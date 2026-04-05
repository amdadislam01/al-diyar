import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Listing from '@/models/Listing';

import stripe from '@/lib/stripe';

async function getUserSession() {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return { session: null, error: NextResponse.json({ message: 'Unauthorized' }, { status: 401 }) };
    }
    return { session, error: null };
}

export async function POST(req: NextRequest) {
    const { session, error } = await getUserSession();
    if (error) return error;

    try {
        await dbConnect();
        const { bookingId } = await req.json();

        // Let's find this specific booking and make sure it actually belongs to the person asking for it.
        // We also need the property details (listing) to know how much to charge!
        const booking = await Booking.findOne({ _id: bookingId, buyer: session!.user.id }).populate('listing');
        if (!booking) {
            return NextResponse.json({ message: 'We couldn\'t find that booking in our records.' }, { status: 404 });
        }

        // Safety check: a buyer can only pay once the visit has been marked as "Completed" by the seller/agent.
        if (booking.status !== 'Completed') {
            return NextResponse.json({ message: 'Hold on! The property visit needs to be finished and confirmed before you can pay.' }, { status: 400 });
        }

        const listing = booking.listing as any;
        if (!listing) {
            return NextResponse.json({ message: 'The property details seem to be missing. Please contact support.' }, { status: 404 });
        }

        // We need the origin URL so we know where to send the user back after they finish paying on Stripe.
        const origin = req.headers.get('origin');

        // Time to talk to Stripe! We're setting up a secure checkout page for this specific property.
        // Note: Stripe wants the price in the smallest unit (cents/paisa), so we multiply by 100.
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'bdt',
                        product_data: {
                            name: listing.title,
                            description: `Final payment for property visit/booking: ${listing.title}`,
                            images: listing.images?.length > 0 ? [listing.images[0]] : [],
                        },
                        unit_amount: Math.round(listing.price * 100), 
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // If they succeed, we add success=true to the URL so the dashboard knows to show a "Thank You" message.
            success_url: `${origin}/dashboard/bookings?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/dashboard/bookings?canceled=true`,
            // We store these IDs in metadata so our webhook can update the database even if the user closes their browser.
            metadata: {
                bookingId: booking._id.toString(),
                listingId: listing._id.toString(),
                buyerId: session!.user.id,
            },
            customer_email: session!.user.email as string,
        });

        return NextResponse.json({ 
            url: stripeSession.url,
            message: 'Stripe checkout session is ready! Redirecting...' 
        });
    } catch (err: any) {
        // Something went wrong on the server or with the Stripe API.
        console.error('[STRIPE_PAY_ERROR]', err);
        return NextResponse.json({ 
            message: err.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? err : undefined 
        }, { status: 500 });
    }
}
