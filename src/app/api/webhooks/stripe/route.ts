import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import dbConnect from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Listing from "@/models/Listing";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    // Stripe sends the event data as a raw string. 
    // We also need the signature from the headers to verify this actually came from Stripe.
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    // If we're missing the signature or our own secret key, we can't trust this request.
    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ message: "Security error: missing signature or webhook secret" }, { status: 400 });
    }

    let event;

    try {
        // Here we're double-checking with Stripe that this message is authentic. 
        // This stops people from faking successful payments!
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err: any) {
        console.error(`Ouch! We couldn't verify the webhook: ${err.message}`);
        return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Now that we know it's a real event from Stripe, let's see what happened.
    if (event.type === "checkout.session.completed") {
        const session = event.data.object as any;
        // We stored these IDs earlier in the "metadata" field when we created the checkout session.
        const { bookingId, listingId } = session.metadata;

        try {
            await dbConnect();

            // Success! Let's update the booking to show it's been paid for.
            // We also store the Payment Intent ID (from Stripe) as our transaction reference.
            await Booking.findByIdAndUpdate(bookingId, {
                paymentStatus: "Paid",
                transactionId: session.payment_intent as string,
                status: "Completed", 
            });

            // Finally, we mark the property itself as "Sold" so nobody else tries to book it.
            await Listing.findByIdAndUpdate(listingId, {
                status: "Sold",
            });

            console.log(`✅ Great news! Payment confirmed and property marked as sold: ${bookingId}`);
        } catch (err: any) {
            // Something went wrong while saving our database. 
            // We should log this so we can fix it manually if needed.
            console.error(`Database error during payment confirmation: ${err.message}`);
            return NextResponse.json({ message: "Database update failed" }, { status: 500 });
        }
    }

    // Tell Stripe we received the message so they don't keep sending it.
    return NextResponse.json({ received: true }, { status: 200 });
}
