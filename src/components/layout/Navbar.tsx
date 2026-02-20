"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ${
        isScrolled
          ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg border-b border-slate-100 dark:border-slate-800 shadow-sm h-16"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group transition-all">
          <div className="w-10 h-10 bg-slate-900 dark:bg-white rounded-full flex items-center justify-center text-white dark:text-slate-900 font-bold text-base transition-transform group-hover:scale-110">
            AD
          </div>
          <span
            className={`font-bold text-xl tracking-tight transition-colors duration-300 ${
              isScrolled ? "text-slate-900 dark:text-white" : "text-white"
            }`}
          >
            Al-Diyar
          </span>
        </Link>

        {/* Center Menu */}
        <div className="hidden md:flex items-center space-x-10">
          {["Home", "Listing", "Property", "Agents", "Blog"].map((item) => (
            <Link
              key={item}
              href={`/${item === "Home" ? "" : item.toLowerCase()}`}
              className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-100 relative group overflow-hidden ${
                isScrolled
                  ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  : "text-white/80 hover:text-white"
              }`}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-6">
          <ThemeToggle />
          <Link
            href="/auth/signin"
            className={`text-sm font-bold tracking-tight transition-colors duration-300 ${
              isScrolled
                ? "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                : "text-white/90 hover:text-white"
            }`}
          >
            Sign In
          </Link>
          <button
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg active:scale-95 ${
              isScrolled
                ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl"
                : "bg-white text-slate-900 hover:bg-slate-100 shadow-white/10"
            }`}
          >
            Add Property
          </button>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border ${
              isScrolled
                ? "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            <span
              className={`material-icons-round text-xl ${
                isScrolled ? "text-slate-600 dark:text-slate-400" : "text-white"
              }`}
            >
              person_outline
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
