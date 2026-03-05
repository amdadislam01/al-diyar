import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb";
import Blog from "@/models/Blog";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const body = await request.json();

        // Enforce URL-safe slug
        const slugSource = body.slug || body.title || "";
        const sanitizedSlug = slugSource
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "") // Remove special characters
            .replace(/[\s_-]+/g, "-")  // Replace spaces, underscores, and hyphens with a single hyphen
            .replace(/^-+|-+$/g, "");   // Remove leading/trailing hyphens

        const blog = await Blog.create({
            ...body,
            slug: sanitizedSlug,
            author: {
                name: session.user.name,
                image: session.user.image,
                id: (session.user as any).id,
            }
        });

        return NextResponse.json(blog, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== "admin") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return NextResponse.json(blogs);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
