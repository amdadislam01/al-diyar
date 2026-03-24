"use client";

import { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { ThemeToggle } from "./layout/ThemeToggle";
import Image from "next/image";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState("");

  const successMessage = useMemo(() => {
    return searchParams.get("verified") === "true"
      ? "Email verified successfully! You can now sign in."
      : "";
  }, [searchParams]);

  const urlError = useMemo(() => {
    const error = searchParams.get("error");
    return error ? "Authentication failed. Please try again." : "";
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    setErrorMessage("");

    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push("/");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again.");
    }
  };

  const handleSocialLogin = (provider: string) => {
    // Google login implementation
    if (provider === "Google") {
      signIn("google", { callbackUrl: "/" });
    }
    // GitHub login implementation
    if (provider === "GitHub") {
      signIn("github", { callbackUrl: "/" });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100 dark:bg-background-dark transition-colors duration-500 relative">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center justify-center text-center mb-8">
          <Link
            href="/"
            className="flex items-center justify-center gap-3 group"
          >
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              <Image
                src="/aldiyarlogo.png"
                alt="Logo"
                width={40}
                height={40}
                className="p-2"
              />
            </div>

            <span
              className="font-bold text-3xl tracking-tight dark:text-white"
              style={{
                fontFamily:
                  "'PPRightGrotesk', 'Plus Jakarta Sans', 'Inter', sans-serif",
                fontWeight: 900,
              }}
            >
              Al-Diyar
            </span>
          </Link>

          <p className="mt-3 text-text-muted dark:text-slate-400">
            Welcome back! Sign in to continue
          </p>
        </div>

        <div className="bg-light dark:bg-slate-900 rounded-2xl p-8 shadow-soft dark:shadow-premium border border-surface-300 dark:border-slate-800 transition-all duration-300">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100/10 border border-green-500/20 rounded-xl">
              <p className="text-sm text-green-500">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {(errorMessage || urlError) && (
            <div className="mb-4 p-4 bg-danger-100/10 border border-danger-500/20 rounded-xl">
              <p className="text-sm text-red-500">
                {errorMessage || urlError}
              </p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
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
                className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.email
                  ? "border-danger-300 dark:border-danger-500"
                  : "border-surface-tonal-300 dark:border-slate-700"
                  }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${errors.password
                  ? "border-danger-300 dark:border-danger-500"
                  : "border-surface-tonal-300 dark:border-slate-700"
                  }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  {...register("rememberMe")}
                  className="w-4 h-4 text-primary-100 dark:text-primary-light bg-surface-tonal-100 dark:bg-slate-800 border-surface-tonal-300 dark:border-slate-700 rounded focus:ring-primary-100 focus:ring-2"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-sm text-text-muted dark:text-slate-400"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-100 dark:text-primary-light hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary-100 dark:bg-white text-white bg-primary dark:text-slate-900 font-semibold rounded-xl shadow-glow dark:shadow-premium hover:bg-primary-200 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Signing In..." : "Sign In"}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-surface-tonal-300 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-light dark:bg-slate-900 text-text-muted dark:text-slate-400 transition-colors duration-300">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleSocialLogin("Google")}
              className="w-full py-3 px-4 bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-white font-medium rounded-xl border border-surface-tonal-300 dark:border-slate-700 hover:bg-surface-tonal-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
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
              onClick={() => handleSocialLogin("GitHub")}
              className="w-full py-3 px-4 bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-white font-medium rounded-xl border border-surface-tonal-300 dark:border-slate-700 hover:bg-surface-tonal-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Sign Up */}
          <p className="mt-6 text-center text-sm text-text-muted dark:text-slate-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary-100 dark:text-primary-light hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Additional Info for Agents */}
        <div className="mt-6 p-4 bg-surface-tonal-100 dark:bg-slate-800 rounded-xl border border-surface-tonal-300 dark:border-slate-700">
          <p className="text-sm text-text-muted dark:text-slate-400 text-center">
            <span className="font-medium text-text-main dark:text-white">
              Are you an Agent?
            </span>{" "}
            Sign up to list properties and connect with buyers
          </p>
        </div>
      </div>
    </div>
  );
}
