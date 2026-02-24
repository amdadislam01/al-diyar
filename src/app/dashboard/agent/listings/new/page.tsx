"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const CATEGORIES = ["Apartment", "Villa", "Land", "Office", "Shop", "House", "Duplex", "Penthouse"];
const AMENITIES_LIST = ["Parking", "Gym", "Swimming Pool", "Elevator", "Security", "Generator", "Garden", "Balcony", "Air Conditioning", "Internet"];

interface FormData {
    title: string;
    description: string;
    price: string;
    type: "Sale" | "Rent";
    category: string;
    address: string;
    lat: string;
    lng: string;
    images: string;
    amenities: string[];
}

export default function AgentNewListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [form, setForm] = useState<FormData>({
        title: "", description: "", price: "", type: "Sale",
        category: "Apartment", address: "", lat: "", lng: "", images: "", amenities: [],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError("");
    };

    const toggleAmenity = (a: string) => {
        setForm((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(a) ? prev.amenities.filter((x) => x !== a) : [...prev.amenities, a],
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const images = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
        const payload = {
            title: form.title, description: form.description, price: Number(form.price),
            type: form.type, category: form.category,
            location: { address: form.address, lat: Number(form.lat), lng: Number(form.lng) },
            images, amenities: form.amenities,
        };

        try {
            // Agent uses the same listing API as seller (role check now accepts both)
            const res = await fetch("/api/agent/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Listing published successfully!");
                setTimeout(() => router.push("/dashboard/agent/listings"), 1200);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition";

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-8">
                <button onClick={() => router.back()}
                    className="flex items-center gap-1 text-sm text-text-muted hover:text-emerald-600 mb-4 transition-colors">
                    <span className="material-icons-outlined text-base">arrow_back</span>
                    Back to Listings
                </button>
                <h1 className="text-2xl font-bold text-text-main">Add New Listing</h1>
                <p className="text-sm text-text-muted mt-1">Fill in the details to publish a new property.</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">error</span>{error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">check_circle</span>{success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5 shadow-card">
                    <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
                        <span className="material-icons-outlined text-emerald-500 text-lg">info</span>Basic Information
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} required
                            placeholder="e.g. Modern 3-Bedroom Apartment in Gulshan" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required rows={4}
                            placeholder="Describe the property in detail..." className={`${inputClass} resize-none`} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Price (BDT) *</label>
                            <input name="price" type="number" value={form.price} onChange={handleChange} required min={0}
                                placeholder="e.g. 15000000" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Type *</label>
                            <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
                                <option value="Sale">Sale</option>
                                <option value="Rent">Rent</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Category *</label>
                            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
                                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Location */}
                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5 shadow-card">
                    <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
                        <span className="material-icons-outlined text-emerald-500 text-lg">location_on</span>Location
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Address</label>
                        <input name="address" value={form.address} onChange={handleChange}
                            placeholder="e.g. Road 12, Gulshan-2, Dhaka" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Latitude *</label>
                            <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required
                                placeholder="e.g. 23.7945" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Longitude *</label>
                            <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required
                                placeholder="e.g. 90.4066" className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* Images */}
                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-card">
                    <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
                        <span className="material-icons-outlined text-emerald-500 text-lg">photo_library</span>Images
                    </h2>
                    <textarea name="images" value={form.images} onChange={handleChange} rows={3}
                        placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
                        className={`${inputClass} resize-none font-mono`} />
                </section>

                {/* Amenities */}
                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-card">
                    <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
                        <span className="material-icons-outlined text-emerald-500 text-lg">star</span>Amenities
                    </h2>
                    <div className="flex flex-wrap gap-2">
                        {AMENITIES_LIST.map((a) => (
                            <button key={a} type="button" onClick={() => toggleAmenity(a)}
                                className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors ${form.amenities.includes(a)
                                        ? "bg-emerald-600 text-white border-emerald-600"
                                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-muted hover:border-emerald-500 hover:text-emerald-600"
                                    }`}>
                                {a}
                            </button>
                        ))}
                    </div>
                </section>

                <div className="flex gap-4 justify-end pb-2">
                    <button type="button" onClick={() => router.back()}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-text-muted text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading}
                        className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-md">
                        {loading ? (
                            <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing…</>
                        ) : (
                            <><span className="material-icons-outlined text-base">publish</span>Publish Listing</>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
