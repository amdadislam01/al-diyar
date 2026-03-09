"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ImageUpload from "@/components/dashboard/ImageUpload";

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
    country: string; // New field
    assignedAgent: string; // New field
    lat: string;
    lng: string;
    status: "Active" | "Pending" | "Sold";
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
    images: (string | File)[];
    amenities: string[];
}

export default function NewListingPage() {
    const router = useRouter();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
    const [agents, setAgents] = useState<{ _id: string; name: string; companyName?: string }[]>([]);
    const [loadingAgents, setLoadingAgents] = useState(false);

    const [form, setForm] = useState<FormData>({
        title: "",
        description: "",
        price: "",
        type: "Sale",
        category: "Apartment",
        address: "",
        neighborhood: "",
        country: "", // New field
        assignedAgent: "", // New field
        lat: "",
        lng: "",
        status: "Pending", // Default to Pending for new listings
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
        images: [],
        amenities: [],
    });

    useEffect(() => {
        fetch("/data/country.json")
            .then(res => res.json())
            .then(data => setCountries(data))
            .catch(err => console.error("Failed to load countries", err));
    }, []);

    useEffect(() => {
        if (form.country) {
            setLoadingAgents(true);
            fetch(`/api/agents?country=${form.country}`)
                .then(res => res.json())
                .then(data => {
                    setAgents(data.agents || []);
                    if (data.agents?.length > 0) {
                        setForm(prev => ({ ...prev, assignedAgent: data.agents[0]._id }));
                    } else {
                        setForm(prev => ({ ...prev, assignedAgent: "" }));
                    }
                })
                .catch(err => console.error("Failed to load agents", err))
                .finally(() => setLoadingAgents(false));
        } else {
            setAgents([]);
            setForm(prev => ({ ...prev, assignedAgent: "" }));
        }
    }, [form.country]);

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
            // Upload new files to Cloudinary if any
            const uploadPromises = form.images.map(async (item) => {
                if (typeof item === "string") return item;
                return await uploadToCloudinary(item);
            });

            setUploading(true);
            const imageUrls = await Promise.all(uploadPromises);
            setUploading(false);

            const roomsArr = form.rooms
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);
            const specialFeaturesArr = form.specialFeatures
                .split(",")
                .map((s) => s.trim())
                .filter(Boolean);

            const payload = {
                title: form.title,
                description: form.description,
                price: Number(form.price),
                type: form.type,
                category: form.category,
                status: "Pending", // Always Pending for new listings
                country: form.country,
                assignedAgent: form.assignedAgent,
                location: { address: form.address, lat: Number(form.lat), lng: Number(form.lng) },
                images: imageUrls,
                amenities: form.amenities,
                /* All structured fields */
                neighborhood: form.neighborhood || undefined,
                listedDate: form.listedDate || undefined,
                pricePerSqft: form.pricePerSqft ? Number(form.pricePerSqft) : undefined,
                estimatedMortgage: form.estimatedMortgage ? Number(form.estimatedMortgage) : undefined,
                hoaFees: form.hoaFees ? Number(form.hoaFees) : undefined,
                hoaFrequency: form.hoaFrequency || undefined,
                size: form.size ? Number(form.size) : undefined,
                bedrooms: form.bedrooms ? Number(form.bedrooms) : undefined,
                bathrooms: form.bathrooms ? Number(form.bathrooms) : undefined,
                fullBaths: form.fullBaths ? Number(form.fullBaths) : undefined,
                partialBaths: form.partialBaths ? Number(form.partialBaths) : undefined,
                rooms: roomsArr.length ? roomsArr : undefined,
                flooring: form.flooring.length ? form.flooring : undefined,
                kitchen: form.kitchen || undefined,
                cooling: form.cooling.length ? form.cooling : undefined,
                heating: form.heating.length ? form.heating : undefined,
                utilities: form.utilities.length ? form.utilities : undefined,
                yearBuilt: form.yearBuilt ? Number(form.yearBuilt) : undefined,
                builder: form.builder || undefined,
                constructionMaterials: form.constructionMaterials.length ? form.constructionMaterials : undefined,
                roofType: form.roofType || undefined,
                garageParking: form.garageParking || undefined,
                specialFeatures: specialFeaturesArr.length ? specialFeaturesArr : undefined,
                nearbySchoolsHospitals: form.nearbySchoolsHospitals || undefined,
                shoppingTransport: form.shoppingTransport || undefined,
                communityFacilities: form.communityFacilities.length ? form.communityFacilities : undefined,
                futureAmenities: form.futureAmenities || undefined,
                mlsNumber: form.mlsNumber || undefined,
                approval: form.approval || undefined,
                ownershipType: form.ownershipType || undefined,
                agentName: form.agentName || undefined,
                dreNumber: form.dreNumber || undefined,
                phone: form.phone || undefined,
                email: form.email || undefined,
            };

            const res = await fetch("/api/seller/listings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess("Listing created successfully!");
                setTimeout(() => router.push("/dashboard/seller/listings"), 1200);
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

    const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition";
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
                            (form[field] as string[]).includes(item) ? "bg-primary text-white border-primary" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-muted hover:border-primary hover:text-primary"
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
                <button onClick={() => router.back()} className="flex items-center gap-1 text-sm text-text-muted hover:text-primary mb-4 transition-colors">
                    <span className="material-icons-outlined text-base">arrow_back</span>
                    Back to Listings
                </button>
                <h1 className="text-2xl font-bold text-text-main">Add New Listing</h1>
                <p className="text-sm text-text-muted mt-1">Fill in all the details to publish a complete property listing.</p>
            </div>

            {error && (
                <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">error</span>
                    {error}
                </div>
            )}
            {success && (
                <div className="flex items-center gap-2 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl mb-5 text-sm">
                    <span className="material-icons-outlined text-base">check_circle</span>
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* ───── 1. Location & Basic Info ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">location_on</span>
                        📍 Location & Basic Info
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Property Title *</label>
                        <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Modern Townhouse in Downtown" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Description *</label>
                        <textarea name="description" value={form.description} onChange={handleChange} required rows={4} placeholder="Describe the property in detail..." className={`${inputClass} resize-none`} />
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
                            <label className="block text-sm font-medium text-text-muted mb-1.5">
                                Assigned Agent * {loadingAgents && <span className="animate-pulse"> (Loading...)</span>}
                            </label>
                            <select name="assignedAgent" value={form.assignedAgent} onChange={handleChange} required className={inputClass} disabled={loadingAgents || !form.country}>
                                <option value="">Select Agent</option>
                                {agents.map((a) => (
                                    <option key={a._id} value={a._id}>{a.name} ({a.companyName || "Independent"})</option>
                                ))}
                            </select>
                            {form.country && agents.length === 0 && !loadingAgents && (
                                <p className="text-[10px] text-danger mt-1">No approved agents found for this country.</p>
                            )}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Latitude *</label>
                            <input name="lat" type="number" step="any" value={form.lat} onChange={handleChange} required placeholder="e.g. 23.7945" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Longitude *</label>
                            <input name="lng" type="number" step="any" value={form.lng} onChange={handleChange} required placeholder="e.g. 90.4066" className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* ───── 2. Price & Mortgage ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">payments</span>
                        💰 Price & Mortgage
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">List Price ($) *</label>
                            <input name="price" type="number" value={form.price} onChange={handleChange} required min={0} placeholder="e.g. 679999" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Price per Sqft ($)</label>
                            <input name="pricePerSqft" type="number" value={form.pricePerSqft} onChange={handleChange} placeholder="e.g. 357" className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Est. Mortgage ($/mo)</label>
                            <input name="estimatedMortgage" type="number" value={form.estimatedMortgage} onChange={handleChange} placeholder="e.g. 4078" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">HOA Fees ($)</label>
                            <input name="hoaFees" type="number" value={form.hoaFees} onChange={handleChange} placeholder="e.g. 165" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">HOA Frequency</label>
                            <select name="hoaFrequency" value={form.hoaFrequency} onChange={handleChange} className={inputClass}>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Annually">Annually</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ───── 3. Interior Details ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">weekend</span>
                        🛋️ Interior Details
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Size (sqft)</label>
                            <input name="size" type="number" value={form.size} onChange={handleChange} placeholder="e.g. 1905" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Bedrooms</label>
                            <input name="bedrooms" type="number" value={form.bedrooms} onChange={handleChange} placeholder="e.g. 2" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Full Baths</label>
                            <input name="fullBaths" type="number" value={form.fullBaths} onChange={handleChange} placeholder="e.g. 2" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Partial Baths</label>
                            <input name="partialBaths" type="number" value={form.partialBaths} onChange={handleChange} placeholder="e.g. 1" className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Total Bathrooms</label>
                            <input name="bathrooms" type="number" value={form.bathrooms} onChange={handleChange} placeholder="e.g. 3" className={inputClass} />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Rooms (comma-separated)</label>
                        <input name="rooms" value={form.rooms} onChange={handleChange} placeholder="Master Bedroom, Master Bathroom, Dining Room, Kitchen" className={inputClass} />
                    </div>
                    <TagToggle items={FLOORING_OPTIONS} field="flooring" label="Flooring" />
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Kitchen Details</label>
                        <input name="kitchen" value={form.kitchen} onChange={handleChange} placeholder="Stainless steel appliances, Quartz countertops, Large island" className={inputClass} />
                    </div>
                    <TagToggle items={COOLING_OPTIONS} field="cooling" label="Cooling" />
                    <TagToggle items={HEATING_OPTIONS} field="heating" label="Heating" />
                    <TagToggle items={UTILITY_OPTIONS} field="utilities" label="Utilities" />
                </section>

                {/* ───── 4. Building & Exterior ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">apartment</span>
                        🏢 Building & Exterior
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Year Built</label>
                            <input name="yearBuilt" type="number" value={form.yearBuilt} onChange={handleChange} placeholder="e.g. 2017" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Builder / Developer</label>
                            <input name="builder" value={form.builder} onChange={handleChange} placeholder="e.g. Fulcrum Property" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Roof Type</label>
                            <input name="roofType" value={form.roofType} onChange={handleChange} placeholder="e.g. Flat" className={inputClass} />
                        </div>
                    </div>
                    <TagToggle items={CONSTRUCTION_OPTIONS} field="constructionMaterials" label="Construction Materials" />
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Garage / Parking</label>
                        <input name="garageParking" value={form.garageParking} onChange={handleChange} placeholder="2 Car Garage, Attached, Side by Side, Rear Access" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Special Features (comma-separated)</label>
                        <input name="specialFeatures" value={form.specialFeatures} onChange={handleChange} placeholder="Indoor/Outdoor Patio, Fire Pit, Courtyard" className={inputClass} />
                    </div>
                </section>

                {/* ───── 5. Community & Amenities ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">park</span>
                        🌳 Community & Amenities
                    </h2>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Nearby Schools / Hospitals</label>
                        <input name="nearbySchoolsHospitals" value={form.nearbySchoolsHospitals} onChange={handleChange} placeholder="Names of nearby schools & hospitals" className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Shopping & Transport</label>
                        <input name="shoppingTransport" value={form.shoppingTransport} onChange={handleChange} placeholder="Walkable to cafes, restaurants, public transport" className={inputClass} />
                    </div>
                    <TagToggle items={COMMUNITY_OPTIONS} field="communityFacilities" label="Community Facilities" />
                    <div>
                        <label className="block text-sm font-medium text-text-muted mb-1.5">Future Amenities</label>
                        <input name="futureAmenities" value={form.futureAmenities} onChange={handleChange} placeholder="Gym, Pool (membership required)" className={inputClass} />
                    </div>
                </section>

                {/* ───── 6. Legal & Documentation ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">description</span>
                        📝 Legal & Documentation
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">MLS Number</label>
                            <input name="mlsNumber" value={form.mlsNumber} onChange={handleChange} placeholder="e.g. 226018120" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Approval</label>
                            <input name="approval" value={form.approval} onChange={handleChange} placeholder="Standard Conditions" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Ownership Type</label>
                            <input name="ownershipType" value={form.ownershipType} onChange={handleChange} placeholder="Single Family Residence" className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* ───── 7. Contact ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">contact_phone</span>
                        📞 Contact
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Agent Name</label>
                            <input name="agentName" value={form.agentName} onChange={handleChange} placeholder="e.g. Mollie Nelson" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">DRE Number</label>
                            <input name="dreNumber" value={form.dreNumber} onChange={handleChange} placeholder="e.g. #01816885" className={inputClass} />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Phone</label>
                            <input name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. (916) 718-4377" className={inputClass} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-text-muted mb-1.5">Email</label>
                            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="agent@example.com" className={inputClass} />
                        </div>
                    </div>
                </section>

                {/* ───── 8. Images ───── */}
                <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
                        <div>
                            <h2 className="text-lg font-bold text-text-main flex items-center gap-2.5">
                                <div className="p-2 bg-primary/10 rounded-xl">
                                    <span className="material-icons-outlined text-primary text-xl block">photo_library</span>
                                </div>
                                Property Gallery
                                <span className="text-danger ml-0.5">*</span>
                            </h2>
                            <p className="text-xs text-text-muted mt-1.5 ml-0.5">Upload at least one high-quality image of your property.</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700/50">
                            <span className={`w-2 h-2 rounded-full ${form.images.length > 0 ? "bg-success animate-pulse" : "bg-slate-300"}`} />
                            <span className="text-xs font-bold text-text-main">
                                {form.images.length} / 10 <span className="text-text-muted font-medium ml-1">Images</span>
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-50/30 dark:bg-slate-800/10 rounded-2xl p-2">
                        <ImageUpload value={form.images} onChange={(items) => setForm((prev) => ({ ...prev, images: items }))} onRemove={(item) => setForm((prev) => ({ ...prev, images: prev.images.filter((img) => img !== item) }))} />
                    </div>
                </section>

                {/* ───── 9. Amenities ───── */}
                <section className={sectionClass}>
                    <h2 className={sectionHeadingClass}>
                        <span className="material-icons-outlined text-primary text-lg">star</span>✨ Property Amenities
                    </h2>
                    <TagToggle items={AMENITIES_LIST} field="amenities" />
                </section>

                {/* ───── Actions ───── */}
                <div className="flex gap-4 justify-end pb-2">
                    <button type="button" onClick={() => router.back()} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-text-muted text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button type="submit" disabled={loading} className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2 shadow-md">
                        {loading ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                {uploading ? "Uploading Images..." : "Publishing..."}
                            </>
                        ) : (
                            <>
                                <span className="material-icons-outlined text-base">publish</span>
                                Publish Listing
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
