import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Listing from "@/models/Listing";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await dbConnect();
        const { id } = await params;

        const listing = await Listing.findById(id)
            .populate("listedBy", "name email phone")
            .lean();

        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        return NextResponse.json({ listing }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/listings/[id]]", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
