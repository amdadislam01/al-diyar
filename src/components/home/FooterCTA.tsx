const FooterCTA = () => {
  return (
    <section className="relative bg-slate-950 py-32 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/20 rounded-full blur-[120px] opacity-30 animate-pulse"></div>
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] opacity-30 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              height="60"
              id="dots"
              patternUnits="userSpaceOnUse"
              width="60"
            >
              <circle cx="2" cy="2" fill="white" r="1"></circle>
            </pattern>
          </defs>
          <rect fill="url(#dots)" height="100%" width="100%"></rect>
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-8 backdrop-blur-md">
          Mobile Ecosystem
        </div>
        <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter leading-tight">
          Modern Real Estate <br /> in Your{" "}
          <span className="text-gradient">Pocket.</span>
        </h2>
        <p className="text-slate-400 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          The Al-Diyar app is the fastest way to browse premium listings and
          manage your property portfolio from anywhere.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button className="group bg-white hover:bg-slate-100 text-slate-950 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-xl hover:shadow-white/10 active:scale-95">
            <span className="material-icons-round text-2xl">apple</span>
            <div>
              <p className="text-[10px] uppercase tracking-widest leading-none text-left opacity-60">
                Buy on the
              </p>
              <p className="text-lg">App Store</p>
            </div>
          </button>
          <button className="group bg-slate-900 hover:bg-slate-800 border border-white/10 text-white px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-4 transition-all shadow-xl active:scale-95">
            <span className="material-icons-round text-2xl text-accent">
              android
            </span>
            <div>
              <p className="text-[10px] uppercase tracking-widest leading-none text-left opacity-60">
                Get it on
              </p>
              <p className="text-lg">Google Play</p>
            </div>
          </button>
        </div>

        <div className="mt-16 pt-16 border-t border-white/5 flex flex-wrap justify-center gap-12">
          <div className="text-center">
            <p className="text-2xl font-black text-white">4.9/5</p>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">
              App Store Rating
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">1M+</p>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">
              Active Users
            </p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-white">50k+</p>
            <p className="text-[10px] uppercase font-bold text-slate-500 tracking-widest mt-1">
              Properties Sold
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
