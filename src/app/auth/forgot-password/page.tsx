"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

type FormData = {
  email: string;
};

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    console.log("Password reset requested for:", data.email);
    // API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-100 mb-2">Al-Diyar</h1>
          <p className="text-text-muted">
            {isSubmitted ? "Check your email" : "Reset your password"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-light rounded-2xl p-8 shadow-[var(--shadow-soft)] border border-surface-300">
          {!isSubmitted ? (
            <>
              {/* Instructions */}
              <div className="mb-6">
                <p className="text-sm text-text-muted text-center">
                  Enter your email address and we&apos;ll send you a link to
                  reset your password.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-main mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                    className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${
                      errors.email
                        ? "border-danger-300"
                        : "border-surface-tonal-300"
                    }`}
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-danger-300">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-primary-100 text-light font-semibold rounded-xl shadow-[var(--shadow-glow)] hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? "Sending..." : "Send Reset"}
                </button>
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <Link
                  href="/auth/signin"
                  className="text-sm text-text-muted hover:text-primary-100 transition-colors duration-300 inline-flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Back to Sign In
                </Link>
              </div>
            </>
          ) : (
            <>
              {/* Success Message */}
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
                      d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"
                    />
                  </svg>
                </div>

                {/* Message */}
                <div>
                  <h3 className="text-lg font-semibold text-text-main mb-2">
                    Check your email
                  </h3>
                  <p className="text-sm text-text-muted">
                    We&apos;ve sent a password reset link to your email address.
                    Please check your inbox and follow the instructions.
                  </p>
                </div>

                {/* Resend  */}
                <div className="pt-4">
                  <p className="text-sm text-text-muted">
                    Didn&apos;t receive the email?{" "}
                    <button
                      onClick={() => setIsSubmitted(false)}
                      className="text-primary-100 hover:underline font-medium"
                    >
                      Try again
                    </button>
                  </p>
                </div>
              </div>

              {/* Back to Sign In */}
              <div className="mt-6 text-center border-t border-surface-tonal-300 pt-6">
                <Link
                  href="/auth/signin"
                  className="text-sm text-primary-100 hover:underline font-semibold"
                >
                  Back to Sign In
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Sign Up */}
        {!isSubmitted && (
          <div className="mt-6 p-4 bg-surface-tonal-100 rounded-xl border border-surface-tonal-300">
            <p className="text-sm text-text-muted text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-primary-100 hover:underline font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
