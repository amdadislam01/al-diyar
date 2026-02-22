import Image from "next/image";
import React from "react";

interface PropertyCardProps {
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
  return (
    <div className="bg-white rounded-xl shadow-soft border border-neutral-subtle overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          alt={title}
          width={500}
          height={500}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          src={imageUrl}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg cursor-pointer hover:bg-white text-primary">
          <span className="material-icons-outlined text-lg">
            favorite_border
          </span>
        </div>
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
          <h3 className="font-bold text-lg text-primary">{price}</h3>
          <span className="text-xs font-medium text-text-muted bg-neutral-subtle px-2 py-1 rounded-md">
            {type}
          </span>
        </div>
        <h4 className="font-medium text-text-main mb-1">{title}</h4>
        <div className="flex items-center text-text-muted text-sm mb-4">
          <span className="material-icons-outlined text-sm mr-1">
            location_on
          </span>
          {location}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-subtle pt-4">
          <div className="flex gap-4 text-sm text-text-muted">
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
          <button className="text-primary hover:text-primary/80 font-medium text-sm">
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
