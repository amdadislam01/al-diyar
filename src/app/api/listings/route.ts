import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const q = searchParams.get("q");
        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const bedrooms = searchParams.get("bedrooms");
        const bathrooms = searchParams.get("bathrooms");
        const country = searchParams.get("country");

        // Base query: Only active listings for public view
        const query: any = { status: "Active" };

        // Search text (title, description, location)
        if (q) {
            query.$or = [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
                { "location.address": { $regex: q, $options: "i" } },
                { neighborhood: { $regex: q, $options: "i" } },
            ];
        }

        if (category && category !== "All") {
            query.category = category;
        }

        if (type && type !== "All") {
            query.type = type;
        }

        if (country) {
            query.country = country;
        }

        // Numerical filters
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        if (bedrooms && bedrooms !== "any") {
            if (bedrooms === "5+") {
                query.bedrooms = { $gte: 5 };
            } else {
                query.bedrooms = Number(bedrooms);
            }
        }

        if (bathrooms && bathrooms !== "any") {
            if (bathrooms === "5+") {
                query.bathrooms = { $gte: 5 };
            } else {
                query.bathrooms = Number(bathrooms);
            }
        }

        const listings = await Listing.find(query)
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ listings }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/listings]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
