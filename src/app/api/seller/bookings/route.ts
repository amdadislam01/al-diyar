import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

async function getSellerSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user.role !== 'seller' && session.user.role !== 'agent')) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    return { session, error: null };
}

export async function GET() {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();
        const bookings = await Booking.find({ seller: session!.user.id, status: { $in: ['PendingSeller', 'Confirmed'] } })
            .populate('listing', 'title location price images')
            .populate('buyer', 'name email phone')
            .populate('agent', 'name email phone')
            .sort({ createdAt: -1 });

        return NextResponse.json({ bookings });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// Confirming a visit
export async function PATCH(req: NextRequest) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();
        const { bookingId, visitDate } = await req.json();

        const booking = await Booking.findOne({ _id: bookingId, seller: session!.user.id });
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        booking.status = 'Confirmed';
        booking.visitDate = new Date(visitDate);
        booking.visitConfirmedAt = new Date();
        await booking.save();

        return NextResponse.json({ message: 'Visit confirmed successfully' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

// Completing a visit
export async function POST(req: NextRequest) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();
        const { bookingId } = await req.json();

        const booking = await Booking.findOne({ _id: bookingId, seller: session!.user.id });
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        booking.status = 'Completed';
        await booking.save();

        return NextResponse.json({ message: 'Visit marked as completed. Buyer can now pay.' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
