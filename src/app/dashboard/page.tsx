"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

interface UserStats {
  bookings: { total: number; pending: number; confirmed: number };
  visits: { upcoming: number };
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  const user = session?.user as any;
  const role = user?.role;
  const approvalStatus = user?.approvalStatus;

  // Role-based redirects
  useEffect(() => {
    if (status !== "authenticated") return;
    if (role === "admin") { router.replace("/dashboard/admin"); return; }
    if (role === "agent" && approvalStatus === "approved") { router.replace("/dashboard/agent"); return; }
    if (role === "seller" && approvalStatus === "approved") { router.replace("/dashboard/seller"); return; }
  }, [session, status, router, role, approvalStatus]);

  // Fetch real stats
  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/user/stats")
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, [status]);

  const userName = user?.name?.split(" ")[0] ?? "there";
  const isPending = (role === "agent" || role === "seller") && approvalStatus === "pending";

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-full mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Welcome back, <span className="text-primary">{userName}</span> 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            {isPending
              ? "Your account is pending admin approval. You can browse as a regular user in the meantime."
              : "Here's what's happening with your property journey."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      {/* Pending banner */}
      {isPending && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40">
          <span className="material-icons-outlined text-amber-500 mt-0.5">schedule</span>
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
              Account Pending Approval
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              An admin will review your {role} application soon. You'll get full access once approved.
            </p>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon="confirmation_number"
          iconBg="bg-primary/10"
          iconColor="text-primary"
          label="Total Bookings"
          value={loading ? "—" : String(stats?.bookings.total ?? 0)}
          sub="All time"
          href="/dashboard/bookings"
        />
        <StatCard
          icon="schedule"
          iconBg="bg-orange-50 dark:bg-orange-900/20"
          iconColor="text-orange-500"
          label="Pending"
          value={loading ? "—" : String(stats?.bookings.pending ?? 0)}
          sub="Awaiting confirmation"
          href="/dashboard/bookings?status=Pending"
        />
        <StatCard
          icon="check_circle"
          iconBg="bg-green-50 dark:bg-green-900/20"
          iconColor="text-green-500"
          label="Confirmed"
          value={loading ? "—" : String(stats?.bookings.confirmed ?? 0)}
          sub="Approved visits"
          href="/dashboard/bookings?status=Confirmed"
        />
        <StatCard
          icon="calendar_month"
          iconBg="bg-purple-50 dark:bg-purple-900/20"
          iconColor="text-purple-500"
          label="Upcoming Visits"
          value={loading ? "—" : String(stats?.visits.upcoming ?? 0)}
          sub="Scheduled"
          href="/dashboard/visits"
        />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { href: "/properties", icon: "search", label: "Browse Properties", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" },
            { href: "/dashboard/bookings", icon: "confirmation_number", label: "My Bookings", color: "bg-primary/10 text-primary" },
            { href: "/dashboard/visits", icon: "calendar_month", label: "Scheduled Visits", color: "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400" },
            { href: "/dashboard/saved", icon: "favorite_border", label: "Saved Listings", color: "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-2 sm:gap-3 p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all group"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center ${action.color}`}>
                <span className="material-icons-outlined text-lg sm:text-xl">{action.icon}</span>
              </div>
              <span className="text-[10px] sm:text-xs font-medium text-slate-600 dark:text-slate-300 text-center leading-snug">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bookings */}
      <RecentBookings />
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon, iconBg, iconColor, label, value, sub, href,
}: {
  icon: string; iconBg: string; iconColor: string;
  label: string; value: string; sub?: string; href?: string;
}) {
  const content = (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
          {sub && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">{sub}</p>}
        </div>
        <div className={`${iconBg} w-10 h-10 rounded-xl flex items-center justify-center shrink-0`}>
          <span className={`material-icons-outlined text-lg ${iconColor}`}>{icon}</span>
        </div>
      </div>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : <div>{content}</div>;
}

// ─── Recent Bookings ──────────────────────────────────────────────────────────

function RecentBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/user/bookings")
      .then((r) => r.json())
      .then((d) => setBookings((d.bookings ?? []).slice(0, 5)))
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-slate-700 dark:text-slate-200">Recent Bookings</h2>
        <Link href="/dashboard/bookings" className="text-xs text-primary hover:underline font-medium">
          View all →
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-slate-50 dark:bg-slate-800 animate-pulse" />
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center px-4">
            <span className="material-icons-outlined text-4xl text-slate-300 dark:text-slate-600">confirmation_number</span>
            <p className="text-sm text-slate-500 dark:text-slate-400">No bookings yet.</p>
            <Link
              href="/properties"
              className="mt-1 text-xs bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-slate-800">
            {bookings.map((b) => {
              const listing = b.listing as any;
              const statusColor =
                b.status === "Confirmed"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : b.status === "Cancelled"
                    ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500 dark:text-rose-400"
                    : b.status === "Completed"
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400";

              return (
                <div key={b._id} className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
                  {/* Image */}
                  <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 overflow-hidden shrink-0">
                    {listing?.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="material-icons-outlined text-slate-400 text-xl">home</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                      {listing?.title ?? "Property"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                      Visit: {new Date(b.visitDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                  {/* Status */}
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${statusColor}`}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
