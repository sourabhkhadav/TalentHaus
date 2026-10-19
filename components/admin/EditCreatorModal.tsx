"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { TalentProfile, Niche, Platform } from "@/types";
import { niches as allNiches, platforms as allPlatforms } from "@/content/roster";
import { uploadCreatorPhoto } from "@/lib/data";
import {
  X,
  Upload,
  Check,
  RefreshCw,
  ImageIcon,
  ExternalLink,
  Instagram,
  Youtube,
  Star,
  Eye,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface EditCreatorModalProps {
  creator: TalentProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (slug: string, updates: Partial<TalentProfile>) => Promise<void> | void;
  founderIdentity?: string;
}

export function EditCreatorModal({
  creator,
  isOpen,
  onClose,
  onSave,
  founderIdentity = "sourabh",
}: EditCreatorModalProps) {
  const [formData, setFormData] = useState<Partial<TalentProfile>>({});
  const [activeTab, setActiveTab] = useState<"general" | "bio" | "social" | "media">("general");

  // Avatar upload state
  const [_avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  // Cover upload state
  const [_coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverError, setCoverError] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Initialize form state when creator changes
  useEffect(() => {
    if (creator) {
      setFormData({
        name: creator.name || "",
        slug: creator.slug || "",
        location: creator.location || "Indore, India",
        status: creator.status || "published",
        featured: creator.featured ?? true,
        niche: Array.isArray(creator.niche) ? [...creator.niche] : ["Lifestyle"],
        platforms: Array.isArray(creator.platforms) ? [...creator.platforms] : ["Instagram"],
        shortBio: creator.shortBio || "",
        bio: creator.bio || "",
        audienceSize: creator.audienceSize || "Verified Roster",
        engagementRate: creator.engagementRate || "High Engagement",
        instagramHandle: creator.instagramHandle || "",
        instagramFollowers: creator.instagramFollowers || "",
        youtubeHandle: creator.youtubeHandle || "",
        youtubeSubscribers: creator.youtubeSubscribers || "",
        tiktokHandle: creator.tiktokHandle || "",
        image: creator.image || "",
        coverImage: creator.coverImage || "",
        cloudinaryPublicId: creator.cloudinaryPublicId || "",
        coverCloudinaryPublicId: creator.coverCloudinaryPublicId || "",
      });
      setAvatarPreview(null);
      setCoverPreview(null);
      setAvatarFile(null);
      setCoverFile(null);
      setAvatarError(null);
      setCoverError(null);
      setSaveError(null);
      setSaveSuccess(false);
    }
  }, [creator, isOpen]);

  // Cleanup blob URLs on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      if (coverPreview) URL.revokeObjectURL(coverPreview);
    };
  }, [avatarPreview, coverPreview]);

  if (!isOpen || !creator) return null;

  const toggleNiche = (niche: Niche) => {
    const current = (formData.niche || []) as Niche[];
    if (current.includes(niche)) {
      if (current.length > 1) {
        setFormData({ ...formData, niche: current.filter((n) => n !== niche) });
      }
    } else {
      setFormData({ ...formData, niche: [...current, niche] });
    }
  };

  const togglePlatform = (platform: Platform) => {
    const current = (formData.platforms || []) as Platform[];
    if (current.includes(platform)) {
      if (current.length > 1) {
        setFormData({ ...formData, platforms: current.filter((p) => p !== platform) });
      }
    } else {
      setFormData({ ...formData, platforms: [...current, platform] });
    }
  };

  const handleAvatarFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarError(null);
    const valid = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!valid.includes(file.type)) {
      setAvatarError("Format must be JPG, PNG, WEBP, or AVIF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAvatarError("File too large. Max size 10MB.");
      return;
    }

    setAvatarFile(file);
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));

    // Upload immediately
    setIsUploadingAvatar(true);
    const res = await uploadCreatorPhoto(file, creator.slug, "avatar", {
      oldPublicId: formData.cloudinaryPublicId,
      founderIdentity,
    });
    setIsUploadingAvatar(false);

    if (res.success && res.url && res.publicId) {
      setFormData((prev) => ({
        ...prev,
        image: res.url,
        cloudinaryPublicId: res.publicId,
      }));
    } else {
      setAvatarError(res.error || "Upload failed.");
    }
  };

  const handleCoverFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverError(null);
    const valid = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!valid.includes(file.type)) {
      setCoverError("Format must be JPG, PNG, WEBP, or AVIF.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setCoverError("File too large. Max size 10MB.");
      return;
    }

    setCoverFile(file);
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));

    // Upload immediately
    setIsUploadingCover(true);
    const res = await uploadCreatorPhoto(file, creator.slug, "cover", {
      oldPublicId: formData.coverCloudinaryPublicId,
      founderIdentity,
    });
    setIsUploadingCover(false);

    if (res.success && res.url && res.publicId) {
      setFormData((prev) => ({
        ...prev,
        coverImage: res.url,
        coverCloudinaryPublicId: res.publicId,
      }));
    } else {
      setCoverError(res.error || "Upload failed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError(null);
    try {
      await onSave(creator.slug, formData);
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save creator updates.";
      setSaveError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-obsidian/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 pb-4 border-b border-gold/15 flex items-center justify-between shrink-0 bg-obsidian/40">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-obsidian border border-gold/20 shrink-0">
              {avatarPreview ? (
                <Image src={avatarPreview} alt="Preview" fill unoptimized className="object-cover" />
              ) : formData.image ? (
                <Image src={formData.image} alt={formData.name || "Avatar"} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone">
                  <ImageIcon size={20} />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl sm:text-2xl text-ivory">Edit Creator Profile</h3>
                {formData.featured && (
                  <span className="text-[10px] font-mono text-gold bg-gold/15 px-2 py-0.5 rounded border border-gold/30 flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> Featured
                  </span>
                )}
              </div>
              <p className="text-xs text-stone font-mono mt-0.5">
                {formData.name} · /roster/{creator.slug}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-gold/15 flex items-center justify-center text-stone hover:text-ivory hover:border-gold/30 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 sm:px-6 pt-2 border-b border-gold/10 bg-obsidian/20 flex items-center gap-2 overflow-x-auto shrink-0">
          {[
            { id: "general", label: "General & Status" },
            { id: "bio", label: "Bio & Niches" },
            { id: "social", label: "Socials & Metrics" },
            { id: "media", label: "Cloudinary Photos" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "px-3 py-2 text-xs font-medium border-b-2 transition-all whitespace-nowrap",
                activeTab === tab.id
                  ? "border-gold text-gold"
                  : "border-transparent text-stone hover:text-ivory"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: GENERAL & STATUS */}
          {activeTab === "general" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Creator Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Public Slug (URL Identifier)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={creator.slug}
                    className="w-full px-3.5 py-2.5 bg-obsidian/50 border border-gold/10 rounded-lg text-stone text-xs font-mono min-h-[44px] cursor-not-allowed"
                    title="Slug cannot be changed directly to prevent broken links"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location || ""}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Indore, Madhya Pradesh, India"
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Audience Tier Label
                  </label>
                  <input
                    type="text"
                    value={formData.audienceSize || ""}
                    onChange={(e) => setFormData({ ...formData, audienceSize: e.target.value })}
                    placeholder="e.g. Verified Roster, 500K+, Tier 1"
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>
              </div>

              {/* Genre / Niche Configuration */}
              <div className="p-4 sm:p-5 rounded-xl bg-obsidian/40 border border-gold/25 space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <label className="block text-xs uppercase text-gold font-bold tracking-wider">
                      Creator Genre / Niche (Card Badge) *
                    </label>
                    <p className="text-[11px] text-stone mt-0.5">
                      Choose which genre badge appears on the creator&apos;s card (e.g. LIFESTYLE, FASHION, ENTERTAINMENT).
                    </p>
                  </div>
                  {/* Live Badge Preview */}
                  {formData.niche?.[0] && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone font-mono">Live Card Badge:</span>
                      <span className="text-[11px] uppercase font-mono font-bold px-2.5 py-1 rounded bg-gold/20 text-gold border border-gold/40 shadow-sm shadow-gold/10">
                        {formData.niche[0]}
                      </span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] uppercase text-stone mb-1 font-mono font-medium">
                      Primary Genre (Card Header Badge) *
                    </label>
                    <select
                      value={formData.niche?.[0] || "Lifestyle"}
                      onChange={(e) => {
                        const selected = e.target.value as Niche;
                        const remaining = (formData.niche || []).filter((n) => n !== selected) as Niche[];
                        setFormData({ ...formData, niche: [selected, ...remaining] });
                      }}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/30 rounded-lg text-gold font-semibold text-xs min-h-[44px]"
                    >
                      {allNiches.map((niche) => (
                        <option key={niche} value={niche}>
                          {niche}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col justify-center">
                    <p className="text-[11px] text-stone/80 p-2.5 rounded-lg bg-obsidian/60 border border-gold/10 leading-relaxed">
                      💡 Changing this updates the badge shown at the top left of this creator&apos;s card on the public roster.
                    </p>
                  </div>
                </div>

                {/* All Niche Pills */}
                <div className="pt-2">
                  <label className="block text-[11px] uppercase text-stone mb-2 font-mono">
                    All Applicable Genres (Click to toggle additional niches):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allNiches.map((niche) => {
                      const isPrimary = formData.niche?.[0] === niche;
                      const isSelected = (formData.niche || []).includes(niche);
                      return (
                        <button
                          key={niche}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if ((formData.niche || []).length > 1) {
                                setFormData({
                                  ...formData,
                                  niche: (formData.niche || []).filter((n) => n !== niche),
                                });
                              }
                            } else {
                              setFormData({
                                ...formData,
                                niche: [...(formData.niche || []), niche],
                              });
                            }
                          }}
                          className={cn(
                            "px-3 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1.5",
                            isPrimary
                              ? "bg-gold text-obsidian font-bold shadow-md shadow-gold/20 border border-gold"
                              : isSelected
                                ? "bg-gold/20 text-gold border border-gold/40 font-medium"
                                : "bg-obsidian/70 border border-gold/15 text-stone hover:text-ivory hover:border-gold/30"
                          )}
                        >
                          {isPrimary && <Check size={11} strokeWidth={3} />}
                          {niche}
                          {isPrimary && <span className="text-[9px] font-mono uppercase opacity-80">(Primary)</span>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Status and Feature Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/15 space-y-2">
                  <span className="block text-xs uppercase text-ivory/80 font-medium">
                    Publish Status
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "published" })}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                        formData.status === "published"
                          ? "bg-emerald-950/70 border-emerald-600 text-emerald-300"
                          : "bg-obsidian border-gold/10 text-stone hover:text-ivory"
                      )}
                    >
                      <Eye size={12} /> Published
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: "draft" })}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                        formData.status === "draft"
                          ? "bg-amber-950/70 border-amber-600 text-amber-300"
                          : "bg-obsidian border-gold/10 text-stone hover:text-ivory"
                      )}
                    >
                      <EyeOff size={12} /> Draft
                    </button>
                  </div>
                  <p className="text-[11px] text-stone">
                    Published creators appear on the live website roster.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/15 space-y-2">
                  <span className="block text-xs uppercase text-ivory/80 font-medium">
                    Featured Spotlight
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: true })}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                        formData.featured
                          ? "bg-gold/20 border-gold text-gold"
                          : "bg-obsidian border-gold/10 text-stone hover:text-ivory"
                      )}
                    >
                      <Star size={12} fill={formData.featured ? "currentColor" : "none"} /> Featured
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, featured: false })}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-xs font-medium border flex items-center justify-center gap-1.5 transition-all",
                        !formData.featured
                          ? "bg-obsidian border-gold/30 text-ivory"
                          : "bg-obsidian border-gold/10 text-stone hover:text-ivory"
                      )}
                    >
                      Standard
                    </button>
                  </div>
                  <p className="text-[11px] text-stone">
                    Featured creators appear on homepage showcases.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: BIO & NICHES */}
          {activeTab === "bio" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                  Short Tagline / 1-Liner Bio *
                </label>
                <input
                  type="text"
                  required
                  value={formData.shortBio || ""}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="e.g. TalentHaus represented creator · Lifestyle & Entertainment."
                  className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                />
                <span className="text-[11px] text-stone block mt-1">
                  Shown on roster cards and preview grids across the website.
                </span>
              </div>

              <div>
                <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                  Full Creator Biography *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Comprehensive bio detailing commercial representation, storytelling specialty, and brand collaboration style..."
                  className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs leading-relaxed"
                />
                <span className="text-[11px] text-stone block mt-1">
                  Shown on the dedicated profile page (/roster/{creator.slug}).
                </span>
              </div>

              {/* Niche Pills */}
              <div>
                <label className="block text-xs uppercase text-ivory/80 mb-2 font-medium">
                  Niches & Categories (Click to toggle) *
                </label>
                <div className="flex flex-wrap gap-2">
                  {allNiches.map((niche) => {
                    const isSelected = (formData.niche || []).includes(niche);
                    return (
                      <button
                        key={niche}
                        type="button"
                        onClick={() => toggleNiche(niche)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          isSelected
                            ? "bg-gold text-obsidian border-gold font-semibold shadow-sm shadow-gold/20"
                            : "bg-obsidian/70 border-gold/15 text-stone hover:text-ivory hover:border-gold/30"
                        )}
                      >
                        {niche}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SOCIALS & METRICS */}
          {activeTab === "social" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium flex items-center gap-1.5">
                    <Instagram size={13} className="text-pink-400" /> Instagram Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone text-xs">@</span>
                    <input
                      type="text"
                      value={formData.instagramHandle || ""}
                      onChange={(e) => setFormData({ ...formData, instagramHandle: e.target.value.replace(/^@/, "") })}
                      placeholder="e.g. rishiagrawalofficial"
                      className="w-full pl-7 pr-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Instagram Followers
                  </label>
                  <input
                    type="text"
                    value={formData.instagramFollowers || ""}
                    onChange={(e) => setFormData({ ...formData, instagramFollowers: e.target.value })}
                    placeholder="e.g. 850K, 1.2M, 240K"
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium flex items-center gap-1.5">
                    <Youtube size={13} className="text-red-400" /> YouTube Handle
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone text-xs">@</span>
                    <input
                      type="text"
                      value={formData.youtubeHandle || ""}
                      onChange={(e) => setFormData({ ...formData, youtubeHandle: e.target.value.replace(/^@/, "") })}
                      placeholder="e.g. rishiagrawal"
                      className="w-full pl-7 pr-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    YouTube Subscribers
                  </label>
                  <input
                    type="text"
                    value={formData.youtubeSubscribers || ""}
                    onChange={(e) => setFormData({ ...formData, youtubeSubscribers: e.target.value })}
                    placeholder="e.g. 420K, 1.1M"
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Engagement Rate
                  </label>
                  <input
                    type="text"
                    value={formData.engagementRate || ""}
                    onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                    placeholder="e.g. High Engagement, 6.2%"
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    TikTok Handle (Optional)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-stone text-xs">@</span>
                    <input
                      type="text"
                      value={formData.tiktokHandle || ""}
                      onChange={(e) => setFormData({ ...formData, tiktokHandle: e.target.value.replace(/^@/, "") })}
                      placeholder="e.g. username"
                      className="w-full pl-7 pr-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                    />
                  </div>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <label className="block text-xs uppercase text-ivory/80 mb-2 font-medium">
                  Active Platforms (Click to toggle)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allPlatforms.map((platform) => {
                    const isSelected = (formData.platforms || []).includes(platform);
                    return (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => togglePlatform(platform)}
                        className={cn(
                          "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                          isSelected
                            ? "bg-gold text-obsidian border-gold font-semibold shadow-sm shadow-gold/20"
                            : "bg-obsidian/70 border-gold/15 text-stone hover:text-ivory hover:border-gold/30"
                        )}
                      >
                        {platform}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: CLOUDINARY PHOTOS */}
          {activeTab === "media" && (
            <div className="space-y-6">
              {/* Profile Avatar Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-obsidian/40 border border-gold/20 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gold/10">
                  <div>
                    <h4 className="text-sm font-semibold text-ivory">Profile Avatar Photo</h4>
                    <p className="text-[11px] text-stone">Primary portrait photo used across the roster.</p>
                  </div>
                  {formData.cloudinaryPublicId && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/50">
                      Cloudinary Linked
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-obsidian border border-gold/25 shrink-0 flex items-center justify-center">
                    {avatarPreview ? (
                      <Image src={avatarPreview} alt="Avatar Preview" fill unoptimized className="object-cover" />
                    ) : formData.image ? (
                      <Image src={formData.image} alt={formData.name || "Avatar"} fill className="object-cover" />
                    ) : (
                      <ImageIcon size={30} className="text-stone/40" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-obsidian hover:bg-gold/90 transition-colors text-xs font-semibold uppercase tracking-wider min-h-[44px]">
                      {isUploadingAvatar ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Uploading to Cloudinary...
                        </>
                      ) : (
                        <>
                          <Upload size={14} /> Upload New Avatar
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={isUploadingAvatar}
                        onChange={handleAvatarFileSelect}
                        className="hidden"
                      />
                    </label>

                    {formData.image && (
                      <p className="text-[10px] font-mono text-stone truncate max-w-md break-all">
                        {formData.image}
                      </p>
                    )}

                    {avatarError && <p className="text-xs text-rose-400">{avatarError}</p>}
                  </div>
                </div>
              </div>

              {/* Cover Banner Card */}
              <div className="p-4 sm:p-5 rounded-xl bg-obsidian/40 border border-gold/20 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gold/10">
                  <div>
                    <h4 className="text-sm font-semibold text-ivory">Cover Banner Photo</h4>
                    <p className="text-[11px] text-stone">Wide hero backdrop for individual profile pages.</p>
                  </div>
                  {formData.coverCloudinaryPublicId && (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-600/50">
                      Cloudinary Linked
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative w-36 h-20 rounded-xl overflow-hidden bg-obsidian border border-gold/25 shrink-0 flex items-center justify-center">
                    {coverPreview ? (
                      <Image src={coverPreview} alt="Cover Preview" fill unoptimized className="object-cover" />
                    ) : formData.coverImage ? (
                      <Image src={formData.coverImage} alt={formData.name || "Cover"} fill className="object-cover" />
                    ) : (
                      <ImageIcon size={30} className="text-stone/40" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold text-obsidian hover:bg-gold/90 transition-colors text-xs font-semibold uppercase tracking-wider min-h-[44px]">
                      {isUploadingCover ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" /> Uploading to Cloudinary...
                        </>
                      ) : (
                        <>
                          <Upload size={14} /> Upload New Cover
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        disabled={isUploadingCover}
                        onChange={handleCoverFileSelect}
                        className="hidden"
                      />
                    </label>

                    {formData.coverImage && (
                      <p className="text-[10px] font-mono text-stone truncate max-w-md break-all">
                        {formData.coverImage}
                      </p>
                    )}

                    {coverError && <p className="text-xs text-rose-400">{coverError}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex items-center justify-between pt-4 border-t border-gold/15">
            <Link
              href={`/roster/${creator.slug}`}
              target="_blank"
              className="text-stone hover:text-gold text-xs flex items-center gap-1 transition-colors"
            >
              <ExternalLink size={13} /> View Public Page
            </Link>

            <div className="flex items-center gap-3">
              {saveError && (
                <span className="text-xs text-rose-400 font-medium mr-2">
                  {saveError}
                </span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "px-6 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 min-h-[44px]",
                  saveSuccess
                    ? "bg-emerald-600 text-white"
                    : "bg-gold text-obsidian hover:bg-gold/90 shadow-lg shadow-gold/10"
                )}
              >
                {isSaving ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" /> Saving...
                  </>
                ) : saveSuccess ? (
                  <>
                    <Check size={14} /> Saved Successfully
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
