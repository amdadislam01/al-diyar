"use client";

import { useEffect, useState } from "react";

type BookingStatus = "Pending" | "Confirmed" | "Cancelled";

interface Booking {
    _id: string;
    listing: {
        _id: string;
        title: string;
        type: string;
        category: string;
        price: number;
    } | null;
    buyer: {
        name: string;
        email: string;
        phone?: string;
    } | null;
    visitDate: string;
    message?: string;
    status: BookingStatus;
    createdAt: string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: string }> = {
    Pending: { label: "Pending", color: "text-warning bg-warning/10 border-warning/30", icon: "schedule" },
    Confirmed: { label: "Confirmed", color: "text-success bg-success/10 border-success/30", icon: "check_circle" },
    Cancelled: { label: "Cancelled", color: "text-danger bg-danger/10 border-danger/30", icon: "cancel" },
};

export default function SellerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [updating, setUpdating] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const url = statusFilter !== "all"
                ? `/api/seller/bookings?status=${statusFilter}`
                : "/api/seller/bookings";
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setBookings(data.bookings);
            else showToast(data.message || "Failed to load bookings", "error");
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, [statusFilter]);

    const handleUpdateStatus = async (bookingId: string, newStatus: "Confirmed" | "Cancelled") => {
        setUpdating(bookingId);
        try {
            const res = await fetch("/api/seller/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, status: newStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setBookings((prev) =>
                    prev.map((b) => (b._id === bookingId ? { ...b, status: newStatus } : b))
                );
                showToast(`Booking ${newStatus.toLowerCase()} successfully`, "success");
            } else {
                showToast(data.message || "Update failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        } finally {
            setUpdating(null);
        }
    };

    const pendingCount = bookings.filter((b) => b.status === "Pending").length;

    return (
        <div className="p-6 space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-reveal
            ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
                >
                    <span className="material-icons-outlined text-base">
                        {toast.type === "success" ? "check_circle" : "error"}
                    </span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">
                        Booking Requests
                        {pendingCount > 0 && (
                            <span className="bg-accent text-white text-xs px-2.5 py-0.5 rounded-full font-bold">
                                {pendingCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        View and respond to visit requests from buyers
                    </p>
                </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
                {(["Pending", "Confirmed", "Cancelled"] as BookingStatus[]).map((s) => {
                    const count = bookings.filter((b) => b.status === s).length;
                    const cfg = STATUS_CONFIG[s];
                    return (
                        <div key={s} className={`rounded-2xl border px-5 py-4 shadow-card bg-surface dark:bg-surface-dark ${cfg.color}`}>
                            <p className="text-xs font-medium opacity-70">{cfg.label}</p>
                            <p className="text-3xl font-bold mt-1">{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap">
                {["all", "Pending", "Confirmed", "Cancelled"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${statusFilter === f
                                ? "bg-primary text-white border-primary"
                                : "bg-surface dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-text-muted hover:border-primary hover:text-primary"
                            }`}
                    >
                        {f === "all" ? "All" : f}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-28 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <span className="material-icons-outlined text-6xl text-slate-300 dark:text-slate-600">
                        event_busy
                    </span>
                    <p className="text-text-muted text-lg font-medium">No booking requests yet</p>
                    <p className="text-sm text-text-muted max-w-xs">
                        When buyers request visits to your properties, they will appear here.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const cfg = STATUS_CONFIG[booking.status];
                        const isPending = booking.status === "Pending";
                        const isUpdating = updating === booking._id;

                        return (
                            <div
                                key={booking._id}
                                className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    {/* Left: listing + buyer info */}
                                    <div className="space-y-3 flex-1 min-w-0">
                                        {/* Listing info */}
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                                <span className="material-icons-outlined text-primary text-lg">apartment</span>
                                            </div>
                                            <div className="min-w-0">
                                                <p className="font-semibold text-text-main text-sm leading-snug line-clamp-1">
                                                    {booking.listing?.title ?? "Deleted Listing"}
                                                </p>
                                                <p className="text-xs text-text-muted mt-0.5">
                                                    {booking.listing?.category} · {booking.listing?.type} ·{" "}
                                                    {booking.listing?.price?.toLocaleString()} BDT
                                                </p>
                                            </div>
                                        </div>

                                        {/* Buyer info */}
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                                <span className="material-icons-outlined text-accent text-base">person</span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-text-main">
                                                    {booking.buyer?.name ?? "Unknown Buyer"}
                                                </p>
                                                <p className="text-xs text-text-muted">{booking.buyer?.email}</p>
                                            </div>
                                        </div>

                                        {/* Visit date & message */}
                                        <div className="flex flex-wrap gap-4 text-xs text-text-muted">
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">calendar_month</span>
                                                {new Date(booking.visitDate).toLocaleDateString("en-US", {
                                                    weekday: "short", year: "numeric", month: "short", day: "numeric",
                                                })}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">access_time</span>
                                                Requested {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>

                                        {booking.message && (
                                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl px-4 py-3 text-sm text-text-muted italic border border-slate-200 dark:border-slate-700">
                                                "{booking.message}"
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: status badge + actions */}
                                    <div className="flex flex-col items-start sm:items-end gap-3 shrink-0">
                                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${cfg.color}`}>
                                            <span className="material-icons-outlined text-sm">{cfg.icon}</span>
                                            {cfg.label}
                                        </span>

                                        {isPending && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUpdateStatus(booking._id, "Confirmed")}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-1.5 px-4 py-2 bg-success text-white rounded-xl text-xs font-semibold hover:bg-success/80 transition-colors disabled:opacity-50"
                                                >
                                                    {isUpdating ? (
                                                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                    ) : (
                                                        <span className="material-icons-outlined text-sm">check</span>
                                                    )}
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleUpdateStatus(booking._id, "Cancelled")}
                                                    disabled={isUpdating}
                                                    className="flex items-center gap-1.5 px-4 py-2 border border-danger text-danger rounded-xl text-xs font-semibold hover:bg-danger/10 transition-colors disabled:opacity-50"
                                                >
                                                    {isUpdating ? (
                                                        <span className="w-3.5 h-3.5 border-2 border-danger/30 border-t-danger rounded-full animate-spin" />
                                                    ) : (
                                                        <span className="material-icons-outlined text-sm">close</span>
                                                    )}
                                                    Decline
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
