"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ListingCard from "@/components/listings/ListingCard";
import FilterBar from "@/components/listings/FilterBar";
import { IListing } from "@/models/Listing";

function ListingResults() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<IListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/listings?${searchParams.toString()}`);
        const data = await response.json();
        setListings(data.listings || []);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchParams]);

  return (
    <div className="w-full">
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="aspect-[4/3.5] bg-slate-100 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      ) : listings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing._id?.toString()} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
            <span className="material-icons-round text-4xl text-slate-400">search_off</span>
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No properties found</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-md">
            We couldn't find any listings matching your search criteria. Try adjusting your filters or search keywords.
          </p>
        </div>
      )}
    </div>
  );
}

export default function ListingPage() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-32 pb-20 transition-colors duration-500">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
              style={{ fontFamily: "'PPRightGrotesk', 'Plus Jakarta Sans', sans-serif" }}>
            Explore Properties
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
            Discover the most exclusive listings tailored to your preferences. From luxury villas to modern apartments, find your perfect match.
          </p>
        </div>

        {/* Filter Section */}
        <Suspense fallback={<div className="h-40 bg-white dark:bg-slate-900 rounded-3xl animate-pulse mb-12" />}>
          <FilterBar />
        </Suspense>

        {/* Results Section */}
        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse" />}>
          <ListingResults />
        </Suspense>
      </div>

      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Inter:wght@400;600;700;800&display=swap");
      `}</style>
    </main>
  );
}
