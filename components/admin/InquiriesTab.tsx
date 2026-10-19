"use client";

import React, { useState } from "react";
import { InboundInquiry, InquiryStatus } from "@/types";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Mail,
  Calendar,
  Clock,
  DollarSign,
  MessageSquare,
  ChevronRight,
  Phone,
  Briefcase,
} from "lucide-react";

interface InquiriesTabProps {
  inquiries: InboundInquiry[];
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onOpenNotes: (inquiry: InboundInquiry) => void;
  onViewDetails: (inquiry: InboundInquiry) => void;
}

const STATUS_OPTIONS: { value: InquiryStatus; label: string; color: string }[] = [
  { value: "new", label: "New Brief", color: "bg-purple-500/15 text-purple-300 border-purple-500/30" },
  { value: "reviewing", label: "Under Review", color: "bg-blue-500/15 text-blue-300 border-blue-500/30" },
  { value: "contacted", label: "Contacted", color: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30" },
  { value: "approved", label: "Approved / Active", color: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30" },
  { value: "closed", label: "Closed", color: "bg-stone-500/15 text-stone-300 border-stone-500/30" },
  { value: "archived", label: "Archived", color: "bg-slate-700/20 text-slate-400 border-slate-700/30" },
];

export function InquiriesTab({
  inquiries,
  onStatusChange,
  onOpenNotes,
  onViewDetails,
}: InquiriesTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = inquiries.filter((inq) => {
    const matchesStatus = statusFilter === "all" || inq.status === statusFilter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      inq.brandName.toLowerCase().includes(q) ||
      inq.contactName.toLowerCase().includes(q) ||
      inq.email.toLowerCase().includes(q) ||
      (inq.phone && inq.phone.toLowerCase().includes(q)) ||
      inq.message.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: InquiryStatus) => {
    const match = STATUS_OPTIONS.find((s) => s.value === status) || STATUS_OPTIONS[0];
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
      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-plum/20 border border-gold/15">
        <div className="flex-1 relative min-w-[240px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="text"
            placeholder="Search by brand, contact name, email, or scope..."
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
            <option value="all">All Inquiries ({inquiries.length})</option>
            <option value="new">New ({inquiries.filter((i) => i.status === "new").length})</option>
            <option value="reviewing">Reviewing ({inquiries.filter((i) => i.status === "reviewing").length})</option>
            <option value="contacted">Contacted ({inquiries.filter((i) => i.status === "contacted").length})</option>
            <option value="approved">Approved ({inquiries.filter((i) => i.status === "approved").length})</option>
            <option value="closed">Closed ({inquiries.filter((i) => i.status === "closed").length})</option>
          </select>
        </div>
      </div>

      {/* Inquiries Cards List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-plum/10 border border-gold/10">
          <Mail size={36} className="mx-auto text-stone mb-3 opacity-60" />
          <h4 className="font-display text-lg text-ivory mb-1">No Campaign Briefs Found</h4>
          <p className="text-stone text-xs max-w-sm mx-auto">
            {searchTerm || statusFilter !== "all"
              ? "No inquiries matched your search or status filter. Try clearing filters."
              : "Inbound campaign briefs submitted through the /contact page will appear here."}
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
          {filtered.map((inq) => (
            <div
              key={inq.id}
              className="p-5 sm:p-6 rounded-2xl bg-plum/20 border border-gold/15 hover:border-gold/30 transition-all shadow-sm"
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Brand & Contact Header */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-xl sm:text-2xl text-ivory tracking-wide">
                      {inq.brandName}
                    </h3>
                    {getStatusBadge(inq.status)}
                    <span className="text-[11px] font-mono text-stone flex items-center gap-1">
                      <Clock size={12} /> {inq.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-stone flex-wrap">
                    <span className="text-ivory font-medium flex items-center gap-1.5">
                      <Briefcase size={13} className="text-gold" /> {inq.contactName}
                    </span>
                    <a
                      href={`mailto:${inq.email}`}
                      className="text-gold/90 hover:text-gold hover:underline flex items-center gap-1.5 transition-colors"
                    >
                      <Mail size={13} /> {inq.email}
                    </a>
                    {inq.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={13} className="text-stone" /> {inq.phone}
                      </span>
                    )}
                  </div>

                  {/* Budget & Timeline Highlights */}
                  <div className="flex items-center gap-3 pt-1 flex-wrap">
                    <span className="px-3 py-1 rounded-lg bg-obsidian/70 border border-gold/20 text-xs font-mono text-gold flex items-center gap-1.5">
                      <DollarSign size={13} /> Budget: <strong className="text-ivory">{inq.budget}</strong>
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-obsidian/70 border border-gold/20 text-xs font-mono text-stone flex items-center gap-1.5">
                      <Calendar size={13} className="text-gold" /> Timeline:{" "}
                      <strong className="text-ivory">{inq.timeline}</strong>
                    </span>
                    {inq.services && inq.services.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {inq.services.map((svc) => (
                          <span
                            key={svc}
                            className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/10 text-gold/80 border border-gold/15"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Message Preview */}
                  <div className="pt-2">
                    <p className="text-xs sm:text-sm text-stone/90 line-clamp-2 leading-relaxed bg-obsidian/40 p-3 rounded-xl border border-gold/10">
                      {inq.message}
                    </p>
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-gold/10">
                  {/* Status Dropdown */}
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-stone uppercase">Status:</span>
                    <select
                      value={inq.status}
                      onChange={(e) => onStatusChange(inq.id, e.target.value as InquiryStatus)}
                      className="px-3 py-2 bg-obsidian border border-gold/30 rounded-xl text-xs font-mono text-ivory focus:outline-none focus:border-gold min-h-[40px]"
                    >
                      <option value="new">New Brief</option>
                      <option value="reviewing">Under Review</option>
                      <option value="contacted">Contacted</option>
                      <option value="approved">Approved</option>
                      <option value="closed">Closed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onOpenNotes(inq)}
                      className="flex-1 lg:flex-none px-3.5 py-2 rounded-xl bg-obsidian/80 border border-gold/20 text-xs text-stone hover:text-ivory hover:border-gold/40 transition-colors flex items-center justify-center gap-1.5 min-h-[40px]"
                    >
                      <MessageSquare size={13} className="text-gold" />
                      {inq.notes ? "View Notes" : "Add Note"}
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewDetails(inq)}
                      className="flex-1 lg:flex-none px-4 py-2 rounded-xl bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center gap-1 min-h-[40px]"
                    >
                      Inspect Brief <ChevronRight size={14} />
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
