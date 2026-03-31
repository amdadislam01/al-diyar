import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';

async function getAgentSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'agent') {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    return { session, error: null };
}

export async function GET() {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();
        const bookings = await Booking.find({ 
            agent: session!.user.id, 
            status: { $in: ['PendingAgent', 'PendingSeller', 'Confirmed', 'Completed', 'Cancelled'] } 
        })
            .populate('listing', 'title location price images listedBy')
            .populate('buyer', 'name email phone')
            .populate('seller', 'name email phone')
            .sort({ createdAt: -1 });

        return NextResponse.json({ bookings });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();
        const { bookingId } = await req.json();

        const booking = await Booking.findOne({ _id: bookingId, agent: session!.user.id });
        if (!booking) {
            return NextResponse.json({ message: 'Booking not found' }, { status: 404 });
        }

        booking.status = 'PendingSeller';
        booking.agentForwardedAt = new Date();
        await booking.save();

        return NextResponse.json({ message: 'Booking forwarded to seller' });
    } catch (err: any) {
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
