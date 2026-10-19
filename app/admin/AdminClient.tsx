"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { RoleGuard } from "@/lib/auth/RoleGuard";
import {
  Deal,
  Expense,
  Task,
  DealStatus,
  TaskStatus,
  TaskPriority,
  ExpenseCategory,
  TalentProfile,
  InboundInquiry,
  CreatorApplication,
  InquiryStatus,
  ApplicationStatus,
} from "@/types";
import {
  getAgencyDeals,
  updateDealStatus,
  addDeal,
  getAgencyExpenses,
  toggleExpenseStatus,
  addExpense,
  getAgencyTasks,
  updateTaskStatus,
  addTask,
  getAgencyRoster,
  addTalentToRoster,
  updateTalentInRoster,
  deleteTalentFromRoster,
  getAgencyInquiries,
  getAgencyApplications,
} from "@/lib/data/store";
import { uploadCreatorPhoto } from "@/lib/data";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  DollarSign,
  CheckSquare,
  Users,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  X,
  ExternalLink,
  Sparkles,
  Shield,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  Star,
  Mail,
  FileText,
  LogOut,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { InquiriesTab } from "@/components/admin/InquiriesTab";
import { ApplicationsTab } from "@/components/admin/ApplicationsTab";
import {
  InquiryDetailsModal,
  ApplicationDetailsModal,
  NotesModal,
} from "@/components/admin/SubmissionModals";
import { CloudinaryStudioTab } from "@/components/admin/CloudinaryStudioTab";
import { CreatorPhotoModal } from "@/components/admin/CreatorPhotoModal";
import { EditCreatorModal } from "@/components/admin/EditCreatorModal";
import { niches as allNiches, type Niche } from "@/content/roster";

type TabId = "overview" | "deals" | "expenses" | "tasks" | "roster" | "inquiries" | "applications" | "media";

export function AdminClient() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Shared store state
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [roster, setRoster] = useState<TalentProfile[]>([]);

  // Modals
  const [showAddDeal, setShowAddDeal] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddTalent, setShowAddTalent] = useState(false);
  const [editingCreator, setEditingCreator] = useState<TalentProfile | null>(null);

  // Filters
  const [dealStatusFilter, setDealStatusFilter] = useState<string>("all");
  const [expenseFilter, setExpenseFilter] = useState<string>("all");
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState<string>("all");
  const [taskStatusFilter, setTaskStatusFilter] = useState<string>("all");

  // Deal Form
  const [newDeal, setNewDeal] = useState({
    brand: "",
    brandContact: "",
    talentName: "Rishi Agrawal",
    title: "",
    platform: "Instagram" as Deal["platform"],
    fee: "₹5,00,000",
    feeNumeric: 500000,
    status: "negotiation" as DealStatus,
    deadline: "2026-12-01",
    contractDate: "2026-10-18",
    assignedFounder: "Sourabh" as "Sourabh" | "Navneet" | "Atharv",
    notes: "",
  });

  // Expense Form
  const [newExpense, setNewExpense] = useState({
    title: "",
    category: "Software" as ExpenseCategory,
    amount: "₹25,000",
    amountNumeric: 25000,
    status: "unpaid" as "paid" | "unpaid",
    dueDate: "2026-11-01",
    isRecurring: true,
    recurringFrequency: "Monthly" as const,
    vendor: "",
    managedBy: "Sourabh" as "Sourabh" | "Navneet" | "Atharv",
  });

  // Task Form
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "Sourabh" as "Sourabh" | "Navneet" | "Atharv",
    relatedEntity: "",
    priority: "high" as TaskPriority,
    status: "pending" as TaskStatus,
    dueDate: "2026-10-25",
  });

  // Talent Form
  const [newTalent, setNewTalent] = useState({
    name: "",
    slug: "",
    location: "Indore, India",
    audienceSize: "500K",
    engagementRate: "6.5%",
    bio: "",
    shortBio: "",
    niche: ["Fashion"],
    platforms: ["Instagram", "YouTube"],
    featured: true,
    instagramHandle: "",
    instagramFollowers: "",
    youtubeHandle: "",
    youtubeSubscribers: "",
    image: "/images/roster/placeholder.jpg",
    coverImage: "/images/roster/placeholder-cover.jpg",
    cloudinaryPublicId: "",
    coverCloudinaryPublicId: "",
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [coverUploadError, setCoverUploadError] = useState<string | null>(null);

  // Selected creator for photo management modal
  const [selectedCreatorForPhoto, setSelectedCreatorForPhoto] = useState<TalentProfile | null>(null);

  // Submissions state (Inquiries & Creator Applications)
  const [inquiries, setInquiries] = useState<InboundInquiry[]>([]);
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<InboundInquiry | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [notesModalItem, setNotesModalItem] = useState<{
    type: "inquiry" | "application";
    id: string;
    name: string;
    notes: string;
  } | null>(null);

  const [isSyncingSubmissions, setIsSyncingSubmissions] = useState(false);

  // Fetch live submissions from Supabase & server route handlers with founder auth
  const syncSubmissions = useCallback(async () => {
    setIsSyncingSubmissions(true);
    try {
      const founderHeader = user?.name?.toLowerCase() || "sourabh";
      const [inqRes, appRes] = await Promise.all([
        fetch("/api/contact", { headers: { "x-founder-auth": founderHeader } }),
        fetch("/api/applications", { headers: { "x-founder-auth": founderHeader } }),
      ]);

      if (inqRes.ok) {
        const json = await inqRes.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped: InboundInquiry[] = json.data.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            brandName: String(r.brand_name || ""),
            contactName: String(r.contact_name || ""),
            email: String(r.email || ""),
            phone: r.phone ? String(r.phone) : undefined,
            budget: String(r.budget || ""),
            timeline: String(r.timeline || ""),
            services: (Array.isArray(r.services) ? r.services : []) as string[],
            message: String(r.message || ""),
            status: (r.status as InquiryStatus) || "new",
            notes: r.notes ? String(r.notes) : undefined,
            date: typeof r.created_at === "string" ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            created_at: typeof r.created_at === "string" ? r.created_at : undefined,
          }));
          setInquiries(mapped);
          try {
            localStorage.setItem("th_agency_inquiries_v3", JSON.stringify(mapped));
          } catch {
            // Ignore storage errors
          }
        }
      }

      if (appRes.ok) {
        const json = await appRes.json();
        if (json.data && Array.isArray(json.data)) {
          const mapped: CreatorApplication[] = json.data.map((r: Record<string, unknown>) => ({
            id: String(r.id),
            fullName: String(r.full_name || ""),
            email: String(r.email || ""),
            phone: String(r.phone || ""),
            location: String(r.location || ""),
            primaryPlatform: String(r.primary_platform || "Instagram"),
            handle: String(r.handle || ""),
            audienceSize: String(r.audience_size || ""),
            niche: (Array.isArray(r.niche) ? r.niche : []) as string[],
            bio: String(r.bio || ""),
            portfolioUrl: r.portfolio_url ? String(r.portfolio_url) : undefined,
            status: (r.status as ApplicationStatus) || "pending",
            notes: r.notes ? String(r.notes) : undefined,
            date: typeof r.created_at === "string" ? r.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
            created_at: typeof r.created_at === "string" ? r.created_at : undefined,
          }));
          setApplications(mapped);
          try {
            localStorage.setItem("th_agency_applications_v3", JSON.stringify(mapped));
          } catch {
            // Ignore storage errors
          }
        }
      }
    } catch {
      // Retain local store items
    } finally {
      setIsSyncingSubmissions(false);
    }
  }, [user?.name]);

  // Load from shared store on mount & sync live Supabase submissions
  useEffect(() => {
    setDeals(getAgencyDeals());
    setExpenses(getAgencyExpenses());
    setTasks(getAgencyTasks());
    setRoster(getAgencyRoster());
    setInquiries(getAgencyInquiries());
    setApplications(getAgencyApplications());

    syncSubmissions();
    const interval = setInterval(syncSubmissions, 10000);
    return () => clearInterval(interval);
  }, [syncSubmissions]);

  // Handlers
  const handleDealStatusChange = (id: string, status: DealStatus) => {
    const updated = updateDealStatus(id, status);
    setDeals(updated);
  };

  const handleExpenseToggle = (id: string) => {
    const updated = toggleExpenseStatus(id);
    setExpenses(updated);
  };

  const handleTaskStatusChange = (id: string, status: TaskStatus) => {
    const updated = updateTaskStatus(id, status);
    setTasks(updated);
  };

  // Inquiry Handlers - Direct state updates ensure inquiries NEVER disappear
  const handleInquiryStatusChange = async (id: string, status: InquiryStatus) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq.id === id ? { ...inq, status } : inq));
      try {
        localStorage.setItem("th_agency_inquiries_v3", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      await fetch(`/api/contact/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": user?.name?.toLowerCase() || "sourabh",
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      // offline/local updated
    }
  };

  const handleSaveInquiryNotes = async (id: string, notes: string) => {
    setInquiries((prev) => {
      const updated = prev.map((inq) => (inq.id === id ? { ...inq, notes } : inq));
      try {
        localStorage.setItem("th_agency_inquiries_v3", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, notes } : null));
    }

    try {
      await fetch(`/api/contact/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": user?.name?.toLowerCase() || "sourabh",
        },
        body: JSON.stringify({ notes }),
      });
    } catch {
      // offline/local updated
    }
  };

  // Creator Application Handlers - Direct state updates ensure applications NEVER disappear
  const handleApplicationStatusChange = async (id: string, status: ApplicationStatus) => {
    setApplications((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, status } : a));
      try {
        localStorage.setItem("th_agency_applications_v3", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, status } : null));
    }

    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": user?.name?.toLowerCase() || "sourabh",
        },
        body: JSON.stringify({ status }),
      });
    } catch {
      // offline/local updated
    }
  };

  const handleSaveApplicationNotes = async (id: string, notes: string) => {
    setApplications((prev) => {
      const updated = prev.map((a) => (a.id === id ? { ...a, notes } : a));
      try {
        localStorage.setItem("th_agency_applications_v3", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (selectedApplication && selectedApplication.id === id) {
      setSelectedApplication((prev) => (prev ? { ...prev, notes } : null));
    }

    try {
      await fetch(`/api/applications/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-founder-auth": user?.name?.toLowerCase() || "sourabh",
        },
        body: JSON.stringify({ notes }),
      });
    } catch {
      // offline/local updated
    }
  };

  const handleSaveNotesModal = async (type: "inquiry" | "application", id: string, notes: string) => {
    if (type === "inquiry") {
      await handleSaveInquiryNotes(id, notes);
    } else {
      await handleSaveApplicationNotes(id, notes);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);

    // Instant local preview
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));

    setUploadingPhoto(true);
    const slug = newTalent.slug || "creator";
    const res = await uploadCreatorPhoto(file, slug, "avatar", {
      founderIdentity: user?.name?.toLowerCase() || "sourabh",
    });
    setUploadingPhoto(false);

    if (res.success && res.url && res.publicId) {
      setNewTalent((prev) => ({
        ...prev,
        image: res.url!,
        cloudinaryPublicId: res.publicId!,
      }));
    } else {
      setUploadError(res.error || "Failed to upload image to Cloudinary.");
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverUploadError(null);

    // Instant local preview
    if (coverPreview) URL.revokeObjectURL(coverPreview);
    setCoverPreview(URL.createObjectURL(file));

    setUploadingCover(true);
    const slug = newTalent.slug || "creator";
    const res = await uploadCreatorPhoto(file, slug, "cover", {
      founderIdentity: user?.name?.toLowerCase() || "sourabh",
    });
    setUploadingCover(false);

    if (res.success && res.url && res.publicId) {
      setNewTalent((prev) => ({
        ...prev,
        coverImage: res.url!,
        coverCloudinaryPublicId: res.publicId!,
      }));
    } else {
      setCoverUploadError(res.error || "Failed to upload cover photo to Cloudinary.");
    }
  };

  const handleDeleteTalent = (slug: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove ${name} from the agency roster?`)) {
      const updated = deleteTalentFromRoster(slug, user?.name?.toLowerCase() || "sourabh");
      setRoster(updated);
    }
  };

  const handleToggleTalentStatus = (slug: string, currentStatus?: string) => {
    const nextStatus = currentStatus === "draft" ? "published" : "draft";
    const updated = updateTalentInRoster(slug, { status: nextStatus }, user?.name?.toLowerCase() || "sourabh");
    setRoster(updated);
  };

  const handleToggleTalentFeatured = (slug: string, currentFeatured?: boolean) => {
    const updated = updateTalentInRoster(slug, { featured: !currentFeatured }, user?.name?.toLowerCase() || "sourabh");
    setRoster(updated);
  };

  const handleCreateDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeal.brand || !newDeal.title) return;
    const talent = roster.find((t) => t.name === newDeal.talentName) || roster[0];
    const updated = addDeal({
      ...newDeal,
      talentId: talent?.slug || "rishi-agrawal",
    });
    setDeals(updated);
    setShowAddDeal(false);
    setNewDeal({
      brand: "",
      brandContact: "",
      talentName: "Rishi Agrawal",
      title: "",
      platform: "Instagram",
      fee: "₹5,00,000",
      feeNumeric: 500000,
      status: "negotiation",
      deadline: "2026-12-01",
      contractDate: "2026-10-18",
      assignedFounder: user?.name === "Navneet" ? "Navneet" : user?.name === "Atharv" ? "Atharv" : "Sourabh",
      notes: "",
    });
  };

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;
    const num = parseFloat(newExpense.amount.replace(/[^0-9.]/g, "")) || 0;
    const updated = addExpense({
      ...newExpense,
      amountNumeric: num,
    });
    setExpenses(updated);
    setShowAddExpense(false);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    const updated = addTask(newTask);
    setTasks(updated);
    setShowAddTask(false);
    setNewTask({
      title: "",
      description: "",
      assignedTo: user?.name === "Navneet" ? "Navneet" : user?.name === "Atharv" ? "Atharv" : "Sourabh",
      relatedEntity: "",
      priority: "high",
      status: "pending",
      dueDate: "2026-10-25",
    });
  };

  const handleCreateTalent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTalent.name || !newTalent.slug) return;
    const profile: TalentProfile = {
      name: newTalent.name,
      slug: newTalent.slug.toLowerCase().trim().replace(/\s+/g, "-"),
      location: newTalent.location,
      audienceSize: newTalent.audienceSize,
      engagementRate: newTalent.engagementRate,
      bio: newTalent.bio || "Newly represented creator with exceptional audience engagement.",
      shortBio: newTalent.shortBio || `${newTalent.name} across platforms.`,
      niche: newTalent.niche as TalentProfile["niche"],
      platforms: newTalent.platforms as TalentProfile["platforms"],
      image: newTalent.image,
      coverImage: newTalent.coverImage,
      cloudinaryPublicId: newTalent.cloudinaryPublicId || undefined,
      coverCloudinaryPublicId: newTalent.coverCloudinaryPublicId || undefined,
      featured: newTalent.featured !== false,
      status: "published",
      instagramHandle: newTalent.instagramHandle || undefined,
      instagramFollowers: newTalent.instagramFollowers || undefined,
      youtubeHandle: newTalent.youtubeHandle || undefined,
      youtubeSubscribers: newTalent.youtubeSubscribers || undefined,
    };
    const updated = addTalentToRoster(profile, user?.name?.toLowerCase() || "sourabh");
    setRoster(updated);
    setShowAddTalent(false);
    setAvatarPreview(null);
    setCoverPreview(null);
  };

  // Filtered views
  const filteredDeals = deals.filter((d) => dealStatusFilter === "all" || d.status === dealStatusFilter);
  const filteredExpenses = expenses.filter((e) => {
    if (expenseFilter === "paid") return e.status === "paid";
    if (expenseFilter === "unpaid") return e.status === "unpaid";
    if (expenseFilter === "rent") return e.category === "Rent";
    if (expenseFilter === "recurring") return e.isRecurring;
    return true;
  });
  const filteredTasks = tasks.filter((t) => {
    const matchAssignee = taskAssigneeFilter === "all" || t.assignedTo === taskAssigneeFilter;
    const matchStatus = taskStatusFilter === "all" || t.status === taskStatusFilter;
    return matchAssignee && matchStatus;
  });

  // Summary Metrics
  const activeDealsCount = deals.filter((d) => d.status === "confirmed" || d.status === "negotiation").length;
  const totalPipelineFee = deals
    .filter((d) => d.status === "confirmed" || d.status === "negotiation")
    .reduce((sum, d) => sum + d.feeNumeric, 0);
  const unpaidExpensesCount = expenses.filter((e) => e.status === "unpaid").length;
  const unpaidExpensesTotal = expenses
    .filter((e) => e.status === "unpaid")
    .reduce((sum, e) => sum + e.amountNumeric, 0);
  const pendingTasksCount = tasks.filter((t) => t.status !== "completed").length;

  return (
    <RoleGuard allowedRoles={["founder", "admin"]}>
      <div className="min-h-screen bg-obsidian text-ivory pt-20 pb-20">
        {/* Founder Persona Switcher Banner */}
        <div className="bg-plum border-b border-gold/20 py-3 px-4 sm:px-6 lg:px-12">
          <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-gold text-obsidian font-mono uppercase font-bold text-[10px]">
                Founder Access
              </span>
              <span className="text-stone">Shared agency data. Logged in as:</span>
              <strong className="text-gold font-semibold text-xs">{user?.name}</strong>
              <span className="text-stone font-mono text-[11px]">({user?.email})</span>
            </div>

            <button
              type="button"
              onClick={async () => {
                await logout();
                router.push("/login?redirectTo=/admin");
              }}
              className="px-3 py-1.5 rounded bg-obsidian/70 hover:bg-obsidian border border-gold/30 hover:border-gold/60 text-gold text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer self-start md:self-auto"
              aria-label="Exit Founder OS"
            >
              <LogOut size={13} />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Command Centre Container */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-12 mt-6 sm:mt-8">
          {/* Header Title & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gold/15">
            <div>
              <div className="flex items-center gap-2 text-gold text-xs tracking-widest uppercase mb-1">
                <Shield size={14} /> TalentHaus Agency Console
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-ivory">Founder Dashboard</h1>
              <p className="text-stone text-xs sm:text-sm mt-0.5">
                Centralized management for agency deals, rent, expenses, and partner follow-ups.
              </p>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => setShowAddDeal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-obsidian font-body text-xs font-semibold tracking-wider uppercase hover:bg-gold/90 transition-colors min-h-[44px]"
              >
                <Plus size={15} /> Add Deal
              </button>
              <button
                type="button"
                onClick={() => setShowAddExpense(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-plum border border-gold/30 text-gold hover:bg-plum/80 text-xs font-body transition-colors min-h-[44px]"
              >
                <Plus size={15} /> Add Expense
              </button>
              <button
                type="button"
                onClick={() => setShowAddTask(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg bg-plum border border-gold/30 text-gold hover:bg-plum/80 text-xs font-body transition-colors min-h-[44px]"
              >
                <Plus size={15} /> New Task
              </button>
            </div>
          </div>

          {/* Responsive Tabs Navigation */}
          <div className="flex overflow-x-auto gap-2 border-b border-gold/10 pt-6 pb-2 scrollbar-none" role="tablist">
            {[
              { id: "overview" as TabId, label: "Overview", icon: Sparkles },
              { id: "deals" as TabId, label: `Deals (${deals.length})`, icon: Briefcase },
              { id: "expenses" as TabId, label: `Expenses & Rent (${expenses.length})`, icon: DollarSign },
              { id: "tasks" as TabId, label: `Tasks & Follow-ups (${tasks.length})`, icon: CheckSquare },
              { id: "roster" as TabId, label: `Roster (${roster.length})`, icon: Users },
              { id: "inquiries" as TabId, label: `Inquiries (${inquiries.length})`, icon: Mail },
              { id: "applications" as TabId, label: `Applications (${applications.length})`, icon: FileText },
              { id: "media" as TabId, label: "Cloudinary Studio", icon: Upload },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2.5 rounded-t-lg text-xs font-body tracking-wider uppercase whitespace-nowrap transition-colors border-b-2 min-h-[44px]",
                    isActive
                      ? "border-gold text-gold font-semibold bg-plum/40"
                      : "border-transparent text-stone hover:text-ivory"
                  )}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="mt-8 space-y-8 animate-fadeIn">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 sm:p-5 rounded-xl bg-plum/30 border border-gold/15">
                  <p className="text-[11px] uppercase tracking-wider text-stone mb-1">Active Deals</p>
                  <p className="font-display text-gold text-2xl sm:text-4xl">{activeDealsCount}</p>
                  <p className="text-[11px] text-emerald-400 mt-1 font-mono">£{totalPipelineFee.toLocaleString()} pipeline</p>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-plum/30 border border-gold/15">
                  <p className="text-[11px] uppercase tracking-wider text-stone mb-1">Unpaid Expenses</p>
                  <p className="font-display text-gold text-2xl sm:text-4xl">{unpaidExpensesCount}</p>
                  <p className="text-[11px] text-amber-300 mt-1 font-mono">£{unpaidExpensesTotal.toLocaleString()} pending</p>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-plum/30 border border-gold/15">
                  <p className="text-[11px] uppercase tracking-wider text-stone mb-1">Pending Tasks</p>
                  <p className="font-display text-gold text-2xl sm:text-4xl">{pendingTasksCount}</p>
                  <p className="text-[11px] text-stone mt-1">Across 3 Founders</p>
                </div>
                <div className="p-4 sm:p-5 rounded-xl bg-plum/30 border border-gold/15">
                  <p className="text-[11px] uppercase tracking-wider text-stone mb-1">Signed Creators</p>
                  <p className="font-display text-gold text-2xl sm:text-4xl">{roster.length}</p>
                  <p className="text-[11px] text-stone mt-1">100% Published</p>
                </div>
              </div>

              {/* Founder Quick Split Summary */}
              <div className="p-5 sm:p-6 rounded-xl bg-plum/20 border border-gold/15">
                <h3 className="font-display text-ivory text-xl mb-4">Founder Task Assignment</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(["Sourabh", "Navneet", "Atharv"] as const).map((name) => {
                    const founderTasks = tasks.filter((t) => t.assignedTo === name && t.status !== "completed");
                    const founderDeals = deals.filter((d) => d.assignedFounder === name);
                    return (
                      <div key={name} className="p-4 rounded-lg bg-obsidian/60 border border-gold/10">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-ivory text-sm">{name}</span>
                          <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold">
                            Partner
                          </span>
                        </div>
                        <p className="text-xs text-stone">
                          Open Tasks: <strong className="text-gold">{founderTasks.length}</strong>
                        </p>
                        <p className="text-xs text-stone mt-1">
                          Active Deals: <strong className="text-ivory">{founderDeals.length}</strong>
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Deals & Urgent Expenses Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Deals */}
                <div className="p-5 sm:p-6 rounded-xl bg-plum/20 border border-gold/15">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-ivory text-lg sm:text-xl">Priority Deals</h3>
                    {deals.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab("deals")}
                        className="text-xs text-gold hover:underline min-h-[44px] flex items-center"
                      >
                        View all ({deals.length}) →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddDeal(true)}
                        className="text-xs text-gold hover:underline min-h-[44px] flex items-center gap-1"
                      >
                        <Plus size={12} /> Log Deal
                      </button>
                    )}
                  </div>
                  {deals.length === 0 ? (
                    <div className="py-8 text-center bg-obsidian/40 rounded-lg border border-gold/10 p-4">
                      <p className="text-xs text-stone">No brand deals recorded yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddDeal(true)}
                        className="mt-2 text-xs text-gold font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Create Your First Deal →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {deals.slice(0, 3).map((deal) => (
                        <div
                          key={deal.id}
                          className="p-3.5 rounded-lg bg-obsidian/70 border border-gold/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ivory truncate">{deal.brand}</p>
                            <p className="text-xs text-stone truncate">
                              {deal.talentName} · {deal.title}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-gold text-xs sm:text-sm font-medium block">
                              {deal.fee}
                            </span>
                            <DealStatusBadge status={deal.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Urgent Expenses */}
                <div className="p-5 sm:p-6 rounded-xl bg-plum/20 border border-gold/15">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-display text-ivory text-lg sm:text-xl">Rent & Agency Costs</h3>
                    {expenses.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => setActiveTab("expenses")}
                        className="text-xs text-gold hover:underline min-h-[44px] flex items-center"
                      >
                        View all ({expenses.length}) →
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowAddExpense(true)}
                        className="text-xs text-gold hover:underline min-h-[44px] flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Expense
                      </button>
                    )}
                  </div>
                  {expenses.length === 0 ? (
                    <div className="py-8 text-center bg-obsidian/40 rounded-lg border border-gold/10 p-4">
                      <p className="text-xs text-stone">No operational expenses or leases logged yet.</p>
                      <button
                        type="button"
                        onClick={() => setShowAddExpense(true)}
                        className="mt-2 text-xs text-gold font-medium hover:underline inline-flex items-center gap-1"
                      >
                        Add First Expense →
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {expenses.slice(0, 3).map((exp) => (
                        <div
                          key={exp.id}
                          className="p-3.5 rounded-lg bg-obsidian/70 border border-gold/10 flex items-center justify-between gap-3"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-ivory truncate">{exp.title}</p>
                            <p className="text-xs text-stone truncate">
                              {exp.category} · Due {exp.dueDate}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <span className="font-mono text-ivory text-xs sm:text-sm font-medium block">
                              {exp.amount}
                            </span>
                            <span
                              className={cn(
                                "text-[10px] font-mono uppercase px-2 py-0.5 rounded",
                                exp.status === "paid"
                                  ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                  : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                              )}
                            >
                              {exp.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEALS */}
          {activeTab === "deals" && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ivory">Brand Deals & Contracts</h2>
                  <p className="text-stone text-xs mt-0.5">
                    Track partnership stages: Pending, Negotiation, Confirmed, Completed, Cancelled.
                  </p>
                </div>

                {/* Collapsible/Select Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-gold" />
                  <select
                    value={dealStatusFilter}
                    onChange={(e) => setDealStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-plum/60 border border-gold/20 rounded-lg text-xs text-ivory focus:border-gold min-h-[44px]"
                  >
                    <option value="all">All Deals ({deals.length})</option>
                    <option value="pending">Pending</option>
                    <option value="negotiation">Negotiation</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>

              {/* Empty State vs Table/Cards */}
              {filteredDeals.length === 0 ? (
                <div className="py-16 text-center rounded-xl bg-plum/20 border border-gold/15 p-6">
                  <Briefcase size={36} className="mx-auto text-gold mb-3 opacity-60" />
                  <h3 className="font-display text-xl text-ivory">No Brand Deals Recorded</h3>
                  <p className="text-stone text-xs mt-1 max-w-sm mx-auto">
                    Track campaigns, deliverable stages, and contract revenue as brand partnerships are structured.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddDeal(true)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Create Your First Deal
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile-First Cards (< md) & Table (>= md) */}
                  <div className="block md:hidden space-y-3">
                    {filteredDeals.map((deal) => (
                      <div
                        key={deal.id}
                        className="p-4 rounded-xl bg-plum/30 border border-gold/15 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-ivory text-base font-semibold">{deal.brand}</h3>
                            <p className="text-xs text-stone mt-0.5">{deal.title}</p>
                          </div>
                          <span className="font-mono text-gold text-sm font-semibold">{deal.fee}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-stone">
                          <span>Creator: <strong className="text-ivory">{deal.talentName}</strong></span>
                          <span>·</span>
                          <span>Lead: <strong className="text-gold">{deal.assignedFounder}</strong></span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                          <DealStatusBadge status={deal.status} />
                          <div className="flex items-center gap-2">
                            <select
                              value={deal.status}
                              onChange={(e) => handleDealStatusChange(deal.id, e.target.value as DealStatus)}
                              className="px-2.5 py-1 bg-obsidian border border-gold/25 rounded text-[11px] text-ivory min-h-[36px]"
                            >
                              <option value="pending">Pending</option>
                              <option value="negotiation">Negotiation</option>
                              <option value="confirmed">Confirmed</option>
                              <option value="completed">Completed</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border border-gold/15 bg-plum/20">
                    <table className="w-full text-left text-xs font-body">
                      <thead className="bg-obsidian/80 border-b border-gold/15 text-stone uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Brand Client</th>
                          <th className="p-4">Deliverable Summary</th>
                          <th className="p-4">Creator</th>
                          <th className="p-4">Lead Founder</th>
                          <th className="p-4">Commercial Fee</th>
                          <th className="p-4">Deadline</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/10 text-ivory">
                        {filteredDeals.map((deal) => (
                          <tr key={deal.id} className="hover:bg-plum/30 transition-colors">
                            <td className="p-4 font-semibold text-ivory">{deal.brand}</td>
                            <td className="p-4 text-stone max-w-xs truncate">{deal.title}</td>
                            <td className="p-4 text-gold font-medium">{deal.talentName}</td>
                            <td className="p-4 text-ivory/80">{deal.assignedFounder}</td>
                            <td className="p-4 font-mono text-gold font-medium">{deal.fee}</td>
                            <td className="p-4 font-mono text-stone">{deal.deadline}</td>
                            <td className="p-4">
                              <DealStatusBadge status={deal.status} />
                            </td>
                            <td className="p-4 text-right">
                              <select
                                value={deal.status}
                                onChange={(e) => handleDealStatusChange(deal.id, e.target.value as DealStatus)}
                                className="px-2 py-1 bg-obsidian border border-gold/20 rounded text-[11px] text-ivory min-h-[36px]"
                              >
                                <option value="pending">Pending</option>
                                <option value="negotiation">Negotiation</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: EXPENSES & RENT */}
          {activeTab === "expenses" && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ivory">Expenses & Rent Schedule</h2>
                  <p className="text-stone text-xs mt-0.5">
                    Agency leases, recurring software, legal fees, and production costs.
                  </p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                  <Filter size={14} className="text-gold" />
                  <select
                    value={expenseFilter}
                    onChange={(e) => setExpenseFilter(e.target.value)}
                    className="px-3 py-2 bg-plum/60 border border-gold/20 rounded-lg text-xs text-ivory focus:border-gold min-h-[44px]"
                  >
                    <option value="all">All Expenses ({expenses.length})</option>
                    <option value="unpaid">Unpaid Only</option>
                    <option value="paid">Paid Only</option>
                    <option value="rent">Rent & Facilities</option>
                    <option value="recurring">Recurring Monthly</option>
                  </select>
                </div>
              </div>

              {/* Empty State vs Table/Cards */}
              {filteredExpenses.length === 0 ? (
                <div className="py-16 text-center rounded-xl bg-plum/20 border border-gold/15 p-6">
                  <DollarSign size={36} className="mx-auto text-gold mb-3 opacity-60" />
                  <h3 className="font-display text-xl text-ivory">No Expenses Logged</h3>
                  <p className="text-stone text-xs mt-1 max-w-sm mx-auto">
                    Track recurring office leases, vendor tools, legal expenses, and creator payouts.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(true)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Add First Expense
                  </button>
                </div>
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="block md:hidden space-y-3">
                    {filteredExpenses.map((exp) => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-xl bg-plum/30 border border-gold/15 space-y-3"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-display text-ivory text-base font-semibold">{exp.title}</h3>
                            <p className="text-xs text-stone mt-0.5">
                              {exp.category} · {exp.vendor}
                            </p>
                          </div>
                          <span className="font-mono text-ivory text-sm font-semibold">{exp.amount}</span>
                        </div>

                        <div className="flex items-center justify-between text-xs text-stone">
                          <span>Due: <strong className="font-mono text-ivory">{exp.dueDate}</strong></span>
                          {exp.isRecurring && (
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold">
                              Recurring {exp.recurringFrequency}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-gold/10">
                          <span
                            className={cn(
                              "text-[10px] uppercase font-mono px-2.5 py-1 rounded",
                              exp.status === "paid"
                                ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                            )}
                          >
                            {exp.status}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleExpenseToggle(exp.id)}
                            className={cn(
                              "px-3 py-1.5 rounded text-xs font-medium transition-colors min-h-[44px]",
                              exp.status === "paid"
                                ? "bg-stone/20 text-stone hover:text-ivory"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white font-semibold"
                            )}
                          >
                            {exp.status === "paid" ? "Mark Unpaid" : "Mark as Paid"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto rounded-xl border border-gold/15 bg-plum/20">
                    <table className="w-full text-left text-xs font-body">
                      <thead className="bg-obsidian/80 border-b border-gold/15 text-stone uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Expense Title</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Vendor / Payee</th>
                          <th className="p-4">Managed By</th>
                          <th className="p-4">Amount</th>
                          <th className="p-4">Due Date</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gold/10 text-ivory">
                        {filteredExpenses.map((exp) => (
                          <tr key={exp.id} className="hover:bg-plum/30 transition-colors">
                            <td className="p-4 font-semibold text-ivory">
                              {exp.title}
                              {exp.isRecurring && (
                                <span className="block text-[10px] font-mono text-gold mt-0.5">
                                  Recurring ({exp.recurringFrequency})
                                </span>
                              )}
                            </td>
                            <td className="p-4 text-stone">{exp.category}</td>
                            <td className="p-4 text-stone">{exp.vendor}</td>
                            <td className="p-4 text-gold">{exp.managedBy}</td>
                            <td className="p-4 font-mono font-medium text-ivory">{exp.amount}</td>
                            <td className="p-4 font-mono text-stone">{exp.dueDate}</td>
                            <td className="p-4">
                              <span
                                className={cn(
                                  "text-[10px] uppercase font-mono px-2 py-0.5 rounded",
                                  exp.status === "paid"
                                    ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/40"
                                    : "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                                )}
                              >
                                {exp.status}
                              </span>
                            </td>
                            <td className="p-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleExpenseToggle(exp.id)}
                                className={cn(
                                  "px-3 py-1 rounded text-xs font-medium transition-colors min-h-[36px]",
                                  exp.status === "paid"
                                    ? "bg-stone/20 text-stone hover:text-ivory"
                                    : "bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 hover:bg-emerald-900"
                                )}
                              >
                                {exp.status === "paid" ? "Mark Unpaid" : "Pay"}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: TASKS & FOLLOW-UPS */}
          {activeTab === "tasks" && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ivory">Tasks & Follow-ups</h2>
                  <p className="text-stone text-xs mt-0.5">
                    Assignee routing across Sourabh, Navneet, and Atharv.
                  </p>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-2 flex-wrap">
                  <select
                    value={taskAssigneeFilter}
                    onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                    className="px-3 py-2 bg-plum/60 border border-gold/20 rounded-lg text-xs text-ivory focus:border-gold min-h-[44px]"
                  >
                    <option value="all">All Assignees</option>
                    <option value="Sourabh">Sourabh</option>
                    <option value="Navneet">Navneet</option>
                    <option value="Atharv">Atharv</option>
                  </select>
                  <select
                    value={taskStatusFilter}
                    onChange={(e) => setTaskStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-plum/60 border border-gold/20 rounded-lg text-xs text-ivory focus:border-gold min-h-[44px]"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Empty State vs Tasks List */}
              {filteredTasks.length === 0 ? (
                <div className="py-16 text-center rounded-xl bg-plum/20 border border-gold/15 p-6">
                  <CheckSquare size={36} className="mx-auto text-gold mb-3 opacity-60" />
                  <h3 className="font-display text-xl text-ivory">No Tasks Found</h3>
                  <p className="text-stone text-xs mt-1 max-w-sm mx-auto">
                    All clear. Assign tasks to Sourabh, Navneet, or Atharv as workflows arise.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowAddTask(true)}
                    className="mt-4 px-5 py-2.5 rounded-full bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-all inline-flex items-center gap-1.5"
                  >
                    <Plus size={14} />
                    Add Task
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "p-4 rounded-xl border transition-all",
                        task.status === "completed"
                          ? "bg-plum/10 border-gold/10 opacity-70"
                          : "bg-plum/30 border-gold/20"
                      )}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={cn(
                                "text-[10px] font-mono uppercase px-2 py-0.5 rounded",
                                task.priority === "high"
                                  ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                                  : task.priority === "medium"
                                    ? "bg-amber-950/60 text-amber-300 border border-amber-800/40"
                                    : "bg-plum text-stone border border-gold/10"
                              )}
                            >
                              {task.priority} Priority
                            </span>
                            <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                              Assigned to: {task.assignedTo}
                            </span>
                            {task.relatedEntity && (
                              <span className="text-[10px] text-stone">· {task.relatedEntity}</span>
                            )}
                          </div>
                          <h3 className={cn("text-sm sm:text-base font-medium text-ivory", task.status === "completed" && "line-through text-stone")}>
                            {task.title}
                          </h3>
                          <p className="text-xs text-stone leading-relaxed">{task.description}</p>
                        </div>

                        <div className="flex items-center sm:flex-col items-end gap-2 shrink-0 pt-2 sm:pt-0">
                          <span className="text-xs font-mono text-stone">Due {task.dueDate}</span>
                          <div className="flex items-center gap-1.5">
                            {task.status !== "completed" ? (
                              <button
                                type="button"
                                onClick={() => handleTaskStatusChange(task.id, "completed")}
                                className="px-3 py-1.5 rounded bg-emerald-950/70 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900 text-xs min-h-[44px] flex items-center gap-1"
                              >
                                <CheckCircle size={13} /> Complete
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleTaskStatusChange(task.id, "in-progress")}
                                className="px-3 py-1.5 rounded bg-plum border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px] flex items-center gap-1"
                              >
                                <Clock size={13} /> Re-open
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: ROSTER */}
          {activeTab === "roster" && (
            <div className="mt-8 space-y-6 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="font-display text-2xl text-ivory">Influencer & Roster Management</h2>
                  <p className="text-stone text-xs mt-0.5">
                    Agency talent directory with public website sync.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTalent(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors min-h-[44px]"
                >
                  <Plus size={15} /> Add Creator
                </button>
              </div>

              {/* Responsive Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roster.map((creator) => (
                  <div
                    key={creator.slug}
                    className="p-5 rounded-xl bg-plum/30 border border-gold/15 flex flex-col justify-between space-y-4 relative group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <button
                            type="button"
                            onClick={() => setEditingCreator(creator)}
                            className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/15 text-gold border border-gold/30 hover:bg-gold/25 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                            title="Click to edit genre / niches"
                          >
                            <Sparkles size={9} /> {creator.niche?.[0] || "Lifestyle"}
                          </button>
                          {(creator.niche?.length || 0) > 1 && (
                            <button
                              type="button"
                              onClick={() => setEditingCreator(creator)}
                              className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-obsidian/60 text-stone border border-gold/10 hover:text-ivory transition-colors cursor-pointer"
                              title="Click to view/edit all niches"
                            >
                              +{(creator.niche?.length || 0) - 1} more
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleToggleTalentStatus(creator.slug, creator.status)}
                            className={cn(
                              "text-[10px] uppercase font-mono px-2 py-0.5 rounded border transition-colors inline-flex items-center gap-1",
                              creator.status === "draft"
                                ? "bg-stone/10 border-stone/30 text-stone hover:text-ivory"
                                : "bg-emerald-950/60 border-emerald-500/40 text-emerald-300"
                            )}
                            title="Click to toggle publish status"
                          >
                            {creator.status === "draft" ? <EyeOff size={10} /> : <Eye size={10} />}
                            {creator.status === "draft" ? "Draft" : "Published"}
                          </button>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleToggleTalentFeatured(creator.slug, creator.featured)}
                            className={cn(
                              "p-1.5 rounded transition-colors",
                              creator.featured ? "text-gold hover:text-gold/80" : "text-stone/40 hover:text-stone"
                            )}
                            title={creator.featured ? "Featured creator (click to unfeature)" : "Click to feature"}
                          >
                            <Star size={15} fill={creator.featured ? "currentColor" : "none"} />
                          </button>
                          <Link
                            href={`/roster/${creator.slug}`}
                            className="text-stone hover:text-gold p-1.5 transition-colors"
                            title="View public profile"
                          >
                            <ExternalLink size={14} />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleDeleteTalent(creator.slug, creator.name)}
                            className="text-stone/60 hover:text-rose-400 p-1.5 transition-colors"
                            title="Delete creator profile"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3.5 my-2">
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-obsidian border border-gold/20 shrink-0">
                          {creator.image ? (
                            <Image
                              src={creator.image}
                              alt={creator.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone">
                              <ImageIcon size={20} />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-display text-lg text-ivory truncate">{creator.name}</h3>
                          <p className="text-[11px] text-stone truncate">{creator.location}</p>
                          {creator.cloudinaryPublicId && (
                            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-700/40 inline-block mt-0.5">
                              Cloudinary Synced
                            </span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs text-stone/80 mt-1 line-clamp-2">{creator.shortBio}</p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-gold/10">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-gold font-medium">{creator.audienceSize}</span>
                          {creator.instagramFollowers && (
                            <span className="text-[11px] text-stone font-mono">IG: {creator.instagramFollowers}</span>
                          )}
                        </div>
                        <span className="text-stone">{creator.engagementRate} eng.</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingCreator(creator)}
                          className="w-full py-2 px-2.5 rounded-lg bg-gold/15 border border-gold/30 hover:bg-gold/25 text-gold text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                        >
                          <Sparkles size={13} /> Edit Details
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCreatorForPhoto(creator)}
                          className="w-full py-2 px-2.5 rounded-lg bg-obsidian border border-gold/20 hover:border-gold/40 text-stone hover:text-ivory text-xs flex items-center justify-center gap-1.5 transition-colors min-h-[38px]"
                        >
                          <Upload size={13} /> Photos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: INQUIRIES */}
          {activeTab === "inquiries" && (
            <div className="mt-8">
              <InquiriesTab
                inquiries={inquiries}
                onStatusChange={handleInquiryStatusChange}
                onOpenNotes={(inq) =>
                  setNotesModalItem({
                    type: "inquiry",
                    id: inq.id,
                    name: inq.brandName,
                    notes: inq.notes || "",
                  })
                }
                onViewDetails={(inq) => setSelectedInquiry(inq)}
                onRefresh={syncSubmissions}
                isRefreshing={isSyncingSubmissions}
              />
            </div>
          )}

          {/* TAB 7: CREATOR APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="mt-8">
              <ApplicationsTab
                applications={applications}
                onStatusChange={handleApplicationStatusChange}
                onOpenNotes={(app) =>
                  setNotesModalItem({
                    type: "application",
                    id: app.id,
                    name: `${app.fullName} (${app.handle})`,
                    notes: app.notes || "",
                  })
                }
                onViewDetails={(app) => setSelectedApplication(app)}
                onRefresh={syncSubmissions}
                isRefreshing={isSyncingSubmissions}
              />
            </div>
          )}

          {/* TAB 8: CLOUDINARY STUDIO */}
          {activeTab === "media" && (
            <div className="mt-8">
              <CloudinaryStudioTab
                roster={roster}
                founderIdentity={user?.name?.toLowerCase() || "sourabh"}
                onTalentUpdated={(slug, updates) => {
                  const updated = updateTalentInRoster(slug, updates);
                  setRoster(updated);
                }}
              />
            </div>
          )}
        </div>

        {/* ── MODALS ── */}

        {/* Add Deal Modal */}
        {showAddDeal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gold/15 mb-6">
                <div>
                  <h3 className="font-display text-ivory text-2xl">New Partnership Deal</h3>
                  <p className="text-xs text-stone">Shared agency deal pipeline</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddDeal(false)}
                  className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateDeal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Brand Client *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dior Beauty"
                      value={newDeal.brand}
                      onChange={(e) => setNewDeal({ ...newDeal, brand: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Deliverable *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 2 Reels + Story Set"
                      value={newDeal.title}
                      onChange={(e) => setNewDeal({ ...newDeal, title: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Creator *</label>
                    <select
                      value={newDeal.talentName}
                      onChange={(e) => setNewDeal({ ...newDeal, talentName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      {roster.map((t) => (
                        <option key={t.slug} value={t.name}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Fee (£) *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. £15,000"
                      value={newDeal.fee}
                      onChange={(e) => {
                        const num = parseFloat(e.target.value.replace(/[^0-9.]/g, "")) || 0;
                        setNewDeal({ ...newDeal, fee: e.target.value, feeNumeric: num });
                      }}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Stage *</label>
                    <select
                      value={newDeal.status}
                      onChange={(e) => setNewDeal({ ...newDeal, status: e.target.value as DealStatus })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="pending">Pending</option>
                      <option value="negotiation">Negotiation</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Lead Founder *</label>
                    <select
                      value={newDeal.assignedFounder}
                      onChange={(e) =>
                        setNewDeal({ ...newDeal, assignedFounder: e.target.value as "Sourabh" | "Navneet" | "Atharv" })
                      }
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="Sourabh">Sourabh</option>
                      <option value="Navneet">Navneet</option>
                      <option value="Atharv">Atharv</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                  <button
                    type="button"
                    onClick={() => setShowAddDeal(false)}
                    className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors min-h-[44px]"
                  >
                    Create Deal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Expense Modal */}
        {showAddExpense && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gold/15 mb-6">
                <div>
                  <h3 className="font-display text-ivory text-2xl">Log Agency Expense</h3>
                  <p className="text-xs text-stone">Record leases, SaaS, or production costs</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5">Expense Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Indore HQ Facility Lease"
                    value={newExpense.title}
                    onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Category *</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value as ExpenseCategory })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="Rent">Rent & Lease</option>
                      <option value="Recurring Agency Cost">Recurring Agency Cost</option>
                      <option value="Software & Tools">Software & Tools</option>
                      <option value="Legal & Accounting">Legal & Accounting</option>
                      <option value="Production & Studio">Production & Studio</option>
                      <option value="Creator Payout">Creator Payout</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Amount *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. £8,500"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Due Date *</label>
                    <input
                      type="date"
                      value={newExpense.dueDate}
                      onChange={(e) => setNewExpense({ ...newExpense, dueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Managed By *</label>
                    <select
                      value={newExpense.managedBy}
                      onChange={(e) =>
                        setNewExpense({
                          ...newExpense,
                          managedBy: e.target.value as "Sourabh" | "Navneet" | "Atharv",
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="Sourabh">Sourabh</option>
                      <option value="Navneet">Navneet</option>
                      <option value="Atharv">Atharv</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="rec-exp"
                    checked={newExpense.isRecurring}
                    onChange={(e) => setNewExpense({ ...newExpense, isRecurring: e.target.checked })}
                    className="w-4 h-4 rounded border-gold/30 accent-gold"
                  />
                  <label htmlFor="rec-exp" className="text-xs text-ivory cursor-pointer">
                    Recurring monthly expense
                  </label>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                  <button
                    type="button"
                    onClick={() => setShowAddExpense(false)}
                    className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors min-h-[44px]"
                  >
                    Save Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Task Modal */}
        {showAddTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gold/15 mb-6">
                <div>
                  <h3 className="font-display text-ivory text-2xl">New Action Item</h3>
                  <p className="text-xs text-stone">Assign follow-ups to Sourabh, Navneet, or Atharv</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTask(false)}
                  className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5">Task Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Audit rough cut for WHOOP campaign"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Specific notes or action steps..."
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Assignee *</label>
                    <select
                      value={newTask.assignedTo}
                      onChange={(e) =>
                        setNewTask({ ...newTask, assignedTo: e.target.value as "Sourabh" | "Navneet" | "Atharv" })
                      }
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="Sourabh">Sourabh</option>
                      <option value="Navneet">Navneet</option>
                      <option value="Atharv">Atharv</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Priority *</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask({ ...newTask, priority: e.target.value as "high" | "medium" | "low" })
                      }
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Due Date *</label>
                    <input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                  <button
                    type="button"
                    onClick={() => setShowAddTask(false)}
                    className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors min-h-[44px]"
                  >
                    Assign Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Add Talent Modal */}
        {showAddTalent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-plum border border-gold/30 rounded-2xl max-w-lg w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-gold/15 mb-6">
                <div>
                  <h3 className="font-display text-ivory text-2xl">Add Creator to Roster</h3>
                  <p className="text-xs text-stone">Creates public roster entry and agency record</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTalent(false)}
                  className="w-11 h-11 flex items-center justify-center text-stone hover:text-ivory"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreateTalent} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Creator Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Kai Sterling"
                      value={newTalent.name}
                      onChange={(e) =>
                        setNewTalent({
                          ...newTalent,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        })
                      }
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={newTalent.slug}
                      onChange={(e) => setNewTalent({ ...newTalent, slug: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs font-mono min-h-[44px]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Location</label>
                    <input
                      type="text"
                      value={newTalent.location}
                      onChange={(e) => setNewTalent({ ...newTalent, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Audience</label>
                    <input
                      type="text"
                      value={newTalent.audienceSize}
                      onChange={(e) => setNewTalent({ ...newTalent, audienceSize: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Engagement</label>
                    <input
                      type="text"
                      value={newTalent.engagementRate}
                      onChange={(e) => setNewTalent({ ...newTalent, engagementRate: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Primary Genre / Niche Selection */}
                <div className="p-3.5 rounded-xl bg-obsidian/40 border border-gold/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs uppercase text-gold font-bold">
                      Primary Genre / Niche (Card Badge) *
                    </label>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-gold/20 text-gold border border-gold/30">
                      {newTalent.niche?.[0] || "Lifestyle"}
                    </span>
                  </div>
                  <select
                    value={newTalent.niche?.[0] || "Lifestyle"}
                    onChange={(e) => {
                      const selected = e.target.value as Niche;
                      const remaining = (newTalent.niche || []).filter((n) => n !== selected) as Niche[];
                      setNewTalent({ ...newTalent, niche: [selected, ...remaining] });
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

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5">Short Bio (Tagline)</label>
                  <input
                    type="text"
                    placeholder="Short 1-liner summary"
                    value={newTalent.shortBio}
                    onChange={(e) => setNewTalent({ ...newTalent, shortBio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                  />
                </div>

                {/* Social Profiles */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Instagram Handle</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-stone text-xs">@</span>
                      <input
                        type="text"
                        placeholder="handle"
                        value={newTalent.instagramHandle}
                        onChange={(e) => setNewTalent({ ...newTalent, instagramHandle: e.target.value.replace(/^@/, "") })}
                        className="w-full pl-7 pr-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">Instagram Followers</label>
                    <input
                      type="text"
                      placeholder="e.g. 850K"
                      value={newTalent.instagramFollowers}
                      onChange={(e) => setNewTalent({ ...newTalent, instagramFollowers: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase text-ivory/80 mb-1.5">YouTube Subscribers</label>
                    <input
                      type="text"
                      placeholder="e.g. 420K"
                      value={newTalent.youtubeSubscribers}
                      onChange={(e) => setNewTalent({ ...newTalent, youtubeSubscribers: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-base sm:text-xs min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase text-ivory/80 mb-1.5">Full Biography</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive creator overview for their individual profile page..."
                    value={newTalent.bio}
                    onChange={(e) => setNewTalent({ ...newTalent, bio: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-obsidian border border-gold/20 rounded-lg text-ivory text-xs"
                  />
                </div>

                {/* Cloudinary Photo Uploads */}
                <div className="space-y-4 pt-2">
                  {/* Avatar Upload */}
                  <div className="p-4 rounded-xl bg-obsidian/70 border border-gold/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase text-ivory/80 font-medium">
                        Profile Avatar Photo (Cloudinary)
                      </label>
                      <span className="text-[10px] text-stone font-mono">Max 10MB · JPG/PNG/WEBP/AVIF</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-obsidian border border-gold/20 shrink-0 flex items-center justify-center">
                        {avatarPreview ? (
                          <Image src={avatarPreview} alt="Avatar Preview" fill unoptimized className="object-cover" />
                        ) : newTalent.image && newTalent.image !== "/images/roster/placeholder.jpg" ? (
                          <Image src={newTalent.image} alt="Avatar" fill className="object-cover" />
                        ) : (
                          <ImageIcon size={22} className="text-stone/40" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/15 border border-gold/30 text-gold hover:bg-gold/25 transition-colors text-xs font-semibold">
                          <Upload size={14} />
                          {uploadingPhoto ? "Uploading to Cloudinary..." : avatarPreview || (newTalent.image && newTalent.image !== "/images/roster/placeholder.jpg") ? "Change Avatar Photo" : "Upload Avatar Photo"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            disabled={uploadingPhoto}
                            onChange={handlePhotoUpload}
                            className="hidden"
                          />
                        </label>

                        {newTalent.cloudinaryPublicId && (
                          <span className="text-[11px] text-emerald-400 font-mono block truncate">
                            ✓ Cloudinary: {newTalent.cloudinaryPublicId}
                          </span>
                        )}
                      </div>
                    </div>

                    {uploadError && <p className="text-xs text-rose-400">{uploadError}</p>}
                  </div>

                  {/* Cover Photo Upload */}
                  <div className="p-4 rounded-xl bg-obsidian/70 border border-gold/20 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs uppercase text-ivory/80 font-medium">
                        Cover Banner Photo (Cloudinary)
                      </label>
                      <span className="text-[10px] text-stone font-mono">Max 10MB · JPG/PNG/WEBP/AVIF</span>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-obsidian border border-gold/20 shrink-0 flex items-center justify-center">
                        {coverPreview ? (
                          <Image src={coverPreview} alt="Cover Preview" fill unoptimized className="object-cover" />
                        ) : newTalent.coverImage && newTalent.coverImage !== "/images/roster/placeholder-cover.jpg" ? (
                          <Image src={newTalent.coverImage} alt="Cover" fill className="object-cover" />
                        ) : (
                          <ImageIcon size={22} className="text-stone/40" />
                        )}
                      </div>

                      <div className="flex-1 space-y-1.5">
                        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gold/15 border border-gold/30 text-gold hover:bg-gold/25 transition-colors text-xs font-semibold">
                          <Upload size={14} />
                          {uploadingCover ? "Uploading to Cloudinary..." : coverPreview || (newTalent.coverImage && newTalent.coverImage !== "/images/roster/placeholder-cover.jpg") ? "Change Cover Banner" : "Upload Cover Banner"}
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            disabled={uploadingCover}
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>

                        {newTalent.coverCloudinaryPublicId && (
                          <span className="text-[11px] text-emerald-400 font-mono block truncate">
                            ✓ Cloudinary: {newTalent.coverCloudinaryPublicId}
                          </span>
                        )}
                      </div>
                    </div>

                    {coverUploadError && <p className="text-xs text-rose-400">{coverUploadError}</p>}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gold/15">
                  <button
                    type="button"
                    onClick={() => setShowAddTalent(false)}
                    className="px-4 py-2.5 rounded-lg border border-gold/20 text-stone hover:text-ivory text-xs min-h-[44px]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gold text-obsidian text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors min-h-[44px]"
                  >
                    Save Creator
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Inquiry Details Modal */}
        {selectedInquiry && (
          <InquiryDetailsModal
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
            onStatusChange={handleInquiryStatusChange}
            onSaveNotes={handleSaveInquiryNotes}
          />
        )}

        {/* Application Details Modal */}
        {selectedApplication && (
          <ApplicationDetailsModal
            application={selectedApplication}
            onClose={() => setSelectedApplication(null)}
            onStatusChange={handleApplicationStatusChange}
            onSaveNotes={handleSaveApplicationNotes}
          />
        )}

        {/* Notes Modal */}
        {notesModalItem && (
          <NotesModal
            item={notesModalItem}
            onClose={() => setNotesModalItem(null)}
            onSave={handleSaveNotesModal}
          />
        )}

        {/* Creator Cloudinary Photo Modal */}
        {selectedCreatorForPhoto && (
          <CreatorPhotoModal
            creator={selectedCreatorForPhoto}
            isOpen={!!selectedCreatorForPhoto}
            onClose={() => setSelectedCreatorForPhoto(null)}
            founderIdentity={user?.name?.toLowerCase() || "sourabh"}
            onUpdated={(slug, updates) => {
              const updated = updateTalentInRoster(slug, updates, user?.name?.toLowerCase() || "sourabh");
              setRoster(updated);
              setSelectedCreatorForPhoto((prev) => (prev ? { ...prev, ...updates } : null));
            }}
          />
        )}

        {/* Creator Edit Details Modal */}
        {editingCreator && (
          <EditCreatorModal
            creator={editingCreator}
            isOpen={!!editingCreator}
            onClose={() => setEditingCreator(null)}
            founderIdentity={user?.name?.toLowerCase() || "sourabh"}
            onSave={(slug, updates) => {
              const updated = updateTalentInRoster(slug, updates, user?.name?.toLowerCase() || "sourabh");
              setRoster(updated);
            }}
          />
        )}
      </div>
    </RoleGuard>
  );
}

function DealStatusBadge({ status }: { status: DealStatus }) {
  if (status === "confirmed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-950/60 border border-emerald-800/40 text-emerald-400">
        <CheckCircle size={10} /> Confirmed
      </span>
    );
  }
  if (status === "negotiation") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-amber-950/60 border border-amber-800/40 text-amber-300">
        <Clock size={10} /> Negotiation
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-purple-950/60 border border-purple-800/40 text-purple-300">
        <CheckCircle size={10} /> Completed
      </span>
    );
  }
  if (status === "cancelled") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-rose-950/60 border border-rose-800/40 text-rose-300">
        <X size={10} /> Cancelled
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] uppercase font-mono bg-sky-950/60 border border-sky-800/40 text-sky-300">
      <Clock size={10} /> Pending
    </span>
  );
}
