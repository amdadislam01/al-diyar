import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const country = searchParams.get("country");

        if (!country) {
            return NextResponse.json({ message: "Country parameter is required" }, { status: 400 });
        }

        await dbConnect();

        // Find approved agents in the specified country (case-insensitive)
        const agents = await User.find({
            role: "agent",
            approvalStatus: "approved",
            country: { $regex: new RegExp(`^${country}$`, "i") }
        })
        .select("name email companyName country image")
        .lean();

        return NextResponse.json({ agents }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agents]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
