import PropertyCard from "../PropertyCard";

const properties = [
  {
    id: "1",
    title: "The Grand Villa",
    price: "$1.2M",
    location: "Palm Jumeirah, Dubai",
    beds: 5,
    baths: 4,
    sqft: "4,500",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop",
    type: "For Sale" as const,
  },
  {
    id: "2",
    title: "Skyline Apartment",
    price: "$2,400/mo",
    location: "Downtown, Dubai",
    beds: 2,
    baths: 2,
    sqft: "1,200",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop",
    type: "For Rent" as const,
  },
  {
    id: "3",
    title: "Seaside Penthouse",
    price: "$850k",
    location: "Marina, Dubai",
    beds: 3,
    baths: 3,
    sqft: "2,100",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop",
    type: "For Sale" as const,
  },
];

const FeaturedProperties = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
              Popular <span className="text-gradient">Listings</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Discover our handpicked selection of properties that define modern
              luxury living. From urban penthouses to serene coastal villas.
            </p>
          </div>
          <button className="text-xs font-black text-slate-900 dark:text-white border-2 border-primary dark:border-primary px-8 py-3 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 cursor-pointer">
            Explore All Listings
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Pagination Dots - matching image */}
        <div className="mt-16 flex items-center justify-center gap-3">
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
          <div className="w-12 h-2 rounded-full bg-slate-900 dark:bg-white transition-all duration-300 shadow-glow"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800 transition-all duration-300"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
