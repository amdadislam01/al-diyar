import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IListing extends Document {
    title: string;
    description: string;
    price: number;
    type: 'Sale' | 'Rent';
    category: string;
    location: {
        address?: string;
        lat: number;
        lng: number;
    };
    images: string[];
    amenities: string[];
    listedBy: Types.ObjectId;
    status: 'Active' | 'Inactive';
    createdAt: Date;
    updatedAt: Date;
}

const ListingSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, 'Price is required'],
            min: [0, 'Price cannot be negative'],
        },
        type: {
            type: String,
            enum: ['Sale', 'Rent'],
            required: [true, 'Listing type (Sale/Rent) is required'],
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true,
            // e.g. "Apartment", "Villa", "Land", "Office", "Shop"
        },
        location: {
            address: {
                type: String,
                trim: true,
            },
            lat: {
                type: Number,
                required: [true, 'Latitude is required'],
            },
            lng: {
                type: Number,
                required: [true, 'Longitude is required'],
            },
        },
        images: {
            type: [String],
            default: [],
        },
        amenities: {
            type: [String],
            default: [],
        },
        listedBy: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Seller reference is required'],
        },
        status: {
            type: String,
            enum: ['Active', 'Inactive'],
            default: 'Active',
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast per-seller queries
ListingSchema.index({ listedBy: 1, status: 1 });

const Listing: Model<IListing> =
    mongoose.models.Listing || mongoose.model<IListing>('Listing', ListingSchema);

export default Listing;
