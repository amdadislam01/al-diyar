import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import Listing from "@/models/Listing";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> | { id: string } }
) {
    try {
        await dbConnect();
        
        // Handle Next.js 15 async params while keeping compatibility
        const resolvedParams = await Promise.resolve(params);
        const { id } = resolvedParams;

        // Fetch agent info
        const agent = await User.findOne({ _id: id, role: "agent" }).select("-password");
        
        if (!agent) {
            return NextResponse.json({ message: "Agent not found" }, { status: 404 });
        }

        // Fetch properties assigned to this agent
        const listings = await Listing.find({ 
            assignedAgent: id,
            status: "Active"
        })
        .sort({ createdAt: -1 })
        .populate("listedBy", "name email image");

        return NextResponse.json({ agent, listings }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agents/[id]]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
