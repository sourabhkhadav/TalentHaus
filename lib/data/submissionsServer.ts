import fs from "fs";
import path from "path";

export interface ServerInquiry {
  id: string;
  brand_name: string;
  contact_name: string;
  email: string;
  phone?: string | null;
  budget: string;
  timeline: string;
  services?: string[];
  message: string;
  status: string;
  notes?: string | null;
  ip_address?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface ServerApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  location: string;
  primary_platform: string;
  handle: string;
  audience_size: string;
  niche: string[];
  bio: string;
  portfolio_url?: string | null;
  status: string;
  notes?: string | null;
  ip_address?: string | null;
  created_at: string;
  updated_at?: string;
}

const INQUIRIES_FILE = path.join(process.cwd(), "content", "inquiries-data.json");
const APPLICATIONS_FILE = path.join(process.cwd(), "content", "applications-data.json");

function ensureDir(filePath: string) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch {
    // Ignore in read-only environments
  }
}

// ── INQUIRIES ──

export function getInquiriesServer(): ServerInquiry[] {
  try {
    if (fs.existsSync(INQUIRIES_FILE)) {
      const raw = fs.readFileSync(INQUIRIES_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback empty
  }
  return [];
}

export function saveInquiryServer(inquiry: ServerInquiry): void {
  try {
    ensureDir(INQUIRIES_FILE);
    const existing = getInquiriesServer();
    const filtered = existing.filter((i) => i.id !== inquiry.id);
    const updated = [inquiry, ...filtered];
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // Ignore in read-only environments
  }
}

export function updateInquiryStatusServer(id: string, status?: string, notes?: string): void {
  try {
    ensureDir(INQUIRIES_FILE);
    const existing = getInquiriesServer();
    const updated = existing.map((i) => {
      if (i.id === id) {
        return {
          ...i,
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
          updated_at: new Date().toISOString(),
        };
      }
      return i;
    });
    fs.writeFileSync(INQUIRIES_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // Ignore
  }
}

// ── APPLICATIONS ──

export function getApplicationsServer(): ServerApplication[] {
  try {
    if (fs.existsSync(APPLICATIONS_FILE)) {
      const raw = fs.readFileSync(APPLICATIONS_FILE, "utf8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // Fallback empty
  }
  return [];
}

export function saveApplicationServer(app: ServerApplication): void {
  try {
    ensureDir(APPLICATIONS_FILE);
    const existing = getApplicationsServer();
    const filtered = existing.filter((a) => a.id !== app.id);
    const updated = [app, ...filtered];
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // Ignore in read-only environments
  }
}

export function updateApplicationStatusServer(id: string, status?: string, notes?: string): void {
  try {
    ensureDir(APPLICATIONS_FILE);
    const existing = getApplicationsServer();
    const updated = existing.map((a) => {
      if (a.id === id) {
        return {
          ...a,
          ...(status ? { status } : {}),
          ...(notes !== undefined ? { notes } : {}),
          updated_at: new Date().toISOString(),
        };
      }
      return a;
    });
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
  } catch {
    // Ignore
  }
}
