import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IConversation extends Document {
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    updatedAt: Date;
    createdAt: Date;
}

const ConversationSchema: Schema = new Schema(
    {
        participants: [{
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        }],
        lastMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
    },
    {
        timestamps: true,
    }
);

// Index for performance
ConversationSchema.index({ participants: 1 });

const Conversation: Model<IConversation> =
    mongoose.models.Conversation || mongoose.model<IConversation>('Conversation', ConversationSchema);

export default Conversation;
