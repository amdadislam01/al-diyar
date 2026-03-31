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
    listing: {
        _id: string;
        title: string;
        price: number;
        type: string;
        category: string;
        location?: { address?: string };
        images: string[];
    } | null;
    seller: { name: string; email: string };
    visitDate: string;
    message?: string;
    status: "PendingAgent" | "PendingSeller" | "Confirmed" | "Completed" | "Cancelled";
    paymentStatus: "Unpaid" | "Paid";
    createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
    PendingAgent: "bg-orange-50 text-orange-600 border-orange-200",
    PendingSeller: "bg-indigo-50 text-indigo-600 border-indigo-200",
    Confirmed: "bg-emerald-50 text-emerald-600 border-emerald-200",
    Completed: "bg-blue-50 text-blue-600 border-blue-200",
    Cancelled: "bg-slate-50 text-slate-400 border-slate-200",
};

import { toast } from "react-hot-toast";
import Swal from "sweetalert2";

function Countdown({ targetDate }: { targetDate: string }) {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(targetDate).getTime() - now;

            if (distance < 0) {
                setTimeLeft("Visit Date Passed");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <span className="material-icons-outlined text-sm animate-pulse">timer</span>
            Countdown: {timeLeft}
        </div>
    );
}

function BookingsContent() {
    const searchParams = useSearchParams();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState("all");

    // Once a user finishes their transaction on Stripe, they'll land back here with a "success" flag in the URL.
    // We check for that flag and the session ID so we can verify everything went smoothly.
    useEffect(() => {
        const success = searchParams.get("success");
        const canceled = searchParams.get("canceled");
        const session_id = searchParams.get("session_id");

        if (success && session_id) {
            const verifyPayment = async () => {
                // Let's show a loading toast while we double-check the payment status with our server.
                const toastId = toast.loading("Verifying your payment, please wait...");
                try {
                    const res = await fetch(`/api/user/checkout/verify?session_id=${session_id}`);
                    const data = await res.json();
                    if (data.success) {
                        toast.success("All set! Your payment has been verified.", { id: toastId });
                        Swal.fire({
                            title: "Payment Successful!",
                            text: "Congratulations! Your property booking is now confirmed.",
                            icon: "success",
                            confirmButtonColor: "#0ea5e9",
                        });
                        // Update the list immediately to show the "Paid" status.
                        fetchBookings();
                    } else {
                        toast.error("We couldn't confirm your payment yet. It might take a moment.", { id: toastId });
                    }
                } catch (err) {
                    toast.error("Oops! Something went wrong while checking your payment.", { id: toastId });
                }
            };
            verifyPayment();
        }

        if (canceled) {
            toast.error("The payment was canceled. No worries, you can try again whenever you're ready.");
        }
    }, [searchParams]);

    // Let's fetch all the property visits the user has scheduled.
    const fetchBookings = async () => {
        setLoading(true);
        const res = await fetch("/api/user/bookings");
        const data = await res.json();
        setBookings(data.bookings ?? []);
        setLoading(false);
    };

    useEffect(() => { fetchBookings(); }, []);

    const handleCancel = async (bookingId: string) => {
        // We always ask for confirmation before canceling a visit request.
        const { isConfirmed } = await Swal.fire({
            title: "Cancel Booking Request?",
            text: "Are you sure you want to cancel this property visit?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, cancel it",
            confirmButtonColor: "#ef4444",
        });

        if (!isConfirmed) return;

        setActionLoading(bookingId);
        try {
            await fetch("/api/user/bookings", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            // Update the list to remove the canceled booking.
            fetchBookings();
        } finally {
            setActionLoading(null);
        }
    };

    const handlePayment = async (bookingId: string) => {
        setActionLoading(bookingId);
        try {
            const res = await fetch("/api/user/bookings/pay", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bookingId }),
            });
            const data = await res.json();
            if (res.ok && data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                toast.error(data.message || "Failed to initiate payment");
            }
        } catch (err) {
            toast.error("Network error");
        } finally {
            setActionLoading(null);
        }
    };

    const tabs = [
        { key: "all", label: "All" },
        { key: "PendingAgent", label: "Waiting Agent" },
        { key: "PendingSeller", label: "Waiting Seller" },
        { key: "Confirmed", label: "Confirmed" },
        { key: "Completed", label: "Visited" },
    ];

    const filteredBookings = activeTab === "all" ? bookings : bookings.filter(b => b.status === activeTab);

    return (
        <div className="p-6 lg:p-10 mx-auto space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight">My Bookings</h1>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">Track your property visits and payments</p>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {tabs.map((t) => (
                    <button key={t.key} onClick={() => setActiveTab(t.key)}
                        className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${activeTab === t.key ? "bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-200" : "bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-slate-800 hover:border-sky-200"}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((i) => <div key={i} className="h-48 rounded-[2rem] bg-slate-100 dark:bg-slate-800 animate-pulse" />)}
                </div>
            ) : filteredBookings.length === 0 ? (
                <div className="flex flex-col items-center gap-6 py-24 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-800">
                    <span className="material-icons-outlined text-7xl text-slate-200">event_note</span>
                    <div>
                        <p className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">No Bookings Found</p>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2">{activeTab === "all" ? "You haven't scheduled any visits yet" : `No bookings with status ${activeTab}`}</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredBookings.map((booking) => (
                        <div key={booking._id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col sm:flex-row gap-6 hover:translate-y-[-4px] transition-all group">
                            <div className="w-full sm:w-40 h-40 rounded-[2rem] bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0 relative">
                                {booking.listing?.images?.[0] ? (
                                    <img src={booking.listing.images[0]} alt={booking.listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300"><span className="material-icons-outlined text-4xl">home</span></div>
                                )}
                                <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${STATUS_STYLES[booking.status]}`}>
                                    {booking.status.replace(/([A-Z])/g, ' $1').trim()}
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-between min-w-0 py-2">
                                <div className="space-y-3">
                                    <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight truncate">{booking.listing?.title ?? "Property"}</h3>
                                    
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                                            <span className="material-icons-round text-sm text-sky-500">calendar_today</span>
                                            {new Date(booking.visitDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                                        </div>
                                        {booking.listing?.price && (
                                            <div className="text-sm font-black text-sky-500 uppercase tracking-widest">
                                                ${booking.listing.price.toLocaleString()} · {booking.listing.type}
                                            </div>
                                        )}
                                    </div>

                                    {booking.status === "Confirmed" && <Countdown targetDate={booking.visitDate} />}

                                    {booking.status === "Completed" && booking.paymentStatus === "Unpaid" && (
                                        <button onClick={() => handlePayment(booking._id)} disabled={actionLoading === booking._id}
                                            className="w-full py-4 bg-sky-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-sky-600 hover:shadow-lg hover:shadow-sky-200 transition-all flex items-center justify-center gap-2">
                                            {actionLoading === booking._id ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span className="material-icons-round text-base">payments</span> Pay for Property</>}
                                        </button>
                                    )}

                                    {booking.paymentStatus === "Paid" && (
                                        <div className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-3 rounded-2xl">
                                            <span className="material-icons-round">verified</span>
                                            <span className="text-[10px] font-black uppercase tracking-widest">Property Paid & Booked</span>
                                        </div>
                                    )}
                                </div>

                                {booking.status.includes("Pending") && (
                                    <button onClick={() => handleCancel(booking._id)} disabled={actionLoading === booking._id}
                                        className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500 transition-colors mt-4 text-left flex items-center gap-1">
                                        {actionLoading === booking._id ? "Processing..." : <><span className="material-icons-outlined text-sm">cancel</span> Cancel Request</>}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
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
