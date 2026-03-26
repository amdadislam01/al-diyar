import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";
import mongoose from "mongoose";

// ─── Helper ───────────────────────────────────────────────────────────────────

async function getSellerSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
    }
    if (session.user.role !== "seller") {
        return { session: null, error: NextResponse.json({ message: "Forbidden: Seller access only" }, { status: 403 }) };
    }
    return { session, error: null };
}

function isValidObjectId(id: string) {
    return mongoose.Types.ObjectId.isValid(id);
}

// ─── GET /api/seller/listings/[id] ──────────────────────────────────────────
// Fetch a specific listing owned by the seller.

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    const { id } = await params;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });
    }

    try {
        await dbConnect();

        const listing = await Listing.findById(id).lean();

        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        // Ownership check
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: "Forbidden: You do not own this listing" }, { status: 403 });
        }

        return NextResponse.json({ listing }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/seller/listings/:id]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── PATCH /api/seller/listings/[id] ─────────────────────────────────────────
// Update a specific listing. Only the seller who owns it can update it.

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    const { id } = await params;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });
    }

    try {
        await dbConnect();
        const User = (await import("@/models/User")).default;

        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        // Ownership check
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: "Forbidden: You do not own this listing" }, { status: 403 });
        }

        const body = await req.json();

        // Whitelist updatable fields
        const allowedUpdates = [
            "title",
            "description",
            "price",
            "type",
            "category",
            "location",
            "country",
            "assignedAgent",
            "images",
            "amenities",
            "status",
            // Location & Basic Info
            "neighborhood",
            "listedDate",
            // Price & Mortgage
            "pricePerSqft",
            "estimatedMortgage",
            "hoaFees",
            "hoaFrequency",
            // Interior Details
            "size",
            "bedrooms",
            "bathrooms",
            "fullBaths",
            "partialBaths",
            "rooms",
            "flooring",
            "kitchen",
            "cooling",
            "heating",
            "utilities",
            // Building & Exterior
            "yearBuilt",
            "builder",
            "constructionMaterials",
            "roofType",
            "garageParking",
            "specialFeatures",
            // Community & Amenities
            "nearbySchoolsHospitals",
            "shoppingTransport",
            "communityFacilities",
            "futureAmenities",
            // Legal & Documentation
            "mlsNumber",
            "approval",
            "ownershipType",
            // Contact
            "agentName",
            "dreNumber",
            "phone",
            "email",
        ] as const;

        type AllowedField = (typeof allowedUpdates)[number];

        const updates: Partial<Record<AllowedField, unknown>> = {};
        for (const key of allowedUpdates) {
            if (key in body) {
                updates[key] = body[key];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ message: "No valid fields provided for update" }, { status: 400 });
        }

        // Validate type if being changed
        if (updates.type && !["Sale", "Rent"].includes(updates.type as string)) {
            return NextResponse.json({ message: "type must be 'Sale' or 'Rent'" }, { status: 400 });
        }

        // Workflow: If country or agent changes, we must re-verify and reset workflow
        const countryChanged = updates.country && updates.country !== listing.country;
        const agentChanged = updates.assignedAgent && updates.assignedAgent.toString() !== listing.assignedAgent?.toString();

        if (countryChanged || agentChanged) {
            const finalCountry = (updates.country as string) || listing.country;
            const finalAgentId = (updates.assignedAgent as string) || listing.assignedAgent;

            if (!finalCountry || !finalAgentId) {
                return NextResponse.json({ message: "Country and Assigned Agent are required" }, { status: 400 });
            }

            const agent = await User.findById(finalAgentId);
            if (!agent || agent.role !== "agent" || agent.approvalStatus !== "approved") {
                return NextResponse.json({ message: "Invalid or unapproved agent selected" }, { status: 400 });
            }

            if (agent.country?.toLowerCase() !== finalCountry.toLowerCase()) {
                return NextResponse.json({ message: "Selected agent does not belong to the property country" }, { status: 400 });
            }

            // Reset workflow status
            (updates as any).assignmentStatus = "pending";
            (updates as any).status = "Pending";
        }

        // Validate status if being changed manually (Sellers can only set to Inactive, or Pending if they want to re-submit)
        if (updates.status && updates.status !== listing.status) {
            if (!["Active", "Sold", "Inactive", "Pending"].includes(updates.status as string)) {
                return NextResponse.json({ message: "Sellers can only set status to Inactive or Pending" }, { status: 400 });
            }
            // If setting to pending manually, we should also reset assignmentStatus
            if (updates.status === "Pending") {
                (updates as any).assignmentStatus = "pending";
            }
        }

        const updated = await Listing.findByIdAndUpdate(id, { $set: updates }, { new: true, runValidators: true }).lean();

        return NextResponse.json({ message: "Listing updated successfully", listing: updated }, { status: 200 });
    } catch (err: unknown) {
        console.error("[PATCH /api/seller/listings/:id]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}

// ─── DELETE /api/seller/listings/[id] ────────────────────────────────────────
// Delete a specific listing. Only the seller who owns it can delete it.

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    const { id } = await params;

    if (!isValidObjectId(id)) {
        return NextResponse.json({ message: "Invalid listing ID" }, { status: 400 });
    }

    try {
        await dbConnect();

        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        // Ownership check
        if (listing.listedBy.toString() !== session!.user.id) {
            return NextResponse.json({ message: "Forbidden: You do not own this listing" }, { status: 403 });
        }

        await Listing.findByIdAndDelete(id);

        return NextResponse.json({ message: "Listing deleted successfully" }, { status: 200 });
    } catch (err: unknown) {
        console.error("[DELETE /api/seller/listings/:id]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
