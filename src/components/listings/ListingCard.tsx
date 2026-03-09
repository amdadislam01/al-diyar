"use client";

import Link from "next/link";
import Image from "next/image";
import { IListing } from "@/models/Listing";

interface ListingCardProps {
  listing: IListing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(listing.price);

  return (
    <Link
      href={`/property/${listing._id}`}
      className="group bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-sky-950/30 transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-4/3 overflow-hidden">
        <Image
          src={listing.images[0] || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=2070&auto=format&fit=crop"}
          alt={listing.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Status Badge */}
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm shadow-lg text-slate-900 dark:text-white border border-white/20">
            {listing.type === "Sale" ? "For Sale" : "For Rent"}
          </span>
        </div>

        {/* Favorite Icon (Placeholder) */}
        <button className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all duration-300">
          <span className="material-icons-round text-lg">favorite_border</span>
        </button>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1 leading-tight group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors duration-300">
            {listing.title}
          </h3>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 mb-4">
          <span className="material-icons-round text-sm">location_on</span>
          <span className="text-xs font-medium truncate">{listing.location.address || "Location not specified"}</span>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 border-t border-b border-slate-50 dark:border-slate-800/50 py-4 mb-4">
          <div className="flex flex-col items-center border-r border-slate-50 dark:border-slate-800/50">
            <span className="text-sm font-black text-slate-900 dark:text-white">{listing.bedrooms || 0}</span>
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-tighter">Beds</span>
          </div>
          <div className="flex flex-col items-center border-r border-slate-50 dark:border-slate-800/50">
            <span className="text-sm font-black text-slate-900 dark:text-white">{listing.bathrooms || 0}</span>
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-tighter">Baths</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-black text-slate-900 dark:text-white">{listing.size || 0}</span>
            <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-tighter">Sqft</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Price</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{formattedPrice}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-900 dark:text-white group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all duration-300">
            <span className="material-icons-round text-lg">arrow_outward</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ListingCard;
