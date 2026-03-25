"use client";

import Image from "next/image";
import React from "react";
import { useSavedListings } from "@/hooks/useSavedListings";

interface PropertyCardProps {
  id: string;
  price: string;
  type: string;
  title: string;
  location: string;
  beds: number;
  baths: number;
  sqft: string;
  imageUrl: string;
  badge?: string;
  badgeBg?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({
  id,
  price,
  type,
  title,
  location,
  beds,
  baths,
  sqft,
  imageUrl,
  badge,
  badgeBg = "bg-primary",
}) => {
  const { toggleSave, isSaved } = useSavedListings();
  const saved = isSaved(id);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-soft dark:shadow-premium border border-neutral-subtle dark:border-slate-800 overflow-hidden group hover:shadow-lg transition-all duration-300">
      <div className="relative h-48 w-full">
        <Image
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageUrl}
        />
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSave(id);
          }}
          className={`absolute top-3 right-3 backdrop-blur-sm p-1.5 rounded-lg cursor-pointer transition-colors ${
            saved 
              ? "bg-red-500 text-white" 
              : "bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 text-primary dark:text-blue-400"
          }`}
        >
          <span className="material-icons-outlined text-lg">
            {saved ? "favorite" : "favorite_border"}
          </span>
        </button>
        {badge && (
          <div
            className={`absolute bottom-3 left-3 ${badgeBg} text-white text-xs font-bold px-2 py-1 rounded`}
          >
            {badge}
          </div>
        )}
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-primary dark:text-blue-400">{price}</h3>
          <span className="text-xs font-medium text-text-muted dark:text-slate-400 bg-neutral-subtle dark:bg-slate-800 px-2 py-1 rounded-md transition-colors">
            {type}
          </span>
        </div>
        <h4 className="font-medium text-text-main dark:text-white mb-1">{title}</h4>
        <div className="flex items-center text-text-muted dark:text-slate-400 text-sm mb-4">
          <span className="material-icons-outlined text-sm mr-1">
            location_on
          </span>
          {location}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-subtle dark:border-slate-800 pt-4 transition-colors">
          <div className="flex gap-4 text-sm text-text-muted dark:text-slate-400">
            <span className="flex items-center gap-1">
              <span className="material-icons-outlined text-sm">bed</span>
              {beds}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons-outlined text-sm">bathtub</span>
              {baths}
            </span>
            <span className="flex items-center gap-1">
              <span className="material-icons-outlined text-sm">
                square_foot
              </span>
              {sqft}
            </span>
          </div>
          <button className="text-primary dark:text-blue-400 hover:text-primary/80 dark:hover:text-blue-300 font-medium text-sm transition-colors">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
