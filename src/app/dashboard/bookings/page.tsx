"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

interface Listing {
    _id: string;
    title: string;
    price: number;
    type: string;
    category: string;
    location?: { address?: string };
    images: string[];
}

interface Booking {
    _id: string;
    listing: Listing;
    seller: { name: string; email: string };
    visitDate: string;
    message?: string;
    status: "Pending" | "Confirmed" | "Cancelled";
    createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
    Pending: "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-700/30",
    Confirmed: "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700/30",
    Cancelled: "bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700",
};

function BookingsContent() {
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get("status") ?? "all";

    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState(statusFilter);

    const fetchBookings = async () => {
        setLoading(true);
        const url = activeTab !== "all" ? `/api/user/bookings?status=${activeTab}` : "/api/user/bookings";
        const res = await fetch(url);
        const data = await res.json();
        setBookings(data.bookings ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, [activeTab]);

    const handleCancel = async (bookingId: string) => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        setCancelling(bookingId);
        try {
            const res = await fetch("/api/user/bookings", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            if (res.ok) {
                setBookings((prev) => prev.filter((b) => b._id !== bookingId));
            } else {
                const d = await res.json();
                alert(d.message ?? "Failed to cancel booking");
            }
        } finally {
            setCancelling(null);
        }
    };

    const tabs = [
        { key: "all", label: "All" },
        { key: "Pending", label: "Pending" },
        { key: "Confirmed", label: "Confirmed" },
        { key: "Cancelled", label: "Cancelled" },
    ];

    return (
        <div className="p-6 lg:p-10 max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Bookings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Manage your property visit bookings
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
                {tabs.map((t) => (
                    <button
                        key={t.key}
                        onClick={() => setActiveTab(t.key)}
                        className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === t.key
                                ? "border-primary text-primary"
                                : "border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-28 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : bookings.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <span className="material-icons-outlined text-5xl text-slate-300 dark:text-slate-600">confirmation_number</span>
                    <p className="text-slate-500 dark:text-slate-400">No bookings found.</p>
                    <Link href="/properties" className="text-sm bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors">
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => {
                        const listing = booking.listing;
                        return (
                            <div
                                key={booking._id}
                                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col md:flex-row"
                            >
                                {/* Image */}
                                <div className="w-full md:w-40 h-32 md:h-auto bg-slate-100 dark:bg-slate-800 shrink-0">
                                    {listing?.images?.[0] ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="material-icons-outlined text-3xl text-slate-300">home</span>
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="flex flex-1 flex-col md:flex-row gap-4 p-5">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 flex-wrap">
                                            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                                                {listing?.title ?? "Property"}
                                            </h3>
                                            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${STATUS_STYLES[booking.status]}`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <div className="mt-2 space-y-1">
                                            {listing?.location?.address && (
                                                <p className="text-xs text-slate-400 flex items-center gap-1">
                                                    <span className="material-icons-outlined text-sm">place</span>
                                                    {listing.location.address}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400 flex items-center gap-1">
                                                <span className="material-icons-outlined text-sm">calendar_today</span>
                                                Visit: {new Date(booking.visitDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                            {listing?.price && (
                                                <p className="text-xs text-primary font-semibold">
                                                    ${listing.price.toLocaleString()} · {listing.type} · {listing.category}
                                                </p>
                                            )}
                                            {booking.message && (
                                                <p className="text-xs text-slate-400 italic mt-1">&ldquo;{booking.message}&rdquo;</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    {booking.status === "Pending" && (
                                        <div className="flex md:flex-col justify-end gap-2 shrink-0">
                                            <button
                                                onClick={() => handleCancel(booking._id)}
                                                disabled={cancelling === booking._id}
                                                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-50 transition-colors"
                                            >
                                                <span className="material-icons-outlined text-sm">cancel</span>
                                                {cancelling === booking._id ? "Cancelling…" : "Cancel"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default function BookingsPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center text-slate-400">Loading…</div>}>
            <BookingsContent />
        </Suspense>
    );
}
