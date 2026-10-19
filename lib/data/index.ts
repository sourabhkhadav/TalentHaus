// ──────────────────────────────────────────────
// UNIFIED DATA ACCESS LAYER (Backend-Ready Boundary)
// Connects to Supabase PostgreSQL & Storage with resilient fallback.
// ──────────────────────────────────────────────

import { roster, type TalentProfile } from "@/content/roster";
import { campaigns, type Campaign } from "@/content/campaigns";
import { insights, type Insight } from "@/content/insights";
import { services, type Service } from "@/content/services";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export type InfluencerRow = Record<string, unknown>;

// Helper to map Supabase influencers row to TalentProfile
export function mapInfluencerRowToTalent(row: InfluencerRow): TalentProfile {
  return {
    id: typeof row.id === "string" ? row.id : undefined,
    slug: String(row.slug || ""),
    name: String(row.name || ""),
    niche: (Array.isArray(row.niche) ? row.niche : []) as TalentProfile["niche"],
    platforms: (Array.isArray(row.platforms) ? row.platforms : []) as TalentProfile["platforms"],
    location: typeof row.location === "string" ? row.location : "Indore, India",
    bio: typeof row.bio === "string" ? row.bio : "",
    shortBio: typeof row.short_bio === "string" ? row.short_bio : "",
    audienceSize: typeof row.audience_size === "string" ? row.audience_size : "100K",
    engagementRate: typeof row.engagement_rate === "string" ? row.engagement_rate : "5.0%",
    image: typeof row.image_url === "string" ? row.image_url : "/images/roster/placeholder.jpg",
    coverImage: typeof row.cover_image_url === "string" ? row.cover_image_url : "/images/roster/placeholder-cover.jpg",
    cloudinaryPublicId: typeof row.cloudinary_public_id === "string" ? row.cloudinary_public_id : undefined,
    coverCloudinaryPublicId: typeof row.cover_cloudinary_public_id === "string" ? row.cover_cloudinary_public_id : undefined,
    featured: Boolean(row.featured),
    status: (row.status === "draft" || row.status === "archived") ? row.status : "published",
    instagramHandle: typeof row.instagram_handle === "string" ? row.instagram_handle : undefined,
    instagramFollowers: typeof row.instagram_followers === "string" ? row.instagram_followers : undefined,
    youtubeHandle: typeof row.youtube_handle === "string" ? row.youtube_handle : undefined,
    youtubeSubscribers: typeof row.youtube_subscribers === "string" ? row.youtube_subscribers : undefined,
    tiktokHandle: typeof row.tiktok_handle === "string" ? row.tiktok_handle : undefined,
    selectedWork: [],
  };
}

// Helper to map TalentProfile to Supabase influencers row
export function mapTalentToInfluencerRow(profile: Partial<TalentProfile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (profile.slug !== undefined) row.slug = profile.slug;
  if (profile.name !== undefined) row.name = profile.name;
  if (profile.niche !== undefined) row.niche = profile.niche;
  if (profile.platforms !== undefined) row.platforms = profile.platforms;
  if (profile.location !== undefined) row.location = profile.location;
  if (profile.bio !== undefined) row.bio = profile.bio;
  if (profile.shortBio !== undefined) row.short_bio = profile.shortBio;
  if (profile.audienceSize !== undefined) row.audience_size = profile.audienceSize;
  if (profile.engagementRate !== undefined) row.engagement_rate = profile.engagementRate;
  if (profile.image !== undefined) row.image_url = profile.image;
  if (profile.coverImage !== undefined) row.cover_image_url = profile.coverImage;
  if (profile.cloudinaryPublicId !== undefined) row.cloudinary_public_id = profile.cloudinaryPublicId;
  if (profile.coverCloudinaryPublicId !== undefined) row.cover_cloudinary_public_id = profile.coverCloudinaryPublicId;
  if (profile.featured !== undefined) row.featured = profile.featured;
  if (profile.status !== undefined) row.status = profile.status;
  if (profile.instagramHandle !== undefined) row.instagram_handle = profile.instagramHandle;
  if (profile.instagramFollowers !== undefined) row.instagram_followers = profile.instagramFollowers;
  if (profile.youtubeHandle !== undefined) row.youtube_handle = profile.youtubeHandle;
  if (profile.youtubeSubscribers !== undefined) row.youtube_subscribers = profile.youtubeSubscribers;
  if (profile.tiktokHandle !== undefined) row.tiktok_handle = profile.tiktokHandle;
  row.updated_at = new Date().toISOString();
  return row;
}

// ── CREATORS / ROSTER ──

export async function getCreators(options?: { includeDrafts?: boolean }): Promise<TalentProfile[]> {
  // 1. Client-side fetch from persistent API (ensures shared DB state across all browsers)
  if (typeof window !== "undefined") {
    try {
      const res = await fetch(`/api/creators?includeDrafts=${options?.includeDrafts ? "true" : "false"}`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          return json.data;
        }
      }
    } catch {
      // Fallback to local
    }
  }

  // 2. Server-side Supabase query
  if (typeof window === "undefined" && isSupabaseConfigured()) {
    try {
      const supabase = createClient();
      let query = supabase.from("influencers").select("*").order("featured", { ascending: false });

      if (!options?.includeDrafts) {
        query = query.eq("status", "published");
      }

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        const mapped = data.map(mapInfluencerRowToTalent);
        return mapped;
      }
    } catch {
      // Supabase query failed or columns missing; fallback to server file store
    }
  }

  // 3. Server-side filesystem read from persistent roster-data.json
  if (typeof window === "undefined") {
    try {
      const fs = await import("fs");
      const path = await import("path");
      const dataFilePath = path.join(process.cwd(), "content", "roster-data.json");
      if (fs.existsSync(dataFilePath)) {
        const content = fs.readFileSync(dataFilePath, "utf8");
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return options?.includeDrafts
            ? parsed
            : parsed.filter((c: TalentProfile) => c.status !== "draft" && c.status !== "archived");
        }
      }
    } catch {
      // Fallback to static roster
    }
  }

  // 4. Graceful fallback to static roster
  return options?.includeDrafts
    ? roster
    : roster.filter((c) => c.status !== "draft" && c.status !== "archived");
}

export async function getFeaturedCreators(): Promise<TalentProfile[]> {
  const all = await getCreators();
  const featured = all.filter((t) => t.featured !== false && t.status !== "draft" && t.status !== "archived");
  return featured.length > 0 ? featured : all.filter((t) => t.status !== "draft" && t.status !== "archived");
}

export async function getCreatorBySlug(slug: string): Promise<TalentProfile | null> {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const all = await getCreators({ includeDrafts: true });
  const found = all.find((t) => t.slug.toLowerCase() === normalized);
  return found ?? null;
}

// Creator Mutations
export async function createCreator(
  profile: Partial<TalentProfile> & { name: string; slug: string },
  founderIdentity: string = "sourabh"
): Promise<{ success: boolean; data?: TalentProfile; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/creators", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": founderIdentity,
        },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: data.data }));
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error || "Failed to create creator." };
    }

    const supabase = createClient();
    const row = mapTalentToInfluencerRow(profile);
    const { data, error } = await supabase.from("influencers").insert([row]).select().single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapInfluencerRowToTalent(data) };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to create creator profile.";
    return { success: false, error: errorMsg };
  }
}

export async function updateCreator(
  slug: string,
  updates: Partial<TalentProfile>,
  founderIdentity: string = "sourabh"
): Promise<{ success: boolean; data?: TalentProfile; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch("/api/creators", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": founderIdentity,
        },
        body: JSON.stringify({ slug, ...updates }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: data.data }));
        return { success: true, data: data.data };
      }
      return { success: false, error: data.error || "Failed to update creator." };
    }

    const supabase = createClient();
    const row = mapTalentToInfluencerRow(updates);
    const { data, error } = await supabase
      .from("influencers")
      .update(row)
      .eq("slug", slug)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: mapInfluencerRowToTalent(data) };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to update creator profile.";
    return { success: false, error: errorMsg };
  }
}

export async function deleteCreator(
  slug: string,
  founderIdentity: string = "sourabh"
): Promise<{ success: boolean; error?: string }> {
  try {
    if (typeof window !== "undefined") {
      const res = await fetch(`/api/creators?slug=${encodeURIComponent(slug)}`, {
        method: "DELETE",
        headers: {
          "x-founder-auth": founderIdentity,
        },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: { slug } }));
        return { success: true };
      }
      return { success: false, error: data.error || "Failed to delete creator." };
    }

    const supabase = createClient();
    const { error } = await supabase.from("influencers").delete().eq("slug", slug);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Failed to delete creator profile.";
    return { success: false, error: errorMsg };
  }
}

export interface AssetUploadOptions {
  category?: "creators" | "campaigns" | "brands" | "team" | "general";
  field?: "avatar" | "cover" | "hero" | "logo";
  targetSlug?: string;
  title?: string;
  oldPublicId?: string;
  founderIdentity?: string;
}

export interface AssetUploadResponse {
  success: boolean;
  url?: string;
  publicId?: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  error?: string;
}

/**
 * Upload an asset to Cloudinary through the secure founder-authenticated API.
 */
export async function uploadAgencyAsset(
  file: File,
  options: AssetUploadOptions = {}
): Promise<AssetUploadResponse> {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
  if (!validTypes.includes(file.type)) {
    return { success: false, error: "Only JPG, PNG, WEBP, and AVIF images are supported." };
  }

  if (file.size > 10 * 1024 * 1024) {
    return { success: false, error: "Image size must be 10MB or smaller." };
  }

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", options.category || "general");
    formData.append("field", options.field || "avatar");
    if (options.targetSlug) formData.append("targetSlug", options.targetSlug);
    if (options.title) formData.append("title", options.title);
    if (options.oldPublicId) formData.append("oldPublicId", options.oldPublicId);

    const headers: Record<string, string> = {
      "x-founder-auth": options.founderIdentity || "sourabh",
    };

    const res = await fetch("/api/upload", {
      method: "POST",
      headers,
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Upload failed." };
    }

    return {
      success: true,
      url: data.url,
      publicId: data.publicId,
      format: data.format,
      width: data.width,
      height: data.height,
      bytes: data.bytes,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Network error during upload.";
    return { success: false, error: errorMsg };
  }
}

/**
 * Upload creator avatar or cover photo via Cloudinary
 */
export async function uploadCreatorPhoto(
  file: File,
  creatorSlug: string,
  type: "avatar" | "cover" = "avatar",
  options: { oldPublicId?: string; founderIdentity?: string } = {}
): Promise<{ success: boolean; url?: string; publicId?: string; error?: string }> {
  return uploadAgencyAsset(file, {
    category: "creators",
    field: type,
    targetSlug: creatorSlug,
    oldPublicId: options.oldPublicId,
    founderIdentity: options.founderIdentity,
  });
}

/**
 * Delete asset from Cloudinary
 */
export async function deleteAgencyAsset(
  publicId: string,
  founderIdentity: string = "sourabh"
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`/api/upload?publicId=${encodeURIComponent(publicId)}`, {
      method: "DELETE",
      headers: {
        "x-founder-auth": founderIdentity,
      },
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Deletion failed." };
    }
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Deletion failed.";
    return { success: false, error: errorMsg };
  }
}

// ── CAMPAIGNS / CASE STUDIES ──
export async function getCampaigns(): Promise<Campaign[]> {
  return campaigns;
}

export async function getFeaturedCampaigns(): Promise<Campaign[]> {
  return campaigns.filter((c) => c.featured);
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const found = campaigns.find((c) => c.slug.toLowerCase() === normalized);
  return found ?? null;
}

// ── INSIGHTS / ARTICLES ──
export async function getInsights(): Promise<Insight[]> {
  return insights;
}

export async function getFeaturedInsights(): Promise<Insight[]> {
  return insights.filter((i) => i.featured);
}

export async function getInsightBySlug(slug: string): Promise<Insight | null> {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const found = insights.find((i) => i.slug.toLowerCase() === normalized);
  return found ?? null;
}

// ── SERVICES ──
export async function getServices(): Promise<Service[]> {
  return services;
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  const found = services.find((s) => s.slug.toLowerCase() === normalized);
  return found ?? null;
}

