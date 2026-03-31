import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IListing extends Document {
    title: string;
    description: string;
    price: number;
    type: "Sale" | "Rent";
    category: string;
    location: {
        address?: string;
        lat: number;
        lng: number;
    };
    images: string[];
    amenities: string[];
    listedBy: Types.ObjectId;
    status: "Active" | "Pending" | "Sold" | "Inactive";
    country: string;
    assignedAgent: Types.ObjectId;
    assignmentStatus: "pending" | "approved" | "rejected";
    createdAt: Date;
    updatedAt: Date;

    /* ── Location & Basic Info ── */
    neighborhood?: string;
    listedDate?: Date;

    /* ── Price & Mortgage ── */
    pricePerSqft?: number;
    estimatedMortgage?: number;
    hoaFees?: number;
    hoaFrequency?: string;

    /* ── Interior Details ── */
    size?: number;
    bedrooms?: number;
    bathrooms?: number;
    fullBaths?: number;
    partialBaths?: number;
    rooms?: string[];
    flooring?: string[];
    kitchen?: string;
    cooling?: string[];
    heating?: string[];
    utilities?: string[];

    /* ── Building & Exterior ── */
    yearBuilt?: number;
    builder?: string;
    constructionMaterials?: string[];
    roofType?: string;
    garageParking?: string;
    specialFeatures?: string[];

    /* ── Community & Amenities ── */
    nearbySchoolsHospitals?: string;
    shoppingTransport?: string;
    communityFacilities?: string[];
    futureAmenities?: string;

    /* ── Legal & Documentation ── */
    mlsNumber?: string;
    approval?: string;
    ownershipType?: string;

    /* ── Contact ── */
    agentName?: string;
    dreNumber?: string;
    phone?: string;
    email?: string;
    /* ── Seller Info (for Agent Listings) ── */
    sellerName?: string;
    sellerEmail?: string;
    sellerPhone?: string;
}

const ListingSchema: Schema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            minlength: [3, "Title must be at least 3 characters"],
        },
        description: {
            type: String,
            required: [true, "Description is required"],
            trim: true,
        },
        price: {
            type: Number,
            required: [true, "Price is required"],
            min: [0, "Price cannot be negative"],
        },
        type: {
            type: String,
            enum: ["Sale", "Rent"],
            required: [true, "Listing type (Sale/Rent) is required"],
        },
        category: {
            type: String,
            required: [true, "Category is required"],
            trim: true,
        },
        location: {
            address: { type: String, trim: true },
            lat: { type: Number, required: [true, "Latitude is required"] },
            lng: { type: Number, required: [true, "Longitude is required"] },
        },
        images: { type: [String], default: [] },
        amenities: { type: [String], default: [] },
        listedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller reference is required"],
        },
        status: {
            type: String,
            enum: ["Active", "Pending", "Sold", "Inactive"],
            default: "Pending", // Changed default to Pending for workflow
        },
        country: {
            type: String,
            required: [true, "Property country is required"],
            trim: true,
        },
        assignedAgent: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Assigned agent is required"],
        },
        assignmentStatus: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
        },

        /* ── Location & Basic Info ── */
        neighborhood: { type: String, trim: true },
        listedDate: { type: Date },

        /* ── Price & Mortgage ── */
        pricePerSqft: { type: Number },
        estimatedMortgage: { type: Number },
        hoaFees: { type: Number },
        hoaFrequency: { type: String, trim: true },

        /* ── Interior Details ── */
        size: { type: Number },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        fullBaths: { type: Number },
        partialBaths: { type: Number },
        rooms: { type: [String], default: [] },
        flooring: { type: [String], default: [] },
        kitchen: { type: String, trim: true },
        cooling: { type: [String], default: [] },
        heating: { type: [String], default: [] },
        utilities: { type: [String], default: [] },

        /* ── Building & Exterior ── */
        yearBuilt: { type: Number },
        builder: { type: String, trim: true },
        constructionMaterials: { type: [String], default: [] },
        roofType: { type: String, trim: true },
        garageParking: { type: String, trim: true },
        specialFeatures: { type: [String], default: [] },

        /* ── Community & Amenities ── */
        nearbySchoolsHospitals: { type: String, trim: true },
        shoppingTransport: { type: String, trim: true },
        communityFacilities: { type: [String], default: [] },
        futureAmenities: { type: String, trim: true },

        /* ── Legal & Documentation ── */
        mlsNumber: { type: String, trim: true },
        approval: { type: String, trim: true },
        ownershipType: { type: String, trim: true },

        /* ── Contact ── */
        agentName: { type: String, trim: true },
        dreNumber: { type: String, trim: true },
        phone: { type: String, trim: true },
        email: { type: String, trim: true },
        /* ── Seller Info (for Agent Listings) ── */
        sellerName: { type: String, trim: true },
        sellerEmail: { type: String, trim: true },
        sellerPhone: { type: String, trim: true },
    },
    {
        timestamps: true,
    },
);

// Indexes for fast queries
ListingSchema.index({ listedBy: 1, status: 1 });
ListingSchema.index({ assignedAgent: 1, assignmentStatus: 1, createdAt: -1 });
ListingSchema.index({ country: 1, status: 1 });

// Delete cached model to prevent hot-reload enum issues in Next.js development
if (mongoose.models.Listing) {
    delete mongoose.models.Listing;
}

const Listing: Model<IListing> = mongoose.model<IListing>("Listing", ListingSchema);

export default Listing;
