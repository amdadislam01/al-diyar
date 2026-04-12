import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

async function getAdminSession(req?: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== 'admin') {
        return { session: null, error: NextResponse.json({ error: 'Unauthorized' }, { status: 403 }) };
    }
    return { session, error: null };
}

// PATCH — approve/reject OR change role
export async function PATCH(request: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        const { userId, action, role } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'userId is required' }, { status: 400 });
        }

        await dbConnect();

        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        // --- Change role ---
        if (role) {
            const validRoles = ['user', 'agent', 'seller', 'admin'];
            if (!validRoles.includes(role)) {
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            }
            user.role = role;
            // Role changes by admin are automatically approved
            user.approvalStatus = 'approved';
            await user.save();
            return NextResponse.json({
                message: `Role changed to ${role}`,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, approvalStatus: user.approvalStatus },
            });
        }

        // --- Approve / Reject ---
        if (action) {
            if (action !== 'approve' && action !== 'reject') {
                return NextResponse.json({ error: 'action must be "approve" or "reject"' }, { status: 400 });
            }
            if (user.role !== 'agent' && user.role !== 'seller') {
                return NextResponse.json({ error: 'Only agent or seller accounts can be approved' }, { status: 400 });
            }
            user.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
            // If rejected, demote to 'user' role
            if (action === 'reject') {
                user.role = 'user';
            }
            await user.save();
            return NextResponse.json({
                message: `User ${action}d successfully`,
                user: { id: user._id, name: user.name, email: user.email, role: user.role, approvalStatus: user.approvalStatus },
            });
        }

        return NextResponse.json({ error: 'action or role is required' }, { status: 400 });
    } catch (err) {
        console.error('❌ Admin user action error:', err);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}

// GET — list users (all roles, optional filter by role/approvalStatus)
export async function GET(request: NextRequest) {
    const { session, error } = await getAdminSession();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const roleFilter = searchParams.get('role');       // 'user' | 'agent' | 'seller' | 'admin' | null (all)
        const statusFilter = searchParams.get('status');   // 'pending' | 'approved' | 'rejected' | null (all agent/seller)

        await dbConnect();

        // Build query
        const query: Record<string, unknown> = {};

        if (roleFilter) {
            query.role = roleFilter;
        } else if (statusFilter) {
            // If filtering by approval status, only show agent/seller
            query.role = { $in: ['agent', 'seller'] };
            query.approvalStatus = statusFilter;
        }
        // If neither, return ALL users

        const users = await User.find(query)
            .select('name email phone role approvalStatus companyName licenseNumber businessAddress website nid country createdAt')
            .sort({ createdAt: -1 })
            .lean();

        return NextResponse.json({ users });
    } catch (err) {
        console.error('❌ Get users error:', err);
        return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
    }
}
