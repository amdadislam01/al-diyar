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
    <section className="py-32 bg-slate-50 dark:bg-slate-950/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
              Featured <span className="text-gradient">Collection.</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
              Explore our curated selection of properties. Each listing is
              hand-picked for its exceptional design and prime location.
            </p>
          </div>
          <button className="group flex items-center gap-3 px-8 py-4 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white font-bold text-sm shadow-premium hover:shadow-xl transition-all">
            View All Properties
            <span className="material-icons-round text-accent group-hover:translate-x-1 transition-transform">
              arrow_forward
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {properties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProperties;
