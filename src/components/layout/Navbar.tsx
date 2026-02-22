import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center gap-2 group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium transform group-hover:scale-105 transition-all">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white leading-none">
                Al-Diyar
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-accent font-semibold">
                Premium Estates
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-10">
            {["Buy", "Rent", "Sell", "Agents"].map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-sm font-semibold text-slate-600 hover:text-accent dark:text-slate-400 dark:hover:text-white transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Auth & CTAs */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/auth/signin"
              className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-accent transition-colors"
            >
              Sign In
            </Link>
            <button className="bg-primary hover:bg-accent text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-premium hover:shadow-accent/20 hover:-translate-y-0.5 active:translate-y-0">
              Post Listing
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <span className="material-icons-round text-2xl">menu</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
