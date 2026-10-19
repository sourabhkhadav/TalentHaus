import { createBrowserClient } from "@supabase/ssr";
import { parse, serialize } from "cookie";
import type { SupabaseClient } from "@supabase/supabase-js";

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(
    url &&
    key &&
    !url.includes("YOUR_") &&
    !key.includes("YOUR_") &&
    !key.includes("unconfigured") &&
    key.length > 20
  );
}

// 400 days in seconds — maximum persistent cookie lifetime supported across modern browsers
export const AUTH_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;
export const AUTH_LOCAL_BACKUP_KEY = "th_sb_cookies_backup";

let cachedBrowserClient: SupabaseClient | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://unconfigured.supabase.co";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "unconfigured-anon-key";

  if (typeof window !== "undefined" && cachedBrowserClient) {
    return cachedBrowserClient;
  }

  const client = createBrowserClient(supabaseUrl, key, {
    isSingleton: true,
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
    },
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_COOKIE_MAX_AGE,
    },
    cookies: {
      getAll() {
        if (typeof document === "undefined") return [];
        const parsed = parse(document.cookie);
        const list = Object.keys(parsed).map((name) => ({
          name,
          value: parsed[name] ?? "",
        }));

        // If auth cookies are missing in document.cookie (e.g. after browser restart or partition),
        // restore them from resilient browser localStorage backup.
        const hasAuthCookie = list.some(
          (c) => c.name.startsWith("sb-") && c.name.includes("-auth-token") && c.value.length > 0
        );

        if (!hasAuthCookie && typeof window !== "undefined") {
          try {
            const backupRaw = localStorage.getItem(AUTH_LOCAL_BACKUP_KEY);
            if (backupRaw) {
              const entries: { name: string; value: string }[] = JSON.parse(backupRaw);
              if (Array.isArray(entries) && entries.length > 0) {
                entries.forEach(({ name, value }) => {
                  if (value) {
                    document.cookie = serialize(name, value, {
                      path: "/",
                      sameSite: "lax",
                      secure: process.env.NODE_ENV === "production",
                      maxAge: AUTH_COOKIE_MAX_AGE,
                    });
                    list.push({ name, value });
                  }
                });
              }
            }
          } catch {
            // Backup parsing error ignored
          }
        }

        return list;
      },
      setAll(cookiesToSet) {
        if (typeof document === "undefined") return;

        cookiesToSet.forEach(({ name, value, options }) => {
          const finalOptions = {
            path: "/",
            sameSite: "lax" as const,
            secure: process.env.NODE_ENV === "production",
            maxAge: AUTH_COOKIE_MAX_AGE,
            ...(options || {}),
          };
          document.cookie = serialize(name, value, finalOptions);
        });

        // Mirror auth cookies to localStorage for resilient long-term session restoration
        if (typeof window !== "undefined") {
          try {
            const existingRaw = localStorage.getItem(AUTH_LOCAL_BACKUP_KEY);
            const backupMap: Record<string, { name: string; value: string }> = {};
            if (existingRaw) {
              try {
                const list: { name: string; value: string }[] = JSON.parse(existingRaw);
                list.forEach((item) => {
                  if (item.name && item.value) {
                    backupMap[item.name] = item;
                  }
                });
              } catch {}
            }

            cookiesToSet.forEach(({ name, value, options }) => {
              if (name.startsWith("sb-") && name.includes("-auth-token")) {
                if (!value || (options && options.maxAge === 0)) {
                  delete backupMap[name];
                } else {
                  backupMap[name] = { name, value };
                }
              }
            });

            const backupList = Object.values(backupMap);
            if (backupList.length > 0) {
              localStorage.setItem(AUTH_LOCAL_BACKUP_KEY, JSON.stringify(backupList));
            } else {
              localStorage.removeItem(AUTH_LOCAL_BACKUP_KEY);
            }
          } catch {
            // Ignore storage quota or access issues
          }
        }
      },
    },
  });

  if (typeof window !== "undefined") {
    cachedBrowserClient = client;
  }

  return client;
}
