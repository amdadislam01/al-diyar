import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

async function getAgentSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    if (session.user.role !== 'agent') {
        return { session: null, error: NextResponse.json({ message: 'Forbidden: Agent access only' }, { status: 403 }) };
    }
    const approvalStatus = (session.user as any).approvalStatus;
    if (approvalStatus !== 'approved') {
        return { session: null, error: NextResponse.json({ message: 'Your account is pending admin approval' }, { status: 403 }) };
    }
    return { session, error: null };
}

// GET /api/agent/bookings — All bookings for this agent's listings
export async function GET(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        const query: Record<string, unknown> = { seller: session!.user.id };
        if (statusFilter && ['Pending', 'Confirmed', 'Cancelled'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const bookings = await Booking.find(query)
            .populate('listing', 'title type category price location status')
            .populate('buyer', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (err: unknown) {
        console.error('[GET /api/agent/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/agent/bookings — Confirm or cancel a booking
export async function PATCH(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const { bookingId, status } = await req.json();

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Valid bookingId is required' }, { status: 400 });
        }
        if (!status || !['Confirmed', 'Cancelled'].includes(status)) {
            return NextResponse.json({ message: "status must be 'Confirmed' or 'Cancelled'" }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) return NextResponse.json({ message: 'Booking not found' }, { status: 404 });

        if (booking.seller.toString() !== session!.user.id) {
            return NextResponse.json({ message: 'Forbidden: This booking does not belong to your listing' }, { status: 403 });
        }

        booking.status = status;
        await booking.save();

        const updated = await Booking.findById(bookingId)
            .populate('listing', 'title type category')
            .populate('buyer', 'name email')
            .lean();

        return NextResponse.json({ message: `Booking ${status.toLowerCase()} successfully`, booking: updated });
    } catch (err: unknown) {
        console.error('[PATCH /api/agent/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
