const TrustSection = () => {
  const stats = [
    {
      label: "Premium Listings",
      value: "1,250+",
      icon: "home_work",
      description: "Carefully curated high-end properties.",
    },
    {
      label: "Expert Agents",
      value: "450+",
      icon: "support_agent",
      description: "Dedicated professionals at your service.",
    },
    {
      label: "Client Satisfaction",
      value: "98%",
      icon: "verified",
      description: "Our commitment to excellence.",
    },
    {
      label: "Global Reach",
      value: "25+",
      icon: "public",
      description: "Market presence across major cities.",
    },
  ];

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="grid-trust"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-trust)" />
        </svg>
      </div>

      <div className="max-w-10/12 mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            Empowering Your <span className="text-gradient">Success.</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto font-medium">
            Over a decade of excellence in connecting elite property owners with
            discerning buyers through transparency and innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group p-8 rounded-3xl bg-white dark:bg-slate-950 border border-slate-100 dark:border-white/5 shadow-premium hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/5 dark:bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-500">
                <span className="material-icons-round text-2xl">
                  {stat.icon}
                </span>
              </div>
              <div className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                {stat.value}
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                {stat.label}
              </div>
              <p className="text-slate-500 dark:text-slate-500 text-sm leading-relaxed">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
