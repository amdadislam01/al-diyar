import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Listing from '@/models/Listing';
import Booking from '@/models/Booking';

async function getAdminSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    if ((session.user as any).role !== 'admin') {
        return { session: null, error: NextResponse.json({ message: 'Forbidden: Admin access only' }, { status: 403 }) };
    }
    return { session, error: null };
}

// GET /api/admin/stats — Platform-wide counts
export async function GET(req: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        await dbConnect();

        const [
            totalUsers,
            totalSellers,
            totalAgents,
            pendingApprovals,
            totalListings,
            activeListings,
            totalBookings,
            pendingBookings,
            confirmedBookings,
        ] = await Promise.all([
            User.countDocuments({ role: 'user' }),
            User.countDocuments({ role: 'seller', approvalStatus: 'approved' }),
            User.countDocuments({ role: 'agent', approvalStatus: 'approved' }),
            User.countDocuments({ role: { $in: ['seller', 'agent'] }, approvalStatus: 'pending' }),
            Listing.countDocuments(),
            Listing.countDocuments({ status: 'Active' }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'Pending' }),
            Booking.countDocuments({ status: 'Confirmed' }),
        ]);

        return NextResponse.json({
            users: { total: totalUsers, sellers: totalSellers, agents: totalAgents, pendingApprovals },
            listings: { total: totalListings, active: activeListings, inactive: totalListings - activeListings },
            bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings, cancelled: totalBookings - pendingBookings - confirmedBookings },
        });
    } catch (err: unknown) {
        console.error('[GET /api/admin/stats]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
