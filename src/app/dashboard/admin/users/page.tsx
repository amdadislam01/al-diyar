"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";

interface UserEntry {
    _id: string;
    name: string;
    email: string;
    role: "user" | "agent" | "seller" | "admin";
    approvalStatus?: "pending" | "approved" | "rejected";
    companyName?: string;
    createdAt: string;
}

const ROLE_STYLES: Record<string, string> = {
    user: "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300",
    agent: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400",
    seller: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    admin: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
};

const STATUS_STYLES: Record<string, string> = {
    pending: "bg-amber-100 dark:bg-amber-900/30 text-amber-700",
    approved: "bg-green-100 dark:bg-green-900/30 text-green-700",
    rejected: "bg-red-100 dark:bg-red-900/20 text-red-600",
};

type TabKey = "all" | "pending" | "approved" | "rejected";

export default function AdminUsersPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Read initial tab from URL ?tab=pending etc.
    const initialTab = (searchParams.get("tab") as TabKey | null) ?? "pending";
    const [tab, setTab] = useState<TabKey>(initialTab);

    const [users, setUsers] = useState<UserEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);
    const [roleChanging, setRoleChanging] = useState<string | null>(null);

    // Sync tab → URL
    const switchTab = (newTab: TabKey) => {
        setTab(newTab);
        router.replace(`/dashboard/admin/users?tab=${newTab}`, { scroll: false });
    };

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const param = tab === "all" ? "" : `?status=${tab}`;
            const res = await fetch(`/api/admin/approve-user${param}`);
            const data = await res.json();
            setUsers(data.users ?? []);
        } catch {
            /* silently fail */
        } finally {
            setLoading(false);
        }
    }, [tab]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleApproval = async (userId: string, action: "approve" | "reject") => {
        setProcessing(userId);
        try {
            const res = await fetch("/api/admin/approve-user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, action }),
            });
            if (res.ok) fetchUsers();
        } catch { /* ignore */ } finally { setProcessing(null); }
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        if (!window.confirm(`Change this user's role to "${newRole}"?`)) return;
        setRoleChanging(userId);
        try {
            const res = await fetch("/api/admin/approve-user", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, role: newRole }),
            });
            if (res.ok) fetchUsers();
        } catch { /* ignore */ } finally { setRoleChanging(null); }
    };

    const tabs: { key: TabKey; label: string; icon: string }[] = [
        { key: "pending", label: "Pending", icon: "schedule" },
        { key: "all", label: "All Users", icon: "group" },
        { key: "approved", label: "Approved", icon: "check_circle" },
        { key: "rejected", label: "Rejected", icon: "cancel" },
    ];

    return (
        <div className="p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-text-main">User Management</h1>
                <p className="text-sm text-text-muted mt-1">
                    View all users, change roles, approve or reject agent &amp; seller accounts
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                {tabs.map((t) => (
                    <button key={t.key} onClick={() => switchTab(t.key)}
                        className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${tab === t.key
                                ? "border-primary text-primary"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}>
                        <span className="material-icons-outlined text-base">{t.icon}</span>
                        {t.label}
                        {/* Pending badge */}
                        {t.key === "pending" && tab === "pending" && users.length > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                                {users.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* User list */}
            {loading ? (
                <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : users.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
                    <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">
                        {tab === "pending" ? "schedule" : tab === "approved" ? "check_circle" : tab === "rejected" ? "cancel" : "group"}
                    </span>
                    <p className="text-sm text-text-muted">
                        {tab === "pending" ? "No pending applications — all caught up! 🎉" : `No ${tab} users found.`}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {users.map((user) => (
                        <div key={user._id}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-card flex-wrap">

                            {/* Left: avatar + info */}
                            <div className="flex items-center gap-4 min-w-0">
                                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 font-bold text-white text-base ${user.role === "agent" ? "bg-emerald-500" :
                                        user.role === "seller" ? "bg-blue-500" :
                                            user.role === "admin" ? "bg-purple-500" : "bg-slate-400"
                                    }`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-text-main">{user.name}</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${ROLE_STYLES[user.role] ?? ROLE_STYLES.user}`}>
                                            {user.role}
                                        </span>
                                        {user.approvalStatus && (user.role === "agent" || user.role === "seller") && (
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${STATUS_STYLES[user.approvalStatus]}`}>
                                                {user.approvalStatus}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-muted truncate">{user.email}</p>
                                    {user.companyName && (
                                        <p className="text-[11px] text-slate-400">🏢 {user.companyName}</p>
                                    )}
                                </div>
                            </div>

                            {/* Right: actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                {/* Role change dropdown */}
                                <select
                                    value={user.role}
                                    disabled={roleChanging === user._id}
                                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                                    className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-text-main text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition disabled:opacity-50 cursor-pointer">
                                    <option value="user">user</option>
                                    <option value="agent">agent</option>
                                    <option value="seller">seller</option>
                                    <option value="admin">admin</option>
                                </select>

                                {/* Approve/Reject — only for pending agent/seller */}
                                {user.approvalStatus === "pending" && (user.role === "agent" || user.role === "seller") && (
                                    <>
                                        <button onClick={() => handleApproval(user._id, "approve")}
                                            disabled={processing === user._id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                            <span className="material-icons-outlined text-sm">check</span>Approve
                                        </button>
                                        <button onClick={() => handleApproval(user._id, "reject")}
                                            disabled={processing === user._id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                            <span className="material-icons-outlined text-sm">close</span>Reject
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
