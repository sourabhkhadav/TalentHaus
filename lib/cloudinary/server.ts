// ──────────────────────────────────────────────
// SERVER-ONLY CLOUDINARY MODULE
// Never import this file into Client Components.
// Secrets must remain protected on the server.
// ──────────────────────────────────────────────

import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

if (typeof window !== "undefined") {
  throw new Error("SECURITY VIOLATION: lib/cloudinary/server must only run in Node.js server context.");
}

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
const API_KEY = process.env.CLOUDINARY_API_KEY || "";
const API_SECRET = process.env.CLOUDINARY_API_SECRET || "";

export const CLOUDINARY_FOLDERS = {
  creators: "talenthaus/creators",
  campaigns: "talenthaus/campaigns",
  brands: "talenthaus/brands",
  team: "talenthaus/team",
  general: "talenthaus/media",
} as const;

export type CloudinaryFolderKey = keyof typeof CLOUDINARY_FOLDERS;

/**
 * Returns true if Cloudinary credentials are fully defined and secret is not a placeholder.
 */
export function isCloudinaryConfigured(): boolean {
  if (!CLOUD_NAME || !API_KEY || !API_SECRET) return false;
  if (
    API_SECRET.includes("PASTE_ACTUAL_SECRET") ||
    API_SECRET.includes("YOUR_") ||
    API_SECRET.length < 10
  ) {
    return false;
  }
  return true;
}

// Initialize Cloudinary instance only when configured
if (isCloudinaryConfigured()) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true,
  });
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
  tags?: string[];
  overwrite?: boolean;
  resourceType?: "image" | "raw" | "auto";
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
}

/**
 * Uploads an image buffer directly to Cloudinary.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not fully configured. Please ensure CLOUDINARY_API_SECRET is set in .env.local"
    );
  }

  const folder = options.folder || CLOUDINARY_FOLDERS.general;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        tags: ["talenthaus", ...(options.tags || [])],
        overwrite: options.overwrite ?? true,
        resource_type: options.resourceType || "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed with empty response"));
          return;
        }

        resolve({
          secure_url: result.secure_url,
          public_id: result.public_id,
          format: result.format,
          width: result.width,
          height: result.height,
          bytes: result.bytes,
          created_at: result.created_at,
        });
      }
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);
    stream.pipe(uploadStream);
  });
}

/**
 * Deletes an image from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(
  publicId: string
): Promise<{ result: string }> {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured.");
  }

  const response = await cloudinary.uploader.destroy(publicId, {
    invalidate: true,
  });

  return { result: response.result || "ok" };
}

export interface CloudinaryResourceItem {
  public_id: string;
  secure_url: string;
  format: string;
  width: number;
  height: number;
  bytes: number;
  created_at: string;
  tags?: string[];
}

/**
 * Lists resources directly from Cloudinary account with optional category folder filtering.
 */
export async function listCloudinaryAssets(
  category?: string
): Promise<CloudinaryResourceItem[]> {
  if (!isCloudinaryConfigured()) return [];

  const prefix =
    category && category in CLOUDINARY_FOLDERS
      ? CLOUDINARY_FOLDERS[category as CloudinaryFolderKey]
      : "talenthaus";

  try {
    const res = await cloudinary.api.resources({
      type: "upload",
      prefix,
      tags: true,
      max_results: 100,
    });

    return (res.resources || []).map((r: {
      public_id: string;
      secure_url: string;
      format: string;
      width: number;
      height: number;
      bytes: number;
      created_at: string;
      tags?: string[];
    }) => ({
      public_id: r.public_id,
      secure_url: r.secure_url,
      format: r.format,
      width: r.width,
      height: r.height,
      bytes: r.bytes,
      created_at: r.created_at,
      tags: r.tags || [],
    }));
  } catch {
    return [];
  }
}

export { cloudinary };
