import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import { generateOTP, saveOTP } from '@/lib/otp';
import { sendOTPEmail } from '@/lib/email';


interface UserData {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: 'user' | 'agent';
    emailVerified: boolean;
    companyName?: string;
    licenseNumber?: string;
    businessAddress?: string;
    website?: string;
}


interface MongooseError extends Error {
    name: 'ValidationError';
    errors: {
        [key: string]: {
            message: string;
        };
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            name,
            email,
            phone,
            password,
            role,
            companyName,
            licenseNumber,
            businessAddress,
            website,
        } = body;

        if (!name || !email || !phone || !password || !role) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        if (role !== 'user' && role !== 'agent') {
            return NextResponse.json(
                { error: 'Invalid account type' },
                { status: 400 }
            );
        }

        if (role === 'agent') {
            if (!companyName || !licenseNumber || !businessAddress) {
                return NextResponse.json(
                    { error: 'Company name, license number, and business address are required for agents' },
                    { status: 400 }
                );
            }
        }

        await dbConnect();

        const emailLower = email.toLowerCase();
        const existingUser = await User.findOne({ email: emailLower });

        if (existingUser) {
            if (existingUser.emailVerified) {
                return NextResponse.json(
                    { error: 'An account with this email already exists' },
                    { status: 409 }
                );
            } else {
                const otp = generateOTP();
                await saveOTP(emailLower, otp);
                await sendOTPEmail(emailLower, otp, name);

                return NextResponse.json({
                    message: 'Account exists but not verified. A new OTP has been sent to your email.',
                    requiresVerification: true,
                });
            }
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const userData: UserData = {
            name,
            email: emailLower,
            phone,
            password: hashedPassword,
            role,
            emailVerified: false,
        };

        if (role === 'agent') {
            userData.companyName = companyName;
            userData.licenseNumber = licenseNumber;
            userData.businessAddress = businessAddress;
            if (website) {
                userData.website = website;
            }
        }

        const user = await User.create(userData);

        const otp = generateOTP();
        await saveOTP(emailLower, otp);
        await sendOTPEmail(emailLower, otp, name);

        return NextResponse.json(
            {
                message: 'Account created successfully. Please check your email for the OTP.',
                userId: user._id,
                requiresVerification: true,
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('❌ Signup error:', error);


        if (error instanceof Error && error.name === 'ValidationError') {
            const validationError = error as MongooseError;
            const messages = Object.values(validationError.errors).map((err) => err.message);
            return NextResponse.json(
                { error: messages.join(', ') },
                { status: 400 }
            );
        }

        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        return NextResponse.json(
            {
                error: 'An error occurred during signup. Please try again.',
                ...(process.env.NODE_ENV === 'development' && {
                    details: errorMessage
                })
            },
            { status: 500 }
        );
    }
}