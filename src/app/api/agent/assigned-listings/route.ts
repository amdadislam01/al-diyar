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
    return { session, error: null };
}

export async function GET(req: NextRequest) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status") || "pending";

        const query = {
            assignedAgent: session!.user.id,
            assignmentStatus: status,
        };

        const listings = await Listing.find(query)
            .populate("listedBy", "name email phone")
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ listings }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agent/assigned-listings]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
