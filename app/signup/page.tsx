"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/AuthContext";
import { Role } from "@/types";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";

export default function SignupPage() {
    const router = useRouter();
    const { signup } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<Role>("talent");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!name.trim() || !email.trim() || !password.trim()) {
            setError("Please fill in all required fields.");
            return;
        }

        if (password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await signup({ name, email, role, password });
            if (res.ok) {
                router.push(`/verify-email?email=${encodeURIComponent(email)}`);
            } else {
                setError(res.error || "Signup could not be processed.");
            }
        } catch {
            setError("Failed to create account. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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
                    Apply for Agency Access
                </h1>
                <p className="font-body text-stone text-xs sm:text-sm mt-2">
                    Exclusive representation and brand partnership workspace.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-plum/30 border border-gold/20 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
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
                        {/* Role selection tab */}
                        <div>
                            <label className="block font-body text-xs font-medium text-stone uppercase tracking-wider mb-2">
                                I am an:
                            </label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    type="button"
                                    onClick={() => setRole("talent")}
                                    className={`min-h-[44px] px-3 py-2 rounded text-xs font-medium transition-all ${
                                        role === "talent"
                                            ? "bg-gold text-obsidian font-bold shadow"
                                            : "bg-obsidian/60 text-stone border border-gold/20 hover:text-ivory"
                                    }`}
                                >
                                    Creator / Talent
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRole("brand")}
                                    className={`min-h-[44px] px-3 py-2 rounded text-xs font-medium transition-all ${
                                        role === "brand"
                                            ? "bg-gold text-obsidian font-bold shadow"
                                            : "bg-obsidian/60 text-stone border border-gold/20 hover:text-ivory"
                                    }`}
                                >
                                    Luxury Brand / Agency
                                </button>
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="name"
                                className="block font-body text-xs font-medium text-stone uppercase tracking-wider mb-1.5"
                            >
                                Full Name or Brand Contact
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone">
                                    <User size={16} />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Your Full Name"
                                    className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded bg-obsidian/80 border border-gold/20 text-ivory font-body text-base sm:text-sm placeholder:text-stone/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block font-body text-xs font-medium text-stone uppercase tracking-wider mb-1.5"
                            >
                                Professional Email
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
                                    placeholder="name@representation.com"
                                    className="w-full min-h-[44px] pl-10 pr-3 py-2.5 rounded bg-obsidian/80 border border-gold/20 text-ivory font-body text-base sm:text-sm placeholder:text-stone/50 focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block font-body text-xs font-medium text-stone uppercase tracking-wider mb-1.5"
                            >
                                Create Password (min. 8 characters)
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone">
                                    <Lock size={16} />
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
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
                                {loading ? "Creating Profile..." : "Submit Registration"}
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gold/15 text-center">
                        <p className="font-body text-xs text-stone">
                            Already registered with TalentHaus?{" "}
                            <Link
                                href="/login"
                                className="text-gold font-medium hover:underline ml-1"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
