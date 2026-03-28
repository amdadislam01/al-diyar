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

        const pipeline: any[] = [
            { $match: query },
            {
                $lookup: {
                    from: "listings",
                    localField: "_id",
                    foreignField: "assignedAgent",
                    as: "properties"
                }
            },
            {
                $addFields: {
                    listingCount: { $size: "$properties" }
                }
            },
            {
                $project: {
                    name: 1,
                    email: 1,
                    companyName: 1,
                    country: 1,
                    image: 1,
                    phone: 1,
                    listingCount: 1,
                    createdAt: 1
                }
            }
        ];

        if (sort === "new") {
            pipeline.push({ $sort: { createdAt: -1 } });
        } else {
            // Sort by listing count descending as the default
            pipeline.push({ $sort: { listingCount: -1, createdAt: -1 } });
        }

        if (limit) {
            pipeline.push({ $limit: parseInt(limit, 10) });
        }

        const agents = await User.aggregate(pipeline).exec();

        return NextResponse.json({ agents }, { status: 200 });
    } catch (err: unknown) {
        console.error("[GET /api/agents]", err);
        const message = err instanceof Error ? err.message : "Internal server error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
