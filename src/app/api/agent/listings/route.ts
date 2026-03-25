import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

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

// GET /api/agent/listings — All listings managed by this agent
export async function GET(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const statusFilter = searchParams.get("status");

        // Query: Added by agent OR Assigned & Approved
        const query: Record<string, any> = {
            $or: [
                { listedBy: session!.user.id },
                { assignedAgent: session!.user.id, assignmentStatus: "approved" }
            ]
        };

        if (statusFilter && ["Active", "Inactive", "Pending", "Sold"].includes(statusFilter)) {
            query.status = statusFilter;
        }

        const User = (await import("@/models/User")).default;

        const listings = await Listing.find(query)
            .populate("listedBy", "name email phone image")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ listings }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agent/listings]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// POST /api/agent/listings — Create a new listing (agent)
export async function POST(req: NextRequest) {
    const { session, error } = await getAgentSession();
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
            country, // Ensure country is included
            images,
            amenities,
            // Seller Info
            sellerName,
            sellerEmail,
            sellerPhone,
            // Existing structured fields...
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

        if (!title || !description || price === undefined || !type || !category || !location || !country) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const listing = await Listing.create({
            title,
            description,
            price,
            type,
            category,
            location,
            country,
            images: images ?? [],
            amenities: amenities ?? [],
            listedBy: session!.user.id,
            assignedAgent: session!.user.id, // Agent listing themselves as agent
            assignmentStatus: "approved",    // Auto-approve agent's own listing
            status: "Active",                 // Start as active
            // Seller Info
            sellerName,
            sellerEmail,
            sellerPhone,
            // Other fields
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

        return NextResponse.json({ message: "Listing created successfully", listing }, { status: 201 });
    } catch (err: unknown) {
        console.error("[POST /api/agent/listings]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
