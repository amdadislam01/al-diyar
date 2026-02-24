"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Get user initials for avatar fallback
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 h-20 flex items-center transition-all duration-500 ${isScrolled
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
            className={`font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? "text-slate-900 dark:text-white" : "text-white"
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
              className={`text-sm font-semibold tracking-wide transition-all duration-300 hover:opacity-100 relative group overflow-hidden ${isScrolled
                ? "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                : "text-white/80 hover:text-white"
                }`}
            >
              {item}
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-current transform translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-300"></span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          <ThemeToggle />

          <button
            className={`hidden sm:block px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 shadow-lg active:scale-95 ${isScrolled
              ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:shadow-xl"
              : "bg-white text-slate-900 hover:bg-slate-100 shadow-white/10"
              }`}
          >
            Add Property
          </button>

          {/* Auth Section */}
          {status === "loading" ? (
            /* Loading skeleton */
            <div className="w-10 h-10 rounded-full bg-white/20 animate-pulse" />
          ) : session?.user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen((prev) => !prev)}
                className="relative flex items-center gap-2 group focus:outline-none cursor-pointer"
                aria-label="Open profile menu"
              >
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-300 shadow-md group-hover:shadow-lg group-hover:scale-105 ${isScrolled
                    ? "border-slate-200 dark:border-slate-700"
                    : "border-white/50"
                    }`}
                >
                  {session.user.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-primary flex items-center justify-center cursor-pointer">
                      <span className="text-white text-sm font-bold">
                        {getInitials(session.user.name)}
                      </span>
                    </div>
                  )}
                </div>
                {/* Chevron */}
                <svg
                  className={`w-4 h-4 transition-all duration-300 ${isDropdownOpen ? "rotate-180" : ""
                    } ${isScrolled ? "text-slate-600 dark:text-slate-300" : "text-white/80"
                    }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Header */}
                  <div className="px-4 py-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-800 dark:to-slate-800 border-b border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-600 shadow-md flex-shrink-0">
                        {session.user.image ? (
                          <Image
                            src={session.user.image}
                            alt={session.user.name ?? "User"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary to-primary flex items-center justify-center">
                            <span className="text-white text-base font-bold">
                              {getInitials(session.user.name)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {session.user.name ?? "User"}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                          {session.user.email}
                        </p>
                        <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 capitalize">
                          {(session.user as any).role ?? "user"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="py-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
                        <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      Dashboard
                    </Link>

                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center group-hover:bg-purple-100 dark:group-hover:bg-purple-900/40 transition-colors">
                        <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      My Profile
                    </Link>

                    <Link
                      href="/dashboard/properties"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors duration-150 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center group-hover:bg-green-100 dark:group-hover:bg-green-900/40 transition-colors">
                        <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                      </div>
                      My Properties
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3" />

                  {/* Logout */}
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors duration-150 group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 flex items-center justify-center group-hover:bg-red-100 dark:group-hover:bg-red-900/30 transition-colors">
                        <svg className="w-4 h-4 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Not logged in — Sign In button */
            <Link
              href="/auth/signin"
              className={`group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold tracking-tight transition-all duration-300 active:scale-95 hover:-translate-y-0.5 ${isScrolled
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md hover:shadow-lg"
                  : "bg-white/15 backdrop-blur-sm border border-white/30 text-white hover:bg-white/25 hover:border-white/50 shadow-sm"
                }`}
            >
              <span className="material-icons-round text-base leading-none">
                person_outline
              </span>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
