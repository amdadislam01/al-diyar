import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { token, password } = body;

        if (!token || !password) {
            return NextResponse.json(
                { error: 'Token and password are required' },
                { status: 400 }
            );
        }

        console.log('🔑 Received reset request with token (unhashed):', token);

        if (password.length < 8) {
            return NextResponse.json(
                { error: 'Password must be at least 8 characters long' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Hash the token provided in the URL to compare with the one in the database
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        console.log('📝 Generated Hash for comparison:', hashedToken);

        // Find user with token and valid expiration
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() },
        });

        if (!user) {
            console.log('❌ No user found with this hashed token or it has expired.');
            const userWithToken = await User.findOne({ resetPasswordToken: hashedToken });
            if (userWithToken) {
                console.log('⏰ Found user with token but it is EXPIRED. Expiry:', userWithToken.resetPasswordExpires);
            } else {
                console.log('🔍 Token not found in database at all.');
            }

            return NextResponse.json(
                { error: 'Password reset token is invalid or has expired.' },
                { status: 400 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Update user
        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        return NextResponse.json({
            message: 'Password has been reset successfully.',
        });
    } catch (error: unknown) {
        console.error('❌ Reset password error:', error);
        return NextResponse.json(
            { error: 'An error occurred. Please try again later.' },
            { status: 500 }
        );
    }
}
