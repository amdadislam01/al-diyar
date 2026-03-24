"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const categories = ["All", "Residential", "Commercial", "Land", "Industrial"];
const types = ["All", "Sale", "Rent"];
const roomOptions = ["any", "1", "2", "3", "4", "5+"];

const FilterBar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [type, setType] = useState(searchParams.get("type") || "All");
  const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "any");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category !== "All") params.set("category", category);
    if (type !== "All") params.set("type", type);
    if (bedrooms !== "any") params.set("bedrooms", bedrooms);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    router.push(`/listing?${params.toString()}`);
  };

  // Debounced search for text input
  useEffect(() => {
    const timer = setTimeout(() => {
      // Don't auto-redirect on first load to avoid loop
      if (q !== (searchParams.get("q") || "")) {
        handleSearch();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [q]);

  return (
    <div className="w-full bg-white dark:bg-slate-900/80 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-3xl p-4 md:p-6 shadow-xl shadow-slate-200/50 dark:shadow-none mb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Search Input */}
        <div className="relative group">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Search Keywords</label>
          <div className="relative flex items-center">
            <span className="material-icons-round absolute left-4 text-slate-400 group-focus-within:text-sky-500 transition-colors">search</span>
            <input
              type="text"
              placeholder="Address, school, agent..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none ring-2 ring-transparent focus:ring-sky-500/20 transition-all"
            />
          </div>
        </div>

        {/* Category Select */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Property Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              const params = new URLSearchParams(window.location.search);
              if (e.target.value === "All") params.delete("category");
              else params.set("category", e.target.value);
              router.push(`/listing?${params.toString()}`);
            }}
            className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-semibold text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-sky-500/20 transition-all appearance-none cursor-pointer"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="material-icons-round absolute right-4 bottom-3.5 text-slate-400 pointer-events-none">expand_more</span>
        </div>

        {/* Type Select */}
        <div className="relative">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Listing Type</label>
          <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-2xl">
            {types.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setType(t);
                  const params = new URLSearchParams(window.location.search);
                  if (t === "All") params.delete("type");
                  else params.set("type", t);
                  router.push(`/listing?${params.toString()}`);
                }}
                className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
                  type === t
                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Price & Bedrooms Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => {
                setBedrooms(e.target.value);
                const params = new URLSearchParams(window.location.search);
                if (e.target.value === "any") params.delete("bedrooms");
                else params.set("bedrooms", e.target.value);
                router.push(`/listing?${params.toString()}`);
              }}
              className="w-full px-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-sm font-semibold text-slate-900 dark:text-white outline-none ring-2 ring-transparent focus:ring-sky-500/20 transition-all appearance-none cursor-pointer"
            >
              {roomOptions.map((opt) => (
                <option key={opt} value={opt}>{opt === "any" ? "Any BR" : `${opt} BR`}</option>
              ))}
            </select>
            <span className="material-icons-round absolute right-3 bottom-3.5 text-slate-400 pointer-events-none">bed</span>
          </div>

          <div className="relative">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block px-1">Price Range</label>
            <div className="flex items-center gap-2">
               <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                onBlur={handleSearch}
                className="w-full px-3 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none ring-2 ring-transparent focus:ring-sky-500/20 transition-all"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                onBlur={handleSearch}
                className="w-full px-3 py-3.5 bg-slate-50 dark:bg-slate-800/50 border-none rounded-2xl text-xs font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 outline-none ring-2 ring-transparent focus:ring-sky-500/20 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
