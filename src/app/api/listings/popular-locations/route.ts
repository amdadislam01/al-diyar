import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function GET() {
    try {
        await dbConnect();

        // Aggregate listings by country
        const popularLocations = await Listing.aggregate([
            { $match: { status: "Active" } },
            {
                $group: {
                    _id: "$country",
                    count: { $sum: 1 },
                    // Get the first image from one of the listings in this country
                    image: { $first: { $arrayElemAt: ["$images", 0] } },
                }
            },
            { $sort: { count: -1 } },
            { $limit: 8 }, // Get top 8 countries
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    country: "$_id", // Using same as name for consistency
                    count: 1,
                    image: 1,
                }
            }
        ]);

        return NextResponse.json({ locations: popularLocations }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/listings/popular-locations]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
