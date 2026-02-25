import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 pt-24 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Brand Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group w-fit">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 font-bold text-sm">
                <Image src="/aldiyarlogo.png" alt="Logo" width={40} height={40} className="p-1" />
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                Al-Diyar
              </span>
            </Link>
            <p className="text-sm leading-relaxed opacity-80">
              Modern Luxury Real Estate. <br />
              Dhaka, Bangladesh <br />
              +880 123 456 789 <br />
              contact@aldiyar.com
            </p>
          </div>

          {/* Sell Property */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-widest">
              Sell Property
            </h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <li>
                <Link
                  href="/sell"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  How it works
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="hover:text-slate-900 transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="/reviews"
                  className="hover:text-slate-900 transition-colors"
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="hover:text-slate-900 transition-colors"
                >
                  Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Buy Property */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-widest">
              Buy Property
            </h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <li>
                <Link
                  href="/buy"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Featured listings
                </Link>
              </li>
              <li>
                <Link
                  href="/cities"
                  className="hover:text-slate-900 transition-colors"
                >
                  Popular cities
                </Link>
              </li>
              <li>
                <Link
                  href="/agents"
                  className="hover:text-slate-900 transition-colors"
                >
                  Meet agents
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow us */}
          <div>
            <h4 className="text-slate-900 dark:text-white font-bold text-sm mb-6 uppercase tracking-widest">
              Follow us
            </h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  href="#"
                  className="hover:text-slate-900 transition-colors"
                >
                  X / Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-50 dark:border-slate-800 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60">
            © 2026 Al-Diyar. All rights reserved.
          </p>
          <div className="flex gap-4">
            <span className="material-icons-round text-slate-400 dark:text-slate-600 text-lg hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer">
              facebook
            </span>
            <span className="material-icons-round text-slate-400 dark:text-slate-600 text-lg hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer">
              camera_alt
            </span>
            <span className="material-icons-round text-slate-400 dark:text-slate-600 text-lg hover:text-slate-600 dark:hover:text-slate-400 transition-colors cursor-pointer">
              public
            </span>
          </div>
        </div>
      </div>
      <Image src="/footer-art.png" alt="Footer" width={1000} height={500} className="mx-auto mt-8" />
    </footer>
  );
};

export default Footer;
