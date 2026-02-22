const MapPreview = () => {
  return (
    <section className="relative h-[600px] w-full overflow-hidden group">
      {/* Dark Modern Map Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=2068&auto=format&fit=crop"
          alt="Abstract city map view"
          className="w-full h-full object-cover transition-all duration-1000 grayscale opacity-40 group-hover:opacity-60 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-slate-950/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-linear-to-b from-slate-50 dark:from-slate-950/50 via-transparent to-slate-50 dark:to-slate-950/50"></div>
      </div>

      {/* Interactive Hub Visuals */}
      <div className="relative z-10 h-full w-full max-w-7xl mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="space-y-6 max-w-2xl px-8 py-12 glass rounded-[3rem] shadow-glass border border-white/10 backdrop-blur-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 text-accent text-[10px] font-black uppercase tracking-widest mb-2">
            <span className="material-icons-round text-sm">explore</span>
            Interactive Geography
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Explore the <span className="text-gradient">Local Scene.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed mb-8">
            Our intelligent map experience allows you to visualize
            neighborhoods, schools, and commute times with real-time precision.
          </p>
          <button className="bg-primary hover:bg-accent text-white px-10 py-5 rounded-2xl font-bold transition-all shadow-premium hover:shadow-accent/40 flex items-center justify-center gap-3 mx-auto transform hover:-translate-y-1">
            <span className="material-icons-round">map</span>
            Open Global Map
          </button>
        </div>
      </div>

      {/* Floating Dynamic Pins */}
      <div className="absolute top-[20%] left-[15%] hidden md:block animate-bounce-slow">
        <div className="relative group/pin cursor-pointer">
          <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg shadow-accent/40 rotate-12 transition-transform group-hover/pin:rotate-0">
            <span className="material-icons-round">home</span>
          </div>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
            Luxury Villa $5M
          </div>
        </div>
      </div>

      <div className="absolute bottom-[25%] right-[10%] hidden md:block animate-pulse-slow">
        <div className="relative group/pin cursor-pointer">
          <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/40 -rotate-12 transition-transform group-hover/pin:rotate-0">
            <span className="material-icons-round">apartment</span>
          </div>
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 bg-slate-900 text-white text-[10px] font-bold rounded-lg opacity-0 group-hover/pin:opacity-100 transition-opacity whitespace-nowrap">
            Skyline Studio $2k/mo
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapPreview;
