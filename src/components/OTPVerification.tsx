'use client';

import { useState, useEffect, useRef } from 'react';

interface OTPVerificationProps {
    email: string;
    onVerify: () => void;
    onCancel: () => void;
}

export default function OTPVerification({ email, onVerify, onCancel }: OTPVerificationProps) {
    const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(300); 
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleChange = (index: number, value: string) => {
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        setError('');

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otp];
        pastedData.split('').forEach((char, index) => {
            if (index < 6) newOtp[index] = char;
        });
        setOtp(newOtp);

        const nextEmptyIndex = newOtp.findIndex((val) => !val);
        if (nextEmptyIndex !== -1) {
            inputRefs.current[nextEmptyIndex]?.focus();
        } else {
            inputRefs.current[5]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            setError('Please enter all 6 digits');
            return;
        }

        setIsVerifying(true);
        setError('');

        try {
            const response = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    otp: otpString,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                onVerify();
            } else {
                setError(data.error || 'Verification failed. Please try again.');
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        setIsResending(true);
        setError('');

        try {
            const response = await fetch('/api/auth/resend-otp', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setTimeLeft(300); 
                setOtp(['', '', '', '', '', '']);
                inputRefs.current[0]?.focus();
                alert('A new OTP has been sent to your email');
            } else {
                setError(data.error || 'Failed to resend OTP');
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-transparent bg-opacity-50 flex items-center justify-center px-4 z-50">
            <div className="bg-light rounded-2xl p-8 max-w-md w-full shadow-[var(--shadow-soft)] border border-surface-300">
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                            className="w-8 h-8 text-light"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-text-main mb-2">Verify Your Email</h2>
                    <p className="text-sm text-text-muted">
                        We&apos;ve sent a 6-digit code to<br />
                        <span className="font-medium text-text-main">{email}</span>
                    </p>
                </div>

                {/* OTP Input */}
                <div className="mb-6">
                    <div className="flex gap-2 justify-center mb-4" onPaste={handlePaste}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-14 text-center text-2xl font-bold bg-surface-tonal-100 border-2 border-surface-tonal-300 rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300"
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-danger-300 text-center mb-2">{error}</p>
                    )}

                    {/* Timer */}
                    <div className="text-center">
                        <p className="text-sm text-text-muted">
                            {timeLeft > 0 ? (
                                <>
                                    Code expires in{' '}
                                    <span className="font-semibold text-primary-100">
                                        {formatTime(timeLeft)}
                                    </span>
                                </>
                            ) : (
                                <span className="text-danger-300">OTP expired</span>
                            )}
                        </p>
                    </div>
                </div>

                {/* Verify */}
                <button
                    onClick={handleVerify}
                    disabled={isVerifying || otp.join('').length !== 6}
                    className="w-full py-3 px-4 bg-primary-100 text-light font-semibold rounded-xl shadow-[var(--shadow-glow)] hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed mb-3 cursor-pointer"
                >
                    {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>

                {/* Resend OTP */}
                <div className="text-center mb-4">
                    <button
                        onClick={handleResend}
                        disabled={isResending || timeLeft === 0}
                        className="text-sm text-primary-100 hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isResending ? 'Sending...' : "Didn't receive the code? Resend"}
                    </button>
                </div>

                {/* Cancel */}
                <button
                    onClick={onCancel}
                    className="w-full py-2 px-4 text-text-muted hover:text-text-main font-medium rounded-xl hover:bg-surface-tonal-100 transition-all duration-300 cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
