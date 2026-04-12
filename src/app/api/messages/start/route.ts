import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Conversation from '@/models/Conversation';
import User from '@/models/User';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const recipientId = typeof body.recipientId === 'object' ? body.recipientId._id : body.recipientId;
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (session.user.id === recipientId) {
            return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 });
        }

        await dbConnect();
        const { Types } = require('mongoose');

        const userObjectId = new Types.ObjectId(session.user.id);
        const recipientObjectId = new Types.ObjectId(recipientId);

        // Check if conversation already exists (using explicit ObjectIds)
        let conversation = await Conversation.findOne({
            participants: { $all: [userObjectId, recipientObjectId] }
        });

        if (!conversation) {
            try {
                conversation = await Conversation.create({
                    participants: [userObjectId, recipientObjectId]
                });
            } catch (err) {
                console.error("Failed to create conversation:", err);
                return NextResponse.json({ error: 'Failed to create conversation' }, { status: 500 });
            }
        }

        return NextResponse.json({ conversationId: conversation._id });
    } catch (error) {
        console.error('Error starting conversation:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
