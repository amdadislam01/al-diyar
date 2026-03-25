"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

export function useSavedListings() {
    const { data: session, status } = useSession();
    const [savedIds, setSavedIds] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [savedListings, setSavedListings] = useState<any[]>([]);

    const fetchSavedListings = useCallback(async () => {
        if (status !== "authenticated") return;

        try {
            const res = await fetch("/api/user/saved");
            const data = await res.json();
            if (res.ok) {
                const ids = data.savedListings.map((listing: any) => listing._id);
                setSavedIds(ids);
                setSavedListings(data.savedListings);
            }
        } catch (error) {
            console.error("Error fetching saved listings:", error);
        } finally {
            setIsLoading(false);
        }
    }, [status]);

    useEffect(() => {
        fetchSavedListings();
    }, [fetchSavedListings]);

    const toggleSave = async (listingId: string) => {
        if (status !== "authenticated") {
            toast.error("Please login to save properties");
            return;
        }

        try {
            const res = await fetch("/api/user/saved", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ listingId }),
            });

            const data = await res.json();

            if (res.ok) {
                if (data.isSaved) {
                    setSavedIds((prev) => [...prev, listingId]);
                    toast.success("Added to saved listings");
                } else {
                    setSavedIds((prev) => prev.filter((id) => id !== listingId));
                    setSavedListings((prev) => prev.filter((listing) => listing._id !== listingId));
                    toast.success("Removed from saved listings");
                }
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            console.error("Error toggling save:", error);
            toast.error("Failed to update saved listings");
        }
    };

    const isSaved = (listingId: string) => {
        return savedIds.includes(listingId);
    };

    return {
        savedIds,
        savedListings,
        isLoading,
        toggleSave,
        isSaved,
        refresh: fetchSavedListings,
    };
}
