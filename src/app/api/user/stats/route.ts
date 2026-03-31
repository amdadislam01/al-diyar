import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();

        const userId = session.user.id;

        const [totalBookings, pendingBookings, confirmedBookings, upcomingVisits] = await Promise.all([
            Booking.countDocuments({ buyer: userId }),
            Booking.countDocuments({ buyer: userId, status: { $in: ['PendingAgent', 'PendingSeller'] } }),
            Booking.countDocuments({ buyer: userId, status: 'Confirmed' }),
            Booking.countDocuments({
                buyer: userId,
                status: { $in: ['PendingAgent', 'PendingSeller', 'Confirmed'] },
                visitDate: { $gte: new Date() },
            }),
        ]);

        return NextResponse.json({
            bookings: { total: totalBookings, pending: pendingBookings, confirmed: confirmedBookings },
            visits: { upcoming: upcomingVisits },
        });
    } catch (err) {
        console.error('[GET /api/user/stats]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
