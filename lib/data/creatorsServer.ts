import fs from "fs";
import path from "path";
import { roster as defaultRoster, TalentProfile } from "@/content/roster";

const DATA_FILE_PATH = path.join(process.cwd(), "content", "roster-data.json");

export function getCreatorsServer(): TalentProfile[] {
  try {
    if (fs.existsSync(DATA_FILE_PATH)) {
      const content = fs.readFileSync(DATA_FILE_PATH, "utf8");
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch {
    // Fallback to static roster
  }
  return defaultRoster;
}

export function getCreatorBySlugServer(slug: string): TalentProfile | null {
  const all = getCreatorsServer();
  const normalized = decodeURIComponent(slug).toLowerCase().trim();
  return all.find((t) => t.slug.toLowerCase() === normalized) || null;
}

export async function getCreatorBySlugServerAsync(slug: string): Promise<TalentProfile | null> {
  const normalized = decodeURIComponent(slug).toLowerCase().trim();

  // 1. Try unified data layer which checks Supabase
  try {
    const { getCreatorBySlug } = await import("@/lib/data");
    const talent = await getCreatorBySlug(normalized);
    if (talent) return talent;
  } catch {
    // proceed to synchronous read
  }

  // 2. Synchronous file fallback
  return getCreatorBySlugServer(normalized);
}
