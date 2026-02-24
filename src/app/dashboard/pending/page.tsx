"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PendingApprovalPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const role = (session?.user as any)?.role ?? "seller";
    const approvalStatus = (session?.user as any)?.approvalStatus;
    const roleLabel = role === "agent" ? "Agent" : "Seller";

    const [checking, setChecking] = useState(false);
    const [message, setMessage] = useState("");

    // Refresh the session token — if admin has approved the user the new
    // approvalStatus will be loaded from DB (auth.ts jwt callback does this).
    // Then redirect them to their dashboard.
    const handleRefresh = async () => {
        setChecking(true);
        setMessage("");
        try {
            await update(); // Re-fetches the session, triggering the jwt callback
            // Give the state time to settle
            await new Promise((r) => setTimeout(r, 800));
            const newStatus = (session?.user as any)?.approvalStatus;
            if (newStatus === "approved") {
                router.replace(role === "agent" ? "/dashboard/agent" : "/dashboard/seller");
            } else {
                setMessage("Your application is still under review. Please check back later.");
            }
        } catch {
            setMessage("Failed to check status. Please try again.");
        } finally {
            setChecking(false);
        }
    };

    if (approvalStatus === "rejected") {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
                <div className="max-w-md w-full text-center">
                    <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-6">
                        <span className="material-icons-outlined text-4xl text-red-500">cancel</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">Application Rejected</h1>
                    <p className="text-slate-500 dark:text-slate-400 mb-8">
                        Unfortunately, your <strong>{roleLabel}</strong> account application has been rejected.
                        Please contact support if you believe this is a mistake.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <a href="mailto:support@al-diyar.com"
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-colors">
                            <span className="material-icons-outlined text-base">mail</span>
                            Contact Support
                        </a>
                        <button onClick={() => signOut({ callbackUrl: "/" })}
                            className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-icons-outlined text-base">logout</span>
                            Sign Out
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-background-light dark:bg-background-dark">
            <div className="max-w-md w-full text-center">
                {/* Animated clock icon */}
                <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-6 animate-pulse">
                    <span className="material-icons-outlined text-4xl text-amber-500">schedule</span>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                    Pending Admin Approval
                </h1>
                <p className="text-slate-500 dark:text-slate-400 mb-2">
                    Your <strong>{roleLabel}</strong> account is currently under review.
                </p>
                <p className="text-slate-400 dark:text-slate-500 text-sm mb-8">
                    Our admin team will verify your details shortly.
                    Once approved, click the button below to access your dashboard.
                </p>

                {/* Steps */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-6 text-left space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                            <span className="material-icons-outlined text-sm text-green-500">check</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Account Created</p>
                            <p className="text-xs text-slate-400">Your account has been registered</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0 animate-pulse">
                            <span className="material-icons-outlined text-sm text-amber-500">schedule</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">Admin Review</p>
                            <p className="text-xs text-slate-400">Your application is being reviewed</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
                            <span className="material-icons-outlined text-sm text-slate-400">dashboard</span>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-400">{roleLabel} Dashboard Access</p>
                            <p className="text-xs text-slate-400">Available after approval</p>
                        </div>
                    </div>
                </div>

                {/* Refresh status button */}
                <button onClick={handleRefresh} disabled={checking}
                    className="w-full mb-3 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 disabled:opacity-60 transition-colors">
                    {checking ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Checking approval status…
                        </>
                    ) : (
                        <>
                            <span className="material-icons-outlined text-base">refresh</span>
                            Check Approval Status
                        </>
                    )}
                </button>

                {message && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-3">{message}</p>
                )}

                <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors flex items-center gap-1 mx-auto">
                    <span className="material-icons-outlined text-sm">logout</span>
                    Sign out
                </button>

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                    Questions? Contact{" "}
                    <a href="mailto:support@al-diyar.com" className="text-primary hover:underline">
                        support@al-diyar.com
                    </a>
                </p>
            </div>
        </div>
    );
}
