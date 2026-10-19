"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { creatorApplicationSchema, CreatorApplicationInput } from "@/lib/validation/schemas";
import { addApplication } from "@/lib/data/store";
import { cn } from "@/lib/utils";
import { CheckCircle, AlertCircle, RefreshCw, ArrowUpRight, LoaderCircle } from "lucide-react";

const NICHES = [
  "Fashion", "Beauty", "Lifestyle", "Tech",
  "Finance", "Fitness", "Food", "Travel",
  "Gaming", "Music", "Comedy", "Business",
];

const PLATFORMS = [
  "Instagram", "YouTube", "TikTok", "Twitter",
  "LinkedIn", "Podcast", "Other",
];

const AUDIENCE_SIZES = [
  "50K – 100K", "100K – 500K", "500K – 1M", "1M – 3M", "3M+",
];

export function CreatorApplicationForm() {
  const [submissionResult, setSubmissionResult] = useState<{
    type: "success" | "error";
    message: string;
    appId?: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreatorApplicationInput>({
    resolver: zodResolver(creatorApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      primaryPlatform: "Instagram",
      handle: "",
      audienceSize: AUDIENCE_SIZES[0],
      niche: ["Fashion"],
      bio: "",
      portfolioUrl: "",
      agency_reference_trap: "",
    },
  });

  const onSubmit = async (data: CreatorApplicationInput) => {
    setSubmissionResult(null);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const resJson = await res.json();

      if (res.ok && resJson.success) {
        addApplication({
          id: resJson.id,
          fullName: data.fullName,
          email: data.email,
          phone: data.phone,
          location: data.location,
          primaryPlatform: data.primaryPlatform,
          handle: data.handle,
          audienceSize: data.audienceSize,
          niche: data.niche,
          bio: data.bio,
          portfolioUrl: data.portfolioUrl,
        });

        setSubmissionResult({
          type: "success",
          message:
            resJson.message ||
            "Your application has been delivered to our Talent Discovery board. We review every applicant and respond within 5–7 business days.",
          appId: resJson.id,
        });
        reset();
      } else {
        setSubmissionResult({
          type: "error",
          message: resJson.error || "Application could not be submitted. Please check the fields and try again.",
        });
      }
    } catch {
      setSubmissionResult({
        type: "error",
        message: "An unexpected network error occurred during submission. Please retry shortly.",
      });
    }
  };

  return (
    <div className="w-full">

      {submissionResult?.type === "success" ? (
        <div className="p-8 sm:p-12 rounded-3xl bg-white border-2 border-emerald-500/30 text-center animate-fadeIn shadow-[0_12px_40px_rgba(16,185,129,0.12)]">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30">
            <CheckCircle size={36} className="text-white" strokeWidth={2.5} />
          </div>
          <h3 className="font-display text-[#0F172A] text-2xl sm:text-4xl font-normal tracking-tight mb-3">
            Application Submitted
          </h3>
          <p className="font-body text-[#334155] text-sm sm:text-base max-w-lg mx-auto mb-6 leading-relaxed font-normal">
            {submissionResult.message}
          </p>
          {submissionResult.appId && (
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 shadow-sm text-xs font-mono text-[#0F172A] mb-8">
              <span className="text-[#059669] font-bold uppercase tracking-wider text-[11px]">
                Application ID:
              </span>
              <span className="font-bold text-[#0F172A] tracking-wider select-all">
                {submissionResult.appId}
              </span>
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={() => setSubmissionResult(null)}
              className="inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#4F46E5] hover:bg-[#4338CA] text-white font-body text-xs sm:text-sm uppercase tracking-wider font-semibold transition-all shadow-[0_10px_30px_rgba(79,70,229,0.25)] hover:shadow-[0_12px_35px_rgba(79,70,229,0.35)] hover:-translate-y-0.5 active:translate-y-0 min-h-[46px]"
            >
              <RefreshCw size={15} /> Submit Another Application
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
          {submissionResult?.type === "error" && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200 flex items-start gap-3.5 text-rose-900 shadow-sm">
              <AlertCircle size={20} className="shrink-0 mt-0.5 text-rose-600" />
              <div>
                <p className="font-semibold text-rose-950 text-sm">Application Error</p>
                <p className="text-xs text-rose-700 mt-1 leading-relaxed">{submissionResult.message}</p>
              </div>
            </div>
          )}

          {/* Honeypot trap */}
          <input
            type="text"
            {...register("agency_reference_trap")}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          {/* Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Full Legal / Creator Name <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                type="text"
                {...register("fullName")}
                placeholder="e.g. Marcus Osei"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                  "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                  errors.fullName && "border-rose-500"
                )}
                aria-invalid={!!errors.fullName}
              />
              {errors.fullName && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Contact Email <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="marcus@creator.com"
                autoComplete="email"
                inputMode="email"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                  "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                  errors.email && "border-rose-500"
                )}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* Phone & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Phone Number <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="+44 7700 900123"
                autoComplete="tel"
                inputMode="tel"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                  "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                  errors.phone && "border-rose-500"
                )}
                aria-invalid={!!errors.phone}
              />
              {errors.phone && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Location (City, Country) <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                type="text"
                {...register("location")}
                placeholder="e.g. Indore, India or Mumbai, India"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                  "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                  errors.location && "border-rose-500"
                )}
                aria-invalid={!!errors.location}
              />
              {errors.location && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.location.message}
                </p>
              )}
            </div>
          </div>

          {/* Platform, Handle & Audience */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Primary Platform <span className="text-[#4F46E5]">*</span>
              </label>
              <select
                {...register("primaryPlatform")}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm focus:outline-none focus:border-[#4F46E5] focus:bg-white min-h-[44px] shadow-sm"
              >
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Handle / URL <span className="text-[#4F46E5]">*</span>
              </label>
              <input
                type="text"
                {...register("handle")}
                placeholder="@yourhandle"
                disabled={isSubmitting}
                className={cn(
                  "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                  "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                  errors.handle && "border-rose-500"
                )}
                aria-invalid={!!errors.handle}
              />
              {errors.handle && (
                <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                  <AlertCircle size={12} /> {errors.handle.message}
                </p>
              )}
            </div>

            <div>
              <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2 font-semibold">
                Audience Size <span className="text-[#4F46E5]">*</span>
              </label>
              <select
                {...register("audienceSize")}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm focus:outline-none focus:border-[#4F46E5] focus:bg-white min-h-[44px] shadow-sm"
              >
                {AUDIENCE_SIZES.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Niches */}
          <div>
            <label className="block font-body text-xs tracking-wider uppercase text-[#0F172A] mb-2.5 font-semibold">
              Content Verticals <span className="text-[#4F46E5]">*</span>
            </label>
            <Controller
              name="niche"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {NICHES.map((n) => {
                    const isChecked = field.value?.includes(n);
                    return (
                      <label
                        key={n}
                        className={cn(
                          "flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer text-xs transition-colors min-h-[44px]",
                          isChecked
                            ? "bg-indigo-50 border-[#4F46E5] text-[#312E81] font-bold"
                            : "bg-slate-50 border-slate-200 text-slate-700 hover:text-[#0F172A] hover:border-[#4F46E5]"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...(field.value || []), n]);
                            } else {
                              field.onChange((field.value || []).filter((v) => v !== n));
                            }
                          }}
                          className="w-4 h-4 rounded border-slate-300 text-[#4F46E5] focus:ring-0 accent-[#4F46E5]"
                        />
                        <span className="truncate">{n}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            />
            {errors.niche && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.niche.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="font-body text-xs tracking-wider uppercase text-[#0F172A] font-semibold">
                Creator Bio & Vision <span className="text-[#4F46E5]">*</span>
              </label>
              <span className="text-slate-500 text-[11px]">Min 25 chars</span>
            </div>
            <textarea
              {...register("bio")}
              rows={4}
              placeholder="Tell us about the narrative behind your content, what makes your audience unique, and what brand partnerships you're aiming to secure..."
              disabled={isSubmitting}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400",
                "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all resize-y shadow-sm",
                errors.bio && "border-rose-500"
              )}
              aria-invalid={!!errors.bio}
            />
            {errors.bio && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
                <AlertCircle size={12} /> {errors.bio.message}
              </p>
            )}
          </div>

          {/* Portfolio link */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
              <label className="font-body text-xs tracking-wider uppercase text-[#0F172A] font-semibold">
                Portfolio, Linktree, or Channel Link (Optional)
              </label>
              <span className="text-slate-500 text-[11px]">
                Share your portfolio, media kit or social profile link.
              </span>
            </div>
            <input
              type="url"
              {...register("portfolioUrl")}
              placeholder="https://..."
              disabled={isSubmitting}
              className={cn(
                "w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-[#0F172A] text-base sm:text-sm placeholder:text-slate-400 min-h-[44px]",
                "focus:outline-none focus:bg-white focus:border-[#4F46E5] focus:ring-1 focus:ring-[#4F46E5]/30 transition-all shadow-sm",
                errors.portfolioUrl && "border-rose-500"
              )}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={cn(
              "w-full py-4 px-8 rounded-full font-body text-xs sm:text-sm font-semibold uppercase tracking-wider min-h-[48px]",
              "bg-[#4F46E5] text-white hover:bg-[#4338CA] transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)]",
              "flex items-center justify-center gap-2",
              "disabled:opacity-60 disabled:cursor-not-allowed group"
            )}
          >
            {isSubmitting ? (
              <>
                <LoaderCircle size={18} className="animate-spin" />
                Submitting Application...
              </>
            ) : (
              <>
                Apply to Join as Creator
                <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
