import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, saveOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        // Validate input
        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if user exists
        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json(
                { error: 'No account found with this email' },
                { status: 404 }
            );
        }

        // Check if already verified
        if (user.emailVerified) {
            return NextResponse.json(
                { error: 'Email is already verified. Please sign in.' },
                { status: 400 }
            );
        }

        // Generate new OTP
        const otp = generateOTP();
        await saveOTP(email, otp);

        // Send OTP email
        await sendOTPEmail(email, otp, user.name);

        return NextResponse.json(
            {
                message: 'A new OTP has been sent to your email',
                sent: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Resend OTP error:', error);
        return NextResponse.json(
            { error: 'An error occurred while sending OTP. Please try again.' },
            { status: 500 }
        );
    }
}
