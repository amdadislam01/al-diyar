"use client";

import Link from "next/link";
import { useSavedListings } from "@/hooks/useSavedListings";

interface PropertyProps {
  id: string;
  title: string;
  price: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  type: "For Sale" | "For Rent";
}

const PropertyCard = ({
  id,
  title,
  price,
  location,
  beds,
  baths,
  sqft,
  image,
  type,
}: PropertyProps) => {
  const { toggleSave, isSaved } = useSavedListings();
  const saved = isSaved(id);

  return (
    <Link 
      href={`/property/${id}`}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-700 border border-slate-100 dark:border-white/5"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
        />

        {/* Status Badge */}
        <div className="absolute top-5 left-5">
          <span className="px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-white text-[10px] font-black uppercase tracking-widest">
            {type}
          </span>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(id);
          }}
          className={`absolute top-5 right-5 w-10 h-10 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center transition-all shadow-xl group/fav ${
            saved 
              ? "bg-red-500 text-white border-red-500" 
              : "bg-white/20 text-white hover:text-accent hover:bg-white"
          }`}
        >
          <span className="material-icons-round text-xl group-hover/fav:scale-110 transition-transform">
            {saved ? "favorite" : "favorite_border"}
          </span>
        </button>

        {/* Price Glass Tag */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="inline-flex px-5 py-2 rounded-2xl bg-slate-950/40 backdrop-blur-xl border border-white/10 text-white shadow-2xl">
            <span className="text-lg font-black tracking-tight">{price}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        <div className="mb-6">
          <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 line-clamp-1 group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
            {title}
          </h3>
          <p className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
            <span className="material-icons-round text-sm text-primary">
              place
            </span>
            {location}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-50 dark:border-white/5">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-icons-round text-primary text-base">
                bed
              </span>
              <span className="text-xs font-black">{beds}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Beds
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-icons-round text-primary text-base">
                bathtub
              </span>
              <span className="text-xs font-black">{baths}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Baths
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <span className="material-icons-round text-primary text-base">
                square_foot
              </span>
              <span className="text-xs font-black">{sqft}</span>
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
              Sqft
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
