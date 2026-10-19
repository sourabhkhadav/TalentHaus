import fs from "fs";
import path from "path";
import { team as defaultTeam } from "@/content/team";

export interface FounderProfile {
  slug: "sourabh" | "navneet" | "atharv" | string;
  name: string;
  role: string;
  bio: string;
  image: string;
  cloudinaryPublicId?: string;
  linkedin?: string;
  email?: string;
}

const DATA_FILE_PATH = path.join(process.cwd(), "content", "team-data.json");

export function getTeamServer(): FounderProfile[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to static
  }

  return defaultTeam.map((m) => ({
    slug: m.name.toLowerCase().includes("sourabh")
      ? "sourabh"
      : m.name.toLowerCase().includes("navneet")
      ? "navneet"
      : "atharv",
    name: m.name,
    role: m.role,
    bio: m.bio,
    image: m.image,
    linkedin: m.linkedin,
  }));
}

export function saveTeamServer(data: FounderProfile[]): void {
  try {
    const dir = path.dirname(DATA_FILE_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(data, null, 2), "utf8");
  } catch {
    // ignore
  }
}

export function getFounderBySlugServer(slug: string): FounderProfile | null {
  const all = getTeamServer();
  const normalized = slug.toLowerCase().trim();
  return all.find((f) => f.slug === normalized) || null;
}
