import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getUserSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    return { session, error: null };
}

// ─── POST /api/user/bookings ──────────────────────────────────────────────────
// Create a new visit request for a property.

export async function POST(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();
        const { listingId, visitDate, message } = body;

        if (!listingId || !visitDate) {
            return NextResponse.json({ message: 'Listing ID and visit date are required' }, { status: 400 });
        }

        if (!mongoose.Types.ObjectId.isValid(listingId)) {
            return NextResponse.json({ message: 'Invalid listingId' }, { status: 400 });
        }

        // Fetch the listing to get the seller/agent ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
        }

        const sellerId = listing.listedBy || (listing as any).assignedAgent;
        if (!sellerId) {
            return NextResponse.json({ message: 'Seller not found for this listing' }, { status: 400 });
        }

        const newBooking = new Booking({
            listing: listingId,
            buyer: session!.user.id,
            seller: sellerId,
            visitDate: new Date(visitDate),
            message,
            status: 'Pending'
        });

        await newBooking.save();

        return NextResponse.json({ message: 'Visit requested successfully', booking: newBooking }, { status: 201 });
    } catch (err: unknown) {
        console.error('[POST /api/user/bookings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── GET /api/user/bookings ───────────────────────────────────────────────────
// Fetch all visit requests created by the logged-in user.

export async function GET() {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        const bookings = await Booking.find({ buyer: session!.user.id })
            .populate('listing', 'title type category price location images status')
            .populate('seller', 'name email phone image')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ bookings }, { status: 200 });
    } catch (err: unknown) {
        console.error('[GET /api/user/bookings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
