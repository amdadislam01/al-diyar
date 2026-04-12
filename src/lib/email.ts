import nodemailer from 'nodemailer';

// Create a transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

/**
 * Send OTP email to user
 * @param email 
 * @param otp 
 * @param name 
 */
export async function sendOTPEmail(email: string, otp: string, name?: string): Promise<void> {
    const mailOptions = {
        from: `Al-Diyar <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Verify Your Email - Al-Diyar',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Al-Diyar</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Email Verification</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                                ${name ? `Hello ${name},` : 'Hello,'}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                                Thank you for signing up with Al-Diyar! To complete your registration, please verify your email address using the OTP below:
                            </p>
                            
                            <!-- OTP Box -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center" style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border: 2px dashed #667eea;">
                                        <div style="font-size: 36px; font-weight: bold; color: #667eea; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                                            ${otp}
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 20px;">
                                This OTP will expire in <strong>05 minutes</strong>. If you didn't request this verification, please ignore this email.
                            </p>
                            
                            <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 24px;">
                                Best regards,<br>
                                <strong>Al-Diyar Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 18px;">
                                &copy; ${new Date().getFullYear()} Al-Diyar. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('❌ Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}

/**
 * Send Password Reset email to user
 * @param email 
 * @param token 
 * @param name 
 */
export async function sendResetPasswordEmail(email: string, token: string, name?: string): Promise<void> {
    const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

    const mailOptions = {
        from: `Al-Diyar <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Reset Your Password - Al-Diyar',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <table role="presentation" style="width: 600px; border-collapse: collapse; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center; background: linear-gradient(135deg, #f6ad55 0%, #ed8936 100%); border-radius: 8px 8px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: bold;">Al-Diyar</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px;">Password Reset Request</p>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                                ${name ? `Hello ${name},` : 'Hello,'}
                            </p>
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 16px; line-height: 24px;">
                                You recently requested to reset your password for your Al-Diyar account. Click the button below to set a new password:
                            </p>
                            
                            <!-- Button -->
                            <table role="presentation" style="width: 100%; border-collapse: collapse; margin: 30px 0;">
                                <tr>
                                    <td align="center">
                                        <a href="${resetUrl}" style="background-color: #ed8936; color: #ffffff; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                                            Reset Password
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px 0; color: #333333; font-size: 14px; line-height: 20px;">
                                Alternatively, you can copy and paste the following link into your browser:
                            </p>
                            <p style="margin: 0 0 20px 0; color: #ed8936; font-size: 14px; word-break: break-all;">
                                ${resetUrl}
                            </p>
                            
                            <p style="margin: 0 0 20px 0; color: #666666; font-size: 14px; line-height: 20px;">
                                This link will expire in <strong>1 hour</strong>. If you didn't request a password reset, please ignore this email.
                            </p>
                            
                            <p style="margin: 30px 0 0 0; color: #333333; font-size: 16px; line-height: 24px;">
                                Best regards,<br>
                                <strong>Al-Diyar Team</strong>
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 30px; text-align: center; background-color: #f8f9fa; border-radius: 0 0 8px 8px;">
                            <p style="margin: 0; color: #999999; font-size: 12px; line-height: 18px;">
                                &copy; ${new Date().getFullYear()} Al-Diyar. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('❌ Error sending password reset email:', error);
        throw new Error('Failed to send password reset email');
    }
}

export async function verifyEmailConfig(): Promise<boolean> {
    try {
        await transporter.verify();
        return true;
    } catch (error) {
        console.error('❌ Email configuration error:', error);
        return false;
    }
}
