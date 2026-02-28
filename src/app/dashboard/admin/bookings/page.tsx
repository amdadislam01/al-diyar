"use client";

import { useEffect, useState, useCallback } from "react";

interface Booking {
    _id: string;
    listing: { title: string; type: string; category: string; price: number } | null;
    buyer: { name: string; email: string } | null;
    seller: { name: string; email: string; role: string } | null;
    visitDate: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt: string;
}

const statusBadge = (status: string) => {
    if (status === "Confirmed") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    if (status === "Cancelled") return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
};

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<"" | "Pending" | "Confirmed" | "Cancelled">("");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/admin/bookings?${params}`);
            const data = await res.json();
            setBookings(data.bookings ?? []);
            setTotal(data.total ?? 0);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const updateStatus = async (bookingId: string, status: string) => {
        setUpdating(bookingId);
        try {
            await fetch("/api/admin/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status }),
            });
            fetchBookings();
        } finally {
            setUpdating(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">All Bookings</h1>
                    <p className="text-sm text-text-muted mt-1">{total} total bookings</p>
                </div>
                <div className="flex gap-2">
                    {(["", "Pending", "Confirmed", "Cancelled"] as const).map((s) => (
                        <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${statusFilter === s ? "bg-primary text-white" : "bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main"
                                }`}>
                            {s || "All"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center">
                    <span className="material-icons-outlined text-4xl text-slate-300 mb-3 block">confirmation_number</span>
                    <p className="text-sm text-text-muted">No bookings found.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {bookings.map((booking) => (
                            <div key={booking._id}
                                className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-card">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-text-main">
                                                {booking.listing?.title ?? "Unknown Listing"}
                                            </p>
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(booking.status)}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted">
                                            🧑 Buyer: <span className="font-medium">{booking.buyer?.name}</span> · {booking.buyer?.email}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            🏢 {booking.listing?.type} · {booking.listing?.category} ·{" "}
                                            <span className="font-medium">${booking.listing?.price?.toLocaleString()}</span>
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            📅 Visit: {new Date(booking.visitDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                        </p>
                                    </div>

                                    {/* Status actions for pending */}
                                    {booking.status === "Pending" && (
                                        <div className="flex gap-2 shrink-0">
                                            <button onClick={() => updateStatus(booking._id, "Confirmed")}
                                                disabled={updating === booking._id}
                                                className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                                Confirm
                                            </button>
                                            <button onClick={() => updateStatus(booking._id, "Cancelled")}
                                                disabled={updating === booking._id}
                                                className="px-3 py-1.5 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 text-red-600 text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {total > 20 && (
                        <div className="flex items-center justify-center gap-2">
                            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-text-muted disabled:opacity-40">← Prev</button>
                            <span className="text-xs text-text-muted">Page {page} of {Math.ceil(total / 20)}</span>
                            <button onClick={() => setPage((p) => p + 1)} disabled={page >= Math.ceil(total / 20)}
                                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-text-muted disabled:opacity-40">Next →</button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
