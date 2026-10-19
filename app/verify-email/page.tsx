"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { MailCheck, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

function VerifyEmailContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const emailParam = searchParams.get("email") || "";

    const [code, setCode] = useState(["", "", "", "", "", ""]);
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verifyError, setVerifyError] = useState<string | null>(null);
    const [resending, setResending] = useState(false);
    const [resendNotice, setResendNotice] = useState(false);

    const handleCodeChange = (index: number, val: string) => {
        if (val.length > 1) val = val.slice(-1);
        const next = [...code];
        next[index] = val;
        setCode(next);

        // Auto focus next input
        if (val && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`);
            nextInput?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setVerifyError(null);

        const token = code.join("").trim();
        if (token.length !== 6) {
            setVerifyError("Please enter all 6 digits of the verification code.");
            return;
        }

        if (!emailParam) {
            setVerifyError("No email address provided for verification.");
            return;
        }

        setVerifying(true);

        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();

            const { error } = await supabase.auth.verifyOtp({
                email: emailParam,
                token,
                type: "signup",
            });

            if (error) {
                setVerifyError(error.message || "Invalid or expired verification code.");
                setVerifying(false);
                return;
            }

            setVerifying(false);
            setVerified(true);
            setTimeout(() => {
                router.push("/portal");
            }, 1200);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Verification service error. Please try again.";
            setVerifyError(message);
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            const { createClient } = await import("@/lib/supabase/client");
            const supabase = createClient();
            await supabase.auth.resend({
                type: "signup",
                email: emailParam,
            });
        } catch {
            // offline fallback
        }
        setResending(false);
        setResendNotice(true);
        setTimeout(() => setResendNotice(false), 3500);
    };

    return (
        <div className="bg-plum/30 border border-gold/20 rounded-xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
            {verified ? (
                <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 size={32} />
                    </div>
                    <h2 className="font-display text-2xl text-ivory mb-2">Email Verified</h2>
                    <p className="font-body text-xs text-stone">
                        Your TalentHaus account is confirmed. Redirecting to your workspace...
                    </p>
                </div>
            ) : (
                <>
                    <div className="w-12 h-12 rounded-full bg-gold/15 text-gold border border-gold/30 flex items-center justify-center mx-auto mb-4">
                        <MailCheck size={24} />
                    </div>

                    <div className="text-center mb-6">
                        <p className="font-body text-xs text-stone">
                            We sent a 6-digit verification code to:
                        </p>
                        <p className="font-body text-sm font-semibold text-gold mt-1 break-all">
                            {emailParam}
                        </p>
                    </div>

                    {resendNotice && (
                        <div
                            role="alert"
                            className="mb-4 p-2.5 bg-gold/10 border border-gold/30 rounded text-center text-xs text-gold"
                        >
                            A fresh verification code has been dispatched.
                        </div>
                    )}

                    {verifyError && (
                        <div
                            role="alert"
                            className="mb-4 p-2.5 bg-rose-950/60 border border-rose-500/40 rounded text-center text-xs text-rose-300"
                        >
                            {verifyError}
                        </div>
                    )}

                    <form onSubmit={handleVerify} className="space-y-6">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {code.map((digit, i) => (
                                <input
                                    key={i}
                                    id={`code-${i}`}
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleCodeChange(i, e.target.value)}
                                    className="w-10 h-12 sm:w-12 sm:h-14 text-center font-display text-xl rounded bg-obsidian/80 border border-gold/25 text-ivory focus:border-gold focus:ring-1 focus:ring-gold outline-none transition-all"
                                />
                            ))}
                        </div>

                        <button
                            type="submit"
                            disabled={verifying}
                            className="w-full min-h-[44px] px-6 py-3 rounded bg-gold text-obsidian font-body text-sm font-semibold tracking-wide hover:bg-gold/90 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                        >
                            {verifying ? "Verifying..." : "Verify & Enter Workspace"}
                            <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-gold/15 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-stone">
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resending}
                            className="inline-flex items-center gap-1.5 text-gold hover:text-gold/80 min-h-[44px] px-2"
                        >
                            <RefreshCw size={13} className={resending ? "animate-spin" : ""} />
                            Resend code
                        </button>
                        <Link
                            href="/login"
                            className="hover:text-ivory min-h-[44px] inline-flex items-center"
                        >
                            Use different email
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <div className="min-h-screen bg-obsidian text-ivory flex flex-col justify-center py-20 px-4 sm:px-6 lg:px-8 safe-bottom">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <Link
                    href="/"
                    className="inline-block font-display text-2xl tracking-wider text-ivory uppercase mb-3 hover:text-gold transition-colors"
                >
                    Talent<span className="text-gold font-normal">Haus</span>
                </Link>
                <h1 className="font-display text-3xl sm:text-4xl text-ivory tracking-tight">
                    Verify Your Credentials
                </h1>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <Suspense
                    fallback={
                        <div className="bg-plum/30 border border-gold/20 rounded-xl p-8 text-center text-stone text-xs">
                            Loading security challenge...
                        </div>
                    }
                >
                    <VerifyEmailContent />
                </Suspense>
            </div>
        </div>
    );
}
