"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

type BookingStatus = "PendingSeller" | "Confirmed" | "Completed" | "Cancelled";

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
    agent: {
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
    PendingSeller: { label: "Pending Confirmation", color: "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200", icon: "schedule" },
    Confirmed: { label: "Confirmed", color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200", icon: "check_circle" },
    Completed: { label: "Completed", color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200", icon: "task_alt" },
    Cancelled: { label: "Cancelled", color: "text-slate-500 bg-slate-50 dark:bg-slate-900/20 border-slate-200", icon: "cancel" },
};

export default function SellerBookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [updating, setUpdating] = useState<string | null>(null);

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/seller/bookings");
            const data = await res.json();
            if (res.ok) setBookings(data.bookings);
            else toast.error(data.message || "Failed to load bookings");
        } catch {
            toast.error("Network error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleConfirmVisit = async (bookingId: string) => {
        const { value: date } = await Swal.fire({
            title: 'Confirm Visit Date',
            input: 'date',
            inputLabel: 'Select the scheduled date for this visit',
            inputValue: new Date().toISOString().split('T')[0],
            showCancelButton: true,
            confirmButtonColor: '#0ea5e9'
        });

        if (!date) return;

        setUpdating(bookingId);
        try {
            const res = await fetch("/api/seller/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, visitDate: date }),
            });
            const data = await res.json();
            if (res.ok) {
                fetchBookings();
                toast.success("Visit confirmed successfully");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setUpdating(null);
        }
    };

    const handleCompleteVisit = async (bookingId: string) => {
        const { isConfirmed } = await Swal.fire({
            title: 'Complete Visit?',
            text: 'Are you sure you want to mark this visit as completed? This will allow the buyer to proceed with payment.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, complete it!',
            confirmButtonColor: '#0ea5e9'
        });

        if (!isConfirmed) return;

        setUpdating(bookingId);
        try {
            const res = await fetch("/api/seller/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            const data = await res.json();
            if (res.ok) {
                fetchBookings();
                toast.success("Visit marked as completed");
            } else {
                toast.error(data.message || "Update failed");
            }
        } catch {
            toast.error("Network error");
        } finally {
            setUpdating(null);
        }
    };

    const filteredBookings = statusFilter === "all" ? bookings : bookings.filter(b => b.status === statusFilter);

    return (
        <div className="p-6 space-y-6">

            <div>
                <h1 className="text-2xl font-bold text-text-main flex items-center gap-2">Property Visits</h1>
                <p className="text-sm text-text-muted mt-0.5">Manage visit confirmations and completions for your properties</p>
            </div>

            <div className="flex gap-2 flex-wrap">
                {["all", "PendingSeller", "Confirmed", "Completed", "Cancelled"].map((f) => (
                    <button key={f} onClick={() => setStatusFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition-all border ${statusFilter === f ? "bg-primary text-white border-primary" : "bg-surface dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-text-muted hover:border-primary hover:text-primary"}`}>
                        {f === "all" ? "All" : f.replace(/([A-Z])/g, ' $1').trim()}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <span className="material-icons-outlined text-6xl text-slate-300 dark:text-slate-600">event_busy</span>
                    <p className="text-text-muted text-lg font-medium">No requests in this category</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredBookings.map((booking) => {
                        const cfg = STATUS_CONFIG[booking.status];
                        return (
                            <div key={booking._id} className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-card space-y-4">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="min-w-0">
                                        <p className="font-bold text-text-main text-sm truncate">{booking.listing?.title ?? "Property"}</p>
                                        <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{booking.listing?.category} · {booking.listing?.price?.toLocaleString()} BDT</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border ${cfg.color}`}>
                                        {cfg.label}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50 dark:border-slate-800">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Buyer</p>
                                        <p className="text-xs font-bold text-text-main line-clamp-1">{booking.buyer?.name}</p>
                                        <p className="text-[10px] text-text-muted mt-0.5 truncate">{booking.buyer?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Agent</p>
                                        <p className="text-xs font-bold text-text-main line-clamp-1">{booking.agent?.name ?? "No Agent"}</p>
                                        <p className="text-[10px] text-text-muted mt-0.5 truncate">{booking.agent?.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 text-[11px] font-bold text-text-muted">
                                    <span className="flex items-center gap-1.5"><span className="material-icons-outlined text-sm">calendar_month</span> {new Date(booking.visitDate).toLocaleDateString()}</span>
                                    <span className="flex items-center gap-1.5"><span className="material-icons-outlined text-sm">update</span> Requested {new Date(booking.createdAt).toLocaleDateString()}</span>
                                </div>

                                {booking.status === "PendingSeller" && (
                                    <button onClick={() => handleConfirmVisit(booking._id)} disabled={updating === booking._id}
                                        className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50">
                                        Confirm Visit Date
                                    </button>
                                )}

                                {booking.status === "Confirmed" && (
                                    <button onClick={() => handleCompleteVisit(booking._id)} disabled={updating === booking._id}
                                        className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all disabled:opacity-50">
                                        Mark Visit Completed
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
