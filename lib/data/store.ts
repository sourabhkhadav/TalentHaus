import { useState, useEffect } from "react";
import {
  Deal,
  Expense,
  Task,
  InboundInquiry,
  CreatorApplication,
  DealStatus,
  TaskStatus,
} from "@/types";
import {
  INITIAL_DEALS,
  INITIAL_EXPENSES,
  INITIAL_TASKS,
  INITIAL_INQUIRIES,
  INITIAL_APPLICATIONS,
} from "./mockData";
import { roster as staticRoster, TalentProfile } from "@/content/roster";
import { createClient } from "@/lib/supabase/client";
import {
  mapInfluencerRowToTalent,
  createCreator,
  updateCreator,
  deleteCreator,
} from "./index";

const STORAGE_KEYS = {
  deals: "th_agency_deals_v3",
  expenses: "th_agency_expenses_v3",
  tasks: "th_agency_tasks_v3",
  inquiries: "th_agency_inquiries_v3",
  applications: "th_agency_applications_v3",
  roster: "th_agency_roster_v5",
};

function getFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // Ignore storage quota or disabled storage
  }
}

// ── ROW MAPPERS FOR SUPABASE ──

function mapDealRow(row: Record<string, unknown>): Deal {
  return {
    id: String(row.id || ""),
    brand: String(row.brand || ""),
    brandContact: String(row.brand_contact || ""),
    talentId: String(row.talent_id || ""),
    talentName: String(row.talent_name || ""),
    title: String(row.title || ""),
    platform: (row.platform as Deal["platform"]) || "Instagram",
    fee: String(row.fee || `₹${(Number(row.fee_numeric) || 0).toLocaleString("en-IN")}`),
    feeNumeric: Number(row.fee_numeric) || 0,
    status: (row.status as DealStatus) || "pending",
    deadline: String(row.deadline || ""),
    contractDate: String(row.contract_date || new Date().toISOString().split("T")[0]),
    assignedFounder: (row.assigned_founder as Deal["assignedFounder"]) || "Sourabh",
    notes: String(row.notes || ""),
  };
}

function mapExpenseRow(row: Record<string, unknown>): Expense {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    category: (row.category as Expense["category"]) || "Recurring Agency Cost",
    amount: String(row.amount || `₹${(Number(row.amount_numeric) || 0).toLocaleString("en-IN")}`),
    amountNumeric: Number(row.amount_numeric) || 0,
    status: (row.status as "paid" | "unpaid") || "unpaid",
    dueDate: String(row.due_date || ""),
    paidDate: typeof row.paid_date === "string" ? row.paid_date : undefined,
    isRecurring: Boolean(row.is_recurring),
    recurringFrequency: (row.recurring_frequency as Expense["recurringFrequency"]) || "Monthly",
    vendor: String(row.vendor || ""),
    managedBy: (row.managed_by as Expense["managedBy"]) || "Sourabh",
  };
}

function mapTaskRow(row: Record<string, unknown>): Task {
  return {
    id: String(row.id || ""),
    title: String(row.title || ""),
    description: String(row.description || ""),
    assignedTo: (row.assigned_to as Task["assignedTo"]) || "Sourabh",
    relatedEntity: String(row.related_entity || ""),
    priority: (row.priority as Task["priority"]) || "medium",
    status: (row.status as Task["status"]) || "pending",
    dueDate: String(row.due_date || ""),
  };
}

function mapInquiryRow(row: Record<string, unknown>): InboundInquiry {
  return {
    id: String(row.id || ""),
    brandName: String(row.brand_name || ""),
    contactName: String(row.contact_name || ""),
    email: String(row.email || ""),
    phone: typeof row.phone === "string" ? row.phone : undefined,
    budget: String(row.budget || ""),
    timeline: String(row.timeline || ""),
    services: (Array.isArray(row.services) ? row.services : []) as string[],
    talentSlug: typeof row.talent_slug === "string" ? row.talent_slug : undefined,
    message: String(row.message || ""),
    status: (row.status as InboundInquiry["status"]) || "new",
    notes: typeof row.notes === "string" ? row.notes : undefined,
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
    date: typeof row.created_at === "string" ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

function mapApplicationRow(row: Record<string, unknown>): CreatorApplication {
  return {
    id: String(row.id || ""),
    fullName: String(row.full_name || ""),
    email: String(row.email || ""),
    phone: String(row.phone || ""),
    location: String(row.location || ""),
    primaryPlatform: String(row.primary_platform || "Instagram"),
    handle: String(row.handle || ""),
    audienceSize: String(row.audience_size || ""),
    niche: (Array.isArray(row.niche) ? row.niche : []) as string[],
    bio: String(row.bio || ""),
    portfolioUrl: typeof row.portfolio_url === "string" ? row.portfolio_url : undefined,
    status: (row.status as CreatorApplication["status"]) || "pending",
    notes: typeof row.notes === "string" ? row.notes : undefined,
    created_at: typeof row.created_at === "string" ? row.created_at : undefined,
    date: typeof row.created_at === "string" ? row.created_at.split("T")[0] : new Date().toISOString().split("T")[0],
  };
}

// ── DEALS ──

export function getAgencyDeals(): Deal[] {
  return getFromStorage<Deal[]>(STORAGE_KEYS.deals, INITIAL_DEALS);
}

export function updateDealStatus(id: string, status: DealStatus): Deal[] {
  const current = getAgencyDeals();
  const updated = current.map((d) => (d.id === id ? { ...d, status } : d));
  saveToStorage(STORAGE_KEYS.deals, updated);

  // Async sync with Supabase
  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase.from("deals").update({ status }).eq("id", id).then();
  }

  return updated;
}

export function addDeal(deal: Omit<Deal, "id">): Deal[] {
  const current = getAgencyDeals();
  const tempId = `del_${Date.now()}`;
  const newDeal: Deal = { ...deal, id: tempId };
  const updated = [newDeal, ...current];
  saveToStorage(STORAGE_KEYS.deals, updated);

  // Async sync with Supabase
  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("deals")
      .insert([
        {
          brand: deal.brand,
          brand_contact: deal.brandContact,
          talent_name: deal.talentName,
          title: deal.title,
          platform: deal.platform,
          fee: deal.fee,
          fee_numeric: deal.feeNumeric,
          status: deal.status,
          deadline: deal.deadline || null,
          contract_date: deal.contractDate || new Date().toISOString().split("T")[0],
          assigned_founder: deal.assignedFounder,
          notes: deal.notes || "",
        },
      ])
      .select()
      .then(({ data }) => {
        if (data && data[0]) {
          const synced = updated.map((d) => (d.id === tempId ? mapDealRow(data[0]) : d));
          saveToStorage(STORAGE_KEYS.deals, synced);
        }
      });
  }

  return updated;
}

// ── EXPENSES ──

export function getAgencyExpenses(): Expense[] {
  return getFromStorage<Expense[]>(STORAGE_KEYS.expenses, INITIAL_EXPENSES);
}

export function toggleExpenseStatus(id: string): Expense[] {
  const current = getAgencyExpenses();
  let nextStatus: "paid" | "unpaid" = "unpaid";
  let nextPaidDate: string | undefined = undefined;

  const updated = current.map((e) => {
    if (e.id === id) {
      const isPaid = e.status === "paid";
      nextStatus = isPaid ? "unpaid" : "paid";
      nextPaidDate = isPaid ? undefined : new Date().toISOString().split("T")[0];
      return {
        ...e,
        status: nextStatus,
        paidDate: nextPaidDate,
      };
    }
    return e;
  });
  saveToStorage(STORAGE_KEYS.expenses, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("expenses")
      .update({ status: nextStatus, paid_date: nextPaidDate || null })
      .eq("id", id)
      .then();
  }

  return updated;
}

export function addExpense(expense: Omit<Expense, "id">): Expense[] {
  const current = getAgencyExpenses();
  const tempId = `exp_${Date.now()}`;
  const newExpense: Expense = { ...expense, id: tempId };
  const updated = [newExpense, ...current];
  saveToStorage(STORAGE_KEYS.expenses, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("expenses")
      .insert([
        {
          title: expense.title,
          category: expense.category,
          amount: expense.amount,
          amount_numeric: expense.amountNumeric,
          status: expense.status,
          due_date: expense.dueDate || null,
          is_recurring: expense.isRecurring,
          recurring_frequency: expense.recurringFrequency,
          vendor: expense.vendor,
          managed_by: expense.managedBy,
        },
      ])
      .select()
      .then(({ data }) => {
        if (data && data[0]) {
          const synced = updated.map((e) => (e.id === tempId ? mapExpenseRow(data[0]) : e));
          saveToStorage(STORAGE_KEYS.expenses, synced);
        }
      });
  }

  return updated;
}

// ── TASKS ──

export function getAgencyTasks(): Task[] {
  return getFromStorage<Task[]>(STORAGE_KEYS.tasks, INITIAL_TASKS);
}

export function updateTaskStatus(id: string, status: TaskStatus): Task[] {
  const current = getAgencyTasks();
  const updated = current.map((t) => (t.id === id ? { ...t, status } : t));
  saveToStorage(STORAGE_KEYS.tasks, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase.from("tasks").update({ status }).eq("id", id).then();
  }

  return updated;
}

export function addTask(task: Omit<Task, "id">): Task[] {
  const current = getAgencyTasks();
  const tempId = `tsk_${Date.now()}`;
  const newTask: Task = { ...task, id: tempId };
  const updated = [newTask, ...current];
  saveToStorage(STORAGE_KEYS.tasks, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("tasks")
      .insert([
        {
          title: task.title,
          description: task.description,
          assigned_to: task.assignedTo,
          related_entity: task.relatedEntity,
          priority: task.priority,
          status: task.status,
          due_date: task.dueDate || null,
        },
      ])
      .select()
      .then(({ data }) => {
        if (data && data[0]) {
          const synced = updated.map((t) => (t.id === tempId ? mapTaskRow(data[0]) : t));
          saveToStorage(STORAGE_KEYS.tasks, synced);
        }
      });
  }

  return updated;
}

// ── INQUIRIES ──

export function getAgencyInquiries(): InboundInquiry[] {
  return getFromStorage<InboundInquiry[]>(STORAGE_KEYS.inquiries, INITIAL_INQUIRIES);
}

export function addInquiry(inquiry: Omit<InboundInquiry, "id" | "date" | "status">): InboundInquiry {
  const current = getAgencyInquiries();
  const tempId = `enq_${Date.now()}`;
  const newInquiry: InboundInquiry = {
    ...inquiry,
    id: tempId,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  const updated = [newInquiry, ...current];
  saveToStorage(STORAGE_KEYS.inquiries, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("inbound_inquiries")
      .insert([
        {
          brand_name: inquiry.brandName,
          contact_name: inquiry.contactName,
          email: inquiry.email,
          phone: inquiry.phone,
          budget: inquiry.budget,
          timeline: inquiry.timeline,
          services: inquiry.services || [],
          message: inquiry.message,
          status: "pending",
        },
      ])
      .select()
      .then(({ data }) => {
        if (data && data[0]) {
          const synced = updated.map((i) => (i.id === tempId ? mapInquiryRow(data[0]) : i));
          saveToStorage(STORAGE_KEYS.inquiries, synced);
        }
      });
  }

  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InboundInquiry["status"], notes?: string): InboundInquiry[] {
  const current = getAgencyInquiries();
  const updated = current.map((inq) => (inq.id === id ? { ...inq, status, ...(notes !== undefined ? { notes } : {}) } : inq));
  saveToStorage(STORAGE_KEYS.inquiries, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    const payload: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) payload.notes = notes;
    supabase
      .from("contact_submissions")
      .update(payload)
      .eq("id", id)
      .then(({ error }) => {
        if (error) {
          supabase.from("inbound_inquiries").update(payload).eq("id", id).then();
        }
      });
  }

  return updated;
}

// ── APPLICATIONS ──

export function getAgencyApplications(): CreatorApplication[] {
  return getFromStorage<CreatorApplication[]>(STORAGE_KEYS.applications, INITIAL_APPLICATIONS);
}

export function addApplication(app: Omit<CreatorApplication, "id" | "date" | "status">): CreatorApplication {
  const current = getAgencyApplications();
  const tempId = `app_${Date.now()}`;
  const newApp: CreatorApplication = {
    ...app,
    id: tempId,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  const updated = [newApp, ...current];
  saveToStorage(STORAGE_KEYS.applications, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    supabase
      .from("creator_applications")
      .insert([
        {
          full_name: app.fullName,
          email: app.email,
          phone: app.phone,
          location: app.location,
          primary_platform: app.primaryPlatform,
          handle: app.handle,
          audience_size: app.audienceSize,
          niche: app.niche,
          bio: app.bio,
          portfolio_url: app.portfolioUrl,
          status: "pending",
        },
      ])
      .select()
      .then(({ data }) => {
        if (data && data[0]) {
          const synced = updated.map((a) => (a.id === tempId ? mapApplicationRow(data[0]) : a));
          saveToStorage(STORAGE_KEYS.applications, synced);
        }
      });
  }

  return newApp;
}

export function updateApplicationStatus(id: string, status: CreatorApplication["status"], notes?: string): CreatorApplication[] {
  const current = getAgencyApplications();
  const updated = current.map((a) => (a.id === id ? { ...a, status, ...(notes !== undefined ? { notes } : {}) } : a));
  saveToStorage(STORAGE_KEYS.applications, updated);

  if (typeof window !== "undefined") {
    const supabase = createClient();
    const payload: Record<string, unknown> = { status, updated_at: new Date().toISOString() };
    if (notes !== undefined) payload.notes = notes;
    supabase.from("creator_applications").update(payload).eq("id", id).then();
  }

  return updated;
}

// ── ROSTER ──

export function getAgencyRoster(): TalentProfile[] {
  return getFromStorage<TalentProfile[]>(STORAGE_KEYS.roster, staticRoster);
}

export function addTalentToRoster(talent: TalentProfile, founderIdentity?: string): TalentProfile[] {
  const creatorToAdd: TalentProfile = {
    ...talent,
    featured: talent.featured !== false,
    status: talent.status || "published",
  };
  const current = getAgencyRoster();
  const filtered = current.filter((t) => t.slug !== creatorToAdd.slug);
  const updated = [creatorToAdd, ...filtered];
  saveToStorage(STORAGE_KEYS.roster, updated);
  saveToStorage("th_agency_roster", updated);

  if (typeof window !== "undefined") {
    createCreator(creatorToAdd, founderIdentity);
    window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: updated }));
  }

  return updated;
}

export function updateTalentInRoster(slug: string, updates: Partial<TalentProfile>, founderIdentity?: string): TalentProfile[] {
  const current = getAgencyRoster();
  const updated = current.map((t) => (t.slug === slug ? { ...t, ...updates } : t));
  saveToStorage(STORAGE_KEYS.roster, updated);
  saveToStorage("th_agency_roster", updated);

  if (typeof window !== "undefined") {
    updateCreator(slug, updates, founderIdentity);
    window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: updated }));
  }

  return updated;
}

export function deleteTalentFromRoster(slug: string, founderIdentity?: string): TalentProfile[] {
  const current = getAgencyRoster();
  const updated = current.filter((t) => t.slug !== slug);
  saveToStorage(STORAGE_KEYS.roster, updated);
  saveToStorage("th_agency_roster", updated);

  if (typeof window !== "undefined") {
    deleteCreator(slug, founderIdentity);
    window.dispatchEvent(new CustomEvent("th-roster-updated", { detail: updated }));
  }

  return updated;
}

// ── REACT HOOK FOR EASY ACCESS WITH SUPABASE SYNC ──

export function useStore() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inquiries, setInquiries] = useState<InboundInquiry[]>([]);
  const [applications, setApplications] = useState<CreatorApplication[]>([]);
  const [roster, setRoster] = useState<TalentProfile[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    // 1. Instant load from local storage
    setDeals(getAgencyDeals());
    setExpenses(getAgencyExpenses());
    setTasks(getAgencyTasks());
    setInquiries(getAgencyInquiries());
    setApplications(getAgencyApplications());
    setRoster(getAgencyRoster());

    // 2. Fetch from Supabase and persistent API in background
    let mounted = true;
    const syncFromSupabase = async () => {
      try {
        setIsSyncing(true);
        const supabase = createClient();

        const [
          dealsRes,
          expensesRes,
          tasksRes,
          inquiriesRes,
          applicationsRes,
          influencersRes,
        ] = await Promise.all([
          supabase.from("deals").select("*").order("created_at", { ascending: false }),
          supabase.from("expenses").select("*").order("created_at", { ascending: false }),
          supabase.from("tasks").select("*").order("created_at", { ascending: false }),
          supabase.from("inbound_inquiries").select("*").order("created_at", { ascending: false }),
          supabase.from("creator_applications").select("*").order("created_at", { ascending: false }),
          supabase.from("influencers").select("*").order("created_at", { ascending: false }),
        ]);

        if (!mounted) return;

        if (!dealsRes.error && dealsRes.data && dealsRes.data.length > 0) {
          const mapped = dealsRes.data.map(mapDealRow);
          setDeals(mapped);
          saveToStorage(STORAGE_KEYS.deals, mapped);
        }

        if (!expensesRes.error && expensesRes.data && expensesRes.data.length > 0) {
          const mapped = expensesRes.data.map(mapExpenseRow);
          setExpenses(mapped);
          saveToStorage(STORAGE_KEYS.expenses, mapped);
        }

        if (!tasksRes.error && tasksRes.data && tasksRes.data.length > 0) {
          const mapped = tasksRes.data.map(mapTaskRow);
          setTasks(mapped);
          saveToStorage(STORAGE_KEYS.tasks, mapped);
        }

        if (!inquiriesRes.error && inquiriesRes.data && inquiriesRes.data.length > 0) {
          const mapped = inquiriesRes.data.map(mapInquiryRow);
          setInquiries(mapped);
          saveToStorage(STORAGE_KEYS.inquiries, mapped);
        }

        if (!applicationsRes.error && applicationsRes.data && applicationsRes.data.length > 0) {
          const mapped = applicationsRes.data.map(mapApplicationRow);
          setApplications(mapped);
          saveToStorage(STORAGE_KEYS.applications, mapped);
        }

        if (!influencersRes.error && influencersRes.data && influencersRes.data.length > 0) {
          const mapped = influencersRes.data.map(mapInfluencerRowToTalent);
          setRoster(mapped);
          saveToStorage(STORAGE_KEYS.roster, mapped);
        } else {
          // Sync from /api/creators so any changes persist
          try {
            const cRes = await fetch("/api/creators?includeDrafts=true");
            if (cRes.ok) {
              const cJson = await cRes.json();
              if (cJson.success && Array.isArray(cJson.data) && cJson.data.length > 0) {
                setRoster(cJson.data);
                saveToStorage(STORAGE_KEYS.roster, cJson.data);
              }
            }
          } catch {
            // fallback loaded
          }
        }
      } catch {
        // Supabase offline or credentials missing; local fallback already loaded
      } finally {
        if (mounted) setIsSyncing(false);
      }
    };

    syncFromSupabase();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    deals,
    expenses,
    tasks,
    inquiries,
    applications,
    roster,
    isSyncing,
    addInquiry: (inq: Omit<InboundInquiry, "id" | "date" | "status">) => {
      const created = addInquiry(inq);
      setInquiries(getAgencyInquiries());
      return created;
    },
    updateInquiryStatus: (id: string, status: InboundInquiry["status"], notes?: string) => {
      const updated = updateInquiryStatus(id, status, notes);
      setInquiries(updated);
      return updated;
    },
    addDeal: (deal: Omit<Deal, "id">) => {
      const updated = addDeal(deal);
      setDeals(updated);
      return updated;
    },
    updateDealStatus: (id: string, status: DealStatus) => {
      const updated = updateDealStatus(id, status);
      setDeals(updated);
      return updated;
    },
    toggleExpensePaid: (id: string) => {
      const updated = toggleExpenseStatus(id);
      setExpenses(updated);
      return updated;
    },
    toggleExpenseStatus: (id: string) => {
      const updated = toggleExpenseStatus(id);
      setExpenses(updated);
      return updated;
    },
    addExpense: (expense: Omit<Expense, "id">) => {
      const updated = addExpense(expense);
      setExpenses(updated);
      return updated;
    },
    updateTaskStatus: (id: string, status: TaskStatus) => {
      const updated = updateTaskStatus(id, status);
      setTasks(updated);
      return updated;
    },
    addTask: (task: Omit<Task, "id">) => {
      const updated = addTask(task);
      setTasks(updated);
      return updated;
    },
    addApplication: (app: Omit<CreatorApplication, "id" | "date" | "status">) => {
      const created = addApplication(app);
      setApplications(getAgencyApplications());
      return created;
    },
    updateApplicationStatus: (id: string, status: CreatorApplication["status"], notes?: string) => {
      const updated = updateApplicationStatus(id, status, notes);
      setApplications(updated);
      return updated;
    },
    addTalentToRoster: (talent: TalentProfile) => {
      const updated = addTalentToRoster(talent);
      setRoster(updated);
      return updated;
    },
    updateTalentInRoster: (slug: string, updates: Partial<TalentProfile>) => {
      const updated = updateTalentInRoster(slug, updates);
      setRoster(updated);
      return updated;
    },
    deleteTalentFromRoster: (slug: string) => {
      const updated = deleteTalentFromRoster(slug);
      setRoster(updated);
      return updated;
    },
  };
}
