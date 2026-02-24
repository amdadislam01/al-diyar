import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import User from '@/models/User';

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

// GET /api/agent/clients — All users who booked one of the agent's listings
export async function GET(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        // Get all unique buyer IDs from bookings for this agent's listings
        const bookings = await Booking.find({ seller: session!.user.id })
            .select('buyer listing status visitDate createdAt')
            .populate('listing', 'title type price')
            .populate('buyer', 'name email phone')
            .sort({ createdAt: -1 })
            .lean();

        // Deduplicate by buyer and attach their bookings as history
        const clientMap = new Map<string, any>();
        for (const booking of bookings) {
            const buyer = booking.buyer as any;
            if (!buyer?._id) continue;
            const id = buyer._id.toString();
            if (!clientMap.has(id)) {
                clientMap.set(id, {
                    ...buyer,
                    bookingCount: 0,
                    lastBooking: null,
                });
            }
            const client = clientMap.get(id);
            client.bookingCount += 1;
            if (!client.lastBooking || new Date(booking.createdAt) > new Date(client.lastBooking)) {
                client.lastBooking = booking.createdAt;
            }
        }

        const clients = Array.from(clientMap.values());

        return NextResponse.json({ clients, total: clients.length }, { status: 200 });
    } catch (err: unknown) {
        console.error('[GET /api/agent/clients]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
