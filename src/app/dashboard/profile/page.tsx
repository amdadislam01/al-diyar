"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Image from "next/image";

export default function ProfilePage() {
    const { data: session, update } = useSession();
    const user = session?.user as any;

    const [name, setName] = useState(user?.name ?? "");
    const [imageUrl, setImageUrl] = useState<string | null>(user?.image ?? null);
    const [isUploading, setIsUploading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

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
            }
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);
        try {
            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, image: imageUrl }),
            });
            if (res.ok) {
                await update({
                    ...session,
                    user: {
                        ...session?.user,
                        name,
                        image: imageUrl,
                    },
                });
                setMessage({ type: "success", text: "Profile updated successfully!" });
            } else {
                const d = await res.json();
                setMessage({ type: "error", text: d.message ?? "Update failed" });
            }
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6 lg:p-10 max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your personal information</p>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="w-16 h-16 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center border-2 border-primary/20">
                            {imageUrl ? (
                                <Image src={imageUrl} alt="avatar" width={64} height={64} className="object-cover w-full h-full" />
                            ) : (
                                <span className="material-icons-outlined text-3xl text-primary">person</span>
                            )}
                        </div>
                        <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                            <span className="material-icons-outlined text-sm">photo_camera</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={isUploading} />
                        </label>
                        {isUploading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-100">{user?.name}</p>
                        <p className="text-sm text-slate-400 dark:text-slate-500">{user?.email}</p>
                        <span className="inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
                            {user?.role ?? "user"}
                        </span>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSave} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition"
                            placeholder="Your full name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={user?.email ?? ""}
                            disabled
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/60 text-slate-400 text-sm cursor-not-allowed"
                        />
                        <p className="text-[11px] text-slate-400 mt-1">Email cannot be changed</p>
                    </div>

                    {message && (
                        <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${message.type === "success"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                                : "bg-red-50 dark:bg-red-900/20 text-red-500 dark:text-red-400"
                            }`}>
                            <span className="material-icons-outlined text-base">
                                {message.type === "success" ? "check_circle" : "error"}
                            </span>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white py-2.5 rounded-xl font-medium text-sm hover:bg-primary/90 disabled:opacity-60 transition-colors"
                    >
                        {saving ? (
                            <>
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Saving…
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-base">save</span>
                                Save Changes
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
