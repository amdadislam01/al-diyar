import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Listing from '@/models/Listing';
import User from '@/models/User';
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

        // Fetch the listing to get the seller and agent ID
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
        }

        const sellerId = listing.listedBy;
        const agentId = listing.assignedAgent;

        if (!sellerId) {
            return NextResponse.json({ message: 'Seller not found for this listing. Contact support.' }, { status: 400 });
        }

        const newBooking = new Booking({
            listing: listingId,
            buyer: session!.user.id,
            agent: agentId || undefined,
            seller: sellerId,
            visitDate: new Date(visitDate),
            message: message || "",
            status: 'PendingAgent',
            paymentStatus: 'Unpaid'
        });

        await newBooking.save();

        return NextResponse.json({ message: 'Visit requested successfully', booking: newBooking }, { status: 201 });
    } catch (err: any) {
        console.error('[POST /api/user/bookings] Error:', err);
        // Return detailed error in dev, generic in prod
        const errorMessage = err?.message || 'Internal server error';
        return NextResponse.json({ 
            message: 'Failed to schedule visit', 
            error: errorMessage,
            stack: process.env.NODE_ENV === 'development' ? err?.stack : undefined
        }, { status: 500 });
    }
}

// ─── GET /api/user/bookings ───────────────────────────────────────────────────
// Fetch all visit requests created by the logged-in user.

export async function GET(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();

        // ─── Auto-Expiration Logic ───────────────────────────────────────────
        // Mark 'Confirmed' bookings as 'Expired' if the visit date has passed.
        const now = new Date();
        await Booking.updateMany(
            { 
                buyer: session!.user.id, 
                status: 'Confirmed', 
                visitDate: { $lt: now } 
            },
            { $set: { status: 'Expired' } }
        );

        const url = new URL(req.url);
        const statusParam = url.searchParams.get('status');

        const query: any = { buyer: session!.user.id };
        if (statusParam && statusParam !== 'all') {
            query.status = statusParam;
        }

        const bookings = await Booking.find(query)
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

// ─── DELETE /api/user/bookings ────────────────────────────────────────────────
// Cancel a visit request.

export async function DELETE(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();
        
        const body = await req.json();
        const { bookingId } = body;

        if (!bookingId) {
            return NextResponse.json({ message: 'Booking ID is required' }, { status: 400 });
        }

        const booking = await Booking.findOne({ _id: bookingId, buyer: session!.user.id });
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found or unauthorized' }, { status: 404 });
        }

        booking.status = 'Cancelled';
        await booking.save();

        return NextResponse.json({ message: 'Booking cancelled successfully' }, { status: 200 });
    } catch (err: unknown) {
        console.error('[DELETE /api/user/bookings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
