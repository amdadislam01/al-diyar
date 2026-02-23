const BrandMarquee = () => {
  const brands = [
    { name: "Global Stay", icon: "public" },
    { name: "Urban Living", icon: "apartment" },
    { name: "Eco Estates", icon: "nature_people" },
    { name: "Luxe Realty", icon: "diamond" },
    { name: "Sky High", icon: "cloud" },
    { name: "Prime Space", icon: "auto_awesome" },
    { name: "Elite Homes", icon: "stars" },
    { name: "Vanguard", icon: "security" },
  ];

  return (
    <div className="py-12 bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-white/5 overflow-hidden transition-colors">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the array for infinite effect */}
        {[...brands, ...brands].map((brand, index) => (
          <div
            key={index}
            className="flex items-center gap-4 px-12 opacity-30 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0 cursor-default"
          >
            <span className="material-icons-round text-4xl text-slate-400 dark:text-slate-500">
              {brand.icon}
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
              {brand.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandMarquee;
