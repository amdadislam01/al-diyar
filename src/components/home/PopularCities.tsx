"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PopularLocation {
  name: string;
  country: string;
  image: string;
  count: number;
}

const PopularCities = () => {
  const [locations, setLocations] = useState<PopularLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/listings/popular-locations");
        const data = await res.json();
        if (res.ok) {
          setLocations(data.locations);
        }
      } catch (error) {
        console.error("Error fetching popular locations:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  // Fallback data if no listings are found
  const fallbackCities = [
    {
      name: "Toronto",
      country: "Canada",
      image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop",
      count: 125,
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      image: "https://images.unsplash.com/photo-1512470876302-972fad2aa9dd?q=80&w=2070&auto=format&fit=crop",
      count: 150,
    },
    {
        name: "Marrakech",
        country: "Morocco",
        image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=2067&auto=format&fit=crop",
        count: 85,
    },
    {
        name: "Dubai",
        country: "UAE",
        image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=2070&auto=format&fit=crop",
        count: 210,
    }
  ];

  const displayLocations = locations.length > 0 ? locations : (loading ? [] : fallbackCities);

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"> 
              <span className="text-black dark:text-white">Popular </span>
              <span className="text-sky-500">Destinations</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Find your dream home in the world's most desired locations. Our
              curated collection features exclusive properties in every corner
              of the globe.
            </p>
          </div>
          <Link href="/property" className="text-[10px] font-black text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-8 py-4 rounded-2xl uppercase tracking-[0.2em] hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all duration-300">
            View All Cities
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {loading ? (
            // Skeleton Loaders
            [...Array(4)].map((_, i) => (
              <div key={i} className="h-[450px] rounded-[3rem] bg-slate-100 dark:bg-slate-800 animate-pulse border border-slate-200 dark:border-slate-700" />
            ))
          ) : (
            displayLocations.map((location) => (
              <Link
                key={location.name}
                href={`/property?country=${location.country}`}
                className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-700 block border border-slate-100 dark:border-slate-800"
              >
                <img
                  src={location.image || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"}
                  alt={location.name}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-10 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-10 h-px bg-white/40" />
                    <span className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">
                      {location.country}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">
                    {location.name}
                  </h3>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 mt-4">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full">
                      {location.count} Listings
                    </p>
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-900 group-hover:translate-x-1 transition-transform">
                      <span className="material-icons-round text-lg">arrow_forward</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
