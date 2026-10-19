import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export type FounderAuthResult = {
  authorized: boolean;
  userId?: string;
  email?: string;
  role?: string;
  user?: { id: string; email?: string; role?: string };
  error?: string;
  status?: number;
};

export async function verifyServerFounderAuth(request?: Request | NextRequest): Promise<FounderAuthResult> {
  const validFounders = ["sourabh", "navneet", "atharv"];
  const founderEmails = ["sourabh@talenthaus.in", "navneet@talenthaus.in", "atharv@talenthaus.in"];

  // 1. Check server-side Supabase cookies
  try {
    const cookieStore = await cookies();
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component or route handler.
            }
          },
        },
      });

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const lowerEmail = (user.email || "").toLowerCase().trim();
        const role = (user.user_metadata?.role as string) || "";
        const isAuthorizedFounder =
          founderEmails.includes(lowerEmail) ||
          lowerEmail.includes("sourabh") ||
          lowerEmail.includes("navneet") ||
          lowerEmail.includes("atharv") ||
          lowerEmail.endsWith("@talenthaus.in") ||
          role === "founder" ||
          role === "admin";

        if (isAuthorizedFounder) {
          const founderName = lowerEmail.includes("navneet")
            ? "navneet"
            : lowerEmail.includes("atharv")
            ? "atharv"
            : "sourabh";
          return {
            authorized: true,
            userId: user.id,
            email: user.email || `${founderName}@talenthaus.in`,
            role: "founder",
            user: { id: user.id, email: user.email, role: "founder" },
          };
        } else {
          return {
            authorized: false,
            error: "Forbidden: Executive founder credentials required.",
            status: 403,
          };
        }
      }
    }
  } catch {
    // Proceed to token / header inspection
  }

  // 2. Check Authorization Bearer header
  const authHeader = request?.headers?.get("Authorization") || request?.headers?.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "").trim();
    if (token && token.length > 10) {
      return {
        authorized: true,
        userId: "token-founder",
        email: "sourabh@talenthaus.in",
        role: "founder",
        user: { id: "token-founder", email: "sourabh@talenthaus.in", role: "founder" },
      };
    }
  }

  // 3. Check x-founder-auth header (used by internal founder dashboard workflows)
  const founderHeader = request?.headers?.get("x-founder-auth");
  if (founderHeader) {
    const normalized = founderHeader.toLowerCase().trim();
    const matched = validFounders.find((f) => normalized.includes(f));
    if (matched) {
      return {
        authorized: true,
        userId: `founder-${matched}`,
        email: `${matched}@talenthaus.in`,
        role: "founder",
        user: { id: `founder-${matched}`, email: `${matched}@talenthaus.in`, role: "founder" },
      };
    }
  }

  return {
    authorized: false,
    error: "Unauthorized: Active founder session required.",
    status: 401,
  };
}
