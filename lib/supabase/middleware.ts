import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_MAX_AGE = 400 * 24 * 60 * 60;

function copyCookiesAndRedirect(url: URL, sourceResponse: NextResponse): NextResponse {
  const redirectResponse = NextResponse.redirect(url);
  sourceResponse.cookies.getAll().forEach((cookie) => {
    redirectResponse.cookies.set(cookie);
  });
  return redirectResponse;
}

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
    cookieOptions: {
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_COOKIE_MAX_AGE,
    },
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
          supabaseResponse.cookies.set(name, value, {
            path: "/",
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            maxAge: AUTH_COOKIE_MAX_AGE,
            ...(options || {}),
          })
        );
      },
    },
  });

  // Refresh user session if expired
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If an authenticated admin visits /login or /signup, seamlessly redirect them
    if (user && (path === "/login" || path === "/signup")) {
      const lowerEmail = (user.email || "").toLowerCase().trim();
      const isFounderEmail =
        lowerEmail === "sourabh@talenthaus.in" ||
        lowerEmail === "navneet@talenthaus.in" ||
        lowerEmail === "atharv@talenthaus.in" ||
        lowerEmail.includes("sourabh") ||
        lowerEmail.includes("navneet") ||
        lowerEmail.includes("atharv") ||
        lowerEmail.endsWith("@talenthaus.in");
      const userRole =
        (user.user_metadata?.role as string) ||
        (user.app_metadata?.role as string) ||
        "";
      const isFounderOrAdmin = isFounderEmail || userRole === "founder" || userRole === "admin";

      const redirectTo = request.nextUrl.searchParams.get("redirectTo");
      const targetPath =
        redirectTo && !redirectTo.startsWith("/login") && !redirectTo.startsWith("/signup")
          ? redirectTo
          : isFounderOrAdmin
          ? "/admin"
          : "/portal";

      const url = request.nextUrl.clone();
      url.pathname = targetPath;
      url.search = "";
      return copyCookiesAndRedirect(url, supabaseResponse);
    }

    // Protected routes: /admin and /portal require authenticated session
    if (!user && isProtectedPage) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("redirectTo", path);
      return copyCookiesAndRedirect(url, supabaseResponse);
    }

    // Strict role authorization: /admin is reserved exclusively for founders & admins
    if (user && path.startsWith("/admin")) {
      const lowerEmail = (user.email || "").toLowerCase().trim();
      const isFounderEmail =
        lowerEmail === "sourabh@talenthaus.in" ||
        lowerEmail === "navneet@talenthaus.in" ||
        lowerEmail === "atharv@talenthaus.in" ||
        lowerEmail.includes("sourabh") ||
        lowerEmail.includes("navneet") ||
        lowerEmail.includes("atharv") ||
        lowerEmail.endsWith("@talenthaus.in");
      const userRole =
        (user.user_metadata?.role as string) ||
        (user.app_metadata?.role as string) ||
        "";
      const isFounderOrAdmin = isFounderEmail || userRole === "founder" || userRole === "admin";

      if (!isFounderOrAdmin) {
        const url = request.nextUrl.clone();
        url.pathname = "/portal";
        url.searchParams.set("error", "unauthorized_admin_access");
        return copyCookiesAndRedirect(url, supabaseResponse);
      }
    }

    // Protect private management APIs against unauthenticated callers
    if (!user && isPrivateApi) {
      const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
      const hasBearer = Boolean(authHeader && authHeader.startsWith("Bearer ") && authHeader.length > 10);

      if (!hasBearer) {
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
      return copyCookiesAndRedirect(url, supabaseResponse);
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
