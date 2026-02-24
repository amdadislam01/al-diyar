"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface Stats {
    listings: number;
    bookings: number;
    clients: number;
    pendingBookings: number;
}

export default function AgentDashboardPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats>({ listings: 0, bookings: 0, clients: 0, pendingBookings: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            try {
                const [listingsRes, bookingsRes, clientsRes] = await Promise.all([
                    fetch("/api/agent/listings"),
                    fetch("/api/agent/bookings"),
                    fetch("/api/agent/clients"),
                ]);
                const [ld, bd, cd] = await Promise.all([listingsRes.json(), bookingsRes.json(), clientsRes.json()]);
                setStats({
                    listings: ld.listings?.length ?? 0,
                    bookings: bd.bookings?.length ?? 0,
                    clients: cd.total ?? 0,
                    pendingBookings: (bd.bookings ?? []).filter((b: any) => b.status === "Pending").length,
                });
            } finally {
                setLoading(false);
            }
        }
        loadStats();
    }, []);

    const name = session?.user?.name ?? "Agent";

    const statCards = [
        { label: "My Listings", value: stats.listings, icon: "home_work", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600", href: "/dashboard/agent/listings" },
        { label: "Total Bookings", value: stats.bookings, icon: "confirmation_number", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600", href: "/dashboard/agent/bookings" },
        { label: "Pending Visits", value: stats.pendingBookings, icon: "schedule", color: "bg-amber-100 dark:bg-amber-900/30 text-amber-600", href: "/dashboard/agent/bookings" },
        { label: "Clients", value: stats.clients, icon: "group", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600", href: "/dashboard/agent/clients" },
    ];

    const quickLinks = [
        { href: "/dashboard/agent/listings/new", label: "Add Listing", icon: "add_home", desc: "Post a new property", color: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30" },
        { href: "/dashboard/agent/bookings", label: "View Bookings", icon: "confirmation_number", desc: "Manage visit requests", color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30" },
        { href: "/dashboard/agent/clients", label: "My Clients", icon: "group", desc: "See client activity", color: "text-purple-600 bg-purple-100 dark:bg-purple-900/30" },
    ];

    return (
        <div className="p-6 space-y-8">
            <div>
                <h1 className="text-2xl font-bold text-text-main">Welcome back, {name} 👋</h1>
                <p className="text-sm text-text-muted mt-1">Here's your agent dashboard overview</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((card) => (
                    <Link key={card.href} href={card.href}
                        className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card hover:border-emerald-400/40 transition-colors flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${card.color}`}>
                            <span className="material-icons-outlined text-xl">{card.icon}</span>
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-7 w-10 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-1" />
                            ) : (
                                <p className="text-2xl font-bold text-text-main">{card.value}</p>
                            )}
                            <p className="text-xs text-text-muted">{card.label}</p>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div>
                <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">⚡ Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <Link key={link.href} href={link.href}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 hover:border-emerald-400/40 transition-colors shadow-card flex items-center gap-4">
                            <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${link.color}`}>
                                <span className="material-icons-outlined text-xl">{link.icon}</span>
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-main">{link.label}</p>
                                <p className="text-xs text-text-muted">{link.desc}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
