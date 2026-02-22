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
  type,
}: PropertyProps) => {
  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-4xl overflow-hidden shadow-premium hover:shadow-2xl transition-all duration-500 border border-slate-100 dark:border-slate-800/50">
      {/* Image Container */}
      <div className="relative h-72 overflow-hidden">
        <div className="absolute top-5 left-5 z-10 flex gap-2">
          <span
            className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 text-white shadow-lg ${type === "For Sale" ? "bg-emerald-500/80" : "bg-accent/80"}`}
          >
            {type}
          </span>
          <span className="px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/20 text-white shadow-lg bg-slate-900/40">
            Verified
          </span>
        </div>

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
        />

        <button className="absolute bottom-5 right-5 z-10 w-10 h-10 bg-white/90 dark:bg-slate-950/90 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 transition-all shadow-lg hover:scale-110 backdrop-blur-sm">
          <span className="material-icons-round text-xl">favorite_border</span>
        </button>

        <div className="absolute inset-0 bg-linear-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </div>

      {/* Content */}
      <div className="p-8 flex flex-col grow">
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors truncate max-w-[200px]">
              {title}
            </h3>
            <p className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-medium">
              <span className="material-icons-round text-sm text-accent">
                place
              </span>
              {location}
            </p>
          </div>
          <div className="text-right">
            <span className="block text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {price}
            </span>
            {type === "For Rent" && (
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                per month
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-6 my-2 border-y border-slate-100 dark:border-slate-800/50">
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl font-light">
              bed
            </span>
            <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">
              {beds} Beds
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 border-x border-slate-100 dark:border-slate-800/50">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl font-light">
              bathtub
            </span>
            <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">
              {baths} Baths
            </span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="material-symbols-outlined text-slate-400 dark:text-slate-500 text-xl font-light">
              straighten
            </span>
            <span className="text-[10px] font-bold text-slate-900 dark:text-slate-200">
              {sqft} sqft
            </span>
          </div>
        </div>

        <button className="mt-auto w-full py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm hover:bg-accent hover:text-white dark:hover:bg-accent transition-all transform hover:-translate-y-0.5 active:translate-y-0">
          Explore Details
        </button>
      </div>
    </div>
  );
};

export default PropertyCard;
