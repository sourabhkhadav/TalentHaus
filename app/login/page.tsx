"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Lock, Mail, ArrowRight, AlertCircle, Shield, KeyRound } from "lucide-react";

function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirectTo") || "";
    const isAdminMode = redirectTo.startsWith("/admin") || searchParams.get("admin") === "true";

    const { user, isAuthenticated, isLoading, login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // If an authenticated session is already active or restored, seamlessly redirect to destination
    useEffect(() => {
        if (!isLoading && isAuthenticated && user) {
            const lowerEmail = (user.email || "").toLowerCase().trim();
            const isFounderOrAdmin =
                user.role === "founder" ||
                user.role === "admin" ||
                lowerEmail === "sourabh@talenthaus.in" ||
                lowerEmail === "navneet@talenthaus.in" ||
                lowerEmail === "atharv@talenthaus.in" ||
                lowerEmail.includes("sourabh") ||
                lowerEmail.includes("navneet") ||
                lowerEmail.includes("atharv") ||
                lowerEmail.endsWith("@talenthaus.in");

            if (isAdminMode) {
                if (isFounderOrAdmin) {
                    router.replace(redirectTo || "/admin");
                }
            } else {
                if (redirectTo) {
                    router.replace(redirectTo);
                } else if (isFounderOrAdmin) {
                    router.replace("/admin");
                } else {
                    router.replace("/portal");
                }
            }
        }
    }, [isLoading, isAuthenticated, user, isAdminMode, redirectTo, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email.trim() || !password.trim()) {
            setError("Please enter both email and password.");
            return;
        }

        setLoading(true);
        try {
            const res = await login(email, password);
            if (res.ok && res.user) {
                const lowerEmail = (res.user.email || "").toLowerCase().trim();
                const isFounderOrAdmin =
                    res.user.role === "founder" ||
                    res.user.role === "admin" ||
                    lowerEmail === "sourabh@talenthaus.in" ||
                    lowerEmail === "navneet@talenthaus.in" ||
                    lowerEmail === "atharv@talenthaus.in" ||
                    lowerEmail.includes("sourabh") ||
                    lowerEmail.includes("navneet") ||
                    lowerEmail.includes("atharv") ||
                    lowerEmail.endsWith("@talenthaus.in");

                if (isAdminMode) {
                    if (isFounderOrAdmin) {
                        router.replace(redirectTo || "/admin");
                    } else {
                        setError("Access restricted: Only authorized TalentHaus founders and administrators can enter Founder OS.");
                    }
                } else {
                    if (redirectTo) {
                        router.replace(redirectTo);
                    } else if (isFounderOrAdmin) {
                        router.replace("/admin");
                    } else {
                        router.replace("/portal");
                    }
                }
            } else {
                setError(res.error || "Authentication failed. Please check credentials.");
            }
        } catch {
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-obsidian text-ivory flex flex-col items-center justify-center py-20 px-4">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-stone font-mono tracking-wider uppercase">Restoring Session...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-obsidian text-ivory flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 safe-bottom">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <Link
                    href="/"
                    className="inline-block font-display text-2xl tracking-wider text-ivory uppercase mb-3 hover:text-gold transition-colors"
                >
                    Talent<span className="text-gold font-normal">Haus</span>
                </Link>
                <h1 className="font-display text-3xl sm:text-4xl text-ivory tracking-tight">
                    {isAdminMode ? "Admin Access" : "Sign in to your account"}
                </h1>
                <p className="font-body text-stone text-xs sm:text-sm mt-2">
                    {isAdminMode
                        ? "Enter verified founder credentials to access the internal management console."
                        : "Access your founder operating system or talent workspace."}
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-plum/30 border border-gold/20 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    <div className="mb-6 flex items-center justify-center gap-2 text-gold/80 text-xs uppercase tracking-wider font-semibold border-b border-gold/15 pb-4">
                        {isAdminMode ? <KeyRound size={14} className="text-gold" /> : <Shield size={14} className="text-gold" />}
                        <span>{isAdminMode ? "Founder OS Security Checkpoint" : "Encrypted Session Authentication"}</span>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="mb-4 p-3 bg-red-950/60 border border-red-500/40 rounded text-red-200 text-xs flex items-center gap-2"
                        >
                            <AlertCircle size={15} className="shrink-0 text-red-400" />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label
                                htmlFor="email"
                                className="block font-body text-xs font-medium text-stone uppercase tracking-wider mb-1.5"
                            >
                                {isAdminMode ? "Founder / Admin Email" : "Email Address"}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone">
                                    <Mail size={16} />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="founder@talenthaus.in"
                                    className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded bg-obsidian/80 border border-gold/20 text-ivory font-body text-base sm:text-sm placeholder:text-stone/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label
                                    htmlFor="password"
                                    className="block font-body text-xs font-medium text-stone uppercase tracking-wider"
                                >
                                    Password
                                </label>
                                {!isAdminMode && (
                                    <Link
                                        href="/forgot-password"
                                        className="font-body text-xs text-gold hover:text-gold/80 transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone">
                                    <Lock size={16} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••••••"
                                    className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded bg-obsidian/80 border border-gold/20 text-ivory font-body text-base sm:text-sm placeholder:text-stone/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full min-h-[44px] px-6 py-3 rounded bg-gold text-obsidian font-body text-sm font-semibold tracking-wide hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {loading ? "Authenticating..." : isAdminMode ? "Verify & Enter Founder OS" : "Sign In"}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>

                    {!isAdminMode && (
                        <div className="mt-6 pt-6 border-t border-gold/15 text-center">
                            <p className="font-body text-xs text-stone">
                                New agency applicant or brand partner?{" "}
                                <Link
                                    href="/signup"
                                    className="text-gold font-medium hover:underline ml-1"
                                >
                                    Apply for account
                                </Link>
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-obsidian text-ivory flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
                </div>
            }
        >
            <LoginForm />
        </Suspense>
    );
}
