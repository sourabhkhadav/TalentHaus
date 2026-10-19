"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { uploadAgencyAsset } from "@/lib/data";
import {
  X,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
  Shield,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

export interface FounderMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  cloudinaryPublicId?: string;
  linkedin?: string;
}

interface FounderPortraitModalProps {
  isOpen: boolean;
  onClose: () => void;
  founder: FounderMember | null;
  initialFile?: File | null;
  onSuccess: (updatedFounder: FounderMember) => void;
  founderIdentity?: string;
}

export function FounderPortraitModal({
  isOpen,
  onClose,
  founder,
  initialFile,
  onSuccess,
  founderIdentity = "sourabh",
}: FounderPortraitModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync initial file if passed
  useEffect(() => {
    if (initialFile) {
      setSelectedFile(initialFile);
      const url = URL.createObjectURL(initialFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  }, [initialFile, isOpen]);

  // Cleanup object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && !initialFile) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl, initialFile]);

  if (!isOpen || !founder) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    const valid = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!valid.includes(file.type)) {
      setError("Invalid format. Please select a JPG, PNG, WEBP, or AVIF image.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 10MB.`);
      return;
    }

    setSelectedFile(file);
    if (previewUrl && !initialFile) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      const res = await uploadAgencyAsset(selectedFile, {
        category: "team",
        field: "avatar",
        targetSlug: founder.slug,
        title: `${founder.name} Executive Portrait`,
        founderIdentity,
      });

      if (!res.success || !res.url) {
        setError(res.error || "Failed to upload photo to Cloudinary.");
        setIsUploading(false);
        return;
      }

      // Persist to team server data
      const putRes = await fetch("/api/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: founder.slug,
          image: res.url,
          cloudinaryPublicId: res.publicId,
        }),
      });

      if (putRes.ok) {
        const json = await putRes.json();
        const updated = json.data || {
          ...founder,
          image: res.url,
          cloudinaryPublicId: res.publicId,
        };
        onSuccess(updated);
        onClose();
      } else {
        setError("Photo uploaded to Cloudinary, but failed to link to founder profile.");
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!window.confirm(`Reset ${founder.name}'s photo to default monogram initials?`)) {
      return;
    }

    setIsRemoving(true);
    setError(null);

    try {
      const putRes = await fetch("/api/team", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          slug: founder.slug,
          image: "",
          cloudinaryPublicId: "",
        }),
      });

      if (putRes.ok) {
        const json = await putRes.json();
        onSuccess(json.data || { ...founder, image: "", cloudinaryPublicId: "" });
        onClose();
      } else {
        setError("Failed to reset photo.");
      }
    } catch {
      setError("Network error resetting photo.");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-stone hover:text-ivory rounded-lg hover:bg-gold/10 transition-colors"
          title="Close"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="pr-8">
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-1">
            <Shield size={13} /> Executive Portrait Studio
          </div>
          <h3 className="font-display text-2xl text-ivory">
            {founder.image ? "Update" : "Upload"} {founder.name}&apos;s Photo
          </h3>
          <p className="text-stone text-xs mt-0.5 font-body">
            {founder.role} · Publishes directly to the <span className="text-gold font-medium">/about</span> founding team.
          </p>
        </div>

        {/* Center: 3:4 Portrait Preview Frame (Exact shape as on /about) */}
        <div className="flex flex-col items-center justify-center py-2">
          <div className="relative w-48 aspect-[3/4] rounded-xl overflow-hidden bg-obsidian border-2 border-gold/30 shadow-lg shadow-gold/5 flex items-center justify-center group">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="New portrait preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : founder.image ? (
              <Image
                src={founder.image}
                alt={founder.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4F46E5]/40 via-[#312E81]/60 to-obsidian p-4 text-center">
                <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/10 mb-2 shadow-lg">
                  <span className="font-display text-2xl text-white font-semibold">
                    {founder.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <span className="text-[11px] text-stone">No photo set</span>
              </div>
            )}

            {/* Overlay change file button if already previewing */}
            {previewUrl && (
              <label className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-ivory cursor-pointer p-2 text-center">
                <Upload size={20} className="text-gold mb-1" />
                <span className="text-xs font-semibold">Change Selection</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="mt-2.5 text-center">
            <span className="text-[11px] font-mono text-gold/80 bg-gold/10 px-2.5 py-0.5 rounded-full border border-gold/20">
              3:4 Portrait Ratio (Optimal for /about)
            </span>
          </div>
        </div>

        {/* Dropzone or Selected File Info */}
        {!selectedFile ? (
          <label className="border-2 border-dashed border-gold/30 hover:border-gold/60 rounded-xl p-4 sm:p-5 flex flex-col items-center justify-center cursor-pointer bg-obsidian/40 hover:bg-obsidian/60 transition-all text-center">
            <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-2">
              <Upload size={18} />
            </div>
            <p className="text-xs font-medium text-ivory">
              Click to select photo or <span className="text-gold underline">browse file</span>
            </p>
            <p className="text-[10px] text-stone mt-0.5">
              JPG, PNG, WEBP, AVIF · Max 10MB
            </p>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="p-3 rounded-xl bg-obsidian/60 border border-gold/20 flex items-center justify-between gap-3 text-xs">
            <div className="min-w-0 flex-1">
              <p className="text-ivory font-mono truncate text-[11px]">{selectedFile.name}</p>
              <p className="text-stone text-[10px] mt-0.5">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB · {selectedFile.type.split("/")[1]?.toUpperCase()}
              </p>
            </div>
            <label className="px-2.5 py-1 rounded bg-gold/10 hover:bg-gold/20 text-gold text-[11px] font-medium cursor-pointer transition-colors border border-gold/20">
              Change
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700/50 flex items-start gap-2 text-xs text-rose-300">
            <AlertCircle size={15} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-gold/15">
          <div>
            {founder.image && !selectedFile && (
              <button
                type="button"
                disabled={isRemoving}
                onClick={handleRemovePhoto}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1.5 transition-colors p-1"
                title="Reset to monogram initials"
              >
                <Trash2 size={13} />
                <span>{isRemoving ? "Resetting..." : "Reset to Monogram"}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUploadAndSave}
              className={cn(
                "px-5 py-2.5 rounded-lg font-semibold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg",
                selectedFile && !isUploading
                  ? "bg-gold text-obsidian hover:bg-gold/90 shadow-gold/10 cursor-pointer"
                  : "bg-stone/20 text-stone/40 border border-stone/20 cursor-not-allowed"
              )}
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Check size={14} /> Save & Publish Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
