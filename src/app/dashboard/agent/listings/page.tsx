"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

interface Listing {
    _id: string;
    title: string;
    price: number;
    type: "Sale" | "Rent";
    category: string;
    status: "Active" | "Pending" | "Sold" | "Inactive";
    assignmentStatus: "pending" | "approved" | "rejected";
    location: { address?: string; lat: number; lng: number };
    images: string[];
    createdAt: string;
    listedBy: string | { _id: string; name: string };
}

export default function AgentListingsPage() {
    const { data: session } = useSession();
    const [listings, setListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [deleting, setDeleting] = useState<string | null>(null);
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3500);
    };

    const fetchListings = async () => {
        setLoading(true);
        try {
            const url = statusFilter !== "all"
                ? `/api/agent/listings?status=${statusFilter}`
                : "/api/agent/listings";
            const res = await fetch(url);
            const data = await res.json();
            if (res.ok) setListings(data.listings);
            else showToast(data.message || "Failed to load listings", "error");
        } catch {
            showToast("Network error", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchListings(); }, [statusFilter]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to delete this listing?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#10B981", // Emerald-500
            cancelButtonColor: "#64748B",
            confirmButtonText: "Yes, delete it!",
            background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
            color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#fff" : "#000",
        });

        if (result.isConfirmed) {
            setDeleting(id);
            try {
                const res = await fetch(`/api/agent/listings/${id}`, { method: "DELETE" });
                const data = await res.json();
                if (res.ok) {
                    setListings((prev) => prev.filter((l) => l._id !== id));
                    Swal.fire({
                        title: "Deleted!",
                        text: "Listing has been deleted.",
                        icon: "success",
                        timer: 2000,
                        showConfirmButton: false,
                        background: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#1e293b" : "#fff",
                        color: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "#fff" : "#000",
                    });
                } else {
                    showToast(data.message || "Delete failed", "error");
                }
            } catch {
                showToast("Network error", "error");
            } finally {
                setDeleting(null);
            }
        }
    };

    const handleToggleStatus = async (listing: Listing) => {
        const newStatus = listing.status === "Active" ? "Inactive" : "Active";
        try {
            const res = await fetch(`/api/agent/listings/${listing._id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                setListings((prev) =>
                    prev.map((l) => (l._id === listing._id ? { ...l, status: newStatus } : l))
                );
                showToast(`Listing marked as ${newStatus}`, "success");
            } else {
                showToast(data.message || "Update failed", "error");
            }
        } catch {
            showToast("Network error", "error");
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Toast */}
            {toast && (
                <div
                    className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-reveal
            ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
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
                    <h1 className="text-2xl font-bold text-text-main">Managed Listings</h1>
                    <p className="text-sm text-text-muted mt-0.5">
                        Manage all your property listings and assigned tasks
                    </p>
                </div>
                <Link
                    href="/dashboard/agent/listings/new"
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-md"
                >
                    <span className="material-icons-outlined text-base">add</span>
                    Add New Listing
                </Link>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {["all", "Active", "Inactive", "Pending", "Sold"].map((f) => (
                    <button
                        key={f}
                        onClick={() => setStatusFilter(f)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors
              ${statusFilter === f
                                ? "bg-emerald-600 text-white border-emerald-600"
                                : "bg-surface dark:bg-surface-dark border-slate-200 dark:border-slate-700 text-text-muted hover:border-emerald-600 hover:text-emerald-600"
                            }`}
                    >
                        {f === "all" ? "All" : f}
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-60 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
                    ))}
                </div>
            ) : listings.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                    <span className="material-icons-outlined text-6xl text-slate-300 dark:text-slate-600">
                        home_work
                    </span>
                    <p className="text-text-muted text-lg font-medium">No listings found</p>
                    <Link
                        href="/dashboard/agent/listings/new"
                        className="mt-2 inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        <span className="material-icons-outlined text-base">add</span>
                        Create your first listing
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                    {listings.map((listing) => {
                        const isListedByMe = typeof listing.listedBy === 'string' 
                            ? listing.listedBy === session?.user?.id
                            : listing.listedBy?._id === session?.user?.id;

                        return (
                            <div
                                key={listing._id}
                                className="bg-surface dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-card hover:shadow-premium transition-shadow group"
                            >
                                {/* Image */}
                                <div className="relative h-44 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                                    {listing.images?.[0] ? (
                                        <img
                                            src={listing.images[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full">
                                            <span className="material-icons-outlined text-5xl text-slate-300 dark:text-slate-600">
                                                image
                                            </span>
                                        </div>
                                    )}
                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${listing.type === 'Sale' ? 'bg-emerald-600' : 'bg-blue-600'} text-white`}>
                                            {listing.type}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase
                                            ${listing.status === "Active" ? "bg-green-600 text-white" : 
                                              listing.status === "Pending" ? "bg-amber-500 text-white" : "bg-slate-500 text-white"}`}>
                                            {listing.status}
                                        </span>
                                        {!isListedByMe && (
                                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-purple-600 text-white">
                                                Assigned
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-4 space-y-2">
                                    <h3 className="font-semibold text-text-main text-base leading-snug line-clamp-1">
                                        {listing.title}
                                    </h3>
                                    <p className="text-xs text-text-muted flex items-center gap-1">
                                        <span className="material-icons-outlined text-sm">location_on</span>
                                        {listing.location?.address || `${listing.location.lat}, ${listing.location.lng}`}
                                    </p>
                                    <p className="text-lg font-bold text-emerald-600">
                                        {listing.price.toLocaleString()} BDT
                                        {listing.type === "Rent" && (
                                            <span className="text-xs font-normal text-text-muted"> /mo</span>
                                        )}
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between px-4 pb-4 gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(listing)}
                                        className={`flex-1 text-[10px] font-bold uppercase px-3 py-2 rounded-lg border transition-colors
                                            ${listing.status === "Active"
                                                ? "border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/10"
                                                : "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/10"
                                            }`}
                                    >
                                        {listing.status === "Active" ? "Deactivate" : "Activate"}
                                    </button>
                                    <Link
                                        href={`/dashboard/agent/listings/${listing._id}/edit`}
                                        className="flex-1 text-[10px] font-bold uppercase px-3 py-2 rounded-lg border border-emerald-600 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 text-center transition-colors"
                                    >
                                        Edit
                                    </Link>
                                    {isListedByMe && (
                                        <button
                                            onClick={() => handleDelete(listing._id)}
                                            disabled={deleting === listing._id}
                                            className="flex-1 text-[10px] font-bold uppercase px-3 py-2 rounded-lg border border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
                                        >
                                            {deleting === listing._id ? "..." : "Delete"}
                                        </button>
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
