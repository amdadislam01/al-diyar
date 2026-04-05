"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { getAdminAnalytics } from "./actions";

interface AnalyticsData {
    kpis: Array<{ label: string; value: string; change: string; icon: string; color: string; bg: string }>;
    userEngagement: number[];
    listingDistribution: Array<{ label: string; value: number; color: string }>;
    topListings: Array<{ id: string; title: string; views: number; change: string; image: string }>;
}

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const result = await getAdminAnalytics();
                // Ensure typed response
                setData(result as AnalyticsData);
            } catch (error) {
                console.error("Failed to load analytics:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    if (loading) return (
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
            <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-text-muted">Analyzing market data...</p>
            </div>
        </div>
    );

    if (!data) return (
         <div className="p-6 flex items-center justify-center min-h-[60vh]">
            <p className="text-red-500 font-medium">Failed to load analytics data.</p>
        </div>
    );

    return (
        <div className="p-6 space-y-8 ">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main tracking-tight">Marketplace Analytics</h1>
                    <p className="text-sm text-text-muted mt-1">Real-time performance metrics for Al-Diyar platform</p>
                </div>
                <div className="flex items-center gap-2 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-1 rounded-xl">
                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white shadow-sm">Daily</button>
                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-text-muted hover:text-text-main transition-colors">Weekly</button>
                    <button className="px-4 py-1.5 text-xs font-semibold rounded-lg text-text-muted hover:text-text-main transition-colors">Monthly</button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {data.kpis?.map((kpi, i) => (
                    <div key={i} className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 rounded-2xl p-5 shadow-card hover:shadow-lg transition-all duration-300 group">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                                <span className="material-icons-outlined text-xl">{kpi.icon}</span>
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${kpi.change.startsWith("+") ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600" : "bg-rose-100 dark:bg-rose-900/30 text-rose-600"}`}>
                                {kpi.change}
                            </span>
                        </div>
                        <p className="text-xs font-medium text-text-muted uppercase tracking-wider">{kpi.label}</p>
                        <p className="text-2xl font-bold text-text-main mt-1">{kpi.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Chart */}
                <div className="lg:col-span-2 bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 shadow-card">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-lg font-bold text-text-main">User Engagement</h2>
                            <p className="text-xs text-text-muted mt-0.5">Overview of active users per day</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-primary"></div>
                                <span className="text-[10px] font-medium text-text-muted">Active Users</span>
                            </div>
                        </div>
                    </div>

                    <div className="h-64 flex items-end justify-between gap-3 px-2">
                        {data.userEngagement?.map((val, i) => (
                            <div key={i} className="relative flex-1 group">
                                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                    {val} Users
                                </div>
                                <div
                                    className="w-full bg-primary/20 hover:bg-primary transition-all duration-300 rounded-t-xl cursor-pointer"
                                    style={{ height: `${Math.max((val / (Math.max(...(data.userEngagement || [0]), 1) * 1.2)) * 100, 5)}%` }}
                                ></div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-6 text-xs text-text-muted font-bold px-4">
                        {Array.from({ length: 7 }, (_, i) => {
                            const d = new Date();
                            d.setDate(d.getDate() - (6 - i));
                            return d.toLocaleDateString('en-US', { weekday: 'short' });
                        }).map(day => <span key={day}>{day}</span>)}
                    </div>
                </div>

                {/* Listing Stats */}
                <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 rounded-3xl p-6 shadow-card">
                    <h2 className="text-lg font-bold text-text-main mb-6">Listing Distribution</h2>
                    <div className="space-y-5">
                        {data.listingDistribution?.map((item, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-xs font-semibold">
                                    <span className="text-text-muted">{item.label}</span>
                                    <span className="text-text-main">{item.value}%</span>
                                </div>
                                <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color} rounded-full transition-all duration-1000`} style={{ width: `${item.value}%` }}></div>
                                </div>
                            </div>
                        ))}
                        {(!data.listingDistribution || data.listingDistribution.length === 0) && (
                            <p className="text-xs text-text-muted italic">No listing data available</p>
                        )}
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/5">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                            <div>
                                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400">Pro Tip</p>
                                <p className="text-[11px] text-indigo-700/70 dark:text-indigo-300/60 mt-0.5 leading-snug">
                                    Saturdays see 20% more engagement on listings.
                                </p>
                            </div>
                            <span className="material-icons-outlined text-indigo-400">lightbulb</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Top Listings Table */}
            <div className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700/50 rounded-3xl shadow-card overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-text-main">Top Performing Listings</h2>
                        <p className="text-xs text-text-muted mt-0.5">Listings with the highest view counts this week</p>
                    </div>
                    <button className="text-xs font-bold text-primary hover:underline">View All</button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 dark:bg-white/5 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                                <th className="px-6 py-4">Property</th>
                                <th className="px-6 py-4">Total Views</th>
                                <th className="px-6 py-4">Performance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                            {data.topListings?.map((listing) => (
                                <tr key={listing.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-10 rounded-lg overflow-hidden shrink-0 border border-slate-200 dark:border-white/10 shadow-sm">
                                                <Image src={listing.image} alt="" fill className="object-cover" />
                                            </div>
                                            <p className="text-sm font-semibold text-text-main leading-tight truncate max-w-[200px]">
                                                {listing.title}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <span className="material-icons-outlined text-lg text-text-muted/60">visibility</span>
                                            <span className="text-sm font-bold text-text-main">{listing.views.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <span className={`material-icons-outlined text-base ${listing.change.startsWith("+") ? "text-emerald-500" : "text-rose-500"}`}>
                                                {listing.change.startsWith("+") ? "trending_up" : "trending_down"}
                                            </span>
                                            <span className={`text-[11px] font-bold ${listing.change.startsWith("+") ? "text-emerald-600" : "text-rose-600"}`}>
                                                {listing.change}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-text-muted hover:text-primary transition-colors">
                                            <span className="material-icons-outlined text-lg">open_in_new</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {(!data.topListings || data.topListings.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-sm text-text-muted italic">
                                        No trending listings yet
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
