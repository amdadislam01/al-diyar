import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IMessage extends Document {
    conversationId: Types.ObjectId;
    sender: Types.ObjectId;
    text: string;
    read: boolean;
    createdAt: Date;
}

const MessageSchema: Schema = new Schema(
    {
        conversationId: {
            type: Schema.Types.ObjectId,
            ref: 'Conversation',
            required: true,
        },
        sender: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String,
            required: true,
            trim: true,
        },
        read: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

// Index for performance
MessageSchema.index({ conversationId: 1, createdAt: 1 });

const Message: Model<IMessage> =
    mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default Message;
