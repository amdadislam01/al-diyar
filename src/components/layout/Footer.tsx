import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-background-dark text-slate-400 py-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-premium group-hover:bg-accent transition-colors">
                A
              </div>
              <span className="font-bold text-2xl tracking-tight text-white">
                Al-Diyar
              </span>
            </Link>
            <p className="max-w-xs text-sm font-medium leading-relaxed opacity-80">
              The premium marketplace for luxury real estate. Discover, tour,
              and acquire extraordinary properties across the globe.
            </p>
            <div className="flex gap-4">
              {["facebook", "camera_alt", "alternate_email", "public"].map(
                (icon) => (
                  <a
                    key={icon}
                    href="#"
                    className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-accent hover:border-accent transition-all"
                  >
                    <span className="material-icons-round text-lg">{icon}</span>
                  </a>
                ),
              )}
            </div>
          </div>

          {/* Links Sections */}
          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">
              Platform
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <Link
                  href="/buy"
                  className="hover:text-accent transition-colors"
                >
                  Marketplace
                </Link>
              </li>
              <li>
                <Link
                  href="/rent"
                  className="hover:text-accent transition-colors"
                >
                  Rental Hub
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="hover:text-accent transition-colors"
                >
                  Verified Agents
                </Link>
              </li>
              <li>
                <Link
                  href="/developments"
                  className="hover:text-accent transition-colors"
                >
                  Developments
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">
              Resources
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <Link
                  href="/about"
                  className="hover:text-accent transition-colors"
                >
                  Global Network
                </Link>
              </li>
              <li>
                <Link
                  href="/press"
                  className="hover:text-accent transition-colors"
                >
                  Inside Al-Diyar
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="hover:text-accent transition-colors"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/help"
                  className="hover:text-accent transition-colors"
                >
                  Concierge
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black text-xs uppercase tracking-widest mb-8">
              Governance
            </h4>
            <ul className="space-y-4 text-sm font-semibold">
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-accent transition-colors"
                >
                  Privacy Charter
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-accent transition-colors"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/compliance"
                  className="hover:text-accent transition-colors"
                >
                  Compliance
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            © 2026 Al-Diyar Global. An Elite Real Estate Ecosystem.
          </p>
          <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-white transition-colors">
              System Status
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Feedback
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
