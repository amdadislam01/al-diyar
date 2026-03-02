"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// ─── Nav Configs ──────────────────────────────────────────────────────────────

// ─── Nav Item Type ────────────────────────────────────────────────────────────

type NavItem = {
  href: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: string;
};

const userNavItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", exact: true },
  {
    href: "/dashboard/bookings",
    label: "My Bookings",
    icon: "confirmation_number",
  },
  {
    href: "/dashboard/visits",
    label: "Scheduled Visits",
    icon: "calendar_month",
  },
  {
    href: "/dashboard/saved",
    label: "Saved Listings",
    icon: "favorite_border",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: "chat_bubble_outline",
    badge: "2",
  },
  { href: "/dashboard/profile", label: "My Profile", icon: "person" },
];

const sellerNavItems: NavItem[] = [
  {
    href: "/dashboard/seller",
    label: "Overview",
    icon: "dashboard",
    exact: true,
  },
  {
    href: "/dashboard/seller/listings",
    label: "My Listings",
    icon: "home_work",
    exact: true,
  },
  {
    href: "/dashboard/seller/listings/new",
    label: "Add Listing",
    icon: "add_home",
  },
  {
    href: "/dashboard/seller/bookings",
    label: "Bookings",
    icon: "confirmation_number",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: "chat_bubble_outline",
    badge: "2",
  },
];

const agentNavItems: NavItem[] = [
  {
    href: "/dashboard/agent",
    label: "Overview",
    icon: "dashboard",
    exact: true,
  },
  {
    href: "/dashboard/agent/listings",
    label: "My Listings",
    icon: "home_work",
    exact: true,
  },
  { href: "/dashboard/agent/clients", label: "Clients", icon: "group" },
  {
    href: "/dashboard/agent/bookings",
    label: "Bookings",
    icon: "confirmation_number",
  },
  {
    href: "/dashboard/messages",
    label: "Messages",
    icon: "chat_bubble_outline",
    badge: "2",
  },
];

const adminNavItems: NavItem[] = [
  {
    href: "/dashboard/admin",
    label: "Overview",
    icon: "dashboard",
    exact: true,
  },
  {
    href: "/dashboard/admin/users",
    label: "Manage Users",
    icon: "manage_accounts",
    exact: true,
  },
  {
    href: "/dashboard/admin/listings",
    label: "All Listings",
    icon: "home_work",
    exact: true,
  },
  {
    href: "/dashboard/admin/bookings",
    label: "All Bookings",
    icon: "confirmation_number",
  },
  { href: "/dashboard/admin/analytics", label: "Analytics", icon: "analytics" },
  { href: "/dashboard/admin/settings", label: "Settings", icon: "settings" },
];

// ─── Role meta ────────────────────────────────────────────────────────────────

const roleMeta: Record<
  string,
  { label: string; subtitle: string; color: string }
> = {
  user: { label: "Al-Diyar", subtitle: "My Dashboard", color: "text-white/50" },
  seller: {
    label: "Al-Diyar",
    subtitle: "Seller Portal",
    color: "text-accent",
  },
  agent: {
    label: "Al-Diyar",
    subtitle: "Agent Portal",
    color: "text-emerald-400",
  },
  admin: { label: "Al-Diyar", subtitle: "Admin Panel", color: "text-warning" },
};

function getNavItems(role: string) {
  if (role === "admin") return adminNavItems;
  if (role === "agent") return agentNavItems;
  if (role === "seller") return sellerNavItems;
  return userNavItems;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const role = (session?.user as { role?: string })?.role ?? "user";
  const approvalStatus = (session?.user as { approvalStatus?: string })
    ?.approvalStatus;
  const meta = roleMeta[role] ?? roleMeta.user;
  const navItems = getNavItems(role);

  // No redirect needed — middleware handles routing for pending users

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Pending: agent/seller waiting for admin approval — they use user nav
  const isPending =
    (role === "seller" || role === "agent") && approvalStatus === "pending";
  const effectiveNavItems = isPending ? userNavItems : navItems;

  return (
    <aside className="hidden md:flex flex-col w-64 bg-primary text-white shrink-0 h-full">
      {/* Logo */}
      <div className="flex items-center h-20 px-8 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center"
          >
            <Image src="/aldiyarlogo.png" alt="Logo" width={32} height={32} />
          </Link>
          <div>
            <span className="text-xl font-bold tracking-tight">
              {meta.label}
            </span>
            <p className={`text-[10px] font-medium -mt-0.5 ${meta.color}`}>
              {meta.subtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Pending approval banner (subtle) */}
      {isPending && (
        <div className="mx-4 mt-4 rounded-xl bg-amber-500/20 border border-amber-400/30 px-4 py-3 flex items-start gap-2">
          <span className="material-icons-outlined text-amber-400 text-base mt-0.5">
            schedule
          </span>
          <div>
            <p className="text-xs text-amber-200 leading-snug font-medium">
              Pending Admin Approval
            </p>
            <p className="text-[11px] text-amber-300/70 mt-0.5">
              Access limited until approved
            </p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {status === "loading" ? (
          // Skeleton while session loads
          <div className="space-y-2 px-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-10 rounded-xl bg-white/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          effectiveNavItems.map((item) => {
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-colors
                  ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <div className="flex items-center">
                  <span
                    className={`material-icons-outlined mr-3 text-lg
                      ${active ? "text-white" : "text-white/60"}`}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </div>
                {item.badge && (
                  <span className="bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })
        )}
      </nav>

      {/* Bottom — User card */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
          {/* Avatar */}
          {session?.user?.image ? (
            <Image
              alt="avatar"
              width={32}
              height={32}
              src={session.user.image}
              className="h-8 w-8 rounded-full border border-white/20 object-cover shrink-0"
            />
          ) : (
            <div className="h-8 w-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center shrink-0">
              <span className="material-icons-outlined text-sm text-white">
                person
              </span>
            </div>
          )}

          {/* Name + role badge */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p
              className={`text-[10px] font-semibold uppercase tracking-wide
                ${role === "admin" ? "text-warning" : role === "agent" ? "text-emerald-400" : role === "seller" ? "text-accent" : "text-white/50"}`}
            >
              {role}
              {isPending && " · pending"}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ callbackUrl: "/auth/signin" })}
            title="Sign out"
            className="text-white/50 hover:text-white transition-colors"
          >
            <span className="material-icons-outlined text-lg">logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
