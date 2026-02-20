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
  title,
  price,
  location,
  beds,
  baths,
  sqft,
  image,
}: PropertyProps) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-card hover:shadow-xl transition-all duration-500 border border-slate-100 dark:border-slate-800">
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <button className="absolute top-4 right-4 w-9 h-9 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-red-500 transition-all shadow-sm">
          <span className="material-icons-round text-lg">favorite_border</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="mb-4">
          <span className="text-xl font-bold text-primary dark:text-primary-light">
            {price}
          </span>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-1 line-clamp-1">
            {title}
          </h3>
          <p className="flex items-center gap-1 text-slate-400 dark:text-slate-500 text-xs mt-1">
            <span className="material-icons-round text-sm">place</span>
            {location}
          </p>
        </div>

        <div className="flex items-center gap-6 pt-4 border-t border-slate-50 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-slate-300 dark:text-slate-600 text-lg">
              bed
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {beds} Beds
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-slate-300 dark:text-slate-600 text-lg">
              bathtub
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {baths} Baths
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="material-icons-round text-slate-300 dark:text-slate-600 text-lg">
              square_foot
            </span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {sqft} sqft
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
