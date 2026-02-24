"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Booking {
    _id: string;
    listing: {
        _id: string;
        title: string;
        price: number;
        type: string;
        category: string;
        location?: { address?: string };
        images: string[];
    };
    visitDate: string;
    status: "Pending" | "Confirmed" | "Cancelled";
}

export default function VisitsPage() {
    const [visits, setVisits] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/user/bookings")
            .then((r) => r.json())
            .then((d) => {
                const now = new Date();
                const upcoming = (d.bookings ?? []).filter(
                    (b: Booking) =>
                        new Date(b.visitDate) >= now &&
                        (b.status === "Pending" || b.status === "Confirmed")
                );
                setVisits(upcoming);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="p-6 lg:p-10 max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Scheduled Visits</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Your upcoming property visits
                </p>
            </div>

            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map((i) => (
                        <div key={i} className="h-24 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : visits.length === 0 ? (
                <div className="flex flex-col items-center gap-4 py-20 text-center">
                    <span className="material-icons-outlined text-5xl text-slate-300 dark:text-slate-600">calendar_month</span>
                    <p className="text-slate-500 dark:text-slate-400">No upcoming visits scheduled.</p>
                    <Link
                        href="/properties"
                        className="text-sm bg-primary text-white px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                        Browse Properties
                    </Link>
                </div>
            ) : (
                <div className="space-y-4">
                    {visits.map((v) => {
                        const date = new Date(v.visitDate);
                        const isToday =
                            date.toDateString() === new Date().toDateString();
                        const isTomorrow =
                            date.toDateString() ===
                            new Date(Date.now() + 86400000).toDateString();
                        const dayLabel = isToday ? "Today" : isTomorrow ? "Tomorrow" : null;

                        return (
                            <div
                                key={v._id}
                                className="flex items-center gap-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-5"
                            >
                                {/* Date badge */}
                                <div className="shrink-0 w-14 text-center bg-primary/10 rounded-xl py-2 px-1">
                                    <p className="text-[10px] text-primary font-semibold uppercase tracking-wide">
                                        {date.toLocaleDateString("en-GB", { month: "short" })}
                                    </p>
                                    <p className="text-xl font-bold text-primary leading-none">
                                        {date.getDate()}
                                    </p>
                                    <p className="text-[10px] text-primary/70">
                                        {date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                                    </p>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">
                                            {v.listing?.title ?? "Property"}
                                        </p>
                                        {dayLabel && (
                                            <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                                                {dayLabel}
                                            </span>
                                        )}
                                    </div>
                                    {v.listing?.location?.address && (
                                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                                            <span className="material-icons-outlined text-sm">place</span>
                                            {v.listing.location.address}
                                        </p>
                                    )}
                                    <p className="text-xs text-slate-400 mt-0.5">
                                        {v.listing?.category} · {v.listing?.type}
                                    </p>
                                </div>

                                {/* Status */}
                                <span
                                    className={`shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-full ${v.status === "Confirmed"
                                            ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                            : "bg-orange-50 dark:bg-orange-900/20 text-orange-500 dark:text-orange-400"
                                        }`}
                                >
                                    {v.status}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
