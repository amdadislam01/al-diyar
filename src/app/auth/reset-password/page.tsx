"use client";

import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

type FormData = {
    password: string;
    confirmPassword: string;
};

function ResetPasswordForm() {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        mode: "onBlur",
    });

    const password = watch("password");

    const onSubmit = async (data: FormData) => {
        setError("");
        if (!token) {
            setError("Invalid or missing reset token.");
            return;
        }

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password: data.password }),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || "Something went wrong.");
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/auth/signin");
            }, 3000);
        } catch (err: any) {
            setError(err.message);
        }
    };

    if (!token) {
        return (
            <div className="text-center p-8 bg-light rounded-2xl shadow-[var(--shadow-soft)] border border-surface-300">
                <h3 className="text-xl font-bold text-danger-300 mb-4">Invalid Reset Link</h3>
                <p className="text-text-muted mb-6">
                    This password reset link is invalid or has expired.
                </p>
                <Link
                    href="/auth/forgot-password"
                    className="inline-block py-3 px-6 bg-primary-100 text-light font-semibold rounded-xl hover:bg-primary-200 transition-all"
                >
                    Request New Link
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-light rounded-2xl p-8 shadow-[var(--shadow-soft)] border border-surface-300">
            {success ? (
                <div className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-success-300 bg-opacity-20 rounded-full flex items-center justify-center">
                        <svg
                            className="w-8 h-8 text-success-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                            />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-text-main">
                        Password Reset Successful
                    </h3>
                    <p className="text-sm text-text-muted">
                        Your password has been reset successfully. Redirecting you to the sign-in page...
                    </p>
                </div>
            ) : (
                <>
                    <div className="mb-6">
                        <p className="text-sm text-text-muted text-center">
                            Please enter your new password below.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-danger-300 bg-opacity-10 border border-danger-300 rounded-lg text-danger-300 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-text-main mb-2"
                            >
                                New Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters",
                                    },
                                })}
                                className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.password
                                        ? "border-danger-300"
                                        : "border-surface-tonal-300"
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.password && (
                                <p className="mt-1 text-sm text-danger-300">
                                    {errors.password.message}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-text-main mb-2"
                            >
                                Confirm New Password
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                {...register("confirmPassword", {
                                    required: "Please confirm your password",
                                    validate: (value) =>
                                        value === password || "Passwords do not match",
                                })}
                                className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.confirmPassword
                                        ? "border-danger-300"
                                        : "border-surface-tonal-300"
                                    }`}
                                placeholder="••••••••"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-danger-300">
                                    {errors.confirmPassword.message}
                                </p>
                            )}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 px-4 bg-primary text-light dark:text-light font-semibold rounded-xl shadow-[var(--shadow-glow)] hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isSubmitting ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary-100 mb-2">Al-Diyar</h1>
                    <h2 className="text-xl font-semibold text-text-main">Set New Password</h2>
                </div>

                <Suspense fallback={
                    <div className="bg-light rounded-2xl p-8 shadow-[var(--shadow-soft)] border border-surface-300 text-center">
                        <p className="text-text-muted">Loading...</p>
                    </div>
                }>
                    <ResetPasswordForm />
                </Suspense>

                {/* Back to Sign In */}
                <div className="mt-8 text-center">
                    <Link
                        href="/auth/signin"
                        className="text-sm text-text-muted hover:text-primary-100 transition-colors duration-300"
                    >
                        Back to Sign In
                    </Link>
                </div>
            </div>
        </div>
    );
}
