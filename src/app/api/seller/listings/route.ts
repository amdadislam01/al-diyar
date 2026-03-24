import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

// ─── Helper ──────────────────────────────────────────────────────────────────

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

// ─── POST /api/seller/listings ────────────────────────────────────────────────
// Create a new property listing for the logged-in seller.

export async function POST(req: NextRequest) {
    const { session, error } = await getSellerSession();
    if (error) return error;

    try {
        await dbConnect();
        const User = (await import("@/models/User")).default;

        const body = await req.json();

        const {
            title,
            description,
            price,
            type,
            category,
            location,
            country,
            assignedAgent,
            images,
            amenities,
             neighborhood,
            listedDate,
            pricePerSqft,
            estimatedMortgage,
            hoaFees,
            hoaFrequency,
            size,
            bedrooms,
            bathrooms,
            fullBaths,
            partialBaths,
            rooms,
            flooring,
            kitchen,
            cooling,
            heating,
            utilities,
            yearBuilt,
            builder,
            constructionMaterials,
            roofType,
            garageParking,
            specialFeatures,
            nearbySchoolsHospitals,
            shoppingTransport,
            communityFacilities,
            futureAmenities,
            mlsNumber,
            approval,
            ownershipType,
            agentName,
            dreNumber,
            phone,
            email,
        } = body;

        // Basic validation
        if (!title || !description || price === undefined || !type || !category || !location || !country || !assignedAgent) {
            return NextResponse.json({ message: "Missing required fields matching the new workflow" }, { status: 400 });
        }

        if (!["Sale", "Rent"].includes(type)) {
            return NextResponse.json({ message: "type must be 'Sale' or 'Rent'" }, { status: 400 });
        }

        if (typeof location.lat !== "number" || typeof location.lng !== "number") {
            return NextResponse.json({ message: "location must include numeric lat and lng" }, { status: 400 });
        }

        // Workflow validation: Check if assigned agent is valid
        const agent = await User.findById(assignedAgent);
        if (!agent || agent.role !== "agent" || agent.approvalStatus !== "approved") {
            return NextResponse.json({ message: "Invalid or unapproved agent selected" }, { status: 400 });
        }

        // Country matching validation (case-insensitive)
        if (agent.country?.toLowerCase() !== country.toLowerCase()) {
            return NextResponse.json({ message: "Selected agent does not belong to the property country" }, { status: 400 });
        }

        const listing = await Listing.create({
            title,
            description,
            price,
            type,
            category,
            location,
            country,
            assignedAgent,
            assignmentStatus: "pending",
            images: images ?? [],
            amenities: amenities ?? [],
            listedBy: session!.user.id,
            status: "Pending", // Force initial status
            // Structured fields (all optional)
            neighborhood,
            listedDate,
            pricePerSqft,
            estimatedMortgage,
            hoaFees,
            hoaFrequency,
            size,
            bedrooms,
            bathrooms,
            fullBaths,
            partialBaths,
            rooms,
            flooring,
            kitchen,
            cooling,
            heating,
            utilities,
            yearBuilt,
            builder,
            constructionMaterials,
            roofType,
            garageParking,
            specialFeatures,
            nearbySchoolsHospitals,
            shoppingTransport,
            communityFacilities,
            futureAmenities,
            mlsNumber,
            approval,
            ownershipType,
            agentName,
            dreNumber,
            phone,
            email,
        });

        return NextResponse.json({ message: "Listing created and sent for agent review", listing }, { status: 201 });
    } catch (err: unknown) {
        console.error("[POST /api/seller/listings]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
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
        const statusFilter = searchParams.get("status");

        const query: Record<string, unknown> = { listedBy: session!.user.id };
        if (statusFilter && ["Active", "Inactive", "Pending", "Sold"].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const listings = await Listing.find(query).sort({ createdAt: -1 }).lean();

        return NextResponse.json({ listings }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/seller/listings]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
