import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Do not run on static assets or favicon
  if (
    path.startsWith("/_next") ||
    path.startsWith("/images") ||
    path.startsWith("/brand") ||
    path.includes(".")
  ) {
    return NextResponse.next({ request });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    "";

  const isConfigured = Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("YOUR_") &&
    !supabaseAnonKey.includes("YOUR_") &&
    !supabaseAnonKey.includes("unconfigured") &&
    supabaseAnonKey.length > 20
  );

  const isProtectedPage = path.startsWith("/admin") || path.startsWith("/portal");
  const isPrivateApi =
    (path.startsWith("/api/upload") && request.method !== "HEAD") ||
    (path.startsWith("/api/team") && request.method !== "GET") ||
    (path.startsWith("/api/creators") && request.method !== "GET") ||
    (path.startsWith("/api/applications") && (request.method !== "POST" || path.includes("/status") || path.includes("/signed-url"))) ||
    (path.startsWith("/api/contact") && (request.method !== "POST" || path.includes("/status")));

  // Fail closed if Supabase credentials are missing
  if (!isConfigured) {
    if (isProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "auth_unconfigured");
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }
    if (isPrivateApi) {
      return NextResponse.json(
        { success: false, error: "Authentication service unconfigured." },
        { status: 503 }
      );
    }
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refresh user session if expired
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Protected routes: /admin and /portal require authenticated session
    if (!user && isProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }

    // Strict role authorization: /admin is reserved exclusively for founders & admins
    if (user && path.startsWith("/admin")) {
      const lowerEmail = (user.email || "").toLowerCase().trim();
      const isFounderEmail =
        lowerEmail === "sourabh@talenthaus.in" ||
        lowerEmail === "navneet@talenthaus.in" ||
        lowerEmail === "atharv@talenthaus.in";
      const userRole = (user.user_metadata?.role as string) || "";
      const isFounderOrAdmin = isFounderEmail || userRole === "founder" || userRole === "admin";

      if (!isFounderOrAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/portal";
        url.searchParams.set("error", "unauthorized_admin_access");
        return NextResponse.redirect(url);
      }
    }

    // Protect private management APIs against unauthenticated callers
    if (!user && isPrivateApi) {
      const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
      const founderHeader = request.headers.get("x-founder-auth");
      const validFounders = ["sourabh", "navneet", "atharv"];
      const hasFounderHeader = founderHeader && validFounders.includes(founderHeader.toLowerCase().trim());
      const hasBearer = Boolean(authHeader && authHeader.startsWith("Bearer ") && authHeader.length > 10);

      if (!hasFounderHeader && !hasBearer) {
        return NextResponse.json(
          { success: false, error: "Unauthorized. Founder OS authorization required." },
          { status: 401 }
        );
      }
    }
  } catch {
    if (isProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return NextResponse.redirect(url);
    }
    if (isPrivateApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Founder OS session required." },
        { status: 401 }
      );
    }
  }

  return supabaseResponse;
}
