import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        await dbConnect();
        const { name } = await req.json();

        if (!name || name.trim().length < 2) {
            return NextResponse.json({ message: 'Name must be at least 2 characters' }, { status: 400 });
        }

        await User.findByIdAndUpdate(session.user.id, { name: name.trim() });
        return NextResponse.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('[PATCH /api/user/profile]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
