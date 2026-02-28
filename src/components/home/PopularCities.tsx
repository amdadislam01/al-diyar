const PopularCities = () => {
  const cities = [
    {
      name: "Toronto",
      country: "Canada",
      image:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop",
      listings: "125 Listings",
    },
    {
      name: "Amsterdam",
      country: "Netherlands",
      image: "/images/city_amsterdam_1771612195764.png",
      listings: "150 Listings",
    },
    {
      name: "Marrakech",
      country: "Morocco",
      image: "/images/city_morocco_marrakech_1771612216541.png",
      listings: "85 Listings",
    },
    {
      name: "Dubai",
      country: "UAE",
      image: "/images/city_dubai_1771612236165.png",
      listings: "210 Listings",
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter"> <span className="text-black dark:text-white">Popular </span>
              <span className="text-gradient">Destinations</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Find your dream home in the world's most desired locations. Our
              curated collection features exclusive properties in every corner
              of the globe.
            </p>
          </div>
          <button className="text-xs font-black text-slate-900 dark:text-white border-2 border-primary dark:border-primary px-8 py-3 rounded-xl uppercase tracking-widest hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-white transition-all duration-300 cursor-pointer">
            View All Cities
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cities.map((city) => (
            <div
              key={city.name}
              className="group relative h-[450px] rounded-4xl overflow-hidden cursor-pointer shadow-premium hover:shadow-2xl transition-all duration-700"
            >
              <img
                src={city.image}
                alt={city.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-px bg-white/40" />
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-[0.2em]">
                    {city.country}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white mb-2">
                  {city.name}
                </h3>
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                  <p className="text-sm font-medium text-white/70">
                    {city.listings}
                  </p>
                  <span className="material-icons-round text-white group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
