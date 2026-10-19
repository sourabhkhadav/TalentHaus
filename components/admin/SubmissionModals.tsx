"use client";

import React, { useState } from "react";
import { InboundInquiry, CreatorApplication, InquiryStatus, ApplicationStatus } from "@/types";
import {
  X,
  Mail,
  Calendar,
  DollarSign,
  MapPin,
  ExternalLink,
  LoaderCircle,
  CheckCircle,
  Shield,
  MessageSquare,
} from "lucide-react";

// ── 1. INQUIRY DETAILS MODAL ──
interface InquiryDetailsModalProps {
  inquiry: InboundInquiry | null;
  onClose: () => void;
  onStatusChange: (id: string, status: InquiryStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export function InquiryDetailsModal({
  inquiry,
  onClose,
  onStatusChange,
  onSaveNotes,
}: InquiryDetailsModalProps) {
  const [internalNotes, setInternalNotes] = useState(inquiry?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  if (!inquiry) return null;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await onSaveNotes(inquiry.id, internalNotes);
    setIsSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-1">
              <Mail size={14} /> Brand Campaign Brief
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-ivory">{inquiry.brandName}</h2>
            <p className="text-xs text-stone mt-0.5">Submitted on {inquiry.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-obsidian/60 border border-gold/15 flex-wrap gap-3">
          <div className="text-xs">
            <span className="text-stone uppercase font-mono block text-[10px]">Current Status</span>
            <span className="font-medium text-ivory uppercase tracking-wider">{inquiry.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone font-mono">Update Status:</span>
            <select
              value={inquiry.status}
              onChange={(e) => onStatusChange(inquiry.id, e.target.value as InquiryStatus)}
              className="px-3 py-1.5 bg-obsidian border border-gold/30 rounded-lg text-xs font-mono text-ivory focus:outline-none focus:border-gold min-h-[36px]"
            >
              <option value="new">New Brief</option>
              <option value="reviewing">Under Review</option>
              <option value="contacted">Contacted</option>
              <option value="approved">Approved</option>
              <option value="closed">Closed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Grid info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/10 space-y-1">
            <span className="text-stone text-[10px] uppercase font-mono block">Contact Person</span>
            <p className="text-ivory font-medium text-sm">{inquiry.contactName}</p>
            <p className="text-gold/90">{inquiry.email}</p>
            {inquiry.phone && <p className="text-stone">{inquiry.phone}</p>}
          </div>

          <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/10 space-y-1">
            <span className="text-stone text-[10px] uppercase font-mono block">Campaign Parameters</span>
            <p className="text-ivory font-medium text-sm flex items-center gap-1.5">
              <DollarSign size={13} className="text-gold" /> Budget: {inquiry.budget}
            </p>
            <p className="text-stone flex items-center gap-1.5">
              <Calendar size={13} className="text-gold" /> Timeline: {inquiry.timeline}
            </p>
          </div>
        </div>

        {/* Services */}
        {inquiry.services && inquiry.services.length > 0 && (
          <div>
            <span className="text-stone text-[11px] uppercase font-mono block mb-2">Requested Deliverables</span>
            <div className="flex items-center gap-2 flex-wrap">
              {inquiry.services.map((svc) => (
                <span
                  key={svc}
                  className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-xs font-mono border border-gold/20"
                >
                  {svc}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Campaign Brief Message */}
        <div>
          <span className="text-stone text-[11px] uppercase font-mono block mb-2">
            Scope & Deliverables Description
          </span>
          <div className="p-4 rounded-xl bg-obsidian/60 border border-gold/15 text-stone text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {inquiry.message}
          </div>
        </div>

        {/* Founder Internal Notes */}
        <div className="pt-2 border-t border-gold/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-ivory font-semibold flex items-center gap-1.5">
              <MessageSquare size={14} className="text-gold" /> Internal Founder Notes
            </span>
            {notesSaved && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle size={12} /> Notes saved
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add internal notes about this brand brief, pricing, assigned founder, or pitch strategy..."
            className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-xl text-ivory text-xs placeholder:text-stone/50 focus:outline-none focus:border-gold transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-4 py-2 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center gap-1.5"
            >
              {isSavingNotes ? <LoaderCircle size={14} className="animate-spin" /> : null}
              Save Notes
            </button>
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-2 border-t border-gold/15">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

interface ApplicationDetailsModalProps {
  application: CreatorApplication | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ApplicationStatus) => void;
  onSaveNotes: (id: string, notes: string) => void;
}

export function ApplicationDetailsModal({
  application,
  onClose,
  onStatusChange,
  onSaveNotes,
}: ApplicationDetailsModalProps) {
  const [internalNotes, setInternalNotes] = useState(application?.notes || "");
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  if (!application) return null;

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    await onSaveNotes(application.id, internalNotes);
    setIsSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-gold/15">
          <div>
            <div className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-1">
              <Shield size={14} /> Creator Representation Application
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-ivory">{application.fullName}</h2>
            <p className="text-xs text-stone mt-0.5">
              {application.handle} · Applied on {application.date}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-obsidian/60 border border-gold/15 flex-wrap gap-3">
          <div className="text-xs">
            <span className="text-stone uppercase font-mono block text-[10px]">Application Status</span>
            <span className="font-medium text-ivory uppercase tracking-wider">{application.status}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone font-mono">Update Status:</span>
            <select
              value={
                application.status === "under_review"
                  ? "reviewing"
                  : application.status === "accepted"
                  ? "approved"
                  : application.status
              }
              onChange={(e) => onStatusChange(application.id, e.target.value as ApplicationStatus)}
              className="px-3 py-1.5 bg-obsidian border border-gold/30 rounded-lg text-xs font-mono text-ivory focus:outline-none focus:border-gold min-h-[36px]"
            >
              <option value="pending">Pending</option>
              <option value="reviewing">In Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Declined</option>
            </select>
          </div>
        </div>

        {/* Creator Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/10 space-y-1.5">
            <span className="text-stone text-[10px] uppercase font-mono block">Contact & Location</span>
            <p className="text-ivory font-medium text-sm">{application.fullName}</p>
            <p className="text-gold/90">{application.email}</p>
            <p className="text-stone">{application.phone}</p>
            <p className="text-stone flex items-center gap-1 pt-1">
              <MapPin size={12} className="text-gold" /> {application.location}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/10 space-y-1.5">
            <span className="text-stone text-[10px] uppercase font-mono block">Platform & Audience</span>
            <p className="text-ivory font-medium text-sm">{application.primaryPlatform}</p>
            <p className="text-gold font-mono">{application.handle}</p>
            <p className="text-stone font-mono">Audience Size: {application.audienceSize}</p>
          </div>
        </div>

        {/* Verticals / Niche */}
        {application.niche && application.niche.length > 0 && (
          <div>
            <span className="text-stone text-[11px] uppercase font-mono block mb-2">Content Verticals</span>
            <div className="flex items-center gap-2 flex-wrap">
              {application.niche.map((n) => (
                <span
                  key={n}
                  className="px-3 py-1 rounded-lg bg-gold/10 text-gold text-xs font-mono border border-gold/20"
                >
                  {n}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Bio & Vision */}
        <div>
          <span className="text-stone text-[11px] uppercase font-mono block mb-2">Creator Bio & Narrative</span>
          <div className="p-4 rounded-xl bg-obsidian/60 border border-gold/15 text-stone text-xs sm:text-sm leading-relaxed whitespace-pre-line">
            {application.bio}
          </div>
        </div>

        {/* Portfolio & Channels Link */}
        {application.portfolioUrl ? (
          <div className="p-4 rounded-xl bg-obsidian/50 border border-gold/15 space-y-2">
            <span className="text-stone text-[11px] uppercase font-mono block">
              Portfolio, Media Kit, or Channel Link
            </span>
            <div className="flex items-center gap-2">
              <ExternalLink size={14} className="text-gold shrink-0" />
              <a
                href={application.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gold hover:underline truncate"
              >
                {application.portfolioUrl}
              </a>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-obsidian/40 border border-gold/10">
            <span className="text-stone text-[11px] uppercase font-mono block">Portfolio & Channel Link</span>
            <p className="text-xs text-stone/80 italic mt-1">No portfolio link provided.</p>
          </div>
        )}

        {/* Internal Founder Notes */}
        <div className="pt-2 border-t border-gold/15 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase font-mono text-ivory font-semibold flex items-center gap-1.5">
              <MessageSquare size={14} className="text-gold" /> Internal Evaluation Notes
            </span>
            {notesSaved && (
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <CheckCircle size={12} /> Notes saved
              </span>
            )}
          </div>
          <textarea
            rows={3}
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            placeholder="Add internal evaluation notes about this creator, audience engagement, or contract terms..."
            className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-xl text-ivory text-xs placeholder:text-stone/50 focus:outline-none focus:border-gold transition-colors"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-4 py-2 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center gap-1.5"
            >
              {isSavingNotes ? <LoaderCircle size={14} className="animate-spin" /> : null}
              Save Notes
            </button>
          </div>
        </div>

        {/* Close */}
        <div className="flex justify-end pt-2 border-t border-gold/15">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ── 3. QUICK NOTES MODAL ──
interface NotesModalProps {
  item: {
    type: "inquiry" | "application";
    id: string;
    name: string;
    notes: string;
  } | null;
  onClose: () => void;
  onSave: (type: "inquiry" | "application", id: string, notes: string) => Promise<void>;
}

export function NotesModal({ item, onClose, onSave }: NotesModalProps) {
  const [text, setText] = useState(item?.notes || "");
  const [isSaving, setIsSaving] = useState(false);

  if (!item) return null;

  const handleSave = async () => {
    setIsSaving(true);
    await onSave(item.type, item.id, text);
    setIsSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-plum border border-gold/30 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gold/15">
          <div>
            <h3 className="font-display text-xl text-ivory">Internal Notes</h3>
            <p className="text-xs text-stone truncate max-w-xs">{item.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-stone hover:text-ivory"
          >
            <X size={18} />
          </button>
        </div>

        <textarea
          rows={5}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter confidential notes, discussions, or next steps..."
          className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-xl text-ivory text-xs placeholder:text-stone/50 focus:outline-none focus:border-gold transition-colors resize-y"
        />

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-gold/15">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[40px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center gap-1.5 min-h-[40px]"
          >
            {isSaving && <LoaderCircle size={14} className="animate-spin" />}
            Save Note
          </button>
        </div>
      </div>
    </div>
  );
}
