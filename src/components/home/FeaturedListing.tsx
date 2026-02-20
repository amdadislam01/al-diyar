const FeaturedListing = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            Featured Listing
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 relative">
            <div className="aspect-video rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img
                src="https://images.propertyspanish.com/villa-malaga-sale-2.jpg"
                alt="Featured Property"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-8 left-8 bg-white/10 dark:bg-slate-900/40 backdrop-blur-md border border-white/20 dark:border-white/10 p-6 rounded-3xl text-white">
              <div className="text-sm font-bold uppercase tracking-widest mb-1 text-orange-400">
                The Grand Villa
              </div>
              <div className="text-2xl font-bold">Palm Jumeirah, Dubai</div>
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="max-w-md">
              <div className="text-6xl font-serif text-slate-900 dark:text-white leading-tight italic">
                "Extraordinary{" "}
                <span className="text-orange-500">performance!</span> Quick
                solutions. Highly recommended."
              </div>

              <div className="mt-8 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-100 dark:border-slate-800">
                  <img src="https://i.pravatar.cc/100?u=jack" alt="User" />
                </div>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">
                    Michael Jordon
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">
                    Home Owner
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center gap-16">
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    1500+
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                    Properties
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-white">
                    1.9M+
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
                    Happy Clients
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedListing;
