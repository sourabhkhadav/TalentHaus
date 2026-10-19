import { NextRequest, NextResponse } from "next/server";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  listCloudinaryAssets,
  isCloudinaryConfigured,
  CLOUDINARY_FOLDERS,
  type CloudinaryFolderKey,
} from "@/lib/cloudinary/server";
import { createClient } from "@/lib/supabase/server";
import { verifyServerFounderAuth } from "@/lib/auth/serverAuth";

// Allowed MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

// Maximum file size: 10 MB
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    // 1. Founder authorization check strictly via server session & verified database role
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: auth.error || "Unauthorized. Founder OS authorization required." },
        { status: auth.status || 401 }
      );
    }

    // 2. Check Cloudinary configuration
    if (!isCloudinaryConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Cloudinary is not fully configured. Please configure your CLOUDINARY_API_SECRET in .env.local.",
        },
        { status: 503 }
      );
    }

    // 3. Parse FormData
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No image file provided in upload payload." },
        { status: 400 }
      );
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file format (${file.type}). Allowed formats: JPG, PNG, WEBP, AVIF.`,
        },
        { status: 400 }
      );
    }

    // 5. Validate file size
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File size exceeds the 10MB limit (File is ${(file.size / (1024 * 1024)).toFixed(2)}MB).`,
        },
        { status: 400 }
      );
    }

    // 6. Category and target parameters
    const rawCategory = (formData.get("category") as string) || "general";
    const category: CloudinaryFolderKey =
      rawCategory in CLOUDINARY_FOLDERS ? (rawCategory as CloudinaryFolderKey) : "general";

    const field = (formData.get("field") as string) || "avatar"; // "avatar" | "cover" | "hero" | "logo"
    const targetSlug = (formData.get("targetSlug") as string)?.trim() || "";
    const title = (formData.get("title") as string)?.trim() || file.name;
    const oldPublicId = (formData.get("oldPublicId") as string)?.trim() || "";

    // 7. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 8. Upload to Cloudinary
    const folder = CLOUDINARY_FOLDERS[category];
    const tags = ["talenthaus", category];
    if (targetSlug) tags.push(targetSlug);

    const result = await uploadToCloudinary(buffer, {
      folder,
      tags,
    });

    // 9. If replacement requested, delete previous asset from Cloudinary safely
    if (oldPublicId && oldPublicId !== result.public_id) {
      try {
        await deleteFromCloudinary(oldPublicId);
      } catch {
        // Safe swallow: old image cleanup should not fail the current upload
      }
    }

    // 10. Persist metadata & references in Supabase
    let savedToSupabase = false;
    try {
      const supabase = await createClient();

      // If updating a creator/influencer record
      if (category === "creators" && targetSlug) {
        const updatePayload: Record<string, unknown> = {
          updated_at: new Date().toISOString(),
        };

        if (field === "cover") {
          updatePayload.cover_image_url = result.secure_url;
          updatePayload.cover_cloudinary_public_id = result.public_id;
        } else {
          updatePayload.image_url = result.secure_url;
          updatePayload.cloudinary_public_id = result.public_id;
        }

        const { error: dbError } = await supabase
          .from("influencers")
          .update(updatePayload)
          .eq("slug", targetSlug);

        if (!dbError) {
          savedToSupabase = true;
        }
      }

      // If updating a founder/team member record
      if (category === "team" && targetSlug) {
        try {
          const { getTeamServer, saveTeamServer } = await import("@/lib/data/teamServer");
          const team = getTeamServer();
          const fIndex = team.findIndex((f) => f.slug === targetSlug.toLowerCase().trim());
          if (fIndex !== -1) {
            team[fIndex].image = result.secure_url;
            team[fIndex].cloudinaryPublicId = result.public_id;
            saveTeamServer(team);
            savedToSupabase = true;
          }
        } catch {
          // team update safe fallback
        }
      }

      // Record in media_assets registry for Founder OS Media Studio
      try {
        await supabase.from("media_assets").insert([
          {
            category,
            title,
            public_id: result.public_id,
            secure_url: result.secure_url,
            format: result.format,
            width: result.width,
            height: result.height,
            bytes: result.bytes,
            related_slug: targetSlug || null,
            uploaded_by: auth.email || auth.user?.id || "founder",
          },
        ]);
      } catch {
        // Migration might still be pending in Supabase; upload succeeded regardless
      }
    } catch {
      // Supabase connection or table issue
    }

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes,
      category,
      field,
      targetSlug,
      savedToSupabase,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Image upload failed";
    return NextResponse.json({ success: false, error: errorMsg }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const publicId = searchParams.get("publicId");

    if (!publicId) {
      return NextResponse.json({ success: false, error: "Missing publicId parameter" }, { status: 400 });
    }

    await deleteFromCloudinary(publicId);

    // Clean up record in media_assets if exists
    try {
      const supabase = await createClient();
      await supabase.from("media_assets").delete().eq("public_id", publicId);
    } catch {
      // Ignore DB error
    }

    return NextResponse.json({ success: true, message: "Asset deleted successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Deletion failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyServerFounderAuth(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || "Unauthorized" }, { status: auth.status || 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");

    const supabase = await createClient();
    let query = supabase
      .from("media_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (category && category !== "all") {
      query = query.eq("category", category);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return NextResponse.json({ success: true, data });
    }

    // Fallback: Query Cloudinary account directly so uploaded assets always display
    const cloudAssets = await listCloudinaryAssets(category || undefined);
    const mapped = cloudAssets.map((c) => {
      // Find creator slug in tags (ignore category tag and "talenthaus")
      const candidateTag = (c.tags || []).find(
        (t) => t !== "talenthaus" && t !== "creators" && t !== category
      );
      return {
        category: category || "creators",
        title: c.public_id.split("/").pop(),
        public_id: c.public_id,
        secure_url: c.secure_url,
        format: c.format,
        width: c.width,
        height: c.height,
        bytes: c.bytes,
        related_slug: candidateTag || (c.public_id.includes("rishi") ? "rishi-agrawal" : c.public_id.includes("ayuxiety") ? "ayuxiety" : undefined),
        tags: c.tags,
        created_at: c.created_at,
      };
    });

    return NextResponse.json({ success: true, data: mapped });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to load media assets";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
