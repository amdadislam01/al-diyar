const PopularCities = () => {
  const cities = [
    {
      name: "Canada",
      image:
        "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?q=80&w=2011&auto=format&fit=crop",
      listings: "125 Listings",
    },
    {
      name: "Amsterdam",
      image: "/images/city_amsterdam_1771612195764.png",
      listings: "150 Listings",
    },
    {
      name: "Morocco",
      image: "/images/city_morocco_marrakech_1771612216541.png",
      listings: "85 Listings",
    },
    {
      name: "Dubai",
      image: "/images/city_dubai_1771612236165.png",
      listings: "210 Listings",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Popular Cities
          </h2>
          <button className="text-sm font-bold text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 px-6 py-2 rounded-full uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            Explore All
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {cities.map((city) => (
            <div key={city.name} className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-4 border-white dark:border-slate-800 shadow-lg hover:scale-105 transition-transform duration-500">
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {city.name}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                {city.listings}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularCities;
