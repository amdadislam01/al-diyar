import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { verifyOTP } from '@/lib/otp';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, otp } = body;

        // Validate input
        if (!email || !otp) {
            return NextResponse.json(
                { error: 'Email and OTP are required' },
                { status: 400 }
            );
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return NextResponse.json(
                { error: 'OTP must be a 6-digit number' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Verify OTP
        const isValid = await verifyOTP(email, otp);

        if (!isValid) {
            return NextResponse.json(
                { error: 'Invalid or expired OTP. Please request a new one.' },
                { status: 400 }
            );
        }

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { emailVerified: true },
            { new: true }
        );

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: 'Email verified successfully! You can now sign in.',
                verified: true,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('OTP verification error:', error);
        return NextResponse.json(
            { error: 'An error occurred during verification. Please try again.' },
            { status: 500 }
        );
    }
}
