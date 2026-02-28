"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Stats {
    totalListings: number;
    activeListings: number;
    inactiveListings: number;
    pendingBookings: number;
    confirmedBookings: number;
    cancelledBookings: number;
}

export default function SellerOverviewPage() {
    const { data: session } = useSession();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [listingsRes, bookingsRes] = await Promise.all([
                    fetch("/api/seller/listings"),
                    fetch("/api/seller/bookings"),
                ]);
                const listingsData = await listingsRes.json();
                const bookingsData = await bookingsRes.json();

                const listings = listingsData.listings ?? [];
                const bookings = bookingsData.bookings ?? [];

                setStats({
                    totalListings: listings.length,
                    activeListings: listings.filter((l: { status: string }) => l.status === "Active").length,
                    inactiveListings: listings.filter((l: { status: string }) => l.status === "Inactive").length,
                    pendingBookings: bookings.filter((b: { status: string }) => b.status === "Pending").length,
                    confirmedBookings: bookings.filter((b: { status: string }) => b.status === "Confirmed").length,
                    cancelledBookings: bookings.filter((b: { status: string }) => b.status === "Cancelled").length,
                });
            } catch {
                /* silently fail */
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const statCards = stats
        ? [
            { label: "Total Listings", value: stats.totalListings, icon: "home_work", color: "text-primary bg-primary/10", href: "/dashboard/seller/listings" },
            { label: "Active Listings", value: stats.activeListings, icon: "check_circle", color: "text-success bg-success/10", href: "/dashboard/seller/listings?status=Active" },
            { label: "Pending Requests", value: stats.pendingBookings, icon: "schedule", color: "text-warning bg-warning/10", href: "/dashboard/seller/bookings" },
            { label: "Confirmed Visits", value: stats.confirmedBookings, icon: "event_available", color: "text-primary-light bg-primary-light/10", href: "/dashboard/seller/bookings" },
        ]
        : [];

    const quickLinks = [
        { href: "/dashboard/seller/listings/new", label: "Add New Listing", icon: "add_home", desc: "Publish a new property" },
        { href: "/dashboard/seller/listings", label: "Manage Listings", icon: "home_work", desc: "View, edit or delete listings" },
        { href: "/dashboard/seller/bookings", label: "View Bookings", icon: "confirmation_number", desc: "Respond to visit requests" },
    ];

    return (
        <div className="p-6 space-y-8">
            {/* Welcome */}
            <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-6 text-white shadow-glow">
                <p className="text-white/70 text-sm font-medium mb-1">Welcome back,</p>
                <h1 className="text-2xl font-bold">{session?.user?.name ?? "Seller"} 👋</h1>
                <p className="text-white/70 text-sm mt-2">
                    Here's a snapshot of your seller activity today.
                </p>
            </div>

            {/* Stats */}
            {loading ? (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <Link
                            key={card.label}
                            href={card.href}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card hover:shadow-premium transition-shadow group"
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                                <span className="material-icons-outlined text-lg">{card.icon}</span>
                            </div>
                            <p className="text-3xl font-bold text-text-main">{card.value}</p>
                            <p className="text-xs text-text-muted mt-1 group-hover:text-primary transition-colors">
                                {card.label}
                            </p>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-base font-semibold text-text-main mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {quickLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card hover:shadow-premium hover:border-primary/40 transition-all group flex items-center gap-4"
                        >
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                                <span className="material-icons-outlined text-primary group-hover:text-white text-lg transition-colors">
                                    {link.icon}
                                </span>
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
