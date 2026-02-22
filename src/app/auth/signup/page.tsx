'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import OTPVerification from '@/components/OTPVerification';

type FormData = {
    name: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    companyName?: string;
    licenseNumber?: string;
    businessAddress?: string;
    website?: string;
    terms: boolean;
};

export default function SignUpPage() {
    const router = useRouter();
    const [role, setrole] = useState<'user' | 'agent'>('user');
    const [showOTP, setShowOTP] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        mode: 'onBlur',
    });

    const password = watch('password');

    const onSubmit = async (data: FormData) => {
        setApiError('');

        try {
            const response = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    role,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setUserEmail(data.email);
                setShowOTP(true);
            } else {
                setApiError(result.error || 'Signup failed. Please try again.');
            }
        } catch (error) {
            setApiError('An error occurred. Please try again.');
        }
    };

    const handleOTPVerified = () => {
        setShowOTP(false);
        router.push('/auth/signin?verified=true');
    };

    const handleOTPCancel = () => {
        setShowOTP(false);
    };

    const handleSocialLogin = (provider: string) => {
        if (provider === 'Google') {
            import('next-auth/react').then(({ signIn }) => {
                signIn('google', { callbackUrl: '/dashboard' });
            });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100">
            <div className="w-full max-w-5xl">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-100 mb-2">Al-Diyar</h1>
                    <p className="text-text-muted">Create your account to get started</p>
                </div>

                {/* Card */}
                <div className="bg-light rounded-2xl p-8 lg:p-10 shadow-[var(--shadow-soft)] border border-surface-300">
                    {/* Account Type  */}
                    <div className="mb-8">
                        <div className="grid grid-cols-2 gap-3 ">
                            <button
                                type="button"
                                onClick={() => setrole('user')}
                                className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${role === 'user'
                                    ? 'bg-primary-100 text-light shadow-[var(--shadow-glow)]'
                                    : 'bg-surface-tonal-100 text-text-main hover:bg-surface-tonal-200'
                                    }`}
                            >
                                User
                            </button>
                            <button
                                type="button"
                                onClick={() => setrole('agent')}
                                className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${role === 'agent'
                                    ? 'bg-primary-100 text-light shadow-[var(--shadow-glow)]'
                                    : 'bg-surface-tonal-100 text-text-main hover:bg-surface-tonal-200'
                                    }`}
                            >
                                Agent
                            </button>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-text-main mb-4">
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Name  */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-text-main mb-2"
                                    >
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        {...register('name', {
                                            required: 'Full name is required',
                                            minLength: {
                                                value: 2,
                                                message: 'Name must be at least 2 characters',
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.name ? 'border-danger-300' : 'border-surface-tonal-300'
                                            }`}
                                        placeholder="Enter your full name"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-danger-300">
                                            {errors.name.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email  */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-text-main mb-2"
                                    >
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        {...register('email', {
                                            required: 'Email is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Invalid email address',
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.email ? 'border-danger-300' : 'border-surface-tonal-300'
                                            }`}
                                        placeholder="you@example.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-danger-300">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Phone  */}
                                <div>
                                    <label
                                        htmlFor="phone"
                                        className="block text-sm font-medium text-text-main mb-2"
                                    >
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        {...register('phone', {
                                            required: 'Phone number is required',
                                            pattern: {
                                                value: /^(\+?880|0)?1[3-9]\d{8}$/,
                                                message: 'Invalid Bangladesh phone number',
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.phone ? 'border-danger-300' : 'border-surface-tonal-300'
                                            }`}
                                        placeholder="+880 1XXX XXXXXX"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-sm text-danger-300">
                                            {errors.phone.message}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <label
                                        htmlFor="password"
                                        className="block text-sm font-medium text-text-main mb-2"
                                    >
                                        Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="password"
                                        {...register('password', {
                                            required: 'Password is required',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must be at least 8 characters',
                                            },
                                            pattern: {
                                                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                                                message: 'Password must contain uppercase, lowercase, and number',
                                            },
                                        })}
                                        className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.password ? 'border-danger-300' : 'border-surface-tonal-300'
                                            }`}
                                        placeholder="Create a strong password"
                                    />
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-danger-300">
                                            {errors.password.message}
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password */}
                                <div className="lg:col-span-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-text-main mb-2"
                                    >
                                        Confirm Password *
                                    </label>
                                    <input
                                        type="password"
                                        id="confirmPassword"
                                        {...register('confirmPassword', {
                                            required: 'Please confirm your password',
                                            validate: (value) =>
                                                value === password || 'Passwords do not match',
                                        })}
                                        className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.confirmPassword ? 'border-danger-300' : 'border-surface-tonal-300'
                                            }`}
                                        placeholder="Confirm your password"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-danger-300">
                                            {errors.confirmPassword.message}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Agent-Specific Information - Only shown when Agent is selected */}
                        {role === 'agent' && (
                            <div className="pt-6 border-t border-surface-tonal-300">
                                <h3 className="text-lg font-semibold text-text-main mb-4">
                                    Business Information
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    {/* Company Name */}
                                    <div>
                                        <label
                                            htmlFor="companyName"
                                            className="block text-sm font-medium text-text-main mb-2"
                                        >
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="companyName"
                                            {...register('companyName', {
                                                required: role === 'agent' ? 'Company name is required for agents' : false,
                                                minLength: {
                                                    value: 2,
                                                    message: 'Company name must be at least 2 characters',
                                                },
                                            })}
                                            className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.companyName ? 'border-danger-300' : 'border-surface-tonal-300'
                                                }`}
                                            placeholder="Your company or agency name"
                                        />
                                        {errors.companyName && (
                                            <p className="mt-1 text-sm text-danger-300">
                                                {errors.companyName.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* License Number */}
                                    <div>
                                        <label
                                            htmlFor="licenseNumber"
                                            className="block text-sm font-medium text-text-main mb-2"
                                        >
                                            License Number *
                                        </label>
                                        <input
                                            type="text"
                                            id="licenseNumber"
                                            {...register('licenseNumber', {
                                                required: role === 'agent' ? 'License number is required for agents' : false,
                                            })}
                                            className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.licenseNumber ? 'border-danger-300' : 'border-surface-tonal-300'
                                                }`}
                                            placeholder="Real estate license number"
                                        />
                                        {errors.licenseNumber && (
                                            <p className="mt-1 text-sm text-danger-300">
                                                {errors.licenseNumber.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Business Address */}
                                    <div>
                                        <label
                                            htmlFor="businessAddress"
                                            className="block text-sm font-medium text-text-main mb-2"
                                        >
                                            Business Address *
                                        </label>
                                        <input
                                            type="text"
                                            id="businessAddress"
                                            {...register('businessAddress', {
                                                required: role === 'agent' ? 'Business address is required for agents' : false,
                                            })}
                                            className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.businessAddress ? 'border-danger-300' : 'border-surface-tonal-300'
                                                }`}
                                            placeholder="Office or business location"
                                        />
                                        {errors.businessAddress && (
                                            <p className="mt-1 text-sm text-danger-300">
                                                {errors.businessAddress.message}
                                            </p>
                                        )}
                                    </div>

                                    {/* Website (Optional) */}
                                    <div>
                                        <label
                                            htmlFor="website"
                                            className="block text-sm font-medium text-text-main mb-2"
                                        >
                                            Website (Optional)
                                        </label>
                                        <input
                                            type="url"
                                            id="website"
                                            {...register('website', {
                                                pattern: {
                                                    value: /^https?:\/\/.+/,
                                                    message: 'Please enter a valid URL (http:// or https://)',
                                                },
                                            })}
                                            className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.website ? 'border-danger-300' : 'border-surface-tonal-300'
                                                }`}
                                            placeholder="https://yourwebsite.com"
                                        />
                                        {errors.website && (
                                            <p className="mt-1 text-sm text-danger-300">
                                                {errors.website.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Terms & Conditions */}
                        <div className="flex items-start gap-2 pt-4">
                            <input
                                type="checkbox"
                                id="terms"
                                {...register('terms', {
                                    required: 'You must accept the terms and conditions',
                                })}
                                className="mt-1 w-4 h-4 text-primary-100 bg-surface-tonal-100 border-surface-tonal-300 rounded focus:ring-primary-100 focus:ring-2"
                            />
                            <div>
                                <label htmlFor="terms" className="text-sm text-text-muted">
                                    I agree to the{' '}
                                    <Link
                                        href="/terms"
                                        className="text-primary-100 hover:underline font-medium"
                                    >
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link
                                        href="/privacy"
                                        className="text-primary-100 hover:underline font-medium"
                                    >
                                        Privacy Policy
                                    </Link>
                                </label>
                                {errors.terms && (
                                    <p className="mt-1 text-sm text-danger-300">
                                        {errors.terms.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* API Error Message */}
                        {apiError && (
                            <div className="p-4 bg-danger-100 border border-danger-300 rounded-xl">
                                <p className="text-sm text-danger-300">{apiError}</p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-primary-100 text-light font-semibold rounded-xl shadow-[var(--shadow-glow)] hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-surface-tonal-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-light text-text-muted">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    {/* Social Login */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="w-full py-3 px-4 bg-surface-tonal-100 text-text-main font-medium rounded-xl border border-surface-tonal-300 hover:bg-surface-tonal-200 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className="w-full py-3 px-4 bg-surface-tonal-100 text-text-main font-medium rounded-xl border border-surface-tonal-300 hover:bg-surface-tonal-200 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-300 flex items-center justify-center gap-3"
                        >
                            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                            Continue with Facebook
                        </button>
                    </div>

                    {/* Sign In */}
                    <p className="mt-6 text-center text-sm text-text-muted">
                        Already have an account?{' '}
                        <Link
                            href="/auth/signin"
                            className="text-primary-100 hover:underline font-semibold"
                        >
                            Sign In
                        </Link>
                    </p>
                </div>

                {/* OTP Verification Modal */}
                {showOTP && (
                    <OTPVerification
                        email={userEmail}
                        onVerify={handleOTPVerified}
                        onCancel={handleOTPCancel}
                    />
                )}
            </div>
        </div>
    );
}
