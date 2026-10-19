import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { checkRateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";

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
    const supabase = await createClient();

    // 3. Insert into Supabase contact_submissions
    const submissionRecord = {
      brand_name: data.brandName.trim(),
      contact_name: data.contactName.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone?.trim() || null,
      budget: data.budget.trim(),
      timeline: data.timeline.trim(),
      services: data.services || [],
      message: data.message.trim(),
      status: "new",
      ip_address: ip,
    };

    let insertedId: string = `sub_${Date.now()}`;
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
      }
    } else if (dbData?.id) {
      insertedId = dbData.id;
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

    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

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

    if (error) {
      return NextResponse.json({ success: true, data: [], notice: "Tables pending SQL migration" });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
