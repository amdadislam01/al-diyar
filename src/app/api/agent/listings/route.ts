import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';

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

// GET /api/agent/listings — All listings posted by this agent
export async function GET(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');

        const query: Record<string, unknown> = { listedBy: session!.user.id };
        if (statusFilter && ['Active', 'Inactive'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const listings = await Listing.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ listings }, { status: 200 });
    } catch (err: unknown) {
        console.error('[GET /api/agent/listings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// POST /api/agent/listings — Create a new listing (agent)
export async function POST(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();
        const { title, description, price, type, category, location, images, amenities } = body;

        if (!title || !description || price === undefined || !type || !category || !location) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        if (!['Sale', 'Rent'].includes(type)) {
            return NextResponse.json({ message: "type must be 'Sale' or 'Rent'" }, { status: 400 });
        }

        const listing = await Listing.create({
            title, description, price, type, category, location,
            images: images ?? [],
            amenities: amenities ?? [],
            listedBy: session!.user.id,
        });

        return NextResponse.json({ message: 'Listing created successfully', listing }, { status: 201 });
    } catch (err: unknown) {
        console.error('[POST /api/agent/listings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
