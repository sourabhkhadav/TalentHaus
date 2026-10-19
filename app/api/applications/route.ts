import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";
import {
  saveApplicationServer,
  getApplicationsServer,
  type ServerApplication,
} from "@/lib/data/submissionsServer";

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
    const rateCheck = checkRateLimit(`apply_${ip}`, 5, 10 * 60 * 1000);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: "Too many creator applications from your IP. Please try again in 10 minutes.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request payload (JSON or FormData)
    let body: Record<string, unknown> = {};
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await request.formData();
      const rawNiches = formData.getAll("niche");
      let niche: string[] = [];
      if (rawNiches.length > 0) {
        niche = rawNiches.map((n) => String(n).trim());
      } else {
        const nicheJson = formData.get("nicheJson");
        if (typeof nicheJson === "string") {
          try {
            niche = JSON.parse(nicheJson);
          } catch {
            niche = ["Fashion"];
          }
        }
      }
      body = {
        fullName: formData.get("fullName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        location: formData.get("location"),
        primaryPlatform: formData.get("primaryPlatform"),
        handle: formData.get("handle"),
        audienceSize: formData.get("audienceSize"),
        niche,
        bio: formData.get("bio"),
        portfolioUrl: formData.get("portfolioUrl"),
        agency_reference_trap: formData.get("agency_reference_trap"),
      };
    } else {
      body = await request.json();
    }

    // Honeypot check
    const trap = (body.agency_reference_trap || body.website_trap || body.company_website) as string | undefined;
    if (trap && trap.length > 0) {
      return NextResponse.json({
        success: true,
        id: `spm_${Date.now()}`,
        message: "Your application has been received.",
      });
    }

    const fullName = String(body.fullName || "").trim();
    const email = String(body.email || "").trim().toLowerCase();
    const phone = String(body.phone || "").trim();
    const location = String(body.location || "").trim();
    const primaryPlatform = String(body.primaryPlatform || "Instagram").trim();
    const handle = String(body.handle || "").trim();
    const audienceSize = String(body.audienceSize || "").trim();
    const bio = String(body.bio || "").trim();
    const portfolioUrl = String(body.portfolioUrl || "").trim();
    const niche: string[] = Array.isArray(body.niche)
      ? (body.niche as string[]).map((n) => String(n).trim())
      : ["Fashion"];

    // Basic validation
    if (!fullName || fullName.length < 2) {
      return NextResponse.json({ success: false, error: "Full legal name must be at least 2 characters." }, { status: 400 });
    }
    if (!email || !email.includes("@")) {
      return NextResponse.json({ success: false, error: "A valid email address is required." }, { status: 400 });
    }
    if (!phone || phone.length < 6) {
      return NextResponse.json({ success: false, error: "A valid contact phone number is required." }, { status: 400 });
    }
    if (!location || location.length < 2) {
      return NextResponse.json({ success: false, error: "City and country is required." }, { status: 400 });
    }
    if (!handle || handle.length < 2) {
      return NextResponse.json({ success: false, error: "Social handle or channel URL is required." }, { status: 400 });
    }
    if (!bio || bio.length < 25) {
      return NextResponse.json({ success: false, error: "Creator biography and vision must be at least 25 characters." }, { status: 400 });
    }

    const nowIso = new Date().toISOString();
    let insertedId: string = `app_${Date.now()}`;

    // 3. Always save to persistent server store first so data is NEVER lost
    const serverApp: ServerApplication = {
      id: insertedId,
      full_name: fullName,
      email,
      phone,
      location,
      primary_platform: primaryPlatform,
      handle,
      audience_size: audienceSize || "50K - 100K",
      niche,
      bio,
      portfolio_url: portfolioUrl || null,
      status: "pending",
      notes: null,
      ip_address: ip,
      created_at: nowIso,
      updated_at: nowIso,
    };
    saveApplicationServer(serverApp);

    // 4. Also insert into Supabase creator_applications table
    try {
      const supabase = await createClient();
      const applicationRecord = {
        full_name: fullName,
        email,
        phone,
        location,
        primary_platform: primaryPlatform,
        handle,
        audience_size: audienceSize || "50K - 100K",
        niche,
        bio,
        portfolio_url: portfolioUrl || null,
        status: "pending",
        ip_address: ip,
      };

      const { data: dbData } = await supabase
        .from("creator_applications")
        .insert([applicationRecord])
        .select("id")
        .single();

      if (dbData?.id) {
        insertedId = dbData.id;
        serverApp.id = dbData.id;
        saveApplicationServer(serverApp);
      }
    } catch {
      // Retained in serverApp
    }

    return NextResponse.json({
      success: true,
      id: insertedId,
      message: "Your application has been delivered to our Talent Discovery board. We review every applicant and respond within 5–7 business days.",
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
    let serverApps = getApplicationsServer();

    // 2. Fetch live rows from Supabase
    try {
      const supabase = await createClient();
      let query = supabase
        .from("creator_applications")
        .select("*")
        .order("created_at", { ascending: false });

      if (statusFilter && statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        const seenIds = new Set<string>();
        const merged: ServerApplication[] = [];

        for (const item of data) {
          const row = item as Record<string, unknown>;
          const id = String(row.id);
          seenIds.add(id);
          merged.push({
            id,
            full_name: String(row.full_name || ""),
            email: String(row.email || ""),
            phone: String(row.phone || ""),
            location: String(row.location || ""),
            primary_platform: String(row.primary_platform || "Instagram"),
            handle: String(row.handle || ""),
            audience_size: String(row.audience_size || ""),
            niche: (Array.isArray(row.niche) ? row.niche : []) as string[],
            bio: String(row.bio || ""),
            portfolio_url: row.portfolio_url ? String(row.portfolio_url) : null,
            status: String(row.status || "pending"),
            notes: row.notes ? String(row.notes) : null,
            ip_address: row.ip_address ? String(row.ip_address) : null,
            created_at: String(row.created_at || new Date().toISOString()),
            updated_at: row.updated_at ? String(row.updated_at) : undefined,
          });
        }

        for (const a of serverApps) {
          if (!seenIds.has(a.id)) {
            merged.push(a);
          }
        }

        serverApps = merged;
      }
    } catch {
      // Retain serverApps
    }

    if (statusFilter && statusFilter !== "all") {
      serverApps = serverApps.filter((a) => a.status === statusFilter);
    }

    return NextResponse.json({ success: true, data: serverApps });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
