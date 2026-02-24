import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const { pathname } = req.nextUrl;
        const token = req.nextauth.token as any;

        const role = token?.role as string | undefined;
        const approvalStatus = token?.approvalStatus as string | undefined;

        const isPending = (role === "agent" || role === "seller") && approvalStatus === "pending";
        const isRejected = (role === "agent" || role === "seller") && approvalStatus === "rejected";

        // ─── Pending agent/seller ────────────────────────────────────────────────
        // They behave like a regular user — redirect agent/seller-specific routes
        // to the regular user dashboard. They should NOT see agent/seller pages.
        if (isPending || isRejected) {
            if (
                pathname.startsWith("/dashboard/agent") ||
                pathname.startsWith("/dashboard/seller") ||
                pathname.startsWith("/dashboard/admin") ||
                pathname === "/dashboard/pending"
            ) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
            // Allow /dashboard and all regular user pages
            return NextResponse.next();
        }

        // ─── Approved agent → redirect /dashboard root to their dashboard ────────
        if (role === "agent" && approvalStatus === "approved") {
            if (pathname === "/dashboard" || pathname === "/dashboard/") {
                return NextResponse.redirect(new URL("/dashboard/agent", req.url));
            }
        }

        // ─── Approved seller → redirect /dashboard root to their dashboard ───────
        if (role === "seller" && approvalStatus === "approved") {
            if (pathname === "/dashboard" || pathname === "/dashboard/") {
                return NextResponse.redirect(new URL("/dashboard/seller", req.url));
            }
        }

        // ─── Admin → redirect /dashboard root to admin dashboard ────────────────
        if (role === "admin") {
            if (pathname === "/dashboard" || pathname === "/dashboard/") {
                return NextResponse.redirect(new URL("/dashboard/admin", req.url));
            }
        }

        // ─── Regular user trying to access role-specific dashboards ─────────────
        if (role === "user") {
            if (
                pathname.startsWith("/dashboard/agent") ||
                pathname.startsWith("/dashboard/seller") ||
                pathname.startsWith("/dashboard/admin")
            ) {
                return NextResponse.redirect(new URL("/dashboard", req.url));
            }
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/auth/signin",
        },
    }
);

export const config = {
    matcher: ["/dashboard/:path*"],
};
