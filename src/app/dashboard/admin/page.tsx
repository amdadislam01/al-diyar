"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
    users: { total: number; sellers: number; agents: number; pendingApprovals: number };
    listings: { total: number; active: number; inactive: number };
    bookings: { total: number; pending: number; confirmed: number; cancelled: number };
}

function StatCard({
    icon, label, value, sub, color, href,
}: {
    icon: string; label: string; value: number | string; sub?: string; color: string; href?: string;
}) {
    const content = (
        <div className={`bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card flex items-center gap-4 ${href ? "hover:border-primary/40 transition-colors cursor-pointer" : ""}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                <span className="material-icons-outlined text-xl">{icon}</span>
            </div>
            <div>
                <p className="text-2xl font-bold text-text-main">{value}</p>
                <p className="text-xs font-medium text-text-muted">{label}</p>
                {sub && <p className="text-[11px] text-slate-400 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then((r) => r.json())
            .then((d) => setStats(d))
            .finally(() => setLoading(false));
    }, []);

    const skeletonCard = (
        <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 h-24 animate-pulse" />
    );

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Admin Overview</h1>
                <p className="text-sm text-text-muted mt-1">Platform-wide statistics and quick actions</p>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => <div key={i}>{skeletonCard}</div>)}
                </div>
            ) : stats ? (
                <>
                    <div>
                        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">👥 Users</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <StatCard icon="person" label="Regular Users" value={stats.users.total} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
                            <StatCard icon="store" label="Approved Sellers" value={stats.users.sellers} color="bg-primary/10 text-primary" href="/dashboard/admin/users?tab=approved&role=seller" />
                            <StatCard icon="real_estate_agent" label="Approved Agents" value={stats.users.agents} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" href="/dashboard/admin/users?tab=approved&role=agent" />
                            <StatCard
                                icon="schedule"
                                label="Pending Approvals"
                                value={stats.users.pendingApprovals}
                                sub="Needs review"
                                color="bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
                                href="/dashboard/admin/users?tab=pending"
                            />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">🏠 Listings</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard icon="home_work" label="Total Listings" value={stats.listings.total} color="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600" href="/dashboard/admin/listings" />
                            <StatCard icon="check_circle" label="Active" value={stats.listings.active} color="bg-green-100 dark:bg-green-900/30 text-green-600" href="/dashboard/admin/listings?status=Active" />
                            <StatCard icon="cancel" label="Inactive" value={stats.listings.inactive} color="bg-slate-100 dark:bg-slate-700 text-slate-500" href="/dashboard/admin/listings?status=Inactive" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">📅 Bookings</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <StatCard icon="confirmation_number" label="Total Bookings" value={stats.bookings.total} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600" href="/dashboard/admin/bookings" />
                            <StatCard icon="pending" label="Pending" value={stats.bookings.pending} color="bg-amber-100 dark:bg-amber-900/30 text-amber-600" href="/dashboard/admin/bookings?status=Pending" />
                            <StatCard icon="event_available" label="Confirmed" value={stats.bookings.confirmed} color="bg-green-100 dark:bg-green-900/30 text-green-600" href="/dashboard/admin/bookings?status=Confirmed" />
                        </div>
                    </div>
                </>
            ) : (
                <p className="text-sm text-text-muted">Failed to load stats.</p>
            )}

            {/* Quick Links */}
            <div>
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">⚡ Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { href: "/dashboard/admin/users", icon: "manage_accounts", label: "Manage Users", desc: "Approve or reject accounts", color: "text-amber-600 bg-amber-100 dark:bg-amber-900/30" },
                        { href: "/dashboard/admin/listings", icon: "home_work", label: "All Listings", desc: "View and moderate listings", color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30" },
                        { href: "/dashboard/admin/bookings", icon: "confirmation_number", label: "All Bookings", desc: "Monitor visit requests", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
                    ].map((item) => (
                        <Link key={item.href} href={item.href}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-primary/40 transition-colors shadow-card flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <span className="material-icons-outlined text-xl">{item.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-main">{item.label}</p>
                                <p className="text-xs text-text-muted">{item.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
