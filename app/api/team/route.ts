import { NextRequest, NextResponse } from "next/server";
import { getTeamServer, saveTeamServer, FounderProfile } from "@/lib/data/teamServer";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";

// GET all founders / team members
export async function GET() {
  try {
    const team = getTeamServer();
    return NextResponse.json({ success: true, data: team });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load team data";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT update a founder's profile (photo, bio, role, etc.)
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const payload = (await request.json()) as Partial<FounderProfile> & { slug: string };
    if (!payload.slug) {
      return NextResponse.json({ success: false, error: "Slug is required (sourabh, navneet, or atharv)" }, { status: 400 });
    }

    const current = getTeamServer();
    const index = current.findIndex((f) => f.slug === payload.slug.toLowerCase().trim());

    if (index === -1) {
      return NextResponse.json({ success: false, error: `Founder "${payload.slug}" not found` }, { status: 404 });
    }

    const updatedFounder: FounderProfile = {
      ...current[index],
      ...payload,
    };

    current[index] = updatedFounder;
    saveTeamServer(current);

    return NextResponse.json({ success: true, data: updatedFounder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update founder profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
