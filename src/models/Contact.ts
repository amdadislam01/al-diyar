import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContact extends Document {
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: Date;
}

const ContactSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            required: [true, "Email is required"],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
        },
        subject: {
            type: String,
            required: [true, "Subject is required"],
            trim: true,
        },
        message: {
            type: String,
            required: [true, "Message is required"],
            trim: true,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    },
);

// Delete cached model to prevent hot-reload issue
if (mongoose.models.Contact) {
    delete mongoose.models.Contact;
}

const Contact: Model<IContact> = mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;
