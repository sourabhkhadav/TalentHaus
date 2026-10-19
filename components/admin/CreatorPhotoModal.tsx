"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { TalentProfile } from "@/types";
import { uploadCreatorPhoto } from "@/lib/data";
import {
  X,
  Upload,
  Check,
  AlertCircle,
  RefreshCw,
  ImageIcon,
} from "lucide-react";

interface CreatorPhotoModalProps {
  creator: TalentProfile;
  isOpen: boolean;
  onClose: () => void;
  onUpdated: (slug: string, updates: Partial<TalentProfile>) => void;
  founderIdentity?: string;
}

export function CreatorPhotoModal({
  creator,
  isOpen,
  onClose,
  onUpdated,
  founderIdentity = "sourabh",
}: CreatorPhotoModalProps) {
  const [activeSlot, setActiveSlot] = useState<"avatar" | "cover">("avatar");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Clean preview URL when changed or unmounted
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Reset state when modal opens/closes or creator changes
  useEffect(() => {
    setSelectedFile(null);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [isOpen, creator.slug]);

  if (!isOpen) return null;

  const currentImage = activeSlot === "avatar" ? creator.image : creator.coverImage;
  const currentPublicId =
    activeSlot === "avatar" ? creator.cloudinaryPublicId : creator.coverCloudinaryPublicId;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    setSuccessMsg(null);

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!validTypes.includes(file.type)) {
      setErrorMsg("Supported formats: JPG, PNG, WEBP, AVIF.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg("Image size must be 10MB or smaller.");
      return;
    }

    setSelectedFile(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUploadAndSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await uploadCreatorPhoto(selectedFile, creator.slug, activeSlot, {
      oldPublicId: currentPublicId,
      founderIdentity,
    });

    setIsUploading(false);

    if (res.success && res.url && res.publicId) {
      setSuccessMsg(
        activeSlot === "avatar"
          ? "Profile photo updated in Cloudinary & Supabase!"
          : "Cover banner updated in Cloudinary & Supabase!"
      );

      const updates: Partial<TalentProfile> =
        activeSlot === "avatar"
          ? { image: res.url, cloudinaryPublicId: res.publicId }
          : { coverImage: res.url, coverCloudinaryPublicId: res.publicId };

      onUpdated(creator.slug, updates);

      // Clean preview
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    } else {
      setErrorMsg(res.error || "Failed to upload photo to Cloudinary.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gold/15">
          <div>
            <h3 className="font-display text-ivory text-2xl">Manage Creator Media</h3>
            <p className="text-xs text-stone mt-0.5">
              Cloudinary photo management for <span className="text-gold font-medium">{creator.name}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-stone hover:text-ivory rounded-lg hover:bg-gold/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Slot selector */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-obsidian/60 border border-gold/15">
          <button
            type="button"
            onClick={() => {
              setActiveSlot("avatar");
              setSelectedFile(null);
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${activeSlot === "avatar"
              ? "bg-gold text-obsidian font-semibold shadow-sm"
              : "text-stone hover:text-ivory"
              }`}
          >
            Avatar Photo (Portrait)
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveSlot("cover");
              setSelectedFile(null);
              if (previewUrl) URL.revokeObjectURL(previewUrl);
              setPreviewUrl(null);
              setErrorMsg(null);
              setSuccessMsg(null);
            }}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${activeSlot === "cover"
              ? "bg-gold text-obsidian font-semibold shadow-sm"
              : "text-stone hover:text-ivory"
              }`}
          >
            Cover Photo (Banner)
          </button>
        </div>

        {/* Visual Preview Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-stone uppercase tracking-wider font-mono text-[11px]">
              {previewUrl ? "New Image Preview" : "Current Active Image"}
            </span>
            {currentPublicId && !previewUrl && (
              <span className="text-[10px] text-emerald-400 font-mono">
                ✓ Hosted on Cloudinary
              </span>
            )}
          </div>

          <div
            className={`relative rounded-xl overflow-hidden bg-obsidian border border-gold/20 flex items-center justify-center ${activeSlot === "avatar" ? "aspect-square max-w-[240px] mx-auto" : "aspect-video w-full"
              }`}
          >
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="New Selection"
                fill
                unoptimized
                className="object-cover"
              />
            ) : currentImage ? (
              <Image
                src={currentImage}
                alt={creator.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-stone p-4">
                <ImageIcon size={32} className="opacity-40 mb-1" />
                <span className="text-xs">No image set</span>
              </div>
            )}
          </div>

          {currentPublicId && (
            <p className="text-[10px] font-mono text-stone/80 truncate text-center">
              Cloudinary ID: <span className="text-ivory">{currentPublicId}</span>
            </p>
          )}
        </div>

        {/* File Selector & Action */}
        <div className="space-y-4 pt-2 border-t border-gold/15">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <label className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gold/15 border border-gold/30 text-gold hover:bg-gold/25 transition-colors text-xs font-semibold min-h-[44px]">
              <Upload size={14} />
              {selectedFile ? "Choose Different Photo" : "Select Replacement Photo"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                disabled={isUploading}
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <span className="text-xs text-stone truncate max-w-[200px]">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </span>
            )}
          </div>

          {/* Feedback banners */}
          {errorMsg && (
            <div className="p-3.5 rounded-lg bg-rose-950/60 border border-rose-700/50 flex items-start gap-2 text-xs text-rose-300 animate-fadeIn">
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 flex items-start gap-2 text-xs text-emerald-300 animate-fadeIn">
              <Check size={15} className="shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Bottom Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
            >
              Close
            </button>
            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUploadAndSave}
              className={`px-5 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 min-h-[44px] transition-all ${selectedFile && !isUploading
                ? "bg-gold text-obsidian hover:bg-gold/90 shadow-lg shadow-gold/10 cursor-pointer"
                : "bg-stone/20 text-stone/40 border border-stone/20 cursor-not-allowed"
                }`}
            >
              {isUploading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" /> Uploading to Cloudinary...
                </>
              ) : (
                <>
                  <Upload size={14} /> Upload & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
