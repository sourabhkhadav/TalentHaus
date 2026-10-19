import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";
import { roster as defaultRoster, TalentProfile } from "@/content/roster";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";
import { createClient } from "@/lib/supabase/server";
import { mapInfluencerRowToTalent, mapTalentToInfluencerRow } from "@/lib/data";

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

// GET all creators (shared source of truth for admin and public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeDraftsParam = searchParams.get("includeDrafts") === "true";

    // Only authorized founders can inspect drafts
    let includeDrafts = false;
    if (includeDraftsParam) {
      const auth = await verifyServerFounderAuth(request);
      includeDrafts = auth.authorized;
    }

    const fileCreators = readCreatorsFromFile();
    let allCreators = fileCreators;

    // 1. Fetch from Supabase influencers table
    try {
      const supabase = await createClient();
      let query = supabase
        .from("influencers")
        .select("*")
        .order("featured", { ascending: false });

      if (!includeDrafts) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;

      if (!error && Array.isArray(data) && data.length > 0) {
        const mappedSb = data.map((r) => mapInfluencerRowToTalent(r as Record<string, unknown>));

        // Merge Supabase with file backup, Supabase taking priority
        const seenSlugs = new Set<string>();
        const merged: TalentProfile[] = [];

        for (const item of mappedSb) {
          if (!seenSlugs.has(item.slug)) {
            seenSlugs.add(item.slug);
            merged.push(item);
          }
        }

        // Add file-only creators if any
        for (const f of fileCreators) {
          if (!seenSlugs.has(f.slug)) {
            seenSlugs.add(f.slug);
            merged.push(f);
          }
        }

        allCreators = merged;
      }
    } catch {
      // Retain fileCreators fallback
    }

    const filtered = includeDrafts
      ? allCreators
      : allCreators.filter((c) => c.status !== "draft" && c.status !== "archived");

    return NextResponse.json({ success: true, data: filtered });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load creators";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST create a new creator (authorized admin only)
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

    const cleanSlug = payload.slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!cleanSlug) {
      return NextResponse.json(
        { success: false, error: "A valid URL slug is required." },
        { status: 400 }
      );
    }

    const current = readCreatorsFromFile();

    // Check duplicate slug in file store
    if (current.some((c) => c.slug === cleanSlug)) {
      return NextResponse.json(
        { success: false, error: `A creator with slug "${cleanSlug}" already exists.` },
        { status: 409 }
      );
    }

    // Check duplicate slug in Supabase
    try {
      const supabase = await createClient();
      const { data: existingSb } = await supabase
        .from("influencers")
        .select("slug")
        .eq("slug", cleanSlug)
        .maybeSingle();

      if (existingSb) {
        return NextResponse.json(
          { success: false, error: `A creator with slug "${cleanSlug}" already exists in the database.` },
          { status: 409 }
        );
      }
    } catch {
      // proceed if query unsupported
    }

    const newCreator: TalentProfile = {
      ...payload,
      slug: cleanSlug,
      name: payload.name.trim(),
      status: payload.status || "published",
      featured: payload.featured !== false,
      niche: payload.niche && payload.niche.length > 0 ? payload.niche : ["Lifestyle"],
      platforms: payload.platforms && payload.platforms.length > 0 ? payload.platforms : ["Instagram"],
      location: payload.location || "Indore, India",
      bio: payload.bio || `${payload.name} is represented exclusively by TalentHaus.`,
      shortBio: payload.shortBio || `TalentHaus represented creator · ${payload.niche?.[0] || "Lifestyle"}.`,
      audienceSize: payload.audienceSize || "Verified Roster",
      engagementRate: payload.engagementRate || "High Engagement",
      image: payload.image || "/images/roster/placeholder.jpg",
      coverImage: payload.coverImage || "/images/roster/placeholder-cover.jpg",
      cloudinaryPublicId: payload.cloudinaryPublicId || undefined,
      coverCloudinaryPublicId: payload.coverCloudinaryPublicId || undefined,
      instagramHandle: payload.instagramHandle || undefined,
      instagramFollowers: payload.instagramFollowers || undefined,
      youtubeHandle: payload.youtubeHandle || undefined,
      youtubeSubscribers: payload.youtubeSubscribers || undefined,
      tiktokHandle: payload.tiktokHandle || undefined,
    };

    // 1. Insert into Supabase influencers table
    try {
      const supabase = await createClient();
      const row = mapTalentToInfluencerRow(newCreator);
      const { data: sbData, error: sbError } = await supabase
        .from("influencers")
        .insert([row])
        .select()
        .single();

      if (sbError) {
        console.warn("Supabase creator insert notice:", sbError.message);
      } else if (sbData) {
        const mapped = mapInfluencerRowToTalent(sbData as Record<string, unknown>);
        newCreator.id = mapped.id;
      }
    } catch (sbEx) {
      console.warn("Supabase creator insert exception:", sbEx);
    }

    // 2. Persist to shared server file store
    const updated = [newCreator, ...current.filter((c) => c.slug !== cleanSlug)];
    saveCreatorsToFile(updated);

    // 3. Revalidate affected Next.js routes
    try {
      revalidatePath("/");
      revalidatePath("/roster");
      revalidatePath(`/roster/${cleanSlug}`);
    } catch {
      // Revalidation error ignored
    }

    return NextResponse.json({ success: true, data: newCreator });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// PUT update an existing creator (authorized admin only)
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

    // 1. Update in Supabase influencers table
    try {
      const supabase = await createClient();
      const row = mapTalentToInfluencerRow(payload);
      const { error: sbError } = await supabase
        .from("influencers")
        .update(row)
        .eq("slug", payload.slug);

      if (sbError) {
        console.warn("Supabase creator update notice:", sbError.message);
      }
    } catch (sbEx) {
      console.warn("Supabase creator update exception:", sbEx);
    }

    // 2. Update server file store
    current[index] = updatedCreator;
    saveCreatorsToFile(current);

    // 3. Revalidate affected Next.js routes
    try {
      revalidatePath("/");
      revalidatePath("/roster");
      revalidatePath(`/roster/${payload.slug}`);
    } catch {
      // Revalidation error ignored
    }

    return NextResponse.json({ success: true, data: updatedCreator });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// DELETE a creator (authorized admin only)
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

    // 1. Delete from Supabase influencers table
    try {
      const supabase = await createClient();
      const { error: sbError } = await supabase
        .from("influencers")
        .delete()
        .eq("slug", slug);

      if (sbError) {
        console.warn("Supabase creator delete notice:", sbError.message);
      }
    } catch (sbEx) {
      console.warn("Supabase creator delete exception:", sbEx);
    }

    // 2. Persist to server file store
    saveCreatorsToFile(filtered);

    // 3. Revalidate affected Next.js routes
    try {
      revalidatePath("/");
      revalidatePath("/roster");
      revalidatePath(`/roster/${slug}`);
    } catch {
      // Revalidation error ignored
    }

    return NextResponse.json({ success: true, message: `Creator "${slug}" removed.` });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete creator";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
