"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PropertyCard from "../PropertyCard";
import { IListing } from "@/models/Listing";

const FeaturedProperties = () => {
  const [properties, setProperties] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProperties = async () => {
      try {
        const response = await fetch("/api/listings?limit=6");
        const data = await response.json();
        setProperties(data.listings || []);
      } catch (error) {
        console.error("Error fetching popular listings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopularProperties();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Popular <span className="text-gradient">Listings</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Discover our handpicked selection of properties that define modern
              luxury living. From urban penthouses to serene coastal villas.
            </p>
          </div>
          <Link href="/property" className="text-xs font-black text-slate-900 dark:text-white border-2 border-primary dark:border-primary px-8 py-3 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 cursor-pointer">
            Explore All Listings
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[4/5] bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] animate-pulse" />
            ))
          ) : properties.length > 0 ? (
            properties.map((property) => (
              <PropertyCard 
                key={property._id?.toString()} 
                id={property._id?.toString() || ""}
                title={property.title}
                price={new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(property.price) + (property.type === "Rent" ? "/mo" : "")}
                location={property.location.address || "Dhaka, Bangladesh"}
                beds={property.bedrooms || 0}
                baths={property.bathrooms || 0}
                sqft={(property.size || 0).toString()}
                image={property.images[0] || "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop"}
                type={property.type === "Sale" ? "For Sale" : "For Rent"}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10 text-slate-400">
               No active properties to show at the moment.
            </div>
          )}
        </div>

        {/* See More Button */}
        {!loading && properties.length >= 6 && (
          <div className="mt-16 flex justify-center">
            <Link 
              href="/property" 
              className="group relative flex items-center gap-3 px-10 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
            >
              <span>See More Properties</span>
              <svg 
                className="w-5 h-5 group-hover:translate-x-1 transition-transform" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}

        {/* Pagination Dots */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
          <div className="w-12 h-2 rounded-full bg-slate-900 dark:bg-white transition-all duration-300 shadow-glow"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
