import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const country = searchParams.get("country");
        const limit = searchParams.get("limit");
        const sort = searchParams.get("sort");

        await dbConnect();

        // Construct query
        const query: any = {
            role: "agent",
            approvalStatus: "approved"
        };

        if (country) {
            query.country = { $regex: new RegExp(`^${country}$`, "i") };
        }

        let agentsQuery = User.find(query).select("name email companyName country image");

        if (sort === "new") {
            agentsQuery = agentsQuery.sort({ createdAt: -1 });
        }

        if (limit) {
            agentsQuery = agentsQuery.limit(parseInt(limit));
        }

        const agents = await agentsQuery.lean();

        if (country) {
            query.country = { $regex: new RegExp(`^${country}$`, "i") };
        }

        // Find approved agents
        const agents = await User.find(query)
        .select("name email companyName country image phone")
        .lean();
        return NextResponse.json({ agents }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agents]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
