import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";
import { updateInquiryStatusServer } from "@/lib/data/submissionsServer";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ error: auth.error || "Unauthorized access" }, { status: auth.status || 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, notes } = body;

    // 1. Always update server persistent store
    updateInquiryStatusServer(id, status, notes);

    // 2. Update Supabase
    try {
      const supabase = await createClient();
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };
      if (status) updates.status = status;
      if (notes !== undefined) updates.notes = notes;

      const { error } = await supabase
        .from("contact_submissions")
        .update(updates)
        .eq("id", id);

      if (error && error.code === "PGRST205") {
        await supabase.from("inbound_inquiries").update(updates).eq("id", id);
      }
    } catch {
      // Retained in server store
    }

    return NextResponse.json({ success: true, message: "Status updated successfully" });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
