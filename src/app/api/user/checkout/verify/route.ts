import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const session_id = searchParams.get("session_id");

    if (!session_id) {
        return NextResponse.json({ message: "Session ID required" }, { status: 400 });
    }

    try {
        const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

        if (checkoutSession.payment_status === "paid") {
            const { bookingId, listingId } = checkoutSession.metadata as any;

            await dbConnect();

            // Perform safety update (in case webhook hasn't arrived)
            await Booking.findByIdAndUpdate(bookingId, {
                paymentStatus: "Paid",
                status: "Completed",
                transactionId: checkoutSession.payment_intent as string,
            });

            await Listing.findByIdAndUpdate(listingId, {
                status: "Sold",
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, status: checkoutSession.payment_status });
    } catch (err: any) {
        console.error("[STRIPE_VERIFY_ERROR]", err);
        return NextResponse.json({ message: err.message }, { status: 500 });
    }
}
