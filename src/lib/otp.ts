import OTP from '@/models/OTP';
import dbConnect from './mongodb';

/**
 * Generate a random 6-digit OTP
 */
export function generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Save OTP to database with expiration time
 * @param email 
 * @param otp 
 * @returns 
 */
export async function saveOTP(email: string, otp: string): Promise<void> {
    await dbConnect();

    await OTP.deleteMany({ email: email.toLowerCase() });

    // Create new OTP 
    await OTP.create({
        email: email.toLowerCase(),
        otp,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000), 
    });
}

/**
 * Verify OTP against stored value
 * @param email 
 * @param otp 
 * @returns 
 */
export async function verifyOTP(email: string, otp: string): Promise<boolean> {
    await dbConnect();

    const otpRecord = await OTP.findOne({
        email: email.toLowerCase(),
        otp,
    });

    if (!otpRecord) {
        return false;
    }

    // Check if OTP is expired
    if (otpRecord.expiresAt < new Date()) {
        await OTP.deleteOne({ _id: otpRecord._id });
        return false;
    }

    // OTP is valid, delete it so it can't be reused
    await OTP.deleteOne({ _id: otpRecord._id });
    return true;
}


export async function cleanupExpiredOTPs(): Promise<void> {
    await dbConnect();
    await OTP.deleteMany({
        expiresAt: { $lt: new Date() },
    });
}
