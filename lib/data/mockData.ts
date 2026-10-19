import { Deal, Expense, Task, InboundInquiry, CreatorApplication, User } from "@/types";

export const FOUNDERS: Record<string, User> = {
  sourabh: {
    id: "usr_founder_sourabh",
    name: "Sourabh Khadav",
    email: "sourabh@talenthaus.in",
    role: "founder",
    avatarUrl: "/images/team/sourabh.jpg",
  },
  navneet: {
    id: "usr_founder_navneet",
    name: "Navneet Jat",
    email: "navneet@talenthaus.in",
    role: "founder",
    avatarUrl: "/images/team/navneet.jpg",
  },
  atharv: {
    id: "usr_founder_atharv",
    name: "Atharv Sharma",
    email: "atharv@talenthaus.in",
    role: "founder",
    avatarUrl: "/images/team/atharv.jpg",
  },
};

export const DEMO_TALENT: User = {
  id: "usr_talent_rishi",
  name: "Rishi Agrawal",
  email: "rishi@talenthaus.in",
  role: "talent",
  talentSlug: "rishi-agrawal",
  avatarUrl: "/images/roster/rishi-agrawal.jpg",
};

export const DEMO_BRAND: User = {
  id: "usr_brand_demo",
  name: "Brand Partner",
  email: "partner@talenthaus.in",
  role: "brand",
  companyName: "Brand Partner",
};

export const INITIAL_DEALS: Deal[] = [];
export const INITIAL_EXPENSES: Expense[] = [];
export const INITIAL_TASKS: Task[] = [];
export const INITIAL_INQUIRIES: InboundInquiry[] = [];
export const INITIAL_APPLICATIONS: CreatorApplication[] = [];
