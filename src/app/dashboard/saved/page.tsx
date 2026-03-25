"use client";

import { useSavedListings } from "@/hooks/useSavedListings";
import ListingCard from "@/components/listings/ListingCard";

export default function SavedListingsPage() {
    const { savedListings, isLoading } = useSavedListings();

    if (isLoading) {
        return (
            <div className="p-6 lg:p-10 max-w-6xl mx-auto flex items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-10 max-w-6xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Saved Listings</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    Properties you've saved for quick access later.
                </p>
            </div>

            {savedListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedListings.map((listing) => (
                        <ListingCard key={listing._id} listing={listing} />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center gap-6 py-32 text-center bg-slate-50/50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                    <div className="w-24 h-24 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center shadow-xl">
                        <span className="material-icons-round text-5xl text-red-500">favorite_border</span>
                    </div>
                    <div className="space-y-2">
                        <p className="text-xl font-bold text-slate-900 dark:text-white">No Saved Listings Yet</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                            Browse properties and click the heart icon to save listings for later.
                        </p>
                    </div>
                    <a
                        href="/properties"
                        className="mt-2 inline-flex items-center gap-2 bg-primary text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/25"
                    >
                        Browse Properties
                        <span className="material-icons-round text-lg">explore</span>
                    </a>
                </div>
            )}
        </div>
    );
}
