"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Next.js
const icon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

interface LocationPickerMapProps {
    lat: number;
    lng: number;
    onChange: (lat: number, lng: number) => void;
    onAddressChange?: (address: string) => void;
}

const LocationMarker = ({ lat, lng, onChange, onAddressChange }: LocationPickerMapProps) => {
    const map = useMap();

    useMapEvents({
        async click(e) {
            onChange(e.latlng.lat, e.latlng.lng);
            // Reverse Geocoding
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${e.latlng.lat}&lon=${e.latlng.lng}`);
                const data = await response.json();
                if (data.display_name && onAddressChange) {
                    onAddressChange(data.display_name);
                }
            } catch (error) {
                console.error("Reverse geocoding error:", error);
            }
        },
    });

    useEffect(() => {
        if (lat !== 0 && lng !== 0) {
            map.setView([lat, lng], map.getZoom());
        }
    }, [lat, lng, map]);

    return lat !== 0 && lng !== 0 ? <Marker position={[lat, lng]} icon={icon} /> : null;
};

// Component to handle map movement from search
const MapController = ({ center }: { center: [number, number] | null }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.flyTo(center, 16);
        }
    }, [center, map]);
    return null;
};

export default function LocationPickerMap({ lat, lng, onChange, onAddressChange }: LocationPickerMapProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const debounceTimer = useRef<NodeJS.Timeout | null>(null);

    // Default coordinates: Dhaka, Bangladesh
    const defaultCenter: [number, number] = [23.8103, 90.4125];

    useEffect(() => {
        setIsMounted(true);
        // Close search results when clicking outside
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Debounced hints
    useEffect(() => {
        if (searchQuery.trim().length < 3) {
            // Only clear results if it's visually appropriate (not after selection)
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
                const data = await response.json();
                setSearchResults(data);
            } catch (error) {
                console.error("Geocoding hints error:", error);
            }
        }, 500);

        return () => {
            if (debounceTimer.current) clearTimeout(debounceTimer.current);
        };
    }, [searchQuery]);

    const handleSearch = async (e: any) => {
        if (e.preventDefault) e.preventDefault();
        if (e.stopPropagation) e.stopPropagation();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5`);
            const data = await response.json();
            setSearchResults(data);
            if (data.length > 0) {
                selectLocation(data[0]);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        } finally {
            setIsSearching(false);
        }
    };

    const selectLocation = (result: any, e?: any) => {
        if (e?.preventDefault) e.preventDefault();
        if (e?.stopPropagation) e.stopPropagation();
        const newLat = parseFloat(result.lat);
        const newLng = parseFloat(result.lon);
        onChange(newLat, newLng);
        setMapCenter([newLat, newLng]);
        setSearchResults([]);
        setSearchQuery(result.display_name);
        if (onAddressChange) {
            onAddressChange(result.display_name);
        }
    };

    if (!isMounted) {
        return <div className="w-full h-[450px] bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse flex items-center justify-center border border-slate-200 dark:border-slate-700 text-slate-500">Initializing Map...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative" ref={searchRef}>
                <div className="relative flex gap-2">
                    <div className="relative flex-1">
                        <span className="material-icons-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleSearch(e);
                                }
                            }}
                            placeholder="Type an address to see hints..."
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition shadow-sm"
                        />
                    </div>
                    <button type="button" onClick={(e) => handleSearch(e)} disabled={isSearching} className="px-5 py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-sm font-semibold transition shadow-md flex items-center gap-2 disabled:opacity-50">
                        {isSearching ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <span className="material-icons-outlined text-base">explore</span>}
                        Search
                    </button>
                </div>

                {/* Search Results Dropdown (Hints) */}
                {searchResults.length > 0 && (
                    <div className="absolute z-[1001] w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl overflow-hidden max-h-60 overflow-y-auto">
                        {searchResults.map((result, idx) => (
                            <button key={idx} type="button" onClick={(e) => selectLocation(result, e)} className="w-full text-left px-4 py-3 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800 last:border-none transition flex items-start gap-3">
                                <span className="material-icons-outlined text-slate-400 mt-0.5">location_on</span>
                                <span>{result.display_name}</span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Map Container */}
            <div className="w-full h-[400px] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative z-0 transition-all duration-300">
                <MapContainer center={lat !== 0 && lng !== 0 ? [lat, lng] : defaultCenter} zoom={13} scrollWheelZoom={true} style={{ height: "100%", width: "100%" }}>
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <LocationMarker
                        lat={lat}
                        lng={lng}
                        onChange={onChange}
                        onAddressChange={(addr) => {
                            setSearchQuery(addr);
                            if (onAddressChange) onAddressChange(addr);
                        }}
                    />
                    <MapController center={mapCenter} />
                </MapContainer>
            </div>
        </div>
    );
}
