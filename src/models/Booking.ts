import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type BookingStatus =
  | "PendingAgent"
  | "PendingSeller"
  | "Confirmed"
  | "Completed"
  | "Cancelled"
  | "Expired";

export interface IBooking extends Document {
  listing: Types.ObjectId;
  buyer: Types.ObjectId;
  agent?: Types.ObjectId;
  /** Denormalized — same as listing.listedBy — enables fast per-seller queries */
  seller: Types.ObjectId;
  visitDate: Date;
  message?: string;
  status: BookingStatus;
  paymentStatus: "Unpaid" | "Paid";
  transactionId?: string;
  visitConfirmedAt?: Date;
  agentForwardedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema: Schema = new Schema(
  {
    listing: {
      type: Schema.Types.ObjectId,
      ref: "Listing",
      required: [true, "Listing reference is required"],
    },
    buyer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Buyer reference is required"],
    },
    agent: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller reference is required"],
    },
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },
    message: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: [
        "PendingAgent",
        "PendingSeller",
        "Confirmed",
        "Completed",
        "Cancelled",
        "Expired",
      ],
      default: "PendingAgent",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
    transactionId: {
      type: String,
      trim: true,
    },
    visitConfirmedAt: {
      type: Date,
    },
    agentForwardedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Fast lookups
BookingSchema.index({ seller: 1, status: 1 });
BookingSchema.index({ agent: 1, status: 1 });
BookingSchema.index({ buyer: 1 });

// This little trick helps us avoid errors in Next.js development mode.
// Since Next.js re-runs this code during hot-reloads, we delete the old model 
// so Mongoose can register it fresh with any new changes we've made.
if (mongoose.models.Booking) {
  delete mongoose.models.Booking;
}

const Booking: Model<IBooking> = mongoose.model<IBooking>("Booking", BookingSchema);

export default Booking;
