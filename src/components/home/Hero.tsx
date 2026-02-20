const Hero = () => {
  return (
    <header className="relative min-h-[90vh] flex items-center pt-16">
      {/* Background with overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_luxury_house_1771612282583.png"
          alt="Luxury House"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/30 to-transparent dark:from-black/80 dark:via-black/40"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col md:flex-row items-center justify-between gap-12">
        {/* Left Content */}
        <div className="md:w-1/2 text-left">
          <h1 className="text-6xl md:text-8xl font-bold text-white leading-tight mb-8">
            Buy, Rent, & <br /> Sell{" "}
            <span className="text-white">Property</span>
          </h1>
          <button className="bg-white text-slate-900 px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-slate-100 transition-all">
            Try for Free
          </button>
        </div>

        {/* Right Content - Search Card */}
        <div className="md:w-[450px] w-full">
          <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug">
              Hire your best Property <br /> Agent as your wish
            </h2>

            <form className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-icons-round text-sm">home</span>
                  Select location
                </label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none">
                    <option>Premsium Avenue</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-icons-round text-sm">category</span>
                  Property type
                </label>
                <div className="relative">
                  <select className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm focus:ring-1 focus:ring-primary outline-none appearance-none">
                    <option>All Select Style</option>
                  </select>
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 material-icons-round text-slate-400 text-sm">
                    expand_more
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="material-icons-round text-sm">bed</span>
                  Bed
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="material-icons-round text-sm">bathtub</span>
                  Bathroom
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 px-3 py-2 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="material-icons-round text-sm">
                    photo_size_select_small
                  </span>
                  Sqft
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="material-icons-round text-sm">payments</span>
                  Check Price
                </label>
                <div className="relative">
                  <div className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-sm font-bold text-slate-800">
                    $1800.00
                  </div>
                </div>
              </div>

              <button className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all mt-4 uppercase text-xs tracking-widest">
                Search
              </button>
            </form>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Hero;
