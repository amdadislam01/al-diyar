const ClientsTestimonials = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 shadow-sm">
            Clients
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            What Our Clients Say About Us
          </h2>
          <p className="text-slate-400 dark:text-slate-500 text-sm mt-2">
            Hear from our satisfied property owners and buyers
          </p>
        </div>

        <div className="bg-white dark:bg-slate-950 rounded-[3rem] p-12 shadow-card dark:shadow-premium flex flex-col md:flex-row items-center gap-16 relative overflow-hidden border border-slate-50 dark:border-white/5 transition-colors">
          {/* Decorative Quote Icon */}
          <div className="absolute top-12 right-12 opacity-5 dark:opacity-10 text-slate-900 dark:text-white">
            <span className="material-icons-round text-9xl">format_quote</span>
          </div>

          <div className="md:w-1/3">
            <div className="aspect-3/4 rounded-4xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976&auto=format&fit=crop"
                alt="Client"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="md:w-2/3">
            <div className="max-w-xl">
              <p className="text-2xl font-medium text-slate-700 dark:text-slate-300 leading-relaxed italic mb-8">
                "Working with this team was a pleasure. They understood our
                needs and helped us find a property that so exceeded our
                expectations. We couldn't have done it without them!"
              </p>

              <div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white">
                  Martha M.D.
                </h4>
                <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">
                  CEO of Airbnb
                </p>
              </div>

              <div className="mt-8 flex gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
                <div className="w-6 h-1.5 rounded-full bg-slate-900 dark:bg-white"></div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200 dark:bg-slate-800"></div>
              </div>
            </div>
          </div>

          {/* Navigation buttons like in the image */}
          <button className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-100 dark:border-slate-800">
            <span className="material-icons-round">chevron_left</span>
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-lg">
            <span className="material-icons-round">chevron_right</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default ClientsTestimonials;
