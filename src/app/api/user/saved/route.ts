import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Listing from "@/models/Listing";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const user = await User.findById(session.user.id).populate({
            path: 'savedListings',
            model: Listing,
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Filter out any nulls in case matching failed for some listings
        const savedListings = (user.savedListings || []).filter(item => item !== null);

        return NextResponse.json({ savedListings });
    } catch (err) {
        console.error("[GET /api/user/saved]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const { listingId } = await req.json();

        if (!listingId) {
            return NextResponse.json({ message: "Listing ID is required" }, { status: 400 });
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if listing exists
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        if (!user.savedListings) {
            user.savedListings = [];
        }

        const isSaved = user.savedListings.some(id => id.toString() === listingId);

        if (isSaved) {
            // Remove from saved
            user.savedListings = user.savedListings.filter(id => id.toString() !== listingId) as any;
        } else {
            // Add to saved
            user.savedListings.push(listingId as any);
        }

        await user.save();

        return NextResponse.json({ 
            message: isSaved ? "Removed from saved listings" : "Added to saved listings",
            isSaved: !isSaved
        });
    } catch (err) {
        console.error("[POST /api/user/saved]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
