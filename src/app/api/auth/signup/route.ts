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
    role: 'user' | 'seller' | 'agent';
    approvalStatus: 'approved' | 'pending';
    emailVerified: boolean;
    companyName?: string;
    licenseNumber?: string;
    businessAddress?: string;
    website?: string;
    nid?: string;
    division?: string;
    district?: string;
    upazila?: string;
    country: string;
    postOffice?: string;
    postCode?: string;
    image?: string;
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
            nid,
            division,
            district,
            upazila,
            country,
            postOffice,
            postCode,
            image,
        } = body;

        if (!name || !email || !phone || !password || !role || !country) {
            return NextResponse.json(
                { error: 'All required fields must be provided' },
                { status: 400 }
            );
        }

        if (role !== 'user' && role !== 'agent' && role !== 'seller') {
            return NextResponse.json(
                { error: 'Invalid account type' },
                { status: 400 }
            );
        }

        // Agent requires companyName, licenseNumber, businessAddress, nid, country
        if (role === 'agent') {
            if (!companyName || !licenseNumber || !businessAddress || !nid || !country) {
                return NextResponse.json(
                    { error: 'All professional details (Company, License, Address, NID, and Country) are required for agents' },
                    { status: 400 }
                );
            }
        }

        // Seller requires businessAddress, nid, country
        if (role === 'seller') {
            if (!businessAddress || !nid || !country) {
                return NextResponse.json(
                    { error: 'NID, Address, and Country details are required for sellers' },
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
            country, // country added here for all roles
            // agents and sellers require admin approval; users are auto-approved
            approvalStatus: (role === 'agent' || role === 'seller') ? 'pending' : 'approved',
            emailVerified: false,
            image: image || undefined,
        };

        if (role === 'agent' || role === 'seller') {
            userData.businessAddress = businessAddress;
            userData.nid = nid;

            if (role === 'agent') {
                userData.companyName = companyName;
                userData.licenseNumber = licenseNumber;
                userData.postOffice = postOffice;
                userData.postCode = postCode;
            } else if (companyName) {
                userData.companyName = companyName;
            }

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