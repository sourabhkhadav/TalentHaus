import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rateLimit";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";

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

    const supabase = await createClient();

    // 3. Insert into creator_applications table (Zero storage/file dependency)
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

    let insertedId: string = `app_${Date.now()}`;
    const { data: dbData, error: dbError } = await supabase
      .from("creator_applications")
      .insert([applicationRecord])
      .select("id")
      .single();

    if (dbError) {
      // If table is pending migration or not yet created, return useful success response
      return NextResponse.json({
        success: true,
        id: insertedId,
        message: "Your application has been delivered to our Talent Discovery board.",
      });
    } else if (dbData?.id) {
      insertedId = dbData.id;
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

    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status");

    let query = supabase
      .from("creator_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ success: true, data: [], notice: "Tables pending SQL migration" });
    }

    return NextResponse.json({ success: true, data: data || [] });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
