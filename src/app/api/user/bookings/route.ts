import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

async function getUserSession(req?: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    return { session, error: null };
}

// ─── GET /api/user/bookings ───────────────────────────────────────────────────
// Returns all bookings made by the logged-in user (as buyer).

export async function GET(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        const query: Record<string, unknown> = { buyer: session!.user.id };
        if (statusFilter && ['Pending', 'Confirmed', 'Cancelled'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const bookings = await Booking.find(query)
            .populate('listing', 'title type category price location images status')
            .populate('seller', 'name email')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (err: unknown) {
        console.error('[GET /api/user/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ─── POST /api/user/bookings ──────────────────────────────────────────────────
// Create a new visit booking for a listing.
// Body: { listingId, visitDate, message? }

export async function POST(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();
        const { listingId, visitDate, message } = body;

        if (!listingId || !visitDate) {
            return NextResponse.json({ message: 'listingId and visitDate are required' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return NextResponse.json({ message: 'Invalid listingId' }, { status: 400 });
        }

        const listing = await Listing.findById(listingId);
        if (!listing) {
            return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
        }
        if (listing.status !== 'Active') {
            return NextResponse.json({ message: 'This listing is not available for booking' }, { status: 400 });
        }

        // Prevent duplicate pending bookings for the same listing
        const existing = await Booking.findOne({
            listing: listingId,
            buyer: session!.user.id,
            status: 'Pending',
        });
        if (existing) {
            return NextResponse.json({ message: 'You already have a pending booking for this listing' }, { status: 409 });
        }

        const booking = await Booking.create({
            listing: listingId,
            buyer: session!.user.id,
            seller: listing.listedBy,
            visitDate: new Date(visitDate),
            message: message || '',
        });

        const populated = await Booking.findById(booking._id)
            .populate('listing', 'title type category price location')
            .populate('seller', 'name email')
            .lean();

        return NextResponse.json({ message: 'Booking created successfully', booking: populated }, { status: 201 });
    } catch (err: unknown) {
        console.error('[POST /api/user/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// ─── DELETE /api/user/bookings ────────────────────────────────────────────────
// Cancel a booking the user made.
// Body: { bookingId }

export async function DELETE(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();
        const { bookingId } = body;

        if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
            return NextResponse.json({ message: 'Valid bookingId is required' }, { status: 400 });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        if (booking.buyer.toString() !== session!.user.id) {
            return NextResponse.json({ message: 'Forbidden: This is not your booking' }, { status: 403 });
        }

        if (booking.status === 'Confirmed') {
            return NextResponse.json({ message: 'Cannot cancel a confirmed booking' }, { status: 400 });
        }

        await Booking.findByIdAndDelete(bookingId);

        return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
    } catch (err: unknown) {
        console.error('[DELETE /api/user/bookings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
