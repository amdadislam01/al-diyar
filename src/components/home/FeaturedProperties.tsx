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
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Popular Listings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Popular properties for rent and sale available at homespage
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-900 transition-all uppercase tracking-widest">
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>

        {/* Pagination Dots - matching image */}
        <div className="mt-12 flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
          <div className="w-8 h-2 rounded-full bg-slate-900 dark:bg-white"></div>
          <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800"></div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
