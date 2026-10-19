"use client";

import React, { useState } from "react";
import { CreatorApplication, ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Users,
  Clock,
  MapPin,
  ExternalLink,
  MessageSquare,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

interface ApplicationsTabProps {
  applications: CreatorApplication[];
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onOpenNotes: (application: CreatorApplication) => void;
  onViewDetails: (application: CreatorApplication) => void;
}

const STATUS_OPTIONS: { value: ApplicationStatus; label: string; color: string }[] = [
  { value: "pending", label: "Pending Review", color: "bg-amber-500/15 text-amber-300 border-amber-500/30" },
  { value: "reviewing", label: "In Review", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { value: "approved", label: "Approved", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { value: "rejected", label: "Declined", color: "bg-rose-500/15 text-rose-300 border-rose-500/30" },
];

export function ApplicationsTab({
  applications,
  onStatusChange,
  onOpenNotes,
  onViewDetails,
}: ApplicationsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = applications.filter((app) => {
    const matchesStatus =
      statusFilter === "all" ||
      app.status === statusFilter ||
      (statusFilter === "reviewing" && app.status === "under_review") ||
      (statusFilter === "approved" && app.status === "accepted");

    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      app.fullName.toLowerCase().includes(q) ||
      app.handle.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.location.toLowerCase().includes(q) ||
      app.niche.some((n) => n.toLowerCase().includes(q)) ||
      app.primaryPlatform.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    let normalized = status;
    if (status === "under_review") normalized = "reviewing";
    if (status === "accepted") normalized = "approved";
    const match = STATUS_OPTIONS.find((s) => s.value === normalized) || STATUS_OPTIONS[0];

    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border",
          match.color
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
        {match.label}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Policy banner */}
      <div className="p-4 rounded-xl bg-obsidian/70 border border-gold/15 flex items-start gap-3 text-stone text-xs">
        <ShieldAlert size={18} className="text-gold shrink-0 mt-0.5" />
        <div>
          <p className="text-ivory font-medium">Founder Approval Workflow</p>
          <p className="text-stone/80 text-[11px] mt-0.5 leading-relaxed">
            Approving an applicant updates their application status to &quot;Approved&quot; for founder review and talent outreach.
            In compliance with agency security policies, approval does not automatically grant applicants a user account or Founder OS access.
          </p>
        </div>
      </div>

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-plum/20 border border-gold/15">
        <div className="flex-1 relative min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            placeholder="Search by creator name, @handle, niche, location, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-obsidian/80 border border-gold/20 rounded-xl text-ivory text-xs placeholder:text-stone/60 focus:outline-none focus:border-gold transition-colors min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs text-stone">
            <Filter size={14} className="text-gold" /> Filter:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 bg-obsidian/80 border border-gold/20 rounded-xl text-ivory text-xs focus:outline-none focus:border-gold min-h-[44px]"
          >
            <option value="all">All Applications ({applications.length})</option>
            <option value="pending">
              Pending ({applications.filter((a) => a.status === "pending").length})
            </option>
            <option value="reviewing">
              In Review ({applications.filter((a) => a.status === "reviewing" || a.status === "under_review").length})
            </option>
            <option value="approved">
              Approved ({applications.filter((a) => a.status === "approved" || a.status === "accepted").length})
            </option>
            <option value="rejected">
              Declined ({applications.filter((a) => a.status === "rejected").length})
            </option>
          </select>
        </div>
      </div>

      {/* Applications List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-plum/10 border border-gold/10">
          <Users size={36} className="mx-auto text-stone mb-3 opacity-60" />
          <h4 className="font-display text-lg text-ivory mb-1">No Creator Applications Found</h4>
          <p className="text-stone text-xs max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No applications matched your search or status filter. Try clearing filters."
              : "Creator applications submitted through the /join page will appear here."}
          </p>
          {(searchTerm || statusFilter !== "all") && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("all");
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-gold/10 border border-gold/30 text-gold text-xs font-mono uppercase hover:bg-gold/20 transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((app) => (
            <div
              key={app.id}
              className="p-5 sm:p-6 rounded-2xl bg-plum/20 border border-gold/15 hover:border-gold/30 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Creator Info Header */}
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl sm:text-2xl text-ivory tracking-wide">
                      {app.fullName}
                    </h3>
                    <span className="text-xs font-mono text-gold px-2.5 py-0.5 rounded-full bg-gold/10 border border-gold/20">
                      {app.handle.startsWith("@") ? app.handle : `@${app.handle}`}
                    </span>
                    {getStatusBadge(app.status)}
                    <span className="text-[11px] font-mono text-stone flex items-center gap-1">
                      <Clock size={12} /> {app.date}
                    </span>
                  </div>

                  {/* Metadata tags */}
                  <div className="flex items-center gap-3 text-xs text-stone flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-obsidian/70 border border-gold/15 text-ivory font-mono text-[11px]">
                      {app.primaryPlatform}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-obsidian/70 border border-gold/15 text-gold font-mono text-[11px]">
                      Audience: <strong className="text-ivory">{app.audienceSize}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-stone">
                      <MapPin size={13} className="text-gold" /> {app.location}
                    </span>
                    <span className="text-stone">
                      {app.email} · {app.phone}
                    </span>
                  </div>

                  {/* Content Verticals / Niches */}
                  {app.niche && app.niche.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                      {app.niche.map((n) => (
                        <span
                          key={n}
                          className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/10 text-gold/90 border border-gold/15"
                        >
                          {n}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bio snippet */}
                  <p className="text-xs sm:text-sm text-stone/90 line-clamp-2 leading-relaxed bg-obsidian/40 p-3 rounded-xl border border-gold/10">
                    {app.bio}
                  </p>

                  {/* Portfolio link */}
                  {app.portfolioUrl && (
                    <div className="pt-1">
                      <a
                        href={app.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-obsidian/80 border border-gold/25 text-xs text-gold hover:text-gold hover:border-gold/50 transition-colors font-mono"
                      >
                        <ExternalLink size={12} className="text-gold" />
                        View Portfolio / Channel
                      </a>
                    </div>
                  )}
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gold/10">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone uppercase">Status:</span>
                    <select
                      value={
                        app.status === "under_review"
                          ? "reviewing"
                          : app.status === "accepted"
                          ? "approved"
                          : app.status
                      }
                      onChange={(e) => onStatusChange(app.id, e.target.value as ApplicationStatus)}
                      className="px-3 py-2 bg-obsidian border border-gold/30 rounded-xl text-xs font-mono text-ivory focus:outline-none focus:border-gold min-h-[40px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">In Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Declined</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenNotes(app)}
                      className="flex-1 lg:flex-none px-3.5 py-2 rounded-xl bg-obsidian/80 border border-gold/20 text-xs text-stone hover:text-ivory hover:border-gold/40 transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
                    >
                      <MessageSquare size={13} className="text-gold" />
                      {app.notes ? "View Notes" : "Add Note"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetails(app)}
                      className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                    >
                      Review Full Details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
