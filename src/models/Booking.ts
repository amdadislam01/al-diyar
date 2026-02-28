import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type BookingStatus = 'Pending' | 'Confirmed' | 'Cancelled';

export interface IBooking extends Document {
    listing: Types.ObjectId;
    buyer: Types.ObjectId;
    /** Denormalized — same as listing.listedBy — enables fast per-seller queries */
    seller: Types.ObjectId;
    visitDate: Date;
    message?: string;
    status: BookingStatus;
    createdAt: Date;
    updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
    {
        listing: {
            type: Schema.Types.ObjectId,
            ref: 'Listing',
            required: [true, 'Listing reference is required'],
        },
        buyer: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Buyer reference is required'],
        },
        seller: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller reference is required'],
        },
        visitDate: {
            type: Date,
            required: [true, 'Visit date is required'],
        },
        message: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Cancelled'],
            default: 'Pending',
        },
    },
    {
        timestamps: true,
    }
);

// Fast per-seller lookup
BookingSchema.index({ seller: 1, status: 1 });
// Fast per-buyer lookup
BookingSchema.index({ buyer: 1 });

const Booking: Model<IBooking> =
    mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema);

export default Booking;
