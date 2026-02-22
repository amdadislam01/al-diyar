const Hero = () => {
  return (
    <header className="relative min-h-[85vh] flex items-center justify-center py-20 lg:py-32 overflow-hidden">
      {/* Cinematic Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop"
          alt="Modern Architecture"
          className="w-full h-full object-cover scale-110 animate-slow-zoom"
        />
        <div className="absolute inset-0 bg-slate-950/60 dark:bg-slate-950/80 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-t from-background-light dark:from-background-dark via-transparent to-slate-950/20"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-reveal">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold mb-8 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
          </span>
          NEW LUXURY LISTINGS AVAILABLE
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-8">
          Elevate Your <span className="text-gradient">Lifestyle.</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-200 mb-12 max-w-2xl mx-auto font-medium leading-relaxed opacity-90">
          Discover high-end properties in the most prestigious locations.
          Experience real estate without boundaries.
        </p>

        {/* Premium Search Console */}
        <div className="max-w-5xl mx-auto p-2 glass rounded-4xl shadow-premium group">
          <div className="bg-white/10 dark:bg-slate-950/20 backdrop-blur-sm p-4 md:p-6 rounded-[1.8rem] border border-white/10 transition-all group-hover:bg-white/20 dark:group-hover:bg-slate-950/40">
            <form className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Location */}
              <div className="text-left space-y-2">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">
                  Where?
                </label>
                <div className="relative group/input">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent material-icons-round text-lg group-focus-within/input:scale-110 transition-transform">
                    place
                  </span>
                  <input
                    type="text"
                    placeholder="Search destination..."
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border-transparent text-white placeholder:text-slate-400 focus:bg-white/10 focus:ring-0 focus:border-accent/30 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Type */}
              <div className="text-left space-y-2">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">
                  Property Type
                </label>
                <select className="w-full px-4 py-4 rounded-2xl bg-white/5 border-transparent text-white focus:bg-white/10 focus:ring-0 focus:border-accent/30 transition-all text-sm font-medium appearance-none">
                  <option className="bg-slate-900">Modern Villas</option>
                  <option className="bg-slate-900">Luxury Penthouses</option>
                  <option className="bg-slate-900">Elite Studios</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="text-left space-y-2">
                <label className="text-[10px] font-bold text-slate-300 uppercase tracking-widest pl-1">
                  Budget
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-accent material-icons-round text-lg">
                    payments
                  </span>
                  <input
                    type="text"
                    placeholder="Max Price"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border-transparent text-white placeholder:text-slate-400 focus:bg-white/10 focus:ring-0 focus:border-accent/30 transition-all text-sm font-medium"
                  />
                </div>
              </div>

              {/* Search Button */}
              <button
                type="button"
                className="h-[60px] bg-accent hover:bg-blue-400 text-white font-bold rounded-2xl shadow-lg shadow-accent/20 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-1 active:scale-95"
              >
                <span className="material-icons-round">search</span>
                Discover Now
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap justify-center gap-6">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white overflow-hidden"
              >
                <img src={`https://i.pravatar.cc/100?u=${i}`} alt="User" />
              </div>
            ))}
            <div className="w-10 h-10 rounded-full border-2 border-slate-900 bg-accent flex items-center justify-center text-[10px] font-bold text-white">
              +2k
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium flex items-center">
            Trusted by{" "}
            <span className="text-white px-1.5 font-bold">2,500+</span> luxury
            homeowners in Dubai
          </p>
        </div>
      </div>
    </header>
  );
};

export default Hero;
