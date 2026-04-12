import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { sendResetPasswordEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json(
                { error: 'Email is required' },
                { status: 400 }
            );
        }

        await dbConnect();

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return NextResponse.json({
                message: 'If an account with that email exists, we have sent a reset link.',
            });
        }

        // Generate a random token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Hash the token to store in the database
        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expiration (1 hour from now)
        const tokenExpiry = new Date(Date.now() + 3600000);

        // Update user model using findOneAndUpdate to ensure it's saved correctly
        const updatedUser = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: tokenExpiry
            },
            { new: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'Failed to process request. Please try again.' },
                { status: 500 }
            );
        }


        // Send the email with the UNHASHED token
        await sendResetPasswordEmail(user.email, resetToken, user.name);

        return NextResponse.json({
            message: 'If an account with that email exists, we have sent a reset link.',
        });
    } catch (error: unknown) {
        console.error('❌ Forgot password error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
