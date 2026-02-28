const FooterCTA = () => {
  return (
    <section className="relative py-24 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 dark:bg-slate-900 border border-slate-800 dark:border-slate-800/50 p-12 md:p-20 text-center shadow-2xl">
          {/* Background Image - Palm trees as in the image */}
          <div className="absolute inset-0 opacity-40">
            <img
              src="https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=2066&auto=format&fit=crop"
              alt="Palm Trees"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Stay Updated on Latest Property
            </h2>
            <p className="text-slate-300 mb-12 max-w-md mx-auto">
              Subscribe to our newsletter and stay updated on the latest luxury
              property listings and market trends.
            </p>

            <div className="max-w-lg mx-auto relative">
              <input
                type="email"
                placeholder="Type your email..."
                className="w-full bg-white dark:bg-slate-800 rounded-full py-4 pl-8 pr-32 text-slate-900 dark:text-white font-medium outline-none shadow-xl border-none"
              />
              <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/80 text-white px-8 rounded-full font-bold text-sm transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FooterCTA;
