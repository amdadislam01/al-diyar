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

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { session, error } = await getAgentSession();
    if (error) return error;

    const { id } = await params;

    try {
        await dbConnect();

        const listing = await Listing.findById(id);

        if (!listing) {
            return NextResponse.json({ message: "Listing not found" }, { status: 404 });
        }

        if (listing.assignedAgent.toString() !== session!.user.id) {
            return NextResponse.json({ message: "You are not authorized to approve this listing" }, { status: 403 });
        }

        if (listing.assignmentStatus !== "pending") {
            return NextResponse.json({ message: `Listing is already ${listing.assignmentStatus}` }, { status: 400 });
        }

        listing.assignmentStatus = "approved";
        listing.status = "Active";
        await listing.save();

        return NextResponse.json({ message: "Listing approved successfully", listing }, { status: 200 });
    } catch (err: unknown) {
        console.error("[PATCH /api/agent/assigned-listings/approve]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
