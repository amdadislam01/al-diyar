import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

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

// GET /api/admin/bookings — All bookings across platform
export async function GET(req: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));

        const query: Record<string, unknown> = {};
        if (statusFilter && ['Pending', 'Confirmed', 'Cancelled'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const [bookings, total] = await Promise.all([
            Booking.find(query)
                .populate('listing', 'title type category price')
                .populate('buyer', 'name email')
                .populate('seller', 'name email role')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Booking.countDocuments(query),
        ]);

        return NextResponse.json({ bookings, total, page, pages: Math.ceil(total / limit) });
    } catch (err: unknown) {
        console.error('[GET /api/admin/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/bookings — Override any booking status
export async function PATCH(req: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        await dbConnect();

        const { bookingId, status } = await req.json();

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Valid bookingId is required' }, { status: 400 });
        }
        if (!status || !['Pending', 'Confirmed', 'Cancelled'].includes(status)) {
            return NextResponse.json({ message: "status must be 'Pending', 'Confirmed' or 'Cancelled'" }, { status: 400 });
        }

        const booking = await Booking.findByIdAndUpdate(bookingId, { status }, { new: true })
            .populate('listing', 'title type category')
            .populate('buyer', 'name email')
            .lean();

        if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

        return NextResponse.json({ message: 'Booking status updated', booking });
    } catch (err: unknown) {
        console.error('[PATCH /api/admin/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
