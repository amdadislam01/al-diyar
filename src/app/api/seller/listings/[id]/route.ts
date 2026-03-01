import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Listing from '@/models/Listing';
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

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// ─── PATCH /api/seller/listings/[id] ─────────────────────────────────────────
// Update a specific listing. Only the seller who owns it can update it.

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    const { id } = await params;   

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: 'Invalid listing ID' }, { status: 400 });
    }

    try {
        await dbConnect();

        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
        }

        // Ownership check
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: 'Forbidden: You do not own this listing' }, { status: 403 });
        }

        const body = await req.json();

        // Whitelist updatable fields
        const allowedUpdates = [
            'title',
            'description',
            'price',
            'type',
            'category',
            'location',
            'images',
            'amenities',
            'status',
        ] as const;

        type AllowedField = (typeof allowedUpdates)[number];

        const updates: Partial<Record<AllowedField, unknown>> = {};
        for (const key of allowedUpdates) {
            if (key in body) {
                updates[key] = body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: 'No valid fields provided for update' }, { status: 400 });
        }

        // Validate type if being changed
        if (updates.type && !['Sale', 'Rent'].includes(updates.type as string)) {
            return NextResponse.json({ message: "type must be 'Sale' or 'Rent'" }, { status: 400 });
        }

        // Validate status if being changed
        if (updates.status && !['Active', 'Inactive'].includes(updates.status as string)) {
            return NextResponse.json({ message: "status must be 'Active' or 'Inactive'" }, { status: 400 });
        }

        const updated = await Listing.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true, runValidators: true }
        ).lean();

        return NextResponse.json({ message: 'Listing updated successfully', listing: updated }, { status: 200 });
    } catch (err: unknown) {
        console.error('[PATCH /api/seller/listings/:id]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── DELETE /api/seller/listings/[id] ────────────────────────────────────────
// Delete a specific listing. Only the seller who owns it can delete it.

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    const { id } = await params;  

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: 'Invalid listing ID' }, { status: 400 });
    }

    try {
        await dbConnect();

        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json({ message: 'Listing not found' }, { status: 404 });
        }

        // Ownership check
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: 'Forbidden: You do not own this listing' }, { status: 403 });
        }

        await Listing.findByIdAndDelete(id);

        return NextResponse.json({ message: 'Listing deleted successfully' }, { status: 200 });
    } catch (err: unknown) {
        console.error('[DELETE /api/seller/listings/:id]', err);
        const message = err instanceof Error ? err.message : 'Internal server error';
        return NextResponse.json({ message }, { status: 500 });
    }
}
