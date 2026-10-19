"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import {
    CheckCircle2,
    Clock,
    FileText,
    Sparkles,
    Upload,
    TrendingUp,
    ShieldCheck,
    Calendar,
    ArrowUpRight,
    Briefcase,
    DollarSign,
    Check,
    X,
    Filter,
} from "lucide-react";

interface Deliverable {
    id: string;
    brand: string;
    campaign: string;
    deliverable: string;
    dueDate: string;
    compensation: string;
    status: "draft_needed" | "in_review" | "approved" | "live";
    draftUrl?: string;
}

const initialDeliverables: Deliverable[] = [];


export function PortalClient() {
    const { user } = useAuth();
    const [deliverables, setDeliverables] = useState<Deliverable[]>(initialDeliverables);
    const [viewMode, setViewMode] = useState<"talent" | "brand">(
        user?.role === "brand" ? "brand" : "talent"
    );
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [uploadModalItem, setUploadModalItem] = useState<Deliverable | null>(null);
    const [draftLinkInput, setDraftLinkInput] = useState("");
    const [reviewModalItem, setReviewModalItem] = useState<Deliverable | null>(null);
    const [feedbackInput, setFeedbackInput] = useState("");
    const [actionMessage, setActionMessage] = useState<string | null>(null);

    const showNotification = (msg: string) => {
        setActionMessage(msg);
        setTimeout(() => setActionMessage(null), 4000);
    };

    const handleUploadDraft = (e: React.FormEvent) => {
        e.preventDefault();
        if (!uploadModalItem || !draftLinkInput) return;

        setDeliverables((prev) =>
            prev.map((d) =>
                d.id === uploadModalItem.id
                    ? { ...d, status: "in_review", draftUrl: draftLinkInput }
                    : d
            )
        );
        showNotification(`Draft uploaded for ${uploadModalItem.campaign}. Brand notified.`);
        setUploadModalItem(null);
        setDraftLinkInput("");
    };

    const handleApproveDraft = (id: string) => {
        setDeliverables((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d))
        );
        showNotification("Deliverable approved for publishing!");
        setReviewModalItem(null);
    };

    const handleRequestRevisions = (id: string) => {
        setDeliverables((prev) =>
            prev.map((d) => (d.id === id ? { ...d, status: "draft_needed" } : d))
        );
        showNotification(`Revision notes submitted to creator: "${feedbackInput || "Revisions required."}"`);
        setReviewModalItem(null);
        setFeedbackInput("");
    };

    const filteredDeliverables = deliverables.filter((d) => {
        if (filterStatus === "all") return true;
        return d.status === filterStatus;
    });

    return (
        <div className="min-h-screen bg-obsidian text-ivory pt-24 pb-20 safe-bottom">
            {/* Action Feedback Banner */}
            {actionMessage && (
                <div
                    role="alert"
                    className="fixed top-24 right-4 z-50 max-w-sm w-full bg-oxblood/90 border border-gold/40 text-ivory p-4 rounded shadow-2xl backdrop-blur-md flex items-center justify-between"
                >
                    <div className="flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-gold shrink-0" />
                        <span className="font-body text-xs sm:text-sm font-medium">{actionMessage}</span>
                    </div>
                    <button
                        onClick={() => setActionMessage(null)}
                        className="w-11 h-11 flex items-center justify-center text-ivory/60 hover:text-ivory"
                        aria-label="Dismiss message"
                    >
                        <X size={16} />
                    </button>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Banner */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-gold/15 mb-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-plum/50 border border-gold/20 text-gold text-xs uppercase tracking-wider mb-3">
                            <Sparkles size={12} />
                            TalentHaus Client & Talent Portal
                        </div>
                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-ivory tracking-tight">
                            {viewMode === "talent" ? "Creator Atelier" : "Brand Campaign Lounge"}
                        </h1>
                        <p className="font-body text-stone text-sm sm:text-base mt-1">
                            {viewMode === "talent"
                                ? `Welcome, ${user?.name || "Talent Member"} • Deliverables, draft submissions & updates.`
                                : "Partner Campaign Lounge • Campaign approvals, drafts & metrics."}
                        </p>
                    </div>

                    {/* View Switcher for authenticated users */}
                    <div className="flex flex-wrap items-center gap-2 bg-plum/40 p-1.5 rounded-lg border border-gold/15">
                        <button
                            type="button"
                            onClick={() => setViewMode("talent")}
                            className={`min-h-[44px] px-4 py-2 rounded text-xs sm:text-sm font-medium transition-all ${
                                viewMode === "talent"
                                    ? "bg-gold text-obsidian shadow"
                                    : "text-stone hover:text-ivory"
                            }`}
                        >
                            Talent View
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewMode("brand")}
                            className={`min-h-[44px] px-4 py-2 rounded text-xs sm:text-sm font-medium transition-all ${
                                viewMode === "brand"
                                    ? "bg-gold text-obsidian shadow"
                                    : "text-stone hover:text-ivory"
                            }`}
                        >
                            Brand View
                        </button>
                        {(user?.role === "founder" || user?.role === "admin") && (
                            <Link
                                href="/admin"
                                className="min-h-[44px] inline-flex items-center gap-1 px-3 py-2 rounded text-xs text-gold/80 hover:text-gold border border-gold/20 hover:border-gold/50"
                            >
                                Founder OS
                                <ArrowUpRight size={12} />
                            </Link>
                        )}
                    </div>
                </div>

                {/* KPI Cards (Responsive Grid: 1 col on mobile, 3 on md) */}
                {viewMode === "talent" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Pending Deliverables</span>
                                <Clock size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">
                                {deliverables.filter((d) => d.status !== "live").length} Active
                            </div>
                            <div className="font-body text-xs text-gold/80 mt-1">
                                {deliverables.length === 0 ? "No pending deliverables" : `${deliverables.filter((d) => d.status === "in_review").length} draft(s) in review`}
                            </div>
                        </div>

                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Representation Status</span>
                                <DollarSign size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">Active</div>
                            <div className="font-body text-xs text-stone mt-1">TalentHaus Representation Desk</div>
                        </div>

                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Agency Support</span>
                                <TrendingUp size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">Central HQ</div>
                            <div className="font-body text-xs text-gold/80 mt-1">Indore, Madhya Pradesh, India</div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Roster Deliverables</span>
                                <FileText size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">
                                {deliverables.filter((d) => d.status === "in_review").length} Need Approval
                            </div>
                            <div className="font-body text-xs text-gold/80 mt-1">
                                {deliverables.length === 0 ? "No active reviews pending" : `${deliverables.filter((d) => d.status === "in_review").length} review(s) outstanding`}
                            </div>
                        </div>

                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Campaign Scope</span>
                                <Briefcase size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">Custom Scope</div>
                            <div className="font-body text-xs text-stone mt-1">Structured per campaign brief</div>
                        </div>

                        <div className="bg-plum/20 border border-gold/15 rounded-lg p-5">
                            <div className="flex items-center justify-between text-stone text-xs uppercase tracking-wider mb-2">
                                <span>Partnership Status</span>
                                <ShieldCheck size={16} className="text-gold" />
                            </div>
                            <div className="font-display text-2xl sm:text-3xl text-ivory">Active Desk</div>
                            <div className="font-body text-xs text-gold/80 mt-1">Managed via TalentHaus Indore HQ</div>
                        </div>
                    </div>
                )}

                {/* Filter bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-gold shrink-0" />
                        <span className="font-body text-xs text-stone uppercase tracking-wider">Status:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {[
                                { id: "all", label: "All" },
                                { id: "draft_needed", label: "Draft Needed" },
                                { id: "in_review", label: "In Review" },
                                { id: "approved", label: "Approved" },
                                { id: "live", label: "Live" },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setFilterStatus(tab.id)}
                                    className={`min-h-[44px] px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                                        filterStatus === tab.id
                                            ? "bg-gold text-obsidian font-semibold"
                                            : "bg-plum/40 text-stone hover:text-ivory border border-gold/10"
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <span className="font-body text-xs text-stone">
                        Showing {filteredDeliverables.length} item{filteredDeliverables.length === 1 ? "" : "s"}
                    </span>
                </div>

                {/* Deliverables List: Responsive Cards on Mobile, Clean Table on Desktop */}
                {filteredDeliverables.length === 0 ? (
                    <div className="py-16 px-6 text-center rounded-xl bg-plum/20 border border-gold/15">
                        <Sparkles size={32} className="mx-auto text-gold mb-3 opacity-60" />
                        <h3 className="font-display text-xl text-ivory">No Active Deliverables</h3>
                        <p className="font-body text-xs text-stone mt-1 max-w-md mx-auto">
                            Assigned campaign deliverables, draft review links, and assets will appear here once a brand partnership contract is activated.
                        </p>
                    </div>
                ) : (
                <div className="space-y-4">
                    {/* Desktop Table View (hidden on small screens) */}
                    <div className="hidden md:block bg-plum/20 border border-gold/15 rounded-lg overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-plum/40 border-b border-gold/15 text-gold text-xs uppercase tracking-wider">
                                <tr>
                                    <th className="px-6 py-4">Brand & Campaign</th>
                                    <th className="px-6 py-4">Deliverable Spec</th>
                                    <th className="px-6 py-4">Due Date</th>
                                    <th className="px-6 py-4">Value</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gold/10">
                                {filteredDeliverables.map((item) => (
                                    <tr key={item.id} className="hover:bg-plum/30 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-display text-base text-ivory font-medium">
                                                {item.brand}
                                            </div>
                                            <div className="font-body text-xs text-stone">{item.campaign}</div>
                                        </td>
                                        <td className="px-6 py-4 font-body text-xs text-ivory max-w-xs">
                                            {item.deliverable}
                                        </td>
                                        <td className="px-6 py-4 font-body text-xs text-stone whitespace-nowrap">
                                            {item.dueDate}
                                        </td>
                                        <td className="px-6 py-4 font-body text-sm font-semibold text-gold">
                                            {item.compensation}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider ${
                                                    item.status === "approved"
                                                        ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                                        : item.status === "live"
                                                        ? "bg-blue-950 text-blue-300 border border-blue-800"
                                                        : item.status === "in_review"
                                                        ? "bg-amber-950 text-amber-300 border border-amber-800"
                                                        : "bg-stone/20 text-stone border border-stone/30"
                                                }`}
                                            >
                                                {item.status.replace("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {viewMode === "talent" ? (
                                                <button
                                                    onClick={() => setUploadModalItem(item)}
                                                    className="min-h-[44px] px-4 py-2 rounded bg-gold/10 hover:bg-gold text-gold hover:text-obsidian text-xs font-medium border border-gold/30 transition-all inline-flex items-center gap-1.5"
                                                >
                                                    <Upload size={14} />
                                                    {item.draftUrl ? "Update Draft" : "Submit Draft"}
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => setReviewModalItem(item)}
                                                    className="min-h-[44px] px-4 py-2 rounded bg-gold text-obsidian hover:bg-gold/90 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                                                >
                                                    Review & Approve
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View (shown only on mobile/tablet < md) */}
                    <div className="md:hidden space-y-4">
                        {filteredDeliverables.map((item) => (
                            <div
                                key={item.id}
                                className="bg-plum/30 border border-gold/20 rounded-lg p-5 flex flex-col gap-3 shadow-lg"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <span className="font-display text-lg text-ivory block font-medium">
                                            {item.brand}
                                        </span>
                                        <span className="font-body text-xs text-stone block mt-0.5">
                                            {item.campaign}
                                        </span>
                                    </div>
                                    <span
                                        className={`px-2.5 py-1 rounded text-xs font-medium uppercase tracking-wider shrink-0 ${
                                            item.status === "approved"
                                                ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                                                : item.status === "live"
                                                ? "bg-blue-950 text-blue-300 border border-blue-800"
                                                : item.status === "in_review"
                                                ? "bg-amber-950 text-amber-300 border border-amber-800"
                                                : "bg-stone/20 text-stone border border-stone/30"
                                        }`}
                                    >
                                        {item.status.replace("_", " ")}
                                    </span>
                                </div>

                                <div className="p-3 bg-obsidian/60 border border-gold/10 rounded text-xs text-ivory font-body leading-relaxed">
                                    <span className="text-stone block mb-1 uppercase tracking-wider text-[10px]">
                                        Deliverable Spec
                                    </span>
                                    {item.deliverable}
                                </div>

                                <div className="flex items-center justify-between text-xs font-body pt-1 border-t border-gold/10">
                                    <span className="text-stone inline-flex items-center gap-1">
                                        <Calendar size={13} className="text-gold" />
                                        Due {item.dueDate}
                                    </span>
                                    <span className="text-gold font-bold text-sm">
                                        {item.compensation}
                                    </span>
                                </div>

                                {item.draftUrl && (
                                    <div className="text-[11px] text-stone truncate font-mono bg-obsidian/40 px-2 py-1.5 rounded border border-gold/10">
                                        Draft: <span className="text-gold/90">{item.draftUrl}</span>
                                    </div>
                                )}

                                <div className="pt-2">
                                    {viewMode === "talent" ? (
                                        <button
                                            onClick={() => setUploadModalItem(item)}
                                            className="w-full min-h-[44px] px-4 py-2.5 rounded bg-gold/10 hover:bg-gold text-gold hover:text-obsidian text-xs font-medium border border-gold/30 transition-all flex items-center justify-center gap-2"
                                        >
                                            <Upload size={15} />
                                            {item.draftUrl ? "Update Draft Link" : "Submit Draft Link"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => setReviewModalItem(item)}
                                            className="w-full min-h-[44px] px-4 py-2.5 rounded bg-gold text-obsidian hover:bg-gold/90 text-xs font-semibold transition-all flex items-center justify-center gap-2"
                                        >
                                            Review & Take Action
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                )}

                {/* Additional Atelier Section: Media Kit & Fast Download */}
                {viewMode === "talent" && (
                    <div className="mt-12 bg-plum/20 border border-gold/15 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-display text-xl text-ivory">
                                    {user?.name || "TalentHaus Creator"} — Media Kit One-Sheet
                                </h3>
                                <p className="font-body text-xs sm:text-sm text-stone mt-1">
                                    Current verified agency one-sheet, demographics, and talent assets.
                                </p>
                            </div>
                            <button
                                onClick={() => showNotification("One-sheet media kit PDF downloaded.")}
                                className="min-h-[44px] px-5 py-2.5 rounded border border-gold/40 text-gold hover:bg-gold hover:text-obsidian text-xs font-medium tracking-wide transition-colors inline-flex items-center justify-center gap-2"
                            >
                                Download Media Kit PDF (2.4MB)
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Talent Submit Draft Modal */}
            {uploadModalItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="upload-draft-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm overflow-y-auto"
                >
                    <div className="bg-plum border border-gold/30 rounded-lg p-6 max-w-lg w-full shadow-2xl relative">
                        <button
                            onClick={() => setUploadModalItem(null)}
                            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                            aria-label="Close dialog"
                        >
                            <X size={18} />
                        </button>
                        <h2 id="upload-draft-title" className="font-display text-2xl text-ivory mb-2">
                            Submit Draft
                        </h2>
                        <p className="font-body text-xs text-stone mb-4">
                            {uploadModalItem.brand} — {uploadModalItem.campaign}
                        </p>

                        <form onSubmit={handleUploadDraft} className="space-y-4">
                            <div>
                                <label className="block font-body text-xs text-gold uppercase tracking-wider mb-2">
                                    Cloud Link (Google Drive, Frame.io, Dropbox)
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://drive.google.com/file/d/..."
                                    value={draftLinkInput}
                                    onChange={(e) => setDraftLinkInput(e.target.value)}
                                    className="w-full min-h-[44px] px-3 py-2.5 rounded bg-obsidian/70 border border-gold/20 text-ivory font-body text-base sm:text-sm focus:border-gold outline-none"
                                />
                                <span className="font-body text-[11px] text-stone mt-1 block">
                                    Ensure permissions are set to view for TalentHaus & brand team.
                                </span>
                            </div>

                            <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setUploadModalItem(null)}
                                    className="w-full sm:w-auto min-h-[44px] px-5 py-2.5 rounded border border-gold/20 text-stone hover:text-ivory text-xs font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded bg-gold text-obsidian hover:bg-gold/90 text-xs font-semibold"
                                >
                                    Submit for Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Brand Review Modal */}
            {reviewModalItem && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="review-draft-title"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm overflow-y-auto"
                >
                    <div className="bg-plum border border-gold/30 rounded-lg p-6 max-w-lg w-full shadow-2xl relative">
                        <button
                            onClick={() => setReviewModalItem(null)}
                            className="absolute top-4 right-4 w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                            aria-label="Close dialog"
                        >
                            <X size={18} />
                        </button>
                        <h2 id="review-draft-title" className="font-display text-2xl text-ivory mb-2">
                            Review Deliverable
                        </h2>
                        <p className="font-body text-xs text-stone mb-4">
                            {reviewModalItem.brand} — {reviewModalItem.campaign}
                        </p>

                        <div className="p-3 bg-obsidian/70 border border-gold/15 rounded text-xs space-y-1.5 mb-4">
                            <div className="text-stone">Spec: {reviewModalItem.deliverable}</div>
                            <div className="text-stone">Fee: {reviewModalItem.compensation}</div>
                            {reviewModalItem.draftUrl ? (
                                <div className="text-gold truncate">
                                    Preview:{" "}
                                    <a
                                        href={reviewModalItem.draftUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="underline hover:text-gold/80"
                                    >
                                        {reviewModalItem.draftUrl}
                                    </a>
                                </div>
                            ) : (
                                <div className="text-stone italic">No draft URL submitted yet.</div>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-body text-xs text-stone uppercase tracking-wider mb-2">
                                    Optional Revisions / Notes
                                </label>
                                <textarea
                                    rows={3}
                                    value={feedbackInput}
                                    onChange={(e) => setFeedbackInput(e.target.value)}
                                    placeholder="Specify color grading notes, audio cuts, or copy adjustments..."
                                    className="w-full p-3 rounded bg-obsidian/70 border border-gold/20 text-ivory font-body text-base sm:text-sm focus:border-gold outline-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => handleRequestRevisions(reviewModalItem.id)}
                                    className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 rounded border border-amber-600/60 text-amber-300 hover:bg-amber-950/40 text-xs font-semibold"
                                >
                                    Request Revisions
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleApproveDraft(reviewModalItem.id)}
                                    className="w-full sm:flex-1 min-h-[44px] px-4 py-2.5 rounded bg-emerald-600 hover:bg-emerald-500 text-ivory text-xs font-semibold flex items-center justify-center gap-1.5"
                                >
                                    <Check size={16} />
                                    Approve & Release
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
