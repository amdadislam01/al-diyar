"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

interface Booking {
    _id: string;
    listing: { title: string; type: string; category: string; price: number; listedBy?: any } | null;
    buyer: { name: string; email: string } | null;
    seller: { _id: string; name: string; email: string } | null;
    visitDate: string;
    message?: string;
    status: "PendingAgent" | "PendingSeller" | "Confirmed" | "Completed" | "Cancelled";
    createdAt: string;
}

const statusBadge = (status: string) => {
    switch (status) {
        case "Confirmed": return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
        case "Completed": return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
        case "PendingAgent": return "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400";
        case "PendingSeller": return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400";
        case "Cancelled": return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400";
        case "Expired": return "bg-slate-100 dark:bg-slate-800 text-slate-500";
        default: return "bg-slate-100 dark:bg-slate-800 text-slate-500";
    }
};

export default function AgentBookingsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>("");

    // Let's grab all the property visit requests that this agent is responsible for.
    const fetchBookings = useCallback(async () => {
        setLoading(true);
        try {
            const url = "/api/agent/bookings";
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setBookings(data.bookings ?? []);
        } catch {
            toast.error("We had trouble loading the visit requests. Please try again.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchBookings(); }, [fetchBookings]);

    const forwardToSeller = async (bookingId: string) => {
        // Before forwarding to the seller, we need to make sure the agent is certain.
        const { isConfirmed } = await Swal.fire({
            title: "Forward to Seller?",
            text: "This will send the visit request to the property owner for them to confirm the date.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, forward it!",
            confirmButtonColor: "#0ea5e9"
        });

        if (!isConfirmed) return;

        setUpdating(bookingId);
        try {
            const res = await fetch("/api/agent/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            if (res.ok) {
                toast.success("Request sent to the seller!");
                fetchBookings();
            }
        } finally {
            setUpdating(null);
        }
    };

    const confirmVisit = async (bookingId: string) => {
        // Since the agent owns this property, they can skip the "Forward to Seller" step 
        // and pick a scheduled date right now.
        const { value: date } = await Swal.fire({
            title: "Pick a Visit Date",
            input: "date",
            inputLabel: "When should the buyer come to see the property?",
            inputValue: new Date().toISOString().split("T")[0],
            showCancelButton: true,
            confirmButtonColor: "#10b981"
        });

        if (!date) return;

        setUpdating(bookingId);
        try {
            const res = await fetch("/api/seller/bookings", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId, visitDate: date }),
            });
            if (res.ok) {
                toast.success("The visit date has been set and confirmed!");
                fetchBookings();
            }
        } finally {
            setUpdating(null);
        }
    };

    const completeVisit = async (bookingId: string) => {
        // Once the visitor has seen the property, marking it as "Completed" 
        // enables the "Pay" button for the buyer.
        const { isConfirmed } = await Swal.fire({
            title: "Mark Visit as Finished?",
            text: "Is the property visit done? This will allow the buyer to proceed with the final payment.",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, it's done!",
            confirmButtonColor: "#3b82f6"
        });

        if (!isConfirmed) return;

        setUpdating(bookingId);
        try {
            const res = await fetch("/api/seller/bookings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            if (res.ok) {
                toast.success("Property visit marked as completed!");
                fetchBookings();
            }
        } finally {
            setUpdating(null);
        }
    };

    const cancelBooking = async (bookingId: string) => {
        const { isConfirmed } = await Swal.fire({
            title: "Cancel Booking?",
            text: "Are you sure you want to cancel this request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it!",
            confirmButtonColor: "#ef4444", // red-500
        });

        if (!isConfirmed) return;

        setUpdating(bookingId);
        try {
            await fetch("/api/user/bookings", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            fetchBookings();
        } finally {
            setUpdating(null);
        }
    };

    const filteredBookings = filter ? bookings.filter(b => b.status === filter) : bookings;

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-text-main">Visit Requests</h1>
                    <p className="text-sm text-text-muted mt-1">Manage property visit requests from buyers</p>
                </div>
                <div className="flex gap-2">
                    {(["", "PendingAgent", "PendingSeller", "Confirmed", "Completed", "Cancelled", "Expired"] as const).map((s) => (
                        <button key={s} onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${filter === s ? "bg-emerald-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-text-muted hover:text-text-main"
                                }`}>
                            {s === "" ? "All" : s.replace(/([A-Z])/g, ' $1').trim()}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-24 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-16 text-center">
                    <span className="material-icons-outlined text-4xl text-emerald-400 mb-3 block">confirmation_number</span>
                    <h3 className="text-lg font-semibold text-text-main mb-1">No requests found</h3>
                    <p className="text-sm text-text-muted">New visit requests will appear here once buyers schedule them.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredBookings.map((booking) => {
                        const isOwner = session?.user?.id === booking.seller?._id;
                        
                        return (
                            <div key={booking._id}
                                className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-4 shadow-card">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0 space-y-1">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-text-main">
                                                {booking.listing?.title ?? "Unknown Listing"}
                                                {isOwner && <span className="ml-2 text-[10px] bg-sky-100 dark:bg-sky-900/30 text-sky-600 uppercase px-1.5 py-0.5 rounded-md">My Property</span>}
                                            </p>
                                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${statusBadge(booking.status)}`}>
                                                {booking.status.replace(/([A-Z])/g, ' $1').trim()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-muted">
                                            🧑 Buyer: <span className="font-medium text-text-main">{booking.buyer?.name}</span> · {booking.buyer?.email}
                                        </p>
                                        <p className="text-xs text-text-muted">
                                            📅 Visit Date: <span className="text-text-main font-medium">{new Date(booking.visitDate).toLocaleDateString("en-US", { dateStyle: "medium" })}</span>
                                        </p>
                                        {booking.message && (
                                            <p className="text-xs text-slate-400 italic">"{booking.message}"</p>
                                        )}
                                    </div>

                                    <div className="flex gap-2 shrink-0">
                                        {booking.status === "PendingAgent" && (
                                            <>
                                                {isOwner ? (
                                                    <button
                                                        onClick={() => confirmVisit(booking._id)}
                                                        disabled={updating === booking._id}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                                        <span className="material-icons-outlined text-sm">check</span>
                                                        Confirm Visit
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => forwardToSeller(booking._id)}
                                                        disabled={updating === booking._id}
                                                        className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                                        <span className="material-icons-outlined text-sm">forward</span>
                                                        Forward to Seller
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {booking.status === "Confirmed" && isOwner && (
                                            <button
                                                onClick={() => completeVisit(booking._id)}
                                                disabled={updating === booking._id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors disabled:opacity-50">
                                                <span className="material-icons-outlined text-sm">task_alt</span>
                                                Mark Completed
                                            </button>
                                        )}

                                        {(booking.status === "PendingAgent" || booking.status === "Confirmed") && (
                                            <button
                                                onClick={() => cancelBooking(booking._id)}
                                                disabled={updating === booking._id}
                                                className="flex items-center gap-1 px-3 py-1.5 bg-red-100 dark:bg-red-900/20 text-red-600 text-xs font-semibold rounded-xl hover:bg-red-200 transition-colors disabled:opacity-50">
                                                <span className="material-icons-outlined text-sm">close</span>
                                                Cancel
                                            </button>
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
