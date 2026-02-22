import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from './mongodb';
import User, { IUser } from '@/models/User';

import GoogleProvider from 'next-auth/providers/google';

declare module 'next-auth' {
    interface User {
        role: 'user' | 'agent';
    }

    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            role: 'user' | 'agent';
        };
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id: string;
        role: 'user' | 'agent';
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
                if (account?.provider === 'google') {
                    const rawEmail = user.email;
                    if (!rawEmail) {
                        console.error("Google Sign-In: No email provided");
                        return false;
                    }

                    const userEmail: string = rawEmail;

                    await dbConnect();

                    // Check if user exists
                    const existingUser = await User.findOne({ email: userEmail.toLowerCase() } as Pick<IUser, 'email'>);

                    if (existingUser) {
                        if (existingUser.provider === 'credentials' && !existingUser.emailVerified) {
                            existingUser.emailVerified = true;
                            existingUser.provider = 'google';

                            if (user.image) {
                                existingUser.image = user.image;
                            }
                            await existingUser.save();
                        }
                        return true;
                    } else {
                        console.log("Creating new user from Google profile");
                        // Create new user from Google profile
                        await User.create({
                            name: user.name,
                            email: userEmail.toLowerCase(),
                            role: 'user',
                            emailVerified: true,
                            provider: 'google',
                            image: user.image,
                        } as Partial<IUser>);
                        return true;
                    }
                }
                return true;
            } catch (error) {
                console.error("Google Sign-In Error:", error);
                return false;
            }
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
            }

            if (token.email) {
                const email = token.email as string;
                await dbConnect();

                const dbUser = await User.findOne({ email } as Pick<IUser, 'email'>);
                if (dbUser) {
                    token.id = dbUser._id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id;
                session.user.role = token.role;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};
