import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

async function getAgentSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
    if (session.user.role !== "agent") {
        return { session: null, error: NextResponse.json({ message: "Forbidden: Agent access only" }, { status: 403 }) };
    }
    const approvalStatus = (session.user as any).approvalStatus;
    if (approvalStatus !== "approved") {
        return { session: null, error: NextResponse.json({ message: "Your account is pending admin approval" }, { status: 403 }) };
    }
    return { session, error: null };
}

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/agent/listings/[id]
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });

    try {
        await dbConnect();
        const listing = await Listing.findById(id).lean();
        if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

        // Access check: Either listed by agent OR assigned to agent
        const isOwner = listing.listedBy.toString() === session!.user.id;
        const isAssigned = listing.assignedAgent?.toString() === session!.user.id;

        if (!isOwner && !isAssigned) {
            return NextResponse.json({ message: "Forbidden: You do not have access to this listing" }, { status: 403 });
        }

        return NextResponse.json({ listing }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agent/listings/:id]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// PATCH /api/agent/listings/[id]
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });

    try {
        await dbConnect();
        const listing = await Listing.findById(id);
        if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

        // Access check
        const isOwner = listing.listedBy.toString() === session!.user.id;
        const isAssigned = listing.assignedAgent?.toString() === session!.user.id;
        if (!isOwner && !isAssigned) {
            return NextResponse.json({ message: "Forbidden: You do not have access to this listing" }, { status: 403 });
        }

        const body = await req.json();
        const allowedUpdates = [
            "title", "description", "price", "type", "category", "location", "country",
            "images", "amenities", "status", "neighborhood", "listedDate", "pricePerSqft",
            "estimatedMortgage", "hoaFees", "hoaFrequency", "size", "bedrooms", "bathrooms",
            "fullBaths", "partialBaths", "rooms", "flooring", "kitchen", "cooling", "heating",
            "utilities", "yearBuilt", "builder", "constructionMaterials", "roofType",
            "garageParking", "specialFeatures", "nearbySchoolsHospitals", "shoppingTransport",
            "communityFacilities", "futureAmenities", "mlsNumber", "approval", "ownershipType",
            "agentName", "dreNumber", "phone", "email", "sellerName", "sellerEmail", "sellerPhone"
        ];

        const updates: any = {};
        for (const key of allowedUpdates) {
            if (key in body) updates[key] = body[key];
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: "No valid fields provided" }, { status: 400 });
        }

        // Location specific update
        if (body.location) {
            updates.location = {
                address: body.location.address || listing.location.address,
                lat: Number(body.location.lat) || listing.location.lat,
                lng: Number(body.location.lng) || listing.location.lng
            };
        }

        const updated = await Listing.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();
        return NextResponse.json({ message: "Listing updated successfully", listing: updated }, { status: 200 });
    } catch (err: unknown) {
        console.error("[PATCH /api/agent/listings/:id]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// DELETE /api/agent/listings/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    const { id } = await params;
    if (!isValidObjectId(id)) return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });

    try {
        await dbConnect();
        const listing = await Listing.findById(id);
        if (!listing) return NextResponse.json({ message: "Listing not found" }, { status: 404 });

        // Only the agent who LISTED it can delete it. Assigned agents shouldn't delete.
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: "Forbidden: Only the listing creator can delete it" }, { status: 403 });
        }

        await Listing.findByIdAndDelete(id);
        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (err: unknown) {
        console.error("[DELETE /api/agent/listings/:id]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
