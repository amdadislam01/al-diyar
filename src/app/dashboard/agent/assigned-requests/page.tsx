"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: "Sale" | "Rent";
  category: string;
  status: string;
  assignmentStatus: string;
  country: string;
  location: { address?: string; lat: number; lng: number };
  listedBy: { name: string; email: string; phone: string };
  images: string[];
  amenities: string[];
  neighborhood?: string;
  pricePerSqft?: number;
  size?: number;
  bedrooms?: number;
  bathrooms?: number;
  fullBaths?: number;
  partialBaths?: number;
  rooms?: string[];
  flooring?: string[];
  kitchen?: string;
  cooling?: string[];
  heating?: string[];
  utilities?: string[];
  yearBuilt?: number;
  builder?: string;
  constructionMaterials?: string[];
  roofType?: string;
  garageParking?: string;
  specialFeatures?: string[];
  nearbySchoolsHospitals?: string;
  shoppingTransport?: string;
  communityFacilities?: string[];
  futureAmenities?: string;
  mlsNumber?: string;
  ownershipType?: string;
  agentName?: string;
  dreNumber?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

export default function AgentAssignedRequestsPage() {
  const { data: session } = useSession();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchAssignedListings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agent/assigned-listings?status=pending");
      const data = await res.json();
      if (res.ok) setListings(data.listings);
      else showToast(data.message || "Failed to load requests", "error");
    } catch {
      showToast("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignedListings();
  }, []);

  const handleApprove = async (id: string) => {
    const result = await Swal.fire({
      title: "Approve Listing?",
      text: "This will make the listing active on the platform.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#10B981",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Yes, approve it!",
    });

    if (result.isConfirmed) {
      setApproving(id);
      try {
        const res = await fetch(`/api/agent/assigned-listings/${id}/approve`, {
          method: "PATCH",
        });
        const data = await res.json();
        if (res.ok) {
          setListings((prev) => prev.filter((l) => l._id !== id));
          Swal.fire({
            title: "Approved!",
            text: "Listing is now active.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          showToast(data.message || "Approval failed", "error");
        }
      } catch {
        showToast("Network error", "error");
      } finally {
        setApproving(null);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-white text-sm font-medium animate-reveal ${toast.type === "success" ? "bg-success" : "bg-danger"}`}
        >
          <span className="material-icons-outlined text-base">
            {toast.type === "success" ? "check_circle" : "error"}
          </span>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-main">Assigned Requests</h1>
        <p className="text-sm text-text-muted mt-0.5">
          Review and approve property listings assigned to you.
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
            />
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <span className="material-icons-outlined text-6xl text-slate-300 dark:text-slate-600">
            assignment_late
          </span>
          <p className="text-text-muted text-lg font-medium">
            No pending requests assigned to you.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-surface dark:bg-surface-dark rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-card flex flex-col sm:flex-row h-full"
            >
              {/* Image Part */}
              <div className="relative w-full sm:w-48 h-48 sm:h-full bg-slate-100 shrink-0">
                {listing.images?.[0] ? (
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <span className="material-icons-outlined text-4xl text-slate-300">
                      image
                    </span>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold text-white ${listing.type === "Sale" ? "bg-primary" : "bg-accent"}`}
                  >
                    {listing.type}
                  </span>
                </div>
              </div>

              {/* Info Part */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-auto">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">
                      {listing.category}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      {new Date(listing.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-bold text-text-main text-lg line-clamp-1 mb-1">
                    {listing.title}
                  </h3>
                  <p className="text-xs text-text-muted flex items-center gap-1 mb-3">
                    <span className="material-icons-outlined text-sm">
                      location_on
                    </span>
                    {listing.country} ·{" "}
                    {listing.location.address || "No address"}
                  </p>

                  {/* Seller Info */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 space-y-1 mb-4">
                    <p className="text-[10px] text-text-muted font-semibold uppercase">
                      Seller Info
                    </p>
                    <p className="text-sm font-medium text-text-main">
                      {listing.listedBy?.name}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <span className="material-icons-outlined text-xs">
                          email
                        </span>{" "}
                        {listing.listedBy?.email}
                      </span>
                      {listing.listedBy?.phone && (
                        <span className="flex items-center gap-1">
                          <span className="material-icons-outlined text-xs">
                            phone
                          </span>{" "}
                          {listing.listedBy?.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setSelectedListing(listing)}
                    className="flex-1 text-center py-2 text-sm font-semibold text-primary border border-primary rounded-xl hover:bg-primary/5 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleApprove(listing._id)}
                    disabled={approving === listing._id}
                    className="flex-[1.5] py-2 text-sm font-semibold bg-success text-white rounded-xl hover:bg-success-dark transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {approving === listing._id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="material-icons-outlined text-base">
                        check_circle
                      </span>
                    )}
                    Approve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setSelectedListing(null)}
          />
          <div className="relative bg-surface dark:bg-surface-dark w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col animate-scaleIn">
            {/* Modal Header */}
            <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900">
              <div>
                <h2 className="text-xl font-bold text-text-main">
                  {selectedListing.title}
                </h2>
                <p className="text-xs text-text-muted">
                  Listing ID: {selectedListing._id}
                </p>
              </div>
              <button
                onClick={() => setSelectedListing(null)}
                className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span className="material-icons-outlined">close</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
              {/* Images Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {selectedListing.images.map((img, i) => (
                  <div
                    key={i}
                    className={`relative rounded-2xl overflow-hidden bg-slate-100 ${i === 0 ? "col-span-2 row-span-2 aspect-square sm:aspect-video" : "aspect-square"}`}
                  >
                    <img
                      src={img}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Description */}
                  <section>
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
                      Description
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">
                      {selectedListing.description}
                    </p>
                  </section>

                  {/* Features Grid */}
                  <div className="grid grid-cols-2 gap-6">
                    <section>
                      <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
                        Interior
                      </h3>
                      <ul className="space-y-2 text-sm text-text-muted">
                        {selectedListing.size && (
                          <li>
                            <span className="font-semibold">Size:</span>{" "}
                            {selectedListing.size} sqft
                          </li>
                        )}
                        {selectedListing.bedrooms && (
                          <li>
                            <span className="font-semibold">Bedrooms:</span>{" "}
                            {selectedListing.bedrooms}
                          </li>
                        )}
                        {selectedListing.bathrooms && (
                          <li>
                            <span className="font-semibold">Bathrooms:</span>{" "}
                            {selectedListing.bathrooms}
                          </li>
                        )}
                        {selectedListing.kitchen && (
                          <li>
                            <span className="font-semibold">Kitchen:</span>{" "}
                            {selectedListing.kitchen}
                          </li>
                        )}
                        {selectedListing.flooring &&
                          selectedListing.flooring.length > 0 && (
                            <li>
                              <span className="font-semibold">Flooring:</span>{" "}
                              {selectedListing.flooring.join(", ")}
                            </li>
                          )}
                      </ul>
                    </section>
                    <section>
                      <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
                        Building
                      </h3>
                      <ul className="space-y-2 text-sm text-text-muted">
                        {selectedListing.yearBuilt && (
                          <li>
                            <span className="font-semibold">Year Built:</span>{" "}
                            {selectedListing.yearBuilt}
                          </li>
                        )}
                        {selectedListing.builder && (
                          <li>
                            <span className="font-semibold">Builder:</span>{" "}
                            {selectedListing.builder}
                          </li>
                        )}
                        {selectedListing.roofType && (
                          <li>
                            <span className="font-semibold">Roof:</span>{" "}
                            {selectedListing.roofType}
                          </li>
                        )}
                        {selectedListing.garageParking && (
                          <li>
                            <span className="font-semibold">Parking:</span>{" "}
                            {selectedListing.garageParking}
                          </li>
                        )}
                      </ul>
                    </section>
                  </div>

                  {/* Amenities */}
                  <section>
                    <h3 className="text-sm font-bold text-text-main uppercase tracking-wider mb-3">
                      Amenities
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.amenities.map((a) => (
                        <span
                          key={a}
                          className="px-3 py-1 bg-primary/5 text-primary text-xs font-medium rounded-full border border-primary/10"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-5 border border-slate-100 dark:border-slate-800">
                    <p className="text-2xl font-bold text-primary mb-1">
                      ${selectedListing.price.toLocaleString()}
                    </p>
                    <p className="text-xs text-text-muted mb-4">
                      {selectedListing.type} · {selectedListing.category}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="material-icons-outlined text-sm text-text-muted">
                          location_on
                        </span>
                        <p className="text-xs text-text-muted">
                          {selectedListing.location.address},{" "}
                          {selectedListing.country}
                        </p>
                      </div>
                      {selectedListing.mlsNumber && (
                        <div className="flex items-center gap-2">
                          <span className="material-icons-outlined text-sm text-text-muted">
                            tag
                          </span>
                          <p className="text-xs text-text-muted italic">
                            MLS #{selectedListing.mlsNumber}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
                    <h4 className="text-xs font-bold text-primary uppercase tracking-wider mb-3">
                      Seller Contact
                    </h4>
                    <p className="text-sm font-bold text-text-main mb-1">
                      {selectedListing.listedBy.name}
                    </p>
                    <p className="text-xs text-text-muted mb-1">
                      {selectedListing.listedBy.email}
                    </p>
                    {selectedListing.listedBy.phone && (
                      <p className="text-xs text-text-muted">
                        {selectedListing.listedBy.phone}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      handleApprove(selectedListing._id);
                      setSelectedListing(null);
                    }}
                    className="w-full py-3 bg-success text-white font-bold rounded-2xl hover:bg-success-dark transition-all shadow-lg flex items-center justify-center gap-2"
                  >
                    <span className="material-icons-outlined">
                      check_circle
                    </span>
                    Approve Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
