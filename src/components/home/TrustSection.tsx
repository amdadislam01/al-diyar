const TrustSection = () => {
  const logos = [
    { name: "Grammarly", icon: "gesture" },
    { name: "Linear", icon: "reorder" },
    { name: "Coinbase", icon: "monetization_on" },
    { name: "Webflow", icon: "lan" },
    { name: "Dribbble", icon: "sports_basketball" },
    { name: "Uber", icon: "directions_car" },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-16">
          <div className="md:w-1/2">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              1250+ Companies <br /> Trust by us.
            </h2>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-full flex items-center justify-center text-orange-500">
                <span className="material-icons-round">star</span>
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white italic">
                  Follow up
                </div>
                <div className="text-xs text-slate-400">Marketing</div>
              </div>
            </div>
          </div>
          <div className="md:w-1/2">
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              The best company to choose for client. This company is very
              trustable and good company. If you need any property then you
              should trust this.
            </p>
            <div className="mt-6 flex items-center gap-4">
              <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all">
                Visit more
              </button>
              <button className="text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold flex items-center gap-2 transition-colors">
                About Company{" "}
                <span className="material-icons-round text-sm">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className="flex items-center gap-2 transition-all"
            >
              <span className="material-icons-round text-3xl text-slate-600 dark:text-slate-400">
                {logo.icon}
              </span>
              <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
                {logo.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
