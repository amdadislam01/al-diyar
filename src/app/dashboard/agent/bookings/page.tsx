"use client";

import { useEffect, useState, useCallback } from "react";

interface Booking {
    _id: string;
    listing: { title: string; type: string; category: string; price: number } | null;
    buyer: { name: string; email: string } | null;
    visitDate: string;
    message?: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt: string;
}

const statusBadge = (status: string) => {
    if (status === "Confirmed") return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
    if (status === "Cancelled") return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
    return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
};

export default function AgentBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<"" | "Pending" | "Confirmed" | "Cancelled">("");

    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const url = filter ? `/api/agent/bookings?status=${filter}` : "/api/agent/bookings";
            const res = await fetch(url);
            const data = await res.json();
            setBookings(data.bookings ?? []);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const updateStatus = async (bookingId: string, status: "Confirmed" | "Cancelled") => {
        setUpdating(bookingId);
        try {
            await fetch("/api/agent/bookings", {
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
                    <h1 className="text-2xl font-bold text-text-main">Bookings</h1>
                    <p className="text-sm text-text-muted mt-1">Visit requests from clients for your listings</p>
                </div>
                <div className="flex gap-2">
                    {(["", "Pending", "Confirmed", "Cancelled"] as const).map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === s ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main"
                                }`}>
                            {s || "All"}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : bookings.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center">
                    <span className="material-icons-outlined text-4xl text-emerald-400 mb-3 block">confirmation_number</span>
                    <h3 className="text-lg font-semibold text-text-main mb-1">No bookings yet</h3>
                    <p className="text-sm text-text-muted">Visit requests will appear here once clients book your listings.</p>
                </div>
            ) : (
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
                                        🧑 <span className="font-medium">{booking.buyer?.name}</span> · {booking.buyer?.email}
                                    </p>
                                    <p className="text-xs text-text-muted">
                                        📅 Visit: {new Date(booking.visitDate).toLocaleDateString("en-US", { dateStyle: "medium" })}
                                    </p>
                                    {booking.message && (
                                        <p className="text-xs text-slate-400 italic">"{booking.message}"</p>
                                    )}
                                </div>

                                {booking.status === "Pending" && (
                                    <div className="flex gap-2 shrink-0">
                                        <button
                                            onClick={() => updateStatus(booking._id, "Confirmed")}
                                            disabled={updating === booking._id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                            <span className="material-icons-outlined text-sm">check</span>
                                            Confirm
                                        </button>
                                        <button
                                            onClick={() => updateStatus(booking._id, "Cancelled")}
                                            disabled={updating === booking._id}
                                            className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50">
                                            <span className="material-icons-outlined text-sm">close</span>
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
