import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';

// ─── Helper ──────────────────────────────────────────────────────────────────

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

// ─── POST /api/seller/listings ────────────────────────────────────────────────
// Create a new property listing for the logged-in seller.

export async function POST(req: NextRequest) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();

        const body = await req.json();

        const {
            title,
            description,
            price,
            type,
            category,
            location,
            images,
            amenities,
        } = body;

        // Basic validation
        if (!title || !description || price === undefined || !type || !category || !location) {
            return NextResponse.json(
                { message: 'Missing required fields: title, description, price, type, category, location' },
                { status: 400 }
            );
        }

        if (!['Sale', 'Rent'].includes(type)) {
            return NextResponse.json({ message: "type must be 'Sale' or 'Rent'" }, { status: 400 });
        }

        if (typeof location.lat !== 'number' || typeof location.lng !== 'number') {
            return NextResponse.json({ message: 'location must include numeric lat and lng' }, { status: 400 });
        }

        const listing = await Listing.create({
            title,
            description,
            price,
            type,
            category,
            location,
            images: images ?? [],
            amenities: amenities ?? [],
            listedBy: session!.user.id,
        });

        return NextResponse.json({ message: 'Listing created successfully', listing }, { status: 201 });
    } catch (err: unknown) {
        console.error('[POST /api/seller/listings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── GET /api/seller/listings ─────────────────────────────────────────────────
// Fetch all listings belonging to the logged-in seller.
// Optional query param: ?status=Active|Inactive

export async function GET(req: NextRequest) {
    const { session, error } = await getSellerSession();
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
        console.error('[GET /api/seller/listings]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
