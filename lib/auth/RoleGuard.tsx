"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "./AuthContext";
import { Role } from "@/types";
import { ShieldAlert, ArrowRight } from "lucide-react";

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, role, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-obsidian text-ivory">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-stone font-mono tracking-wider uppercase">Loading Workspace...</p>
        </div>
      </div>
    );
  }

  // Treat 'founder' as having 'admin' privileges and vice versa
  const isAuthorized =
    user &&
    (allowedRoles.includes(user.role) ||
      (allowedRoles.includes("admin") && user.role === "founder") ||
      (allowedRoles.includes("founder") && user.role === "admin"));

  if (!isAuthorized) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center px-4 py-24 bg-obsidian text-ivory">
        <div className="max-w-md w-full bg-plum/40 border border-gold/30 rounded-2xl p-6 sm:p-8 text-center backdrop-blur-md">
          <div className="w-14 h-14 rounded-full bg-gold/10 text-gold flex items-center justify-center mx-auto mb-4">
            <ShieldAlert size={28} />
          </div>
          <h2 className="font-display text-2xl text-ivory mb-2">Restricted Workspace</h2>
          <p className="text-stone text-xs sm:text-sm mb-6 leading-relaxed">
            This area requires authenticated {allowedRoles.join(" or ")} credentials. You are currently logged in as{" "}
            <strong className="text-gold capitalize">{role || "Guest"}</strong>
            {user?.name ? ` (${user.name})` : ""}.
          </p>

          <Link
            href="/login?redirectTo=/admin"
            className="w-full min-h-[44px] py-2.5 px-4 rounded bg-gold text-obsidian font-body text-xs font-semibold uppercase tracking-wider hover:bg-gold/90 transition-colors flex items-center justify-center gap-1.5"
          >
            Sign in with Founder Credentials <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
