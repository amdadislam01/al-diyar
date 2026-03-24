"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/dashboard/ImageUpload";
import dynamic from "next/dynamic";

const LocationPickerMap = dynamic(() => import("@/components/dashboard/LocationPickerMap"), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500">Loading Map...</div>,
});

const CATEGORIES = ["Apartment", "Villa", "Land", "Office", "Shop", "House", "Duplex", "Penthouse", "Townhouse", "Condo"];
const AMENITIES_LIST = ["Parking", "Gym", "Swimming Pool", "Elevator", "Security", "Generator", "Garden", "Balcony", "Air Conditioning", "Internet", "Laundry", "Playground"];
const FLOORING_OPTIONS = ["Carpet", "Concrete", "Tile", "Wood", "Marble", "Vinyl", "Laminate"];
const COOLING_OPTIONS = ["Central AC", "Ceiling Fans", "Ductless Units", "Window AC", "Split AC"];
const HEATING_OPTIONS = ["Central Heating", "Radiant", "Baseboard", "Heat Pump", "Gas Furnace"];
const UTILITY_OPTIONS = ["Cable", "Internet", "Gas", "Water", "Sewer", "Electricity", "Solar"];
const CONSTRUCTION_OPTIONS = ["Fiber Cement", "Stucco", "Frame", "Lap Siding", "Brick", "Stone", "Concrete", "Wood"];
const COMMUNITY_OPTIONS = ["Park", "Urban Farm", "Dog Park", "Public Art", "Paddle Courts", "Playground", "Community Center", "Jogging Trail"];

interface FormData {
    title: string;
    description: string;
    price: string;
    type: "Sale" | "Rent";
    category: string;
    address: string;
    neighborhood: string;
    country: string;
    lat: string;
    lng: string;
    status: "Active" | "Pending" | "Sold" | "Inactive";
    listedDate: string;
    pricePerSqft: string;
    estimatedMortgage: string;
    hoaFees: string;
    hoaFrequency: string;
    size: string;
    bedrooms: string;
    bathrooms: string;
    fullBaths: string;
    partialBaths: string;
    rooms: string;
    flooring: string[];
    kitchen: string;
    cooling: string[];
    heating: string[];
    utilities: string[];
    yearBuilt: string;
    builder: string;
    constructionMaterials: string[];
    roofType: string;
    garageParking: string;
    specialFeatures: string;
    nearbySchoolsHospitals: string;
    shoppingTransport: string;
    communityFacilities: string[];
    futureAmenities: string;
    mlsNumber: string;
    approval: string;
    ownershipType: string;
    agentName: string;
    dreNumber: string;
    phone: string;
    email: string;
    /* Seller Info Unique to Agent Listing on behalf */
    sellerName: string;
    sellerEmail: string;
    sellerPhone: string;
    images: (string | File)[];
    amenities: string[];
}

export default function AgentNewListingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);

    const [form, setForm] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        type: "Sale",
        category: "Apartment",
        address: "",
        neighborhood: "",
        country: "",
        lat: "",
        lng: "",
        status: "Active",
        listedDate: "",
        pricePerSqft: "",
        estimatedMortgage: "",
        hoaFees: "",
        hoaFrequency: "Monthly",
        size: "",
        bedrooms: "",
        bathrooms: "",
        fullBaths: "",
        partialBaths: "",
        rooms: "",
        flooring: [],
        kitchen: "",
        cooling: [],
        heating: [],
        utilities: [],
        yearBuilt: "",
        builder: "",
        constructionMaterials: [],
        roofType: "",
        garageParking: "",
        specialFeatures: "",
        nearbySchoolsHospitals: "",
        shoppingTransport: "",
        communityFacilities: [],
        futureAmenities: "",
        mlsNumber: "",
        approval: "",
        ownershipType: "",
        agentName: "",
        dreNumber: "",
        phone: "",
        email: "",
        sellerName: "",
        sellerEmail: "",
        sellerPhone: "",
        images: [],
        amenities: [],
    });

    useEffect(() => {
        fetch("/data/country.json")
            .then((res) => res.json())
            .then((data) => setCountries(data))
            .catch((err) => console.error("Failed to load countries", err));
    }, []);

    useEffect(() => {
        if (session?.user) {
            setForm((prev) => ({
                ...prev,
                agentName: prev.agentName || session.user.name || "",
                email: prev.email || session.user.email || "",
            }));
        }
    }, [session?.user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const toggleArrayItem = (field: keyof FormData, item: string) => {
        setForm((prev) => {
            const arr = prev[field] as string[];
            return { ...prev, [field]: arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item] };
        });
    };

    const uploadToCloudinary = async (file: File) => {
        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

        if (!cloudName || !uploadPreset) {
            throw new Error("Cloudinary configuration is missing. Please check your environment variables.");
        }

        const data = new FormData();
        data.append("upload_preset", uploadPreset);
        data.append("file", file);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
            method: "POST",
            body: data,
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error?.message || "Upload failed");
        }
        return result.secure_url as string;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const uploadPromises = form.images.map(async (item) => {
                if (typeof item === "string") return item;
                return await uploadToCloudinary(item);
            });

            setUploading(true);
            const imageUrls = await Promise.all(uploadPromises);
            setUploading(false);

            const roomsArr = form.rooms.split(",").map((s) => s.trim()).filter(Boolean);
            const specialFeaturesArr = form.specialFeatures.split(",").map((s) => s.trim()).filter(Boolean);

            const payload = {
                ...form,
                price: Number(form.price),
                lat: Number(form.lat),
                lng: Number(form.lng),
                location: { address: form.address, lat: Number(form.lat), lng: Number(form.lng) },
                images: imageUrls,
                pricePerSqft: form.pricePerSqft ? Number(form.pricePerSqft) : undefined,
                estimatedMortgage: form.estimatedMortgage ? Number(form.estimatedMortgage) : undefined,
                hoaFees: form.hoaFees ? Number(form.hoaFees) : undefined,
                size: form.size ? Number(form.size) : undefined,
                bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
                bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
                fullBaths: form.fullBaths ? Number(form.fullBaths) : undefined,
                partialBaths: form.partialBaths ? Number(form.partialBaths) : undefined,
                yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
                rooms: roomsArr.length ? roomsArr : undefined,
                specialFeatures: specialFeaturesArr.length ? specialFeaturesArr : undefined,
            };

            const res = await fetch("/api/agent/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Listing created successfully!");
                setTimeout(() => router.push("/dashboard/agent/listings"), 1200);
            } else {
                setError(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : "Network error. Please try again.");
        } finally {
            setLoading(false);
            setUploading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition";
    const sectionClass = "bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5 shadow-card";
    const sectionHeadingClass = "text-base font-semibold text-text-main flex items-center gap-2";

    const TagToggle = ({ items, field, label }: { items: string[]; field: keyof FormData; label?: string }) => (
        <div>
            {label && <label className="block text-sm font-medium text-text-muted mb-2">{label}</label>}
            <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                    <button
                        key={item}
                        type="button"
                        onClick={() => toggleArrayItem(field, item)}
                        className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors ${
                            (form[field] as string[]).includes(item) ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-muted hover:border-emerald-500 hover:text-emerald-600"
                        }`}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-6 mx-auto">
            <div className="mb-8">
                <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-text-muted hover:text-emerald-600 mb-4 transition-colors">
                    <span className="material-icons-outlined text-base">arrow_back</span>
                    Back to Listings
                </button>
                <h1 className="text-2xl font-bold text-text-main">Add New Listing</h1>
                <p className="text-sm text-text-muted mt-1">Fill in all the details to publish a complete property listing.</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">error</span>
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">check_circle</span>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">location_on</span>
                        Location & Basic Info
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Property Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Modern Townhouse" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the property..." className={`${inputClass} resize-none`} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Address</label>
                        <input name="address" value={form.address} onChange={handleChange} placeholder="Street, City, Zip" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Neighborhood</label>
                        <input name="neighborhood" value={form.neighborhood} onChange={handleChange} placeholder="e.g. Downtown" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Property Country *</label>
                            <select name="country" value={form.country} onChange={handleChange} required className={inputClass}>
                                <option value="">Select Country</option>
                                {countries.map((c) => (
                                    <option key={c.code} value={c.name}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Listed Date</label>
                            <input name="listedDate" type="date" value={form.listedDate} onChange={handleChange} className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                                {CATEGORIES.map((c) => (
                                    <option key={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Status</label>
                            <select name="status" value={form.status} onChange={handleChange} className={inputClass}>
                                <option value="Active">Active</option>
                                <option value="Pending">Pending</option>
                                <option value="Inactive">Inactive</option>
                                <option value="Sold">Sold</option>
                            </select>
                        </div>
                    </div>
                    <div className="mt-4 mb-6">
                        <label className="block text-sm font-medium text-text-muted mb-2">Location on Map *</label>
                        <LocationPickerMap lat={Number(form.lat) || 0} lng={Number(form.lng) || 0} onChange={(lat, lng) => setForm((prev) => ({ ...prev, lat: lat.toString(), lng: lng.toString() }))} onAddressChange={(addr) => setForm((prev) => ({ ...prev, address: addr }))} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required placeholder="Latitude" className={inputClass} />
                        <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required placeholder="Longitude" className={inputClass} />
                    </div>
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">payments</span>
                        Price & Mortgage
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="price" type="number" value={form.price} onChange={handleChange} required placeholder="List Price ($)" className={inputClass} />
                        <input name="pricePerSqft" type="number" value={form.pricePerSqft} onChange={handleChange} placeholder="Price per Sqft ($)" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input name="estimatedMortgage" type="number" value={form.estimatedMortgage} onChange={handleChange} placeholder="Est. Mortgage ($/mo)" className={inputClass} />
                        <input name="hoaFees" type="number" value={form.hoaFees} onChange={handleChange} placeholder="HOA Fees ($)" className={inputClass} />
                        <select name="hoaFrequency" value={form.hoaFrequency} onChange={handleChange} className={inputClass}>
                            <option value="Monthly">Monthly</option>
                            <option value="Quarterly">Quarterly</option>
                            <option value="Annually">Annually</option>
                        </select>
                    </div>
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">weekend</span>
                        Interior Details
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <input name="size" type="number" value={form.size} onChange={handleChange} placeholder="Size (sqft)" className={inputClass} />
                        <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="Bedrooms" className={inputClass} />
                        <input name="fullBaths" type="number" value={form.fullBaths} onChange={handleChange} placeholder="Full Baths" className={inputClass} />
                        <input name="partialBaths" type="number" value={form.partialBaths} onChange={handleChange} placeholder="Partial Baths" className={inputClass} />
                    </div>
                    <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="Total Bathrooms" className={inputClass} />
                    <input name="rooms" value={form.rooms} onChange={handleChange} placeholder="Rooms (comma-separated)" className={inputClass} />
                    <TagToggle items={FLOORING_OPTIONS} field="flooring" label="Flooring" />
                    <input name="kitchen" value={form.kitchen} onChange={handleChange} placeholder="Kitchen Details" className={inputClass} />
                    <TagToggle items={COOLING_OPTIONS} field="cooling" label="Cooling" />
                    <TagToggle items={HEATING_OPTIONS} field="heating" label="Heating" />
                    <TagToggle items={UTILITY_OPTIONS} field="utilities" label="Utilities" />
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">apartment</span>
                        Building & Exterior
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input name="yearBuilt" type="number" value={form.yearBuilt} onChange={handleChange} placeholder="Year Built" className={inputClass} />
                        <input name="builder" value={form.builder} onChange={handleChange} placeholder="Builder / Developer" className={inputClass} />
                        <input name="roofType" value={form.roofType} onChange={handleChange} placeholder="Roof Type" className={inputClass} />
                    </div>
                    <TagToggle items={CONSTRUCTION_OPTIONS} field="constructionMaterials" label="Construction" />
                    <input name="garageParking" value={form.garageParking} onChange={handleChange} placeholder="Garage / Parking" className={inputClass} />
                    <input name="specialFeatures" value={form.specialFeatures} onChange={handleChange} placeholder="Special Features (comma-separated)" className={inputClass} />
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">park</span>
                        Community & Amenities
                    </h2>
                    <input name="nearbySchoolsHospitals" value={form.nearbySchoolsHospitals} onChange={handleChange} placeholder="Nearby Schools / Hospitals" className={inputClass} />
                    <input name="shoppingTransport" value={form.shoppingTransport} onChange={handleChange} placeholder="Shopping & Transport" className={inputClass} />
                    <TagToggle items={COMMUNITY_OPTIONS} field="communityFacilities" label="Community Facilities" />
                    <input name="futureAmenities" value={form.futureAmenities} onChange={handleChange} placeholder="Future Amenities" className={inputClass} />
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">description</span>
                        Legal & Documentation
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input name="mlsNumber" value={form.mlsNumber} onChange={handleChange} placeholder="MLS Number" className={inputClass} />
                        <input name="approval" value={form.approval} onChange={handleChange} placeholder="Approval" className={inputClass} />
                        <input name="ownershipType" value={form.ownershipType} onChange={handleChange} placeholder="Ownership Type" className={inputClass} />
                    </div>
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">contact_phone</span>
                        Contact info (Public)
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="agentName" value={form.agentName} onChange={handleChange} placeholder="Agent Name" className={inputClass} />
                        <input name="dreNumber" value={form.dreNumber} onChange={handleChange} placeholder="DRE Number" className={inputClass} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className={inputClass} />
                        <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" className={inputClass} />
                    </div>
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">person</span>
                        Seller Info (For Internal Use)
                    </h2>
                    <input name="sellerName" value={form.sellerName} onChange={handleChange} placeholder="Seller Name" className={inputClass} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="sellerEmail" type="email" value={form.sellerEmail} onChange={handleChange} placeholder="Seller Email" className={inputClass} />
                        <input name="sellerPhone" value={form.sellerPhone} onChange={handleChange} placeholder="Seller Phone" className={inputClass} />
                    </div>
                </section>

                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-6 shadow-sm">
                    <h2 className="text-lg font-bold text-text-main flex items-center gap-2.5">
                        <span className="material-icons-outlined text-emerald-500 text-xl block">photo_library</span>
                        Property Gallery *
                    </h2>
                    <ImageUpload value={form.images} onChange={(items) => setForm((prev) => ({ ...prev, images: items }))} onRemove={(item) => setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== item) }))} maxImages={20} />
                </section>

                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-emerald-500 text-lg">star</span> Property Amenities
                    </h2>
                    <TagToggle items={AMENITIES_LIST} field="amenities" />
                </section>

                <div className="flex gap-4 justify-end pb-2">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-text-muted text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Cancel</button>
                    <button type="submit" disabled={loading} className="px-8 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-md">
                        {loading ? "Publishing..." : "Publish Listing"}
                    </button>
                </div>
            </form>
        </div>
    );
}
