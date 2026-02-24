import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
import mongoose from 'mongoose';

async function getAdminSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    if ((session.user as any).role !== 'admin') {
        return { session: null, error: NextResponse.json({ message: 'Forbidden: Admin access only' }, { status: 403 }) };
    }
    return { session, error: null };
}

// GET /api/admin/listings — All listings across platform
export async function GET(req: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get('status');
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
        const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'));

        const query: Record<string, unknown> = {};
        if (statusFilter && ['Active', 'Inactive'].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const [listings, total] = await Promise.all([
            Listing.find(query)
                .populate('listedBy', 'name email role')
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean(),
            Listing.countDocuments(query),
        ]);

        return NextResponse.json({ listings, total, page, pages: Math.ceil(total / limit) });
    } catch (err: unknown) {
        console.error('[GET /api/admin/listings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/admin/listings — Toggle listing status
export async function PATCH(req: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        await dbConnect();

        const { listingId, status } = await req.json();

        if (!listingId || !mongoose.Types.ObjectId.isValid(listingId)) {
            return NextResponse.json({ message: 'Valid listingId is required' }, { status: 400 });
        }
        if (!status || !['Active', 'Inactive'].includes(status)) {
            return NextResponse.json({ message: "status must be 'Active' or 'Inactive'" }, { status: 400 });
        }

        const listing = await Listing.findByIdAndUpdate(listingId, { status }, { new: true }).lean();
        if (!listing) return NextResponse.json({ message: 'Listing not found' }, { status: 404 });

        return NextResponse.json({ message: 'Listing status updated', listing });
    } catch (err: unknown) {
        console.error('[PATCH /api/admin/listings]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
