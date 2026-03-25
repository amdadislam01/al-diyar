"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { IListing } from "@/models/Listing";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";

export default function PropertyDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [sendingMsg, setSendingMsg] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await fetch(`/api/listings/${id}`);
        const data = await response.json();
        setListing(data.listing);
      } catch (error) {
        console.error("Error fetching listing:", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchListing();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          Property Not Found
        </h2>
        <Link
          href="/property"
          className="text-sky-500 hover:text-sky-600 font-semibold"
        >
          Back to Properties
        </Link>
      </div>
    );
  }

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-34 pb-20 transition-colors duration-500">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-sky-500 transition-colors">
            Home
          </Link>
          <span className="material-icons-round text-xs">chevron_right</span>
          <Link
            href="/property"
            className="hover:text-sky-500 transition-colors"
          >
            Properties
          </Link>
          <span className="material-icons-round text-xs">chevron_right</span>
          <span className="text-slate-900 dark:text-white truncate">
            {listing.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Gallery Section */}
            <div className="space-y-4">
              <div className="relative aspect-video rounded-4xl overflow-hidden shadow-2xl border border-white/20">
                <Image
                  src={
                    listing.images[activeImage] ||
                    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"
                  }
                  alt={listing.title}
                  fill
                  className="object-cover"
                  priority
                />

                {listing.images.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === 0 ? listing.images.length - 1 : prev - 1,
                        )
                      }
                      className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                    >
                      <span className="material-icons-round">chevron_left</span>
                    </button>
                    <button
                      onClick={() =>
                        setActiveImage((prev) =>
                          prev === listing.images.length - 1 ? 0 : prev + 1,
                        )
                      }
                      className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all"
                    >
                      <span className="material-icons-round">
                        chevron_right
                      </span>
                    </button>
                  </>
                )}

                <div className="absolute bottom-6 right-6 px-4 py-2 rounded-full bg-black/50 backdrop-blur-md text-white text-xs font-bold border border-white/10 uppercase tracking-widest">
                  {activeImage + 1} / {listing.images.length || 1}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative w-24 md:w-32 aspect-square rounded-2xl overflow-hidden shrink-0 transition-all duration-300 ring-2 ${
                      activeImage === index
                        ? "ring-sky-500 scale-95"
                        : "ring-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Title & Overview */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 md:p-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400">
                      {listing.category}
                    </span>
                    <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400">
                      For {listing.type}
                    </span>
                    {listing.status && (
                      <span className="px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-widest bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">
                        {listing.status}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight wrap-break-word">
                    {listing.title}
                  </h1>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                      <span className="material-icons-round text-sky-500 text-sm">
                        location_on
                      </span>
                      <span className="font-semibold text-xs sm:text-sm">
                        {listing.location.address}, {listing.country}
                      </span>
                    </div>
                    {listing.neighborhood && (
                      <p className="text-xs text-slate-400 dark:text-slate-500 italic max-w-xl">
                        {listing.neighborhood}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:text-right shrink-0">
                  <p className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
                    Price
                  </p>
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                    {formattedPrice}
                  </p>
                  {listing.pricePerSqft && (
                    <p className="text-[10px] font-bold text-sky-500 uppercase tracking-widest mt-1">
                      {listing.pricePerSqft}$ / SQFT
                    </p>
                  )}
                </div>
              </div>

              {/* Quick Info Grid - ENRICHED */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-5 sm:p-8 bg-slate-50 dark:bg-slate-800/40 rounded-4xl border border-slate-100 dark:border-slate-700/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sky-500">
                    <span className="material-icons-round text-lg sm:text-xl">
                      bed
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-1">
                    {listing.bedrooms || 0}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Bedrooms
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sky-500">
                    <span className="material-icons-round text-lg sm:text-xl">
                      bathtub
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-1">
                      {listing.bathrooms || 0}
                    </span>
                    {(listing.fullBaths || listing.partialBaths) && (
                      <span className="text-[10px] text-slate-400 italic">
                        ({listing.fullBaths || 0}F / {listing.partialBaths || 0}
                        P)
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Bathrooms
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sky-500">
                    <span className="material-icons-round text-lg sm:text-xl">
                      square_foot
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-1">
                    {listing.size || 0}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Square Ft
                  </span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-sky-500">
                    <span className="material-icons-round text-lg sm:text-xl">
                      calendar_today
                    </span>
                  </div>
                  <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-none mt-1">
                    {listing.yearBuilt || "N/A"}
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold text-slate-400 tracking-widest">
                    Year Built
                  </span>
                </div>
              </div>
            </div>

            {/* Description/Neighborhood */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight">
                Property Details
              </h2>
              <div className="prose prose-sm sm:prose-base prose-slate dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {listing.description.split("\n").map((para, i) => (
                  <p key={i} className="mb-4">
                    {para}
                  </p>
                ))}
              </div>

              {listing.neighborhood && (
                <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-tight">
                    The Neighborhood
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {listing.neighborhood}
                  </p>
                </div>
              )}
            </div>

            {/* Interior & Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Interior Features */}
              <div className="bg-white dark:bg-slate-900 rounded-4xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                  <span className="material-icons-round text-sky-500">
                    deck
                  </span>
                  Interior
                </h3>
                <div className="space-y-4">
                  {listing.rooms?.length ? (
                    <div className="flex flex-wrap gap-2">
                      {listing.rooms.map((room, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase rounded-lg text-slate-500"
                        >
                          {room}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="grid gap-3">
                    {listing.kitchen && (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Kitchen:
                        </b>{" "}
                        {listing.kitchen}
                      </p>
                    )}
                    {listing.flooring?.length ? (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Flooring:
                        </b>{" "}
                        {listing.flooring.join(", ")}
                      </p>
                    ) : null}
                    {listing.cooling?.length ? (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Cooling:
                        </b>{" "}
                        {listing.cooling.join(", ")}
                      </p>
                    ) : null}
                    {listing.heating?.length ? (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Heating:
                        </b>{" "}
                        {listing.heating.join(", ")}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Building & Construction */}
              <div className="bg-white dark:bg-slate-900 rounded-4xl p-8 border border-slate-100 dark:border-slate-800 shadow-lg">
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tight flex items-center gap-2">
                  <span className="material-icons-round text-sky-500">
                    architecture
                  </span>
                  Building
                </h3>
                <div className="space-y-4">
                  <div className="grid gap-3">
                    {listing.builder && (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Builder:
                        </b>{" "}
                        {listing.builder}
                      </p>
                    )}
                    {listing.constructionMaterials?.length ? (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Materials:
                        </b>{" "}
                        {listing.constructionMaterials.join(", ")}
                      </p>
                    ) : null}
                    {listing.roofType && (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Roof:
                        </b>{" "}
                        {listing.roofType}
                      </p>
                    )}
                    {listing.garageParking && (
                      <p className="text-xs text-slate-500">
                        <b className="text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                          Parking:
                        </b>{" "}
                        {listing.garageParking}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Special Features & Amenities */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">
                Luxury Amenities & Features
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
                {/* Regular Amenities */}
                {(listing.amenities || []).map((amenity, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center group-hover:bg-sky-50 dark:group-hover:bg-sky-900/20 transition-colors">
                      <span className="material-icons-round text-sky-500 text-base sm:text-lg">
                        check_circle
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide truncate">
                      {amenity}
                    </span>
                  </div>
                ))}

                {/* Special Features */}
                {(listing.specialFeatures || []).map((feature, i) => (
                  <div
                    key={`special-${i}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20 flex items-center justify-center">
                      <span className="material-icons-round text-sky-600 dark:text-sky-400 text-base sm:text-lg">
                        stars
                      </span>
                    </div>
                    <span className="text-[11px] sm:text-sm font-black text-sky-600 dark:text-sky-400 uppercase tracking-wide truncate">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Community & Nearby */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 md:p-12 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-tight">
                Community & Neighborhood
              </h2>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Schools & Health
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {listing.nearbySchoolsHospitals ||
                        "Information not available"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                      Shopping & Transport
                    </h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {listing.shoppingTransport || "Information not available"}
                    </p>
                  </div>
                </div>

                {listing.communityFacilities?.length ? (
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                      Community Facilities
                    </h4>
                    <div className="flex flex-wrap gap-3">
                      {listing.communityFacilities.map((facility, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
                        >
                          <span className="material-icons-round text-sky-500 text-xs">
                            nature_people
                          </span>
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            {facility}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {listing.futureAmenities && (
                  <div className="p-6 bg-amber-50/50 dark:bg-amber-900/10 rounded-3xl border border-amber-100/50 dark:border-amber-900/20">
                    <h4 className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="material-icons-round text-sm">
                        upcoming
                      </span>
                      Future Plans
                    </h4>
                    <p className="text-sm text-amber-800/70 dark:text-amber-400/70 font-medium italic">
                      {listing.futureAmenities}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Sidebar */}
          <div className="lg:col-span-1">
            <div className="space-y-8 lg:sticky lg:top-28">
              {/* Agent Contact Card */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-2xl shadow-slate-200/50 dark:shadow-none">
                {(() => {
                  const agent = (listing.assignedAgent as any) || (listing.listedBy as any);
                  const isAgent = (listing.assignedAgent as any)?.role === 'agent';
                  
                  return (
                    <>
                      <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-slate-50 dark:border-slate-800 overflow-hidden mb-4 shadow-lg bg-sky-50 dark:bg-slate-800 flex items-center justify-center">
                          {agent?.image ? (
                            <img 
                              src={agent.image}
                              alt={agent.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="material-icons-round text-5xl text-sky-500">person</span>
                          )}
                        </div>
                        <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none mb-1 text-center">
                          {agent?.name || listing.agentName || "Property Owner"}
                        </h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {isAgent ? "Exclusive Representative" : "Property Owner"}
                        </p>
                        {agent?.licenseNumber && <p className="text-[8px] font-bold text-slate-300 mt-1 uppercase tracking-widest">DRE: {agent.licenseNumber}</p>}
                      </div>

                      <div className="space-y-4 mb-8">
                        <a href={`tel:${agent?.phone || listing.phone}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all group">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform shadow-sm">
                              <span className="material-icons-round text-base sm:text-lg">call</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Phone Number</span>
                              <span className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white tracking-widest truncate">{agent?.phone || listing.phone || "Not available"}</span>
                          </div>
                        </a>
                        <a href={`mailto:${agent?.email || listing.email}`} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all group">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-sky-500 group-hover:scale-110 transition-transform shadow-sm">
                              <span className="material-icons-round text-base sm:text-lg">mail</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Email Address</span>
                              <span className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white truncate">{agent?.email || listing.email || "Not available"}</span>
                          </div>
                        </a>
                        {agent?.companyName && (
                          <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800">
                            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-sky-500 shadow-sm">
                                <span className="material-icons-round text-base sm:text-lg">business</span>
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Company</span>
                                <span className="text-[11px] sm:text-sm font-black text-slate-900 dark:text-white truncate">{agent.companyName}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={async () => {
                          if (!session) {
                            toast.error("Please login to message the contact");
                            router.push("/auth/signin");
                            return;
                          }

                          // If the logged in user is the contact themselves, redirect to dashboard
                          if (session.user.id === agent?._id?.toString()) {
                            toast.error("You cannot message yourself");
                            return;
                          }

                          setSendingMsg(true);
                          try {
                            const res = await fetch("/api/messages/start", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ recipientId: agent?._id }),
                            });
                            const data = await res.json();
                            if (data.conversationId) {
                              router.push(`/dashboard/messages?chat=${data.conversationId}`);
                            } else {
                              toast.error(data.error || "Failed to start conversation");
                            }
                          } catch (error) {
                            toast.error("Something went wrong");
                          } finally {
                            setSendingMsg(false);
                          }
                        }}
                        disabled={sendingMsg}
                        className="w-full py-4 sm:py-5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black uppercase tracking-widest text-xs sm:text-sm hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <span className="material-icons-round text-base">send</span>
                        {sendingMsg ? "Starting Chat..." : `Message ${isAgent ? "Agent" : "Owner"}`}
                      </button>
                    </>
                  );
                })()}
              </div>

              {/* Location Map Placeholder */}
              <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight mb-4">
                  Location
                </h4>
                <div className="aspect-square bg-linear-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl relative overflow-hidden group">
                  {listing.location?.lat && listing.location?.lng ? (
                    <PropertyMap lat={listing.location.lat} lng={listing.location.lng} />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs">
                      Coordinates not available
                    </div>
                  )}
                </div>
                <p className="mt-4 text-[10px] font-black text-slate-400 leading-relaxed uppercase tracking-[0.15em] text-center">
                  Exact location revealed upon contact
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
