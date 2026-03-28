"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { IListing } from "@/models/Listing";

const FeaturedListing = () => {
  const [listing, setListing] = useState<IListing | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/listings?limit=1");
        const data = await response.json();
        if (data.listings && data.listings.length > 0) {
          setListing(data.listings[0]);
        }
      } catch (error) {
        console.error("Error fetching featured listing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-32 bg-white dark:bg-slate-950">
        <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="w-full aspect-21/9 bg-slate-100 dark:bg-slate-800 rounded-[3rem] animate-pulse" />
        </div>
      </section>
    );
  }

  if (!listing) return null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <section className="py-32 bg-white dark:bg-slate-950 transition-colors overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/4"></div>

      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-bold uppercase tracking-widest mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Spotlight Property
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4">
            Exceptional <span className="text-gradient">Living.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl font-medium">
            Handpicked by our AI experts, this property represents the pinnacle
            of Al-Diyar's exclusive inventory.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-3/5 relative group">
            {/* Decorative frames */}
            <div className="absolute -inset-4 border border-slate-100 dark:border-slate-800 rounded-[3.5rem] -z-10 transition-transform duration-500 group-hover:scale-105"></div>

            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white dark:border-slate-900 relative">
              <img
                src={listing.images[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"}
                alt={listing.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
            </div>

            {/* Glassmorphic Info Card */}
            <div className="absolute -bottom-8 -right-8 md:-right-12 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-white/10 p-8 rounded-[2.5rem] shadow-premium max-w-sm animate-reveal">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
                  <span className="material-icons-round">verified</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                    Prop-ID: AD-{listing._id?.toString().slice(-4).toUpperCase()}
                  </div>
                  <div className="text-xl font-black text-slate-900 dark:text-white line-clamp-1">
                    {listing.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm font-medium mb-6">
                <span className="material-icons-round text-sm text-accent">
                  location_on
                </span>
                {listing.location.address}
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-800">
                <div className="text-2xl font-black text-primary dark:text-primary-light">
                  {formattedPrice}
                </div>
                <button className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-icons-round">favorite_border</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:w-2/5 mt-12 lg:mt-0">
            <div className="space-y-10">
              <div className="relative">
                <span className="text-8xl font-black text-slate-100 dark:text-slate-900 absolute -top-10 -left-6 -z-10 italic">
                  "
                </span>
                <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white leading-[1.3]">
                  Extraordinary{" "}
                  <span className="text-accent">
                    performance!
                  </span>{" "}
                  Quick solutions. Highly recommended.
                </div>
              </div>

              <div className="flex items-center gap-5">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white dark:border-slate-800 shadow-lg">
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(listing.agentName || "Agent")}&background=0ea5e9&color=fff`}
                      alt="User"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white text-lg">
                    {listing.agentName || "Exclusive Agent"}
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">
                    Property Representative
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 py-10 border-y border-slate-100 dark:border-slate-900">
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                    {listing.size}+
                  </div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Sqft Total
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                    {listing.bedrooms}
                  </div>
                  <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest">
                    Luxury Bedrooms
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/property/${listing._id}`} className="flex-1 bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group">
                  Book a Private Tour
                  <span className="material-icons-round text-sm group-hover:translate-x-1 transition-transform">
                    calendar_month
                  </span>
                </Link>
                <Link href={`/property/${listing._id}`} className="flex-1 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-100 dark:border-slate-800 px-8 py-4 rounded-2xl font-bold text-sm tracking-wide hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-center">
                  View full details
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListing;
