"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { uploadAgencyAsset, deleteAgencyAsset } from "@/lib/data";
import { TalentProfile } from "@/types";
import {
  Upload,
  Image as ImageIcon,
  Check,
  Copy,
  Trash2,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Layers,
  Sparkles,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { FounderPortraitModal } from "@/components/admin/FounderPortraitModal";

interface MediaAsset {
  id?: string;
  category: "creators" | "campaigns" | "brands" | "team" | "general";
  title?: string;
  public_id: string;
  secure_url: string;
  format?: string;
  width?: number;
  height?: number;
  bytes?: number;
  related_slug?: string;
  created_at?: string;
}

export interface FounderMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
  image: string;
  cloudinaryPublicId?: string;
  linkedin?: string;
}

interface CloudinaryStudioTabProps {
  roster: TalentProfile[];
  founderIdentity: string;
  onTalentUpdated?: (slug: string, updates: Partial<TalentProfile>) => void;
}

type AssetCategory = "creators" | "campaigns" | "brands" | "team";

const CATEGORY_TABS: { key: AssetCategory; label: string; desc: string }[] = [
  { key: "creators", label: "Creator Photos", desc: "Talent avatars and cover photos" },
  { key: "campaigns", label: "Campaign Images", desc: "Hero campaign visuals and case studies" },
  { key: "brands", label: "Brand Logos", desc: "Client partner and sponsor SVG/PNG logos" },
  { key: "team", label: "Founder / Team Photos", desc: "Executive team portraits" },
];

export function CloudinaryStudioTab({
  roster,
  founderIdentity,
  onTalentUpdated,
}: CloudinaryStudioTabProps) {
  const [activeCategory, setActiveCategory] = useState<AssetCategory>("creators");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [field, setField] = useState<"avatar" | "cover">("avatar");
  const [targetSlug, setTargetSlug] = useState<string>(roster[0]?.slug || "rishi-agrawal");
  const [targetFounderSlug, setTargetFounderSlug] = useState<string>("sourabh");
  const [teamMembers, setTeamMembers] = useState<FounderMember[]>([]);
  const [isAssigningFounder, setIsAssigningFounder] = useState(false);
  const [modalFounder, setModalFounder] = useState<FounderMember | null>(null);
  const [modalInitialFile, setModalInitialFile] = useState<File | null>(null);
  const [isFounderModalOpen, setIsFounderModalOpen] = useState(false);
  const [showAdvancedTeamUpload, setShowAdvancedTeamUpload] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<{
    url: string;
    publicId: string;
    width?: number;
    height?: number;
    bytes?: number;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentAssets, setRecentAssets] = useState<MediaAsset[]>([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  // Load team members from /api/team
  const loadTeamMembers = useCallback(async () => {
    try {
      const res = await fetch("/api/team");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setTeamMembers(json.data);
        }
      }
    } catch {
      // offline fallback
    }
  }, []);

  useEffect(() => {
    loadTeamMembers();
  }, [loadTeamMembers]);

  // Load recent assets for active category
  const loadRecentAssets = useCallback(async () => {
    try {
      setIsLoadingAssets(true);
      const res = await fetch(`/api/upload?category=${activeCategory}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          setRecentAssets(json.data);
        }
      }
    } catch {
      // Offline fallback
    } finally {
      setIsLoadingAssets(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadRecentAssets();
  }, [loadRecentAssets]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setUploadSuccess(null);

    // Validate type
    const valid = ["image/jpeg", "image/png", "image/webp", "image/avif"];
    if (!valid.includes(file.type)) {
      setUploadError("Invalid format. Please select a JPG, PNG, WEBP, or AVIF image.");
      return;
    }

    // Validate size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Limit is 10MB.`);
      return;
    }

    setSelectedFile(file);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(URL.createObjectURL(file));
  };

  const handleClearSelected = () => {
    setSelectedFile(null);
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setUploadError(null);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const activeFounder = teamMembers.find((f) => f.slug === targetFounderSlug);
    const resolvedTitle =
      customTitle ||
      (activeCategory === "team"
        ? `${activeFounder?.name || "Founder"} Executive Portrait`
        : selectedFile.name);

    const res = await uploadAgencyAsset(selectedFile, {
      category: activeCategory,
      field: activeCategory === "creators" ? field : "avatar",
      targetSlug:
        activeCategory === "creators"
          ? targetSlug
          : activeCategory === "team"
          ? targetFounderSlug
          : undefined,
      title: resolvedTitle,
      founderIdentity,
    });

    setIsUploading(false);

    if (res.success && res.url && res.publicId) {
      setUploadSuccess({
        url: res.url,
        publicId: res.publicId,
        width: res.width,
        height: res.height,
        bytes: res.bytes,
      });

      // If uploaded for a creator, notify parent store
      if (activeCategory === "creators" && targetSlug && onTalentUpdated) {
        if (field === "cover") {
          onTalentUpdated(targetSlug, {
            coverImage: res.url,
            coverCloudinaryPublicId: res.publicId,
          });
        } else {
          onTalentUpdated(targetSlug, {
            image: res.url,
            cloudinaryPublicId: res.publicId,
          });
        }
      }

      // If uploaded for a founder, persist to team storage & live about page
      if (activeCategory === "team" && targetFounderSlug) {
        try {
          const putRes = await fetch("/api/team", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              slug: targetFounderSlug,
              image: res.url,
              cloudinaryPublicId: res.publicId,
            }),
          });
          if (putRes.ok) {
            const json = await putRes.json();
            if (json.data) {
              setTeamMembers((prev) =>
                prev.map((f) => (f.slug === targetFounderSlug ? json.data : f))
              );
            }
          }
        } catch {
          // offline fallback
        }
      }

      // Add to recent assets
      setRecentAssets((prev) => [
        {
          category: activeCategory,
          public_id: res.publicId!,
          secure_url: res.url!,
          format: res.format,
          width: res.width,
          height: res.height,
          bytes: res.bytes,
          related_slug:
            activeCategory === "creators"
              ? targetSlug
              : activeCategory === "team"
              ? targetFounderSlug
              : undefined,
          title: resolvedTitle,
          created_at: new Date().toISOString(),
        },
        ...prev,
      ]);

      // Reset selection
      handleClearSelected();
      setCustomTitle("");
    } else {
      setUploadError(res.error || "Failed to upload image to Cloudinary.");
    }
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDeleteAsset = async (publicId: string) => {
    if (!window.confirm("Are you sure you want to permanently delete this asset from Cloudinary?")) {
      return;
    }
    const res = await deleteAgencyAsset(publicId, founderIdentity);
    if (res.success) {
      setRecentAssets((prev) => prev.filter((a) => a.public_id !== publicId));
    } else {
      alert(res.error || "Failed to delete asset from Cloudinary.");
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gold/15">
        <div>
          <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-1">
            <Sparkles size={13} /> Cloudinary Media Engine
          </div>
          <h2 className="font-display text-2xl text-ivory">Asset Studio & Secure Uploads</h2>
          <p className="text-stone text-xs mt-0.5">
            Upload, preview, optimize, and replace photos for creators, campaigns, brands, and team members.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadRecentAssets}
            disabled={isLoadingAssets}
            className="px-3 py-2 rounded-lg bg-plum border border-gold/20 text-stone hover:text-ivory text-xs flex items-center gap-1.5 transition-colors"
            title="Refresh assets list"
          >
            <RefreshCw size={13} className={isLoadingAssets ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {CATEGORY_TABS.map((cat) => {
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => {
                setActiveCategory(cat.key);
                setUploadError(null);
                setUploadSuccess(null);
              }}
              className={cn(
                "p-3.5 rounded-xl text-left border transition-all min-h-[58px]",
                isActive
                  ? "bg-gold/15 border-gold text-ivory shadow-lg shadow-gold/5"
                  : "bg-plum/30 border-gold/15 text-stone hover:text-ivory hover:border-gold/30"
              )}
            >
              <span className="block font-medium text-xs sm:text-sm">{cat.label}</span>
              <span className="block text-[11px] text-stone mt-0.5 truncate">{cat.desc}</span>
            </button>
          );
        })}
      </div>

      {/* Executive Founding Team Showcase (when Founder / Team Photos tab is active) */}
      {activeCategory === "team" && (
        <div className="space-y-4 p-5 sm:p-6 rounded-2xl bg-plum/40 border border-gold/25 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gold/15">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs uppercase tracking-widest font-mono mb-1">
                <Shield size={14} /> TalentHaus Leadership
              </div>
              <h3 className="font-display text-2xl text-ivory">Executive Founding Team</h3>
              <p className="text-stone text-xs mt-0.5">
                Click <strong className="text-gold">&quot;Upload Photo&quot;</strong> on any founder to open the dedicated portrait studio with live 3:4 preview. No scrolling required.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gold bg-gold/15 border border-gold/30 px-3 py-1 rounded-full">
                3 Executive Profiles
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {teamMembers.map((founder) => {
              return (
                <div
                  key={founder.slug}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    const file = e.dataTransfer.files?.[0];
                    if (file) {
                      setModalFounder(founder);
                      setModalInitialFile(file);
                      setIsFounderModalOpen(true);
                    }
                  }}
                  className="relative rounded-2xl p-4 sm:p-5 transition-all duration-300 border bg-obsidian/75 border-gold/20 hover:border-gold/45 hover:bg-plum/40 flex flex-col justify-between group shadow-lg"
                >
                  <div>
                    {/* Header Badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone">
                        Founder // {founder.slug}
                      </span>
                      {founder.image ? (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Live on /about
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          Monogram
                        </span>
                      )}
                    </div>

                    {/* Portrait container 3:4 (Clickable to open modal) */}
                    <div
                      onClick={() => {
                        setModalFounder(founder);
                        setModalInitialFile(null);
                        setIsFounderModalOpen(true);
                      }}
                      className="relative aspect-[3/4] max-h-[240px] w-full rounded-xl overflow-hidden mb-3.5 bg-obsidian border border-gold/25 flex items-center justify-center cursor-pointer group/img transition-all hover:border-gold shadow-inner"
                      title="Click to change photo"
                    >
                      {founder.image ? (
                        <Image
                          src={founder.image}
                          alt={founder.name}
                          fill
                          className="object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#4F46E5]/40 via-[#312E81]/60 to-obsidian text-center p-4">
                          <div className="w-16 h-16 rounded-full border border-white/30 flex items-center justify-center bg-white/10 mb-2 shadow-lg">
                            <span className="font-display text-2xl text-white font-semibold">
                              {founder.name.split(" ").map((n) => n[0]).join("")}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone">Click to Upload Photo</p>
                        </div>
                      )}

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-obsidian/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center text-ivory">
                        <Upload size={22} className="text-gold mb-1" />
                        <span className="text-xs font-semibold">{founder.image ? "Change Photo" : "Upload Photo"}</span>
                      </div>
                    </div>

                    <h4 className="font-display text-base text-ivory font-semibold group-hover:text-gold transition-colors">
                      {founder.name}
                    </h4>
                    <p className="text-gold text-xs font-medium mt-0.5">{founder.role}</p>
                    <p className="text-stone text-[11px] line-clamp-2 mt-2 leading-relaxed">
                      {founder.bio}
                    </p>
                  </div>

                  {/* Actions Right on Card */}
                  <div className="pt-3.5 mt-3.5 border-t border-gold/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setModalFounder(founder);
                        setModalInitialFile(null);
                        setIsFounderModalOpen(true);
                      }}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-gold text-obsidian hover:bg-gold/90 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 shadow-md shadow-gold/10 cursor-pointer min-h-[38px]"
                    >
                      <Upload size={13} />
                      <span>{founder.image ? "Change Photo" : "Upload Photo"}</span>
                    </button>

                    {founder.image && (
                      <button
                        type="button"
                        onClick={async () => {
                          if (window.confirm(`Reset ${founder.name}'s photo to default monogram initials?`)) {
                            try {
                              const putRes = await fetch("/api/team", {
                                method: "PUT",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({ slug: founder.slug, image: "", cloudinaryPublicId: "" }),
                              });
                              if (putRes.ok) {
                                setTeamMembers((prev) =>
                                  prev.map((f) => (f.slug === founder.slug ? { ...f, image: "", cloudinaryPublicId: "" } : f))
                                );
                              }
                            } catch {
                              // ignore
                            }
                          }
                        }}
                        className="p-2 rounded-xl bg-obsidian/70 border border-gold/20 text-stone hover:text-rose-400 hover:border-rose-500/40 transition-colors min-h-[38px] flex items-center justify-center"
                        title="Reset to monogram initials"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Upload Console & Live Preview */}
      {activeCategory === "team" && !showAdvancedTeamUpload ? (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-plum/20 border border-gold/15 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold" />
            <span className="text-stone">
              Executive leadership photos are managed directly through the Founder cards above with instant 1-click modal.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedTeamUpload(true)}
            className="text-gold hover:underline font-mono text-[11px] w-fit"
          >
            + Open Advanced Batch Upload Console
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fadeIn">
          {activeCategory === "team" && (
            <div className="lg:col-span-12 flex justify-between items-center pb-1">
              <span className="text-xs text-stone font-mono">Advanced Batch / Raw Upload Console</span>
              <button
                type="button"
                onClick={() => setShowAdvancedTeamUpload(false)}
                className="text-xs text-gold hover:underline font-mono"
              >
                ✕ Close Advanced Console
              </button>
            </div>
          )}

          {/* Left: Upload Controller */}
          <div className="lg:col-span-7 bg-plum/30 border border-gold/20 rounded-2xl p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gold/10">
              <h3 className="font-display text-lg text-ivory flex items-center gap-2">
                <Upload size={16} className="text-gold" /> Upload New Asset
              </h3>
              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/20">
                Folder: talenthaus/{activeCategory}
              </span>
            </div>

            {/* Conditional target configuration for Creators */}
            {activeCategory === "creators" && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                      Assign to Creator *
                    </label>
                    <select
                      value={targetSlug}
                      onChange={(e) => setTargetSlug(e.target.value)}
                      className="w-full px-3 py-2 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                    >
                      {roster.map((creator) => (
                        <option key={creator.slug} value={creator.slug}>
                          {creator.name} ({creator.slug})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                      Image Slot *
                    </label>
                    <select
                      value={field}
                      onChange={(e) => setField(e.target.value as "avatar" | "cover")}
                      className="w-full px-3 py-2 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                    >
                      <option value="avatar">Profile Avatar Photo</option>
                      <option value="cover">Banner Cover Photo</option>
                    </select>
                  </div>
                </div>

                {/* Target Creator Visual Chip */}
                {(() => {
                  const targetCreator = roster.find((r) => r.slug === targetSlug);
                  if (!targetCreator) return null;
                  const currentSlotImg = field === "cover" ? targetCreator.coverImage : targetCreator.image;
                  return (
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-obsidian/60 border border-gold/15">
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-obsidian border border-gold/20 shrink-0 flex items-center justify-center">
                        {currentSlotImg ? (
                          <Image src={currentSlotImg} alt={targetCreator.name} fill className="object-cover" />
                        ) : (
                          <span className="font-display text-xs text-gold">{targetCreator.name.charAt(0)}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs text-ivory font-medium truncate">
                          Targeting: <span className="text-gold font-semibold">{targetCreator.name}</span>
                        </p>
                        <p className="text-[10px] text-stone truncate font-mono">
                          Slot: {field === "avatar" ? "Profile Avatar Photo" : "Banner Cover Photo"}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Conditional target configuration for Founders / Team */}
            {activeCategory === "team" && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                    Assign to Founder Profile *
                  </label>
                  <select
                    value={targetFounderSlug}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTargetFounderSlug(val);
                      const f = teamMembers.find((m) => m.slug === val);
                      if (f) setCustomTitle(`${f.name} Executive Portrait`);
                    }}
                    className="w-full px-3 py-2 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                  >
                    {teamMembers.map((founder) => (
                      <option key={founder.slug} value={founder.slug}>
                        {founder.name} — {founder.role}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Founder Visual Chip */}
                {(() => {
                  const targetFounder = teamMembers.find((f) => f.slug === targetFounderSlug);
                  if (!targetFounder) return null;
                  return (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-obsidian/60 border border-gold/20">
                      <div className="relative w-11 h-14 rounded-lg overflow-hidden bg-obsidian border border-gold/30 shrink-0 flex items-center justify-center">
                        {targetFounder.image ? (
                          <Image src={targetFounder.image} alt={targetFounder.name} fill className="object-cover" />
                        ) : (
                          <span className="font-display text-sm font-semibold text-gold">
                            {targetFounder.name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-ivory font-semibold truncate">{targetFounder.name}</p>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold/15 text-gold border border-gold/30">
                            Selected Founder
                          </span>
                        </div>
                        <p className="text-[11px] text-stone truncate">{targetFounder.role}</p>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {activeCategory !== "creators" && activeCategory !== "team" && (
              <div>
                <label className="block text-xs uppercase text-ivory/80 mb-1.5 font-medium">
                  Asset Title / Label
                </label>
                <input
                  type="text"
                  value={customTitle}
                  onChange={(e) => setCustomTitle(e.target.value)}
                  placeholder={`e.g. ${
                    activeCategory === "campaigns"
                      ? "Product Launch 4K Visual"
                      : "Luxury Lifestyle Partner Logo"
                  }`}
                  className="w-full px-3 py-2 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs min-h-[44px]"
                />
              </div>
            )}

            {/* Drag & Drop / File Input Zone */}
            <div className="border-2 border-dashed border-gold/25 hover:border-gold/50 rounded-xl p-5 sm:p-6 text-center transition-colors bg-obsidian/40 relative">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                title="Click or drop file to select image"
              />
              <div className="flex flex-col items-center justify-center space-y-1.5 pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <ImageIcon size={20} />
                </div>
                <p className="text-xs font-medium text-ivory">
                  Drag and drop image or <span className="text-gold underline">browse file</span>
                </p>
                <p className="text-[10px] text-stone">
                  Supported: JPG, PNG, WEBP, AVIF · Max: 10MB
                </p>
              </div>
            </div>

            {/* Error Message */}
            {uploadError && (
              <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700/50 flex items-start gap-2 text-xs text-rose-300 animate-fadeIn">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Success Banner */}
            {uploadSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-600/40 text-emerald-300 space-y-1 animate-fadeIn text-xs">
                <div className="flex items-center gap-1.5 font-medium text-emerald-200">
                  <Check size={15} /> Uploaded to Cloudinary successfully!
                </div>
                <div className="font-mono text-[10px] text-stone truncate">
                  Public ID: <span className="text-ivory">{uploadSuccess.publicId}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right: Live Preview & Action Card */}
          <div className="lg:col-span-5 bg-plum/30 border border-gold/20 rounded-2xl p-5 sm:p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gold/10 mb-3">
                <h3 className="font-display text-lg text-ivory flex items-center gap-2">
                  <Layers size={16} className="text-gold" /> Image Preview
                </h3>
                {selectedFile && (
                  <button
                    type="button"
                    onClick={handleClearSelected}
                    className="text-[11px] text-rose-400 hover:underline"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {filePreview ? (
                <div className="space-y-3">
                  <div className="relative h-[220px] sm:h-[240px] w-full rounded-xl overflow-hidden bg-obsidian border border-gold/20 flex items-center justify-center shadow-inner">
                    <Image
                      src={filePreview}
                      alt="Upload Preview"
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-obsidian/70 border border-gold/15 flex items-center justify-between text-xs font-mono">
                    <span className="text-ivory truncate max-w-[180px]" title={selectedFile?.name}>
                      {selectedFile?.name}
                    </span>
                    <span className="text-gold shrink-0">
                      {selectedFile ? (selectedFile.size / (1024 * 1024)).toFixed(2) + " MB" : ""} · {selectedFile?.type.split("/")[1]?.toUpperCase()}
                    </span>
                  </div>
                </div>
              ) : uploadSuccess ? (
                <div className="space-y-3">
                  <div className="relative h-[220px] sm:h-[240px] w-full rounded-xl overflow-hidden bg-obsidian border border-gold/20 flex items-center justify-center shadow-inner">
                    <Image
                      src={uploadSuccess.url}
                      alt="Uploaded Asset"
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-obsidian/70 border border-gold/15 flex items-center justify-between text-xs">
                    <span className="text-stone font-mono text-[10px] truncate max-w-[200px]">
                      {uploadSuccess.publicId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyText(uploadSuccess.url, "success-url")}
                      className="text-gold hover:underline font-mono inline-flex items-center gap-1 text-[11px]"
                    >
                      {copiedId === "success-url" ? <Check size={11} /> : <Copy size={11} />} Copy URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="h-[220px] sm:h-[240px] w-full rounded-xl border border-dashed border-gold/15 bg-obsidian/20 flex flex-col items-center justify-center text-stone p-5 text-center space-y-1.5">
                  <ImageIcon size={28} className="opacity-30 text-gold" />
                  <p className="text-xs">No image selected</p>
                  <p className="text-[11px] text-stone/60">
                    Select or drop an image on the left to preview it here.
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="pt-3 border-t border-gold/10 mt-3">
              <button
                type="button"
                disabled={!selectedFile || isUploading}
                onClick={handleUpload}
                className={cn(
                  "w-full py-2.5 rounded-xl font-semibold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 min-h-[44px]",
                  selectedFile && !isUploading
                    ? "bg-gold text-obsidian hover:bg-gold/90 shadow-lg shadow-gold/10 cursor-pointer"
                    : "bg-stone/20 text-stone/40 border border-stone/20 cursor-not-allowed"
                )}
              >
                {isUploading ? (
                  <>
                    <RefreshCw size={15} className="animate-spin" /> Uploading to Cloudinary...
                  </>
                ) : (
                  <>
                    <Upload size={15} /> Upload Asset Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery of Recent Cloudinary Assets */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl text-ivory flex items-center gap-2">
            Uploaded {CATEGORY_TABS.find((t) => t.key === activeCategory)?.label}
          </h3>
          <span className="text-xs text-stone font-mono">
            {recentAssets.length} asset{recentAssets.length === 1 ? "" : "s"}
          </span>
        </div>

        {recentAssets.length === 0 ? (
          <div className="p-8 rounded-xl bg-plum/20 border border-gold/10 text-center space-y-1">
            <p className="text-stone text-xs">No assets recorded in this category yet.</p>
            <p className="text-stone/60 text-[11px]">Upload an image above to record it in Cloudinary and Supabase.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentAssets.map((asset) => (
              <div
                key={asset.public_id}
                className="bg-plum/30 border border-gold/15 rounded-xl p-3.5 flex flex-col justify-between space-y-3 relative group hover:border-gold/30 transition-colors"
              >
                <div>
                  <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-obsidian border border-gold/10 mb-2">
                    <Image
                      src={asset.secure_url}
                      alt={asset.title || asset.public_id}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <h4 className="text-xs font-medium text-ivory truncate" title={asset.title || asset.public_id}>
                    {asset.title || asset.public_id.split("/").pop()}
                  </h4>
                  {asset.related_slug && (
                    <span className="text-[10px] font-mono text-gold block truncate">
                      Linked: {asset.related_slug}
                    </span>
                  )}
                  <p className="text-[10px] font-mono text-stone truncate mt-0.5">
                    {asset.format?.toUpperCase()} · {asset.bytes ? `${(asset.bytes / 1024).toFixed(0)} KB` : "Asset"}
                  </p>
                </div>

                {activeCategory === "creators" && onTalentUpdated && (
                  <div className="pt-2 border-t border-gold/10">
                    <select
                      defaultValue=""
                      onChange={(e) => {
                        if (!e.target.value) return;
                        const [slug, slot] = e.target.value.split(":");
                        if (slot === "cover") {
                          onTalentUpdated(slug, {
                            coverImage: asset.secure_url,
                            coverCloudinaryPublicId: asset.public_id,
                          });
                        } else {
                          onTalentUpdated(slug, {
                            image: asset.secure_url,
                            cloudinaryPublicId: asset.public_id,
                          });
                        }
                        const name = roster.find((r) => r.slug === slug)?.name || slug;
                        alert(`Assigned as ${slot === "avatar" ? "Profile Avatar" : "Cover Banner"} for ${name}!`);
                        e.target.value = "";
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-obsidian border border-gold/20 text-[11px] text-gold hover:border-gold/40 cursor-pointer font-medium"
                    >
                      <option value="" disabled>
                        ⚡ Assign to Creator...
                      </option>
                      {roster.map((r) => (
                        <React.Fragment key={r.slug}>
                          <option value={`${r.slug}:avatar`}>Set as {r.name} Avatar</option>
                          <option value={`${r.slug}:cover`}>Set as {r.name} Cover</option>
                        </React.Fragment>
                      ))}
                    </select>
                  </div>
                )}

                {activeCategory === "team" && (
                  <div className="pt-2 border-t border-gold/10">
                    <select
                      defaultValue=""
                      disabled={isAssigningFounder}
                      onChange={async (e) => {
                        const founderSlug = e.target.value;
                        if (!founderSlug) return;
                        setIsAssigningFounder(true);
                        try {
                          const putRes = await fetch("/api/team", {
                            method: "PUT",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                              slug: founderSlug,
                              image: asset.secure_url,
                              cloudinaryPublicId: asset.public_id,
                            }),
                          });
                          if (putRes.ok) {
                            const updatedFounder = await putRes.json();
                            const founderName =
                              teamMembers.find((f) => f.slug === founderSlug)?.name || founderSlug;
                            setTeamMembers((prev) =>
                              prev.map((f) =>
                                f.slug === founderSlug
                                  ? (updatedFounder.data || {
                                      ...f,
                                      image: asset.secure_url,
                                      cloudinaryPublicId: asset.public_id,
                                    })
                                  : f
                              )
                            );
                            alert(`Assigned photo as ${founderName}'s executive profile picture! Live on /about.`);
                          } else {
                            alert("Failed to assign photo to founder profile.");
                          }
                        } catch {
                          alert("Network error updating founder profile.");
                        } finally {
                          setIsAssigningFounder(false);
                          e.target.value = "";
                        }
                      }}
                      className="w-full py-1.5 px-2 rounded-lg bg-obsidian border border-gold/20 text-[11px] text-gold hover:border-gold/40 cursor-pointer font-medium"
                    >
                      <option value="" disabled>
                        ⚡ Assign to Founder Profile...
                      </option>
                      {teamMembers.map((f) => (
                        <option key={f.slug} value={f.slug}>
                          Set as {f.name} Photo
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyText(asset.secure_url, asset.public_id)}
                      className="p-1.5 rounded text-stone hover:text-gold transition-colors"
                      title="Copy Cloudinary secure URL"
                    >
                      {copiedId === asset.public_id ? <Check size={13} /> : <Copy size={13} />}
                    </button>
                    <a
                      href={asset.secure_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded text-stone hover:text-ivory transition-colors"
                      title="Open full size in new tab"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteAsset(asset.public_id)}
                    className="p-1.5 rounded text-stone/50 hover:text-rose-400 transition-colors"
                    title="Delete from Cloudinary"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dedicated Founder Portrait Studio Modal */}
      <FounderPortraitModal
        isOpen={isFounderModalOpen}
        onClose={() => {
          setIsFounderModalOpen(false);
          setModalFounder(null);
          setModalInitialFile(null);
        }}
        founder={modalFounder}
        initialFile={modalInitialFile}
        founderIdentity={founderIdentity}
        onSuccess={(updated) => {
          setTeamMembers((prev) =>
            prev.map((f) => (f.slug === updated.slug ? updated : f))
          );
        }}
      />
    </div>
  );
}
