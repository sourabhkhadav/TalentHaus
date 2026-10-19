import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";
import {
  saveInquiryServer,
  getInquiriesServer,
  type ServerInquiry,
} from "@/lib/data/submissionsServer";

const contactPayloadSchema = z.object({
  brandName: z.string().min(2, "Brand or agency name is required").max(120),
  contactName: z.string().min(2, "Contact name & title is required").max(120),
  email: z.string().email("Valid corporate email is required").max(150),
  phone: z.string().max(40).optional().nullable(),
  budget: z.string().min(1, "Campaign budget is required").max(80),
  timeline: z.string().min(1, "Campaign timeline is required").max(120),
  message: z.string().min(10, "Campaign scope and deliverables must be at least 10 characters").max(3000),
  services: z.array(z.string()).optional().default([]),
  honeypot: z.string().max(0, "Bot detected").optional().nullable(),
});

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(`contact_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many brief submissions from your IP. Please try again in a few minutes.",
        },
        { status: 429 }
      );
    }

    // 2. Parse & validate body
    const body = await request.json();

    // Silent honeypot trap
    if (body.honeypot || body.website_trap || body.company_website) {
      return NextResponse.json({
        success: true,
        message: "Your brand campaign brief has been received.",
        id: `spm_${Date.now()}`,
      });
    }

    const validated = contactPayloadSchema.safeParse(body);
    if (!validated.success) {
      const firstError = validated.error.errors[0]?.message || "Invalid submission data.";
      return NextResponse.json({ success: false, error: firstError }, { status: 400 });
    }

    const data = validated.data;
    const nowIso = new Date().toISOString();
    let insertedId: string = `sub_${Date.now()}`;

    // 3. Always save to persistent server store first so data is NEVER lost
    const serverRecord: ServerInquiry = {
      id: insertedId,
      brand_name: data.brandName.trim(),
      contact_name: data.contactName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      budget: data.budget.trim(),
      timeline: data.timeline.trim(),
      services: data.services || [],
      message: data.message.trim(),
      status: "new",
      notes: null,
      ip_address: ip,
      created_at: nowIso,
      updated_at: nowIso,
    };
    saveInquiryServer(serverRecord);

    // 4. Also insert into Supabase contact_submissions
    try {
      const supabase = await createClient();
      const submissionRecord = {
        brand_name: serverRecord.brand_name,
        contact_name: serverRecord.contact_name,
        email: serverRecord.email,
        phone: serverRecord.phone,
        budget: serverRecord.budget,
        timeline: serverRecord.timeline,
        services: serverRecord.services,
        message: serverRecord.message,
        status: "new",
        ip_address: ip,
      };

      const { data: dbData, error: dbError } = await supabase
        .from("contact_submissions")
        .insert([submissionRecord])
        .select("id")
        .single();

      if (dbError) {
        // Fallback try inbound_inquiries if contact_submissions not created yet
        const { data: altData } = await supabase
          .from("inbound_inquiries")
          .insert([submissionRecord])
          .select("id")
          .single();

        if (altData?.id) {
          insertedId = altData.id;
          serverRecord.id = altData.id;
          saveInquiryServer(serverRecord);
        }
      } else if (dbData?.id) {
        insertedId = dbData.id;
        serverRecord.id = dbData.id;
        saveInquiryServer(serverRecord);
      }
    } catch {
      // Retained in serverRecord
    }

    return NextResponse.json({
      success: true,
      id: insertedId,
      message: "Your campaign brief has been securely delivered to our executive board.",
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized access" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    // 1. Fetch from persistent server backup store
    let serverInquiries = getInquiriesServer();

    // 2. Fetch live rows from Supabase
    try {
      const supabase = await createClient();
      let query = supabase
        .from("contact_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      let { data, error } = await query;

      if (error && error.code === "PGRST205") {
        // Try fallback table
        const alt = await supabase
          .from("inbound_inquiries")
          .select("*")
          .order("created_at", { ascending: false });
        data = alt.data;
        error = alt.error;
      }

      if (!error && Array.isArray(data) && data.length > 0) {
        // Merge Supabase data with server store without duplicates
        const seenIds = new Set<string>();
        const merged: ServerInquiry[] = [];

        for (const item of data) {
          const row = item as Record<string, unknown>;
          const id = String(row.id);
          seenIds.add(id);
          merged.push({
            id,
            brand_name: String(row.brand_name || ""),
            contact_name: String(row.contact_name || ""),
            email: String(row.email || ""),
            phone: row.phone ? String(row.phone) : null,
            budget: String(row.budget || ""),
            timeline: String(row.timeline || ""),
            services: (Array.isArray(row.services) ? row.services : []) as string[],
            message: String(row.message || ""),
            status: String(row.status || "new"),
            notes: row.notes ? String(row.notes) : null,
            ip_address: row.ip_address ? String(row.ip_address) : null,
            created_at: String(row.created_at || new Date().toISOString()),
            updated_at: row.updated_at ? String(row.updated_at) : undefined,
          });
        }

        // Add any server store items not yet in Supabase
        for (const s of serverInquiries) {
          if (!seenIds.has(s.id)) {
            merged.push(s);
          }
        }

        serverInquiries = merged;
      }
    } catch {
      // Retain serverInquiries
    }

    if (statusFilter && statusFilter !== "all") {
      serverInquiries = serverInquiries.filter((i) => i.status === statusFilter);
    }

    return NextResponse.json({ success: true, data: serverInquiries });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
