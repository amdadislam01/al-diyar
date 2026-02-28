"use client";

import { useEffect, useState, useCallback } from "react";

interface Listing {
    _id: string;
    title: string;
    type: string;
    category: string;
    price: number;
    status: "Active" | "Inactive";
    location: { address?: string };
    listedBy: { name: string; email: string; role: string };
    createdAt: string;
}

const statusBadge = (status: string) =>
    status === "Active"
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
        : "bg-slate-100 dark:bg-slate-700 text-slate-500";

export default function AdminListingsPage() {
    const [listings, setListings] = useState<Listing[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<"" | "Active" | "Inactive">("");
    const [loading, setLoading] = useState(true);
    const [toggling, setToggling] = useState<string | null>(null);

    const fetchListings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/admin/listings?${params}`);
            const data = await res.json();
            setListings(data.listings ?? []);
            setTotal(data.total ?? 0);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => { fetchListings(); }, [fetchListings]);

    const toggleStatus = async (listing: Listing) => {
        setToggling(listing._id);
        try {
            await fetch("/api/admin/listings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    listingId: listing._id,
                    status: listing.status === "Active" ? "Inactive" : "Active",
                }),
            });
            fetchListings();
        } finally {
            setToggling(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">All Listings</h1>
                    <p className="text-sm text-text-muted mt-1">{total} total listings</p>
                </div>
                <div className="flex gap-2">
                    {(["", "Active", "Inactive"] as const).map((s) => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s
                                    ? "bg-primary text-white"
                                    : "bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main"
                                }`}>
                            {s || "All"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
                    <span className="material-icons-outlined text-4xl text-slate-300 mb-3 block">home_work</span>
                    <p className="text-sm text-text-muted">No listings found.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {listings.map((listing) => (
                            <div key={listing._id}
                                className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-card">
                                <div className="flex items-center gap-4 min-w-0">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                                        <span className="material-icons-outlined text-indigo-600 dark:text-indigo-400 text-lg">home_work</span>
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-text-main truncate">{listing.title}</p>
                                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(listing.status)}`}>
                                                {listing.status}
                                            </span>
                                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 dark:bg-slate-700 text-slate-500">
                                                {listing.type}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted truncate">
                                            {listing.category} · {listing.location?.address || "No address"} ·{" "}
                                            <span className="font-medium">${listing.price.toLocaleString()}</span>
                                        </p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            By: {listing.listedBy?.name} ({listing.listedBy?.role})
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => toggleStatus(listing)}
                                    disabled={toggling === listing._id}
                                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors disabled:opacity-50 ${listing.status === "Active"
                                            ? "bg-red-100 dark:bg-red-900/20 text-red-600 hover:bg-red-200"
                                            : "bg-green-100 dark:bg-green-900/20 text-green-600 hover:bg-green-200"
                                        }`}>
                                    <span className="material-icons-outlined text-sm">
                                        {listing.status === "Active" ? "block" : "check_circle"}
                                    </span>
                                    {listing.status === "Active" ? "Deactivate" : "Activate"}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {total > 20 && (
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-text-muted disabled:opacity-40">
                                ← Prev
                            </button>
                            <span className="text-xs text-text-muted">Page {page} of {Math.ceil(total / 20)}</span>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 20)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-text-muted disabled:opacity-40">
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
