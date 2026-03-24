"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Listing {
    _id: string;
    title: string;
    type: string;
    category: string;
    price: number;
    status: "Active" | "Inactive";
    location: { address?: string };
    createdAt: string;
}

const statusBadge = (status: string) =>
    status === "Active"
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        : "bg-slate-100 dark:bg-slate-700 text-slate-500";

export default function AgentListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/agent/listings")
            .then((r) => r.json())
            .then((d) => setListings(d.listings ?? []))
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">My Managed Listings</h1>
                    <p className="text-sm text-text-muted mt-1">Properties you created or have been assigned and approved</p>
                </div>
                <Link href="/dashboard/agent/listings/new"
                    className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors">
                    <span className="material-icons-outlined text-base">add</span>
                    Add Listing
                </Link>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : listings.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center">
                    <span className="material-icons-outlined text-4xl text-emerald-400 mb-3 block">home_work</span>
                    <h3 className="text-lg font-semibold text-text-main mb-1">No listings yet</h3>
                    <p className="text-sm text-text-muted mb-4">Create your first property listing to get started.</p>
                    <Link href="/dashboard/agent/listings/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
                        <span className="material-icons-outlined text-base">add</span> Add Listing
                    </Link>
                </div>
            ) : (
                <div className="space-y-3">
                    {listings.map((listing) => (
                        <div key={listing._id}
                            className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-card">
                            <div className="flex items-center gap-4 min-w-0">
                                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                                    <span className="material-icons-outlined text-emerald-600 dark:text-emerald-400 text-lg">home_work</span>
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-text-main truncate">{listing.title}</p>
                                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(listing.status)}`}>
                                            {listing.status}
                                        </span>
                                        <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500">
                                            {listing.type}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted">
                                        {listing.category} · {listing.location?.address || "No address"} · <span className="font-medium">${listing.price.toLocaleString()}</span>
                                    </p>
                                </div>
                            </div>
                            <Link href={`/dashboard/agent/listings/${listing._id}/edit`}
                                className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-text-muted text-xs font-semibold rounded-xl transition-colors">
                                <span className="material-icons-outlined text-sm">edit</span>
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
