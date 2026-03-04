import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    role: 'user' | 'seller' | 'agent' | 'admin';
    approvalStatus: 'approved' | 'pending' | 'rejected';
    emailVerified: boolean;
    provider?: string;
    // Agent / Seller specific fields
    companyName?: string;
    licenseNumber?: string;
    businessAddress?: string;
    website?: string;
    nid?: string;
    division?: string;
    district?: string;
    upazila?: string;
    postOffice?: string;
    postCode?: string;
    image?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters'],
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 'Invalid email address'],
        },
        phone: {
            type: String,
            required: [
                function (this: any) {
                    // Only required for credentials provider
                    return !this.provider || this.provider === 'credentials';
                },
                'Phone number is required',
            ],
            validate: {
                validator: function (v: string) {
                    // Skip validation if not provided (for social login)
                    if (!v && (this as unknown as IUser).provider !== 'credentials') return true;
                    // Otherwise validate format
                    return /^(\+?880|0)?1[3-9]\d{8}$/.test(v);
                },
                message: 'Invalid Bangladesh phone number',
            },
        },
        password: {
            type: String,
            required: [
                function (this: any) {
                    // Only required for credentials provider
                    return !this.provider || this.provider === 'credentials';
                },
                'Password is required',
            ],
            minlength: [8, 'Password must be at least 8 characters'],
        },
        provider: {
            type: String,
            default: 'credentials',
        },
        role: {
            type: String,
            enum: ['user', 'seller', 'agent', 'admin'],
            required: [true, 'Account type is required'],
            default: 'user',
        },
        approvalStatus: {
            type: String,
            enum: ['approved', 'pending', 'rejected'],
            // No default here — enforced via pre-save hook below
        },
        emailVerified: {
            type: Boolean,
            default: false,
        },
        // Agent-specific fields
        companyName: {
            type: String,
            trim: true,
        },
        licenseNumber: {
            type: String,
            trim: true,
        },
        businessAddress: {
            type: String,
            trim: true,
        },
        website: {
            type: String,
            trim: true,
            match: [/^https?:\/\/.+/, 'Invalid URL format'],
        },
        nid: {
            type: String,
            trim: true,
        },
        division: {
            type: String,
            trim: true,
        },
        district: {
            type: String,
            trim: true,
        },
        upazila: {
            type: String,
            trim: true,
        },
        postOffice: {
            type: String,
            trim: true,
        },
        postCode: {
            type: String,
            trim: true,
        },
        image: {
            type: String,
            trim: true,
        },
        resetPasswordToken: {
            type: String,
        },
        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

// ─── Auto-assign approvalStatus before every save ────────────────────────────
// Rule:
//   agent / seller  → 'pending'  (must wait for admin approval)
//   user  / admin   → 'approved' (auto-approved)
//
// This runs ONLY when approvalStatus is not already set (new doc or explicit change).
UserSchema.pre('save', async function () {
    if (!this.approvalStatus) {
        const role = this.role as string;
        if (role === 'agent' || role === 'seller') {
            this.approvalStatus = 'pending';
        } else {
            this.approvalStatus = 'approved';
        }
    }
});

// Handle model recompilation in Next.js development
if (mongoose.models.User) {
    // If the model exists but is missing our new fields, we might need a refresh
    // In development, this is common when editing the schema
    const existingModel = mongoose.models.User;
    if (process.env.NODE_ENV === 'development' && !existingModel.schema.paths.nid) {
        delete (mongoose.models as any).User;
    }
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;


