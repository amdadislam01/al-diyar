"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ImageUpload from "@/components/dashboard/ImageUpload";

const CATEGORIES = [
  "Apartment",
  "Villa",
  "Land",
  "Office",
  "Shop",
  "House",
  "Duplex",
  "Penthouse",
];
const AMENITIES_LIST = [
  "Parking",
  "Gym",
  "Swimming Pool",
  "Elevator",
  "Security",
  "Generator",
  "Garden",
  "Balcony",
  "Air Conditioning",
  "Internet",
];

interface FormData {
  title: string;
  description: string;
  price: string;
  type: "Sale" | "Rent";
  category: string;
  address: string;
  lat: string;
  lng: string;
  images: (string | File)[];
  amenities: string[];
  status: "Active" | "Inactive";
}

export default function EditListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    price: "",
    type: "Sale",
    category: "Apartment",
    address: "",
    lat: "",
    lng: "",
    images: [],
    amenities: [],
    status: "Active",
  });

  // Fetch existing listing
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/seller/listings`);
        const data = await res.json();
        if (res.ok) {
          const listing = data.listings.find(
            (l: { _id: string }) => l._id === id,
          );
          if (listing) {
            setForm({
              title: listing.title ?? "",
              description: listing.description ?? "",
              price: String(listing.price ?? ""),
              type: listing.type ?? "Sale",
              category: listing.category ?? "Apartment",
              address: listing.location?.address ?? "",
              lat: String(listing.location?.lat ?? ""),
              lng: String(listing.location?.lng ?? ""),
              images: listing.images ?? [],
              amenities: listing.amenities ?? [],
              status: listing.status ?? "Active",
            });
          }
        }
      } catch {
        setError("Failed to load listing data.");
      } finally {
        setFetching(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const toggleAmenity = (a: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(a)
        ? prev.amenities.filter((x) => x !== a)
        : [...prev.amenities, a],
    }));
  };

  const uploadToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset || "al_diyar_preset");

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Upload failed");
    }

    const data = await response.json();
    return data.secure_url as string;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Upload new files to Cloudinary if any
      const uploadPromises = form.images.map(async (item) => {
        if (typeof item === "string") return item;
        return await uploadToCloudinary(item);
      });

      setUploading(true);
      const imageUrls = await Promise.all(uploadPromises);
      setUploading(false);

      const payload = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        type: form.type,
        category: form.category,
        location: {
          address: form.address,
          lat: Number(form.lat),
          lng: Number(form.lng),
        },
        images: imageUrls,
        amenities: form.amenities,
        status: form.status,
      };

      const res = await fetch(`/api/seller/listings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Listing updated successfully!");
        setTimeout(() => router.push("/dashboard/seller/listings"), 1200);
      } else {
        setError(data.message || "Update failed");
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error ? err.message : "Network error. Please try again.",
      );
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  if (fetching) {
    return (
      <div className="p-6 flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center gap-3 text-text-muted">
          <span className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm">Loading listing…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-primary mb-4 transition-colors"
        >
          <span className="material-icons-outlined text-base">arrow_back</span>
          Back to Listings
        </button>
        <h1 className="text-2xl font-bold text-text-main">Edit Listing</h1>
        <p className="text-sm text-text-muted mt-1">
          Update your property details below.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-2 bg-danger/10 border border-danger/30 text-danger px-4 py-3 rounded-xl mb-5 text-sm">
          <span className="material-icons-outlined text-base">error</span>
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 bg-success/10 border border-success/30 text-success px-4 py-3 rounded-xl mb-5 text-sm">
          <span className="material-icons-outlined text-base">
            check_circle
          </span>
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5 shadow-card">
          <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
            <span className="material-icons-outlined text-primary text-lg">
              info
            </span>
            Basic Information
          </h2>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Title *
            </label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Description *
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition resize-none"
            />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Price (BDT) *
              </label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={handleChange}
                required
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              >
                <option>Sale</option>
                <option>Rent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Category
              </label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </section>

        {/* Location */}
        <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-5 shadow-card">
          <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
            <span className="material-icons-outlined text-primary text-lg">
              location_on
            </span>
            Location
          </h2>
          <div>
            <label className="block text-sm font-medium text-text-muted mb-1.5">
              Address
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Latitude *
              </label>
              <input
                name="lat"
                type="number"
                step="any"
                value={form.lat}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-muted mb-1.5">
                Longitude *
              </label>
              <input
                name="lng"
                type="number"
                step="any"
                value={form.lng}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-text-main text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
              />
            </div>
          </div>
        </section>

        {/* Card: Images */}
        <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-6 shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
            <div>
              <h2 className="text-lg font-bold text-text-main flex items-center gap-2.5">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <span className="material-icons-outlined text-primary text-xl block">
                    photo_library
                  </span>
                </div>
                Property Gallery
                <span className="text-danger ml-0.5">*</span>
              </h2>
              <p className="text-xs text-text-muted mt-1.5 ml-0.5">
                Update images for your property.
              </p>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 rounded-full border border-slate-200 dark:border-slate-700/50">
              <span
                className={`w-2 h-2 rounded-full ${form.images.length > 0 ? "bg-success animate-pulse" : "bg-slate-300"}`}
              />
              <span className="text-xs font-bold text-text-main">
                {form.images.length} / 10{" "}
                <span className="text-text-muted font-medium ml-1">Images</span>
              </span>
            </div>
          </div>

          <div className="bg-slate-50/30 dark:bg-slate-800/10 rounded-2xl p-2">
            <ImageUpload
              value={form.images}
              onChange={(items) =>
                setForm((prev) => ({ ...prev, images: items }))
              }
              onRemove={(item) =>
                setForm((prev) => ({
                  ...prev,
                  images: prev.images.filter((img) => img !== item),
                }))
              }
            />
          </div>
        </section>

        {/* Amenities */}
        <section className="bg-surface dark:bg-surface-dark border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4 shadow-card">
          <h2 className="text-base font-semibold text-text-main flex items-center gap-2">
            <span className="material-icons-outlined text-primary text-lg">
              star
            </span>
            Amenities
          </h2>
          <div className="flex flex-wrap gap-2">
            {AMENITIES_LIST.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => toggleAmenity(a)}
                className={`px-3 py-1.5 rounded-full text-sm border font-medium transition-colors
                  ${form.amenities.includes(a) ? "bg-primary text-white border-primary" : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-text-muted hover:border-primary hover:text-primary"}`}
              >
                {a}
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-4 justify-end pb-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-text-muted text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-60 flex items-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {uploading ? "Uploading Images..." : "Saving..."}
              </>
            ) : (
              <>
                <span className="material-icons-outlined text-base">save</span>
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
