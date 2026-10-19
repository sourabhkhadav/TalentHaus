import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { roster as defaultRoster, TalentProfile } from "@/content/roster";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";

const DATA_FILE_PATH = path.join(process.cwd(), "content", "roster-data.json");

function readCreatorsFromFile(): TalentProfile[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // fallback to static
  }
  // Initialize file with default roster
  saveCreatorsToFile(defaultRoster);
  return defaultRoster;
}

function saveCreatorsToFile(data: TalentProfile[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // file system fallback
  }
}

// GET all creators
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDrafts = searchParams.get("includeDrafts") === "true";

    const creators = readCreatorsFromFile();

    const filtered = includeDrafts
      ? creators
      : creators.filter((c) => c.status !== "draft" && c.status !== "archived");

    return NextResponse.json({ success: true, data: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load creators";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST create a new creator
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const payload = (await request.json()) as TalentProfile;
    if (!payload.name || !payload.slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required fields." },
        { status: 400 }
      );
    }

    const current = readCreatorsFromFile();
    const existingIndex = current.findIndex((c) => c.slug === payload.slug);

    if (existingIndex >= 0) {
      return NextResponse.json(
        { success: false, error: `A creator with slug "${payload.slug}" already exists.` },
        { status: 409 }
      );
    }

    const newCreator: TalentProfile = {
      ...payload,
      status: payload.status || "published",
      featured: payload.featured !== false,
      niche: payload.niche && payload.niche.length > 0 ? payload.niche : ["Lifestyle"],
      platforms: payload.platforms && payload.platforms.length > 0 ? payload.platforms : ["Instagram"],
      location: payload.location || "India",
      bio: payload.bio || `${payload.name} is represented exclusively by TalentHaus.`,
      shortBio: payload.shortBio || `TalentHaus represented creator · ${payload.niche?.[0] || "Lifestyle"}.`,
      audienceSize: payload.audienceSize || "Verified Roster",
      engagementRate: payload.engagementRate || "High Engagement",
      image: payload.image || "",
      coverImage: payload.coverImage || "",
    };

    const updated = [newCreator, ...current];
    saveCreatorsToFile(updated);

    return NextResponse.json({ success: true, data: newCreator });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT update an existing creator
export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const payload = (await request.json()) as Partial<TalentProfile> & { slug: string };
    if (!payload.slug) {
      return NextResponse.json({ success: false, error: "Slug is required for updates." }, { status: 400 });
    }

    const current = readCreatorsFromFile();
    const index = current.findIndex((c) => c.slug === payload.slug);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Creator with slug "${payload.slug}" not found.` },
        { status: 404 }
      );
    }

    const updatedCreator: TalentProfile = {
      ...current[index],
      ...payload,
    };

    current[index] = updatedCreator;
    saveCreatorsToFile(current);

    return NextResponse.json({ success: true, data: updatedCreator });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE a creator
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ success: false, error: "Missing slug parameter" }, { status: 400 });
    }

    const current = readCreatorsFromFile();
    const filtered = current.filter((c) => c.slug !== slug);

    if (filtered.length === current.length) {
      return NextResponse.json({ success: false, error: `Creator "${slug}" not found.` }, { status: 404 });
    }

    saveCreatorsToFile(filtered);
    return NextResponse.json({ success: true, message: `Creator "${slug}" removed.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
