import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Contact from "@/models/Contact";

export async function POST(req: Request) {
    try {
        await dbConnect();
        const body = await req.json();
        const { name, email, subject, message } = body;

        // Basic validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        // Email format validation (redundant with Mongoose but good for quick response)
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        const newContact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        return NextResponse.json({ message: "Contact request sent successfully", contact: newContact }, { status: 201 });
    } catch (error: any) {
        console.error("API Contact Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
