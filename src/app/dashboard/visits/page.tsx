"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

type BookingStatus = "PendingAgent" | "PendingSeller" | "Confirmed" | "Completed" | "Cancelled" | "Expired";

interface Booking {
    _id: string;
    listing: {
        _id: string;
        title: string;
        type: string;
        category: string;
        price: number;
        images: string[];
    } | null;
    seller: {
        name: string;
        email: string;
        phone?: string;
        image?: string;
    } | null;
    visitDate: string;
    message?: string;
    status: BookingStatus;
    createdAt: string;
}

const STATUS_CONFIG: Record<BookingStatus, { label: string; color: string; icon: string }> = {
    PendingAgent: { label: "Waiting Agent", color: "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/30", icon: "schedule" },
    PendingSeller: { label: "Waiting Seller", color: "text-indigo-600 bg-indigo-50 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-900/30", icon: "forward" },
    Confirmed: { label: "Confirmed", color: "text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-900/30", icon: "check_circle" },
    Completed: { label: "Completed", color: "text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-900/30", icon: "task_alt" },
    Cancelled: { label: "Cancelled", color: "text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-900/20 dark:border-rose-900/30", icon: "cancel" },
    Expired: { label: "Expired", color: "text-slate-500 bg-slate-50 border-slate-200 dark:bg-slate-900/20 dark:border-slate-900/30", icon: "history" },
};

export default function VisitsPage() {
    const { data: session } = useSession();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchBookings = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/bookings");
            const data = await res.json();
            if (res.ok) {
                setBookings(data.bookings);
            } else {
                showToast(data.message || "Failed to load bookings", "error");
            }
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (session) fetchBookings();
    }, [session]);

    const filteredBookings = statusFilter === "all" 
        ? bookings 
        : bookings.filter(b => b.status === statusFilter);

    return (
        <div className="p-6 space-y-8 mx-auto">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-reveal ${toast.type === "success" ? "bg-emerald-500" : "bg-rose-500"}`}>
                    <span className="material-icons-outlined text-base">
                        {toast.type === "success" ? "check_circle" : "error"}
                    </span>
                    {toast.msg}
                </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white flex items-center gap-3">
                        Scheduled Visits
                        <span className="bg-sky-500 text-white text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest">
                            {bookings.length} Total
                        </span>
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">
                        Track and manage your scheduled property visits
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2 flex-wrap bg-slate-100/50 dark:bg-slate-800/50 p-1.5 rounded-2xl w-fit border border-slate-200 dark:border-slate-700">
                {[
                    { id: "all", label: "All Requests" },
                    { id: "PendingAgent", label: "Waiting Agent" },
                    { id: "PendingSeller", label: "Waiting Seller" },
                    { id: "Confirmed", label: "Confirmed" },
                    { id: "Completed", label: "Completed" },
                    { id: "Cancelled", label: "Cancelled" },
                ].map((f) => (
                    <button
                        key={f.id}
                        onClick={() => setStatusFilter(f.id)}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all
                        ${statusFilter === f.id
                                ? "bg-white dark:bg-slate-700 text-sky-500 shadow-sm"
                                : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                            }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-64 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
                    ))}
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-6 text-center bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-xl">
                    <div className="w-20 h-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                        <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600">
                            event_busy
                        </span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-slate-900 dark:text-white text-xl font-black uppercase tracking-tight">No visits found</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs font-medium">
                            {statusFilter === "all" 
                                ? "You haven't requested any property visits yet. Explore listings to get started!" 
                                : `You don't have any ${statusFilter.toLowerCase()} visit requests.`}
                        </p>
                    </div>
                    <Link href="/property" className="px-8 py-4 bg-sky-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-sky-600 transition-all shadow-lg shadow-sky-500/25">
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredBookings.map((booking) => {
                        const cfg = STATUS_CONFIG[booking.status];
                        const listing = booking.listing;
                        const seller = booking.seller;

                        return (
                            <div
                                key={booking._id}
                                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-xl hover:shadow-2xl transition-all group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
                                
                                <div className="flex flex-col h-full gap-6">
                                    {/* Top Section: Listing Info */}
                                    <div className="flex gap-4">
                                        <div className="relative w-24 h-24 rounded-3xl overflow-hidden shrink-0 shadow-lg ring-4 ring-slate-50 dark:ring-slate-800">
                                            <Image
                                                src={listing?.images?.[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"}
                                                alt={listing?.title || "Property"}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] font-black uppercase tracking-widest bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full">
                                                    {listing?.category || "Property"}
                                                </span>
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${cfg.color}`}>
                                                    <span className="material-icons-outlined text-[10px]">{cfg.icon}</span>
                                                    {cfg.label}
                                                </span>
                                            </div>
                                            <Link href={`/property/${listing?._id}`} className="font-black text-slate-900 dark:text-white text-base leading-snug hover:text-sky-500 transition-colors line-clamp-1 truncate uppercase tracking-tight">
                                                {listing?.title || "Deleted Property"}
                                            </Link>
                                            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                {listing?.type} · {listing?.price?.toLocaleString()}$
                                            </p>
                                        </div>
                                    </div>

                                    {/* Middle Section: Visit Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                                <span className="material-icons-outlined text-[10px]">calendar_month</span>
                                                Visit Date
                                            </p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-tighter">
                                                {new Date(booking.visitDate).toLocaleDateString("en-US", {
                                                    weekday: "short", month: "short", day: "numeric", year: "numeric"
                                                })}
                                            </p>
                                        </div>
                                        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-3xl border border-slate-100 dark:border-slate-700/50">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1">
                                                <span className="material-icons-outlined text-[10px]">person</span>
                                                Contact
                                            </p>
                                            <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter">
                                                {seller?.name || "The Seller"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Message */}
                                    {booking.message && (
                                        <div className="bg-sky-50/50 dark:bg-sky-900/10 p-4 rounded-3xl border border-sky-100/50 dark:border-sky-900/20">
                                            <p className="text-[10px] font-medium text-slate-600 dark:text-sky-400/80 italic leading-relaxed">
                                                "{booking.message}"
                                            </p>
                                        </div>
                                    )}

                                    {/* Footer */}
                                    <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                                            Requested on {new Date(booking.createdAt).toLocaleDateString()}
                                        </p>
                                        <Link 
                                            href={`/property/${listing?._id}`}
                                            className="text-[10px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
                                        >
                                            View Property <span className="material-icons-round text-xs">arrow_forward</span>
                                        </Link>
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
