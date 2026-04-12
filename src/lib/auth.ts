import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User, { IUser } from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';
import GithubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
    interface User {
        role: 'user' | 'seller' | 'agent' | 'admin';
        approvalStatus?: 'approved' | 'pending' | 'rejected';
        image?: string | null;
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            role: 'user' | 'seller' | 'agent' | 'admin';
            approvalStatus?: 'approved' | 'pending' | 'rejected';
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'user' | 'seller' | 'agent' | 'admin';
        approvalStatus?: 'approved' | 'pending' | 'rejected';
        image?: string | null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID!,
            clientSecret: process.env.GITHUB_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Email and password are required');
                }

                await dbConnect();
                // Find user by email
                const user = await User.findOne({ email: credentials.email.toLowerCase() });

                if (!user) {
                    throw new Error('Invalid email or password');
                }

                // Check if user verified
                if (!user.emailVerified && user.provider === 'credentials') {
                    throw new Error('Please verify your email before signing in');
                }

                // If user registered with Google, they shouldn't use password login
                if (user.provider === 'google') {
                    throw new Error('Please login with Google');
                }

                // Verify password
                if (!user.password) {
                    throw new Error('Invalid email or password');
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                // Return user
                return {
                    id: user._id.toString(),
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    approvalStatus: user.approvalStatus,
                };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/signin',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider === 'google' || account?.provider === 'github') {
                    const rawEmail = user.email;
                    if (!rawEmail) {
                        console.error(`${account.provider === 'google' ? 'Google' : 'GitHub'} Sign-In: No email provided`);
                        return false;
                    }

                    const userEmail: string = rawEmail;

                    await dbConnect();

                    // Atomically update or create user
                    const updatedUser = await User.findOneAndUpdate(
                        { email: userEmail.toLowerCase() },
                        {
                            $set: {
                                name: user.name,
                                emailVerified: true,
                                provider: account.provider,
                                image: user.image || undefined,
                            },
                            // Only set these on INSERT (new user) — existing users keep their role/approvalStatus
                            $setOnInsert: {
                                role: 'user',
                                approvalStatus: 'approved',
                            },
                        },
                        {
                            upsert: true,
                            new: true,
                            setDefaultsOnInsert: true,
                        }
                    );

                    if (updatedUser) {
                    }
                    return true;
                }
                return true;
            } catch (error) {
                console.error("❌ Google Sign-In Callback Error:", error);
                if (error instanceof Error) {
                    console.error("Error Message:", error.message);
                    console.error("Error Name:", error.name);
                    // Log validation errors specifically if they exist
                    if (error.name === 'ValidationError') {
                        console.error("Validation Details:", JSON.stringify((error as any).errors, null, 2));
                    }
                }
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.image = user.image ?? null;
            }

            if (token.email) {
                const email = token.email as string;
                await dbConnect();

                const dbUser = await User.findOne({ email } as Pick<IUser, 'email'>);
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                    token.approvalStatus = dbUser.approvalStatus;
                    token.image = dbUser.image ?? null;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
                session.user.approvalStatus = token.approvalStatus;
                session.user.image = token.image ?? session.user.image;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
