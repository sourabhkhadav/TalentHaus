"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { User, Role } from "@/types";
import { createClient } from "@/lib/supabase/client";

interface AuthContextType {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<{ ok: boolean; error?: string; user?: User }>;
  signup: (data: { name: string; email: string; role: Role; password?: string }) => Promise<{ ok: boolean; error?: string; user?: User }>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ ok: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "th_auth_session_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  // Helper to map Supabase user to application User model
  const mapSupabaseUser = useCallback(async (sbUser: { id: string; email?: string; user_metadata?: Record<string, unknown> }): Promise<User> => {
    const email = sbUser.email || "";
    const meta = sbUser.user_metadata || {};
    const name =
      (meta.full_name as string) ||
      (meta.name as string) ||
      email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const lowerEmail = email.toLowerCase().trim();
    let role: Role = "talent";

    // 1. Verified founder emails from domain
    if (
      lowerEmail === "sourabh@talenthaus.in" ||
      lowerEmail === "navneet@talenthaus.in" ||
      lowerEmail === "atharv@talenthaus.in" ||
      lowerEmail.includes("sourabh") ||
      lowerEmail.includes("navneet") ||
      lowerEmail.includes("atharv") ||
      lowerEmail.endsWith("@talenthaus.in")
    ) {
      role = "founder";
    }

    // 2. Attempt profile fetch from Supabase profiles table
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", sbUser.id).single();
      if (profile && profile.role) {
        role = profile.role as Role;
      }
    } catch {
      // profiles query skipped or unavailable
    }

    // 3. User metadata only permitted for non-executive roles (talent or brand)
    if (role !== "founder" && role !== "admin") {
      if (meta.role === "brand" || meta.role === "talent") {
        role = meta.role as Role;
      }
    }

    return {
      id: sbUser.id,
      name,
      email,
      role,
      avatarUrl: (meta.avatar_url as string) || undefined,
    };
  }, [supabase]);

  // Sync Supabase Auth session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user && isMounted) {
          const appUser = await mapSupabaseUser(session.user);
          setUser(appUser);
          try {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
          } catch {
            // storage unavailable
          }
          setIsLoading(false);
          return;
        }
      } catch {
        // Supabase session error or unconfigured
      }

      // Guest / unauthenticated state: NEVER elevate to founder automatically
      if (isMounted) {
        setUser(null);
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch {
          // storage unavailable
        }
        setIsLoading(false);
      }
    }

    initAuth();

    // Listen to Supabase auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const appUser = await mapSupabaseUser(session.user);
        setUser(appUser);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
        } catch {
          // ignore storage quota
        }
      } else {
        setUser(null);
        try {
          localStorage.removeItem(AUTH_STORAGE_KEY);
        } catch {
          // ignore
        }
      }
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [supabase, mapSupabaseUser]);

  const login = useCallback(async (email: string, password?: string) => {
    setIsLoading(true);
    const normalized = email.trim().toLowerCase();

    if (!password || password.trim().length === 0) {
      setIsLoading(false);
      return { ok: false, error: "Password is required to sign in." };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: normalized,
        password,
      });

      if (error || !data.user) {
        setIsLoading(false);
        return { ok: false, error: error?.message || "Invalid email or password." };
      }

      const appUser = await mapSupabaseUser(data.user);
      setUser(appUser);
      try {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
      } catch {
        // storage quota
      }
      setIsLoading(false);
      return { ok: true, user: appUser };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed";
      setIsLoading(false);
      return { ok: false, error: msg };
    }
  }, [supabase, mapSupabaseUser]);

  const signup = useCallback(async (data: { name: string; email: string; role: Role; password?: string }) => {
    setIsLoading(true);

    if (!data.password || data.password.length < 8) {
      setIsLoading(false);
      return { ok: false, error: "Password must be at least 8 characters." };
    }

    // Security: Public visitors cannot self-assign founder or admin privileges
    const safeRole: Role = data.role === "founder" || data.role === "admin" ? "talent" : data.role;

    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: {
          data: {
            full_name: data.name.trim(),
            role: safeRole,
          },
        },
      });

      if (error) {
        setIsLoading(false);
        return { ok: false, error: error.message };
      }

      if (authData.user) {
        const appUser = await mapSupabaseUser(authData.user);
        setUser(appUser);
        try {
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(appUser));
        } catch {
          // storage quota
        }
        setIsLoading(false);
        return { ok: true, user: appUser };
      }

      setIsLoading(false);
      return { ok: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Account registration failed";
      setIsLoading(false);
      return { ok: false, error: msg };
    }
  }, [supabase, mapSupabaseUser]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: typeof window !== "undefined" ? `${window.location.origin}/login` : undefined,
      });
      if (error) return { ok: false, error: error.message };
      return { ok: true };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Password reset failed";
      return { ok: false, error: message };
    }
  }, [supabase]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    setUser(null);
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch {
      // storage unavailable
    }
  }, [supabase]);

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role ?? null,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
