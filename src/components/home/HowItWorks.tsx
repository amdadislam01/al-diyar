const steps = [
  {
    icon: "search_insights",
    title: "Precision Discovery",
    description:
      "Our AI-driven search engine analyzes millions of data points to find properties that perfectly align with your lifestyle.",
    accent: "bg-blue-500",
  },
  {
    icon: "view_in_ar",
    title: "Digital Immersion",
    description:
      "Experience properties through cinematic 4K virtual tours and ultra-high-resolution aerial photography.",
    accent: "bg-indigo-500",
  },
  {
    icon: "verified_user",
    title: "Secure Liquidity",
    description:
      "Benefit from our blockchain-verified contract system and instant secure payment processing.",
    accent: "bg-emerald-500",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 bg-white dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
            The <span className="text-gradient">Al-Diyar</span> Standard.
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 font-medium">
            We've redefined the acquisition journey. Every step is engineered
            for simplicity, transparency, and absolute security.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative p-10 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-900 transition-all duration-500 hover:shadow-premium overflow-hidden"
            >
              {/* Decorative Background */}
              <div
                className={`absolute -top-10 -right-10 w-32 h-32 ${step.accent} opacity-[0.03] group-hover:opacity-[0.08] rounded-full transition-all duration-700 blur-2xl group-hover:scale-150`}
              ></div>

              <div
                className={`w-16 h-16 ${step.accent} rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/10 group-hover:scale-110 transition-transform duration-500`}
              >
                <span className="material-symbols-outlined text-white text-3xl font-light">
                  {step.icon}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-black text-slate-300 dark:text-slate-700 tracking-tighter">
                  0{index + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white group-hover:text-accent transition-colors">
                  {step.title}
                </h3>
              </div>

              <p className="text-slate-600 dark:text-slate-400 font-medium text-sm leading-relaxed">
                {step.description}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 text-accent text-xs font-bold opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500 cursor-pointer">
                Learn More
                <span className="material-icons-round text-sm">
                  arrow_forward
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
