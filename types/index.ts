export type Role = "founder" | "admin" | "talent" | "brand";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  companyName?: string;
  talentSlug?: string;
}

export type DealStatus = "pending" | "negotiation" | "confirmed" | "completed" | "cancelled";

export interface Deal {
  id: string;
  brand: string;
  brandContact: string;
  talentId: string;
  talentName: string;
  title: string;
  platform: "Instagram" | "YouTube" | "TikTok" | "LinkedIn" | "Multi-Platform";
  fee: string;
  feeNumeric: number;
  status: DealStatus;
  deadline: string;
  contractDate: string;
  assignedFounder: "Sourabh" | "Navneet" | "Atharv";
  notes?: string;
}

export type ExpenseCategory =
  | "Rent"
  | "Recurring Agency Cost"
  | "Legal & Accounting"
  | "Software & Tools"
  | "Production & Studio"
  | "Creator Payout";

export type ExpenseStatus = "paid" | "unpaid";

export interface Expense {
  id: string;
  title: string;
  category: ExpenseCategory;
  amount: string;
  amountNumeric: number;
  status: ExpenseStatus;
  dueDate: string;
  paidDate?: string;
  isRecurring: boolean;
  recurringFrequency?: "Monthly" | "Quarterly" | "Annual";
  vendor: string;
  managedBy: "Sourabh" | "Navneet" | "Atharv";
}

export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "high" | "medium" | "low";

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: "Sourabh" | "Navneet" | "Atharv";
  relatedEntity?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
}

export type InquiryStatus = "new" | "pending" | "reviewed" | "reviewing" | "contacted" | "approved" | "closed" | "archived";

export interface InboundInquiry {
  id: string;
  brandName: string;
  contactName: string;
  email: string;
  phone?: string;
  budget: string;
  timeline: string;
  services?: string[];
  talentSlug?: string;
  message: string;
  status: InquiryStatus;
  notes?: string;
  date: string;
  created_at?: string;
}

export type ApplicationStatus = "pending" | "reviewing" | "under_review" | "approved" | "accepted" | "rejected";

export interface CreatorApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  location: string;
  primaryPlatform: string;
  handle: string;
  audienceSize: string;
  niche: string[];
  bio: string;
  portfolioUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  date: string;
  created_at?: string;
}

export type { TalentProfile, Platform, Niche } from "@/content/roster";
export type { Campaign } from "@/content/campaigns";
export type { Insight } from "@/content/insights";
export type { Service } from "@/content/services";

