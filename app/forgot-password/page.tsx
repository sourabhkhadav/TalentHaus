"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { Mail, ArrowLeft, ArrowRight, CheckCircle2, AlertCircle } from "lucide-react";

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email.trim()) {
            setError("Please enter your registered email address.");
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(email);
            if (res.ok) {
                setSubmitted(true);
            } else {
                setError(res.error || "Failed to dispatch recovery email. Please check the address.");
            }
        } catch {
            setError("Network error. Please try again shortly.");
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
                    Reset your password
                </h1>
                <p className="font-body text-stone text-xs sm:text-sm mt-2">
                    Enter your email to receive a secure recovery code.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-plum/30 border border-gold/20 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
                    {submitted ? (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-4 border border-gold/30">
                                <CheckCircle2 size={24} />
                            </div>
                            <h2 className="font-display text-2xl text-ivory mb-2">Check your inbox</h2>
                            <p className="font-body text-xs text-stone leading-relaxed mb-6">
                                We have dispatched a password reset link to{" "}
                                <strong className="text-gold font-medium break-all">{email}</strong>. Please check your spam folder if it doesn't appear within 2 minutes.
                            </p>
                            <Link
                                href="/login"
                                className="w-full min-h-[44px] px-6 py-3 rounded bg-gold text-obsidian font-body text-sm font-semibold tracking-wide hover:bg-gold/90 transition-all flex items-center justify-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>
                        </div>
                    ) : (
                        <>
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
                                        Account Email
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

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full min-h-[44px] px-6 py-3 rounded bg-gold text-obsidian font-body text-sm font-semibold tracking-wide hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {loading ? "Sending link..." : "Send Reset Link"}
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </form>

                            <div className="mt-6 pt-6 border-t border-gold/15 text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-1.5 text-xs text-stone hover:text-gold transition-colors"
                                >
                                    <ArrowLeft size={14} />
                                    Return to Sign In
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
