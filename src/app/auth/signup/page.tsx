"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OTPVerification from "@/components/OTPVerification";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Image from "next/image";

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
  nid?: string;
  division?: string;
  district?: string;
  upazila?: string;
  country?: string;
  terms: boolean;
};

export default function SignUpPage() {
  const router = useRouter();
  const [role, setrole] = useState<"user" | "seller" | "agent">("user");
  const [showOTP, setShowOTP] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [apiError, setApiError] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      throw new Error("Cloudinary configuration is missing.");
    }

    const data = new FormData();
    data.append("upload_preset", uploadPreset);
    data.append("file", file);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
      },
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error?.message || "Upload failed");
    }
    return result.secure_url as string;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image file.");
      return;
    }

    try {
      setIsUploading(true);
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // Location data state
  const [countries, setCountries] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    mode: "onBlur",
  });

  const password = watch("password");

  // Load location data
  useEffect(() => {
    const loadLocationData = async () => {
      try {
        const res = await fetch("/data/country.json");
        const data = await res.json();
        setCountries(data || []);
      } catch (error) {
        console.error("Error loading country data:", error);
      }
    };
    loadLocationData();
  }, []);

  // Filtered lists (none needed now)

  const onSubmit = async (data: FormData) => {
    setApiError("");

    try {
      // Prepare final data
      const selectedCountry = countries.find((c) => c.name === data.country);
      const dialCode = selectedCountry?.dial_code || "";

      // Prepend dial code to phone if not already present
      let finalPhone = data.phone.trim();
      if (
        dialCode &&
        !finalPhone.startsWith("+") &&
        !finalPhone.startsWith(dialCode.replace("+", ""))
      ) {
        // Remove leading zero if present when prepending dial code
        const phoneWithoutLeadingZero = finalPhone.startsWith("0")
          ? finalPhone.substring(1)
          : finalPhone;
        finalPhone = dialCode + phoneWithoutLeadingZero;
      }

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          phone: finalPhone,
          role,
          image: imageUrl || undefined,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        setUserEmail(data.email);
        setShowOTP(true);
      } else {
        setApiError(result.error || "Signup failed. Please try again.");
      }
    } catch (error) {
      setApiError("An error occurred. Please try again.");
    }
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    router.push("/auth/signin?verified=true");
  };

  const handleOTPCancel = () => {
    setShowOTP(false);
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === "Google") {
      import("next-auth/react").then(({ signIn }) => {
        signIn("google", { callbackUrl: "/" });
      });
    }
    if (provider === "GitHub") {
      import("next-auth/react").then(({ signIn }) => {
        signIn("github", { callbackUrl: "/" });
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-surface-100 dark:bg-background-dark transition-colors duration-500 relative">
      <div className="absolute top-8 right-8">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-5xl">
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
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 lg:p-10 shadow-soft dark:shadow-premium border border-surface-300 dark:border-slate-800 transition-colors">
          {/* Account Type  */}
          <div className="mb-8">
            <div className="grid grid-cols-3 gap-3 ">
              <button
                type="button"
                onClick={() => setrole("user")}
                className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                  role === "user"
                    ? "bg-primary dark:bg-blue-600 text-white shadow-glow dark:shadow-premium"
                    : "bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-slate-200 hover:bg-surface-tonal-200 dark:hover:bg-slate-700"
                }`}
              >
                User
              </button>
              <button
                type="button"
                onClick={() => setrole("seller")}
                className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                  role === "seller"
                    ? "bg-primary dark:bg-blue-600 text-white shadow-glow dark:shadow-premium"
                    : "bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-slate-200 hover:bg-surface-tonal-200 dark:hover:bg-slate-700"
                }`}
              >
                Seller
              </button>
              <button
                type="button"
                onClick={() => setrole("agent")}
                className={`py-3 px-4 rounded-xl font-medium transition-all duration-300 cursor-pointer ${
                  role === "agent"
                    ? "bg-primary dark:bg-blue-600 text-white shadow-glow dark:shadow-premium"
                    : "bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-slate-200 hover:bg-surface-tonal-200 dark:hover:bg-slate-700"
                }`}
              >
                Agent
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Picture Upload */}
            <div className="flex flex-col items-center mb-6">
              <label className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2">
                Profile Picture
              </label>
              <div className="relative w-24 h-24 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-center bg-slate-50 dark:bg-slate-800 overflow-hidden group">
                {imageUrl ? (
                  <>
                    <img
                      src={imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setImageUrl(null)}
                      className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="material-icons-round text-xs">
                        close
                      </span>
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    {isUploading ? (
                      <div className="w-6 h-6 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <span className="material-icons-round text-slate-400 text-2xl">
                        add_a_photo
                      </span>
                    )}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={isUploading}
                />
              </div>
            </div>
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Name  */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    {...register("name", {
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Name must be at least 2 characters",
                      },
                    })}
                    className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.name
                        ? "border-danger-300"
                        : "border-surface-tonal-300 dark:border-slate-700"
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                {/* Email  */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Email Address *
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
                    className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.email
                        ? "border-danger-300"
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

                {/* Country Selection */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Country *
                  </label>
                  <select
                    id="country"
                    {...register("country", {
                      required: "Country is required",
                    })}
                    className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.country
                        ? "border-danger-300"
                        : "border-surface-tonal-300 dark:border-slate-700"
                    }`}
                  >
                    <option value="">Select Country</option>
                    {countries.map((c, idx) => (
                      <option key={idx} value={c.name}>
                        {c.emoji} {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.country.message}
                    </p>
                  )}
                </div>

                {/* Phone Number */}
                <div className="lg:col-span-2">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    {/* Dial Code Prefix */}
                    {watch("country") &&
                      countries.find((c) => c.name === watch("country"))
                        ?.dial_code && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-medium pr-2 border-r border-slate-200 dark:border-slate-700 pointer-events-none">
                          {
                            countries.find((c) => c.name === watch("country"))
                              .dial_code
                          }
                        </div>
                      )}
                    <input
                      type="tel"
                      id="phone"
                      {...register("phone", {
                        required: "Phone number is required",
                      })}
                      style={{
                        paddingLeft:
                          watch("country") &&
                          countries.find((c) => c.name === watch("country"))
                            ?.dial_code
                            ? `${countries.find((c) => c.name === watch("country")).dial_code.length * 9 + 30}px`
                            : undefined,
                      }}
                      className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.phone
                          ? "border-danger-300"
                          : "border-surface-tonal-300 dark:border-slate-700"
                      }`}
                      placeholder="1XXXXXXXXX"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Agent/Seller Specific Information */}
            {(role === "agent" || role === "seller") && (
              <div className="pt-6 border-t border-surface-tonal-300">
                {role === "agent" && (
                  <h3 className="text-lg font-semibold text-text-main dark:text-white mb-4">
                    Business & Identification
                  </h3>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Company Name (Shown only for Agent) */}
                  {role === "agent" && (
                    <div>
                      <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                      >
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        {...register("companyName", {
                          required: "Company name is required for agents",
                          minLength: {
                            value: 2,
                            message:
                              "Company name must be at least 2 characters",
                          },
                        })}
                        className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                          errors.companyName
                            ? "border-danger-300"
                            : "border-surface-tonal-300 dark:border-slate-700"
                        }`}
                        placeholder="Your company or agency name"
                      />
                      {errors.companyName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.companyName.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* License Number (Agent only) */}
                  {role === "agent" && (
                    <div>
                      <label
                        htmlFor="licenseNumber"
                        className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                      >
                        License Number *
                      </label>
                      <input
                        type="text"
                        id="licenseNumber"
                        {...register("licenseNumber", {
                          required: "License number is required for agents",
                        })}
                        className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                          errors.licenseNumber
                            ? "border-danger-300"
                            : "border-surface-tonal-300 dark:border-slate-700"
                        }`}
                        placeholder="Real estate license number"
                      />
                      {errors.licenseNumber && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.licenseNumber.message}
                        </p>
                      )}
                    </div>
                  )}

                  {/* NID Number (Both Agent and Seller) */}
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="nid"
                      className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                    >
                      NID Number *
                    </label>
                    <input
                      type="text"
                      id="nid"
                      {...register("nid", {
                        required: "NID number is required",
                        pattern: {
                          value: /^[0-9]{10,17}$/,
                          message: "Invalid NID format (10-17 digits)",
                        },
                      })}
                      className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.nid
                          ? "border-danger-300"
                          : "border-surface-tonal-300 dark:border-slate-700"
                      }`}
                      placeholder="Enter your 10, 13, or 17 digit NID number"
                    />
                    {errors.nid && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.nid.message}
                      </p>
                    )}
                  </div>

                  {/* Address (Both Agent and Seller) */}
                  <div className="lg:col-span-2">
                    <label
                      htmlFor="businessAddress"
                      className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                    >
                      Address *
                    </label>
                    <input
                      type="text"
                      id="businessAddress"
                      {...register("businessAddress", {
                        required: "Address is required",
                      })}
                      className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                        errors.businessAddress
                          ? "border-danger-300"
                          : "border-surface-tonal-300 dark:border-slate-700"
                      }`}
                      placeholder={
                        role === "agent"
                          ? "Office or business location"
                          : "Your current address or shop location"
                      }
                    />
                    {errors.businessAddress && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.businessAddress.message}
                      </p>
                    )}
                  </div>

                  {/* Website (Optional, Agent only) */}
                  {role === "agent" && (
                    <div className="lg:col-span-2">
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                      >
                        Website (Optional)
                      </label>
                      <input
                        type="url"
                        id="website"
                        {...register("website", {
                          pattern: {
                            value: /^https?:\/\/.+/,
                            message:
                              "Please enter a valid URL (http:// or https://)",
                          },
                        })}
                        className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                          errors.website
                            ? "border-danger-300"
                            : "border-surface-tonal-300 dark:border-slate-700"
                        }`}
                        placeholder="https://yourwebsite.com"
                      />
                      {errors.website && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.website.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Security Section (At the end for everyone) */}
            <div className="pt-6 border-t border-surface-tonal-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Password *
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
                      pattern: {
                        value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                        message:
                          "Password must contain uppercase, lowercase, and number",
                      },
                    })}
                    className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.password
                        ? "border-danger-300"
                        : "border-surface-tonal-300 dark:border-slate-700"
                    }`}
                    placeholder="Create a strong password"
                  />
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-text-main dark:text-slate-200 mb-2"
                  >
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    className={`w-full px-4 py-3 bg-surface-tonal-100 dark:bg-slate-800 border rounded-xl text-text-main dark:text-white placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 ${
                      errors.confirmPassword
                        ? "border-danger-300"
                        : "border-surface-tonal-300 dark:border-slate-700"
                    }`}
                    placeholder="Confirm your password"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-2 pt-4">
              <input
                type="checkbox"
                id="terms"
                {...register("terms", {
                  required: "You must accept the terms and conditions",
                })}
                className="mt-1 w-4 h-4 text-primary dark:text-blue-500 bg-surface-tonal-100 dark:bg-slate-800 border-surface-tonal-300 dark:border-slate-700 rounded focus:ring-primary focus:ring-2"
              />
              <div>
                <label
                  htmlFor="terms"
                  className="text-sm text-text-muted dark:text-slate-400"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-primary dark:text-blue-400 hover:underline font-medium"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary dark:text-blue-400 hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.terms.message}
                  </p>
                )}
              </div>
            </div>

            {/* API Error Message */}
            {apiError && (
              <div className="p-4 bg-danger-100 border border-danger-300 rounded-xl">
                <p className="text-sm text-red-500">{apiError}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-primary dark:bg-white text-white dark:text-slate-900 font-semibold rounded-xl shadow-glow dark:shadow-premium hover:bg-primary/90 dark:hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all duration-300 hover:shadow-lg cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Divider and Social Login - Hidden for Seller and Agent */}
          {role === "user" && (
            <>
              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-surface-tonal-300 dark:border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-slate-900 text-text-muted dark:text-slate-400 transition-colors">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialLogin("Google")}
                  className="w-full py-3 px-4 bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-white font-medium rounded-xl border border-surface-tonal-300 dark:border-slate-700 hover:bg-surface-tonal-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
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
                  className="w-full py-3 px-4 bg-surface-tonal-100 dark:bg-slate-800 text-text-main dark:text-white font-medium rounded-xl border border-surface-tonal-300 dark:border-slate-700 hover:bg-surface-tonal-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Continue with GitHub
                </button>
              </div>
            </>
          )}

          {/* Sign In */}
          <p className="mt-6 text-center text-sm text-text-muted dark:text-slate-400 transition-colors">
            Already have an account?{" "}
            <Link
              href="/auth/signin"
              className="text-primary dark:text-blue-400 hover:underline font-semibold"
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
