'use client';

import { useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('');

  const successMessage = useMemo(() => {
    return searchParams.get('verified') === 'true'
      ? 'Email verified successfully! You can now sign in.'
      : '';
  }, [searchParams]);

  const urlError = useMemo(() => {
    const error = searchParams.get('error');
    return error ? 'Authentication failed. Please try again.' : '';
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: 'onBlur',
  });

  const onSubmit = async (data: FormData) => {
    setErrorMessage('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        setErrorMessage(result.error);
      } else if (result?.ok) {
        router.push('/dashboard');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      signIn('google', { callbackUrl: '/dashboard' });
    }
    // Facebook implementation pending
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-100 mb-2">Al-Diyar</h1>
          <p className="text-text-muted">Welcome back! Sign in to continue</p>
        </div>

        <div className="bg-light rounded-2xl p-8 shadow-[var(--shadow-soft)] border border-surface-300">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {(errorMessage || urlError) && (
            <div className="mb-4 p-4 bg-danger-100 border border-danger-300 rounded-xl">
              <p className="text-sm text-danger-300">
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
                className="block text-sm font-medium text-text-main mb-2"
              >
                Email Address
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
                className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${
                  errors.email
                    ? 'border-danger-300'
                    : 'border-surface-tonal-300'
                }`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-danger-300">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-main mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full px-4 py-3 bg-surface-tonal-100 border rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent transition-all duration-300 ${
                  errors.password
                    ? 'border-danger-300'
                    : 'border-surface-tonal-300'
                }`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-danger-300">
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
                  {...register('rememberMe')}
                  className="w-4 h-4 text-primary-100 bg-surface-tonal-100 border-surface-tonal-300 rounded focus:ring-primary-100 focus:ring-2"
                />
                <label htmlFor="rememberMe" className="text-sm text-text-muted">
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-primary-100 hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary-100 text-light font-semibold rounded-xl shadow-[var(--shadow-glow)] hover:bg-primary-200 focus:outline-none focus:ring-2 focus:ring-primary-100 focus:ring-offset-2 transition-all duration-300 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
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

          {/* Social Login Buttons */}
          <div className="space-y-3">
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

          {/* Sign Up */}
          <p className="mt-6 text-center text-sm text-text-muted">
            Don&apos;t have an account?{' '}
            <Link
              href="/auth/signup"
              className="text-primary-100 hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Additional Info for Agents */}
        <div className="mt-6 p-4 bg-surface-tonal-100 rounded-xl border border-surface-tonal-300">
          <p className="text-sm text-text-muted text-center">
            <span className="font-medium text-text-main">
              Are you an Agent?
            </span>{' '}
            Sign up to list properties and connect with buyers
          </p>
        </div>
      </div>
    </div>
  );
}
