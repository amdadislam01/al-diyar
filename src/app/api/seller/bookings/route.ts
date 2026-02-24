import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import mongoose from 'mongoose';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getSellerSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    if (session.user.role !== 'seller' && session.user.role !== 'agent') {
        return { session: null, error: NextResponse.json({ message: 'Forbidden: Seller access only' }, { status: 403 }) };
    }
    return { session, error: null };
}

// ─── GET /api/seller/bookings ─────────────────────────────────────────────────
// Fetch all booking/visit requests for the logged-in seller's properties.
// Populates listing (title, type, category) and buyer (name, email).

export async function GET(req: NextRequest) {
    const { session, error } = await getSellerSession();
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
        console.error('[GET /api/seller/bookings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── PATCH /api/seller/bookings ───────────────────────────────────────────────
// Update the status of a booking (Confirmed / Cancelled).
// Body: { bookingId: string, status: 'Confirmed' | 'Cancelled' }

export async function PATCH(req: NextRequest) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();
        const { bookingId, status } = body;

        if (!bookingId) {
            return NextResponse.json({ message: 'bookingId is required' }, { status: 400 });
        }

        if (!status || !['Confirmed', 'Cancelled'].includes(status)) {
            return NextResponse.json(
                { message: "status must be 'Confirmed' or 'Cancelled'" },
                { status: 400 }
            );
        }

        if (!mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Invalid bookingId' }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        // Ensure the booking belongs to this seller
        if (booking.seller.toString() !== session!.user.id) {
            return NextResponse.json(
                { message: 'Forbidden: This booking does not belong to your property' },
                { status: 403 }
            );
        }

        booking.status = status;
        await booking.save();

        const updated = await Booking.findById(bookingId)
            .populate('listing', 'title type category')
            .populate('buyer', 'name email')
            .lean();

        return NextResponse.json({ message: `Booking ${status.toLowerCase()} successfully`, booking: updated }, { status: 200 });
    } catch (err: unknown) {
        console.error('[PATCH /api/seller/bookings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
