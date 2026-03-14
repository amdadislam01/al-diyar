"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";
import { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { 
  Menu, X, 
  ChevronDown, LayoutDashboard, UserCircle, LogOut, Mail
} from "lucide-react";
import { HomeIcon } from "@/components/ui/home";
import { BlocksIcon } from "@/components/ui/blocks";
import { UsersIcon } from "@/components/ui/users";
import { FileTextIcon } from "@/components/ui/file-text";

// ─── Role → dashboard root ────────────────────────────────────────────────────
function getDashboardHref(role?: string) {
  if (role === "admin") return "/dashboard/admin";
  if (role === "agent") return "/dashboard/agent";
  if (role === "seller") return "/dashboard/seller";
  return "/dashboard";
}

function getDashboardLabel(role?: string) {
  if (role === "admin") return "Admin Panel";
  if (role === "agent") return "Agent Portal";
  if (role === "seller") return "Seller Portal";
  return "My Dashboard";
}

// ─── Role → center nav items ──────────────────────────────────────────────────
const navItemsMap = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "About", href: "/about", icon: FileTextIcon },
  { label: "Property", href: "/property", icon: BlocksIcon },
  { label: "Agents", href: "/agents", icon: UsersIcon },
  { label: "Blog", href: "/blog", icon: FileTextIcon },
  { label: "Contact", href: "/contact", icon: Mail }
];

const Navbar = () => {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();

  const role = (session?.user as { role?: string })?.role;
  const dashboardHref = getDashboardHref(role);

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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target as Node) && isMobileMenuOpen) {
          // Keep button click out of this logic to prevent double toggle
          const target = e.target as HTMLElement;
          if(!target.closest('.mobile-menu-btn')) {
              setIsMobileMenuOpen(false);
          }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "py-3"
            : "py-5"
        }`}
      >
        <div className={`mx-auto max-w-10/12 px-4 sm:px-6 lg:px-8 transition-all duration-500 ${
          isScrolled 
            ? "w-[95%] sm:w-11/12 rounded-4xl bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 shadow-premium" 
            : "w-full bg-transparent border-transparent"
        }`}>
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group transition-all shrink-0">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                isScrolled ? "bg-primary/10" : "bg-white shadow-lg"
              }`}>
                <Image
                  src="/aldiyarlogo.png"
                  alt="Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <span
                className={`font-black text-2xl tracking-tighter transition-colors duration-300 dark:text-white ${
                  isScrolled ? "text-slate-900 dark:text-white" : "text-black"
                }`}
              >
                Al-Diyar
              </span>
            </Link>

            {/* Center Menu (Desktop) */}
            <div className="hidden md:flex items-center justify-center flex-1 px-8">
              <div className="flex items-center gap-1 p-1.5 rounded-full bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-800/50">
                {navItemsMap.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <DesktopNavItem 
                      key={item.label} 
                      item={item} 
                      isActive={isActive} 
                      isScrolled={isScrolled} 
                    />
                  );
                })}
              </div>
            </div>

            {/* Right side (Desktop & Mobile combined) */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="hidden sm:block">
                 <ThemeToggle />
              </div>

              <Link
                href="/dashboard/seller/listings/new"
                className={`hidden md:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 ${
                  isScrolled
                    ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                    : "bg-white text-slate-900 hover:bg-slate-50"
                }`}
              >
                Add Property
              </Link>

              {/* Auth Section */}
              {status === "loading" ? (
                <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ) : session?.user ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen((prev) => !prev)}
                    className="relative flex items-center gap-2 p-1 pr-3 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 focus:outline-none group shadow-sm"
                    aria-label="Open profile menu"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
                      {session.user.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name ?? "User"}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            {getInitials(session.user.name)}
                          </span>
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-64 rounded-3xl bg-white dark:bg-slate-950 shadow-premium border border-slate-200/50 dark:border-slate-800/50 overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
                      <div className="p-4 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border-2 border-white dark:border-slate-800 shadow-sm">
                            {session.user.image ? (
                              <Image
                                src={session.user.image}
                                alt={session.user.name ?? "User"}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-primary flex items-center justify-center">
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
                             <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-primary/10 text-primary">
                              {role ?? "user"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-1">
                        <Link
                          href={dashboardHref}
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors group"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                          {getDashboardLabel(role)}
                        </Link>
                        <Link
                          href="/dashboard/profile"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors group"
                        >
                          <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors" />
                          My Profile
                        </Link>
                        <Link
                          href="/dashboard/properties"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white transition-colors group"
                        >
                          <HomeIcon size={16} className="text-slate-400 group-hover:text-primary transition-colors" />
                          My Properties
                        </Link>
                      </div>

                      <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-900/30">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            signOut({ callbackUrl: "/" });
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors group"
                        >
                          <LogOut className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className={`hidden sm:flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 active:scale-95 ${
                    isScrolled
                      ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-white/90 backdrop-blur-md text-slate-900 hover:bg-white shadow-sm"
                  }`}
                >
                  <UserCircle className="w-4 h-4" />
                  Sign In
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`mobile-menu-btn md:hidden p-2 rounded-full transition-colors ${
                  isScrolled ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white" : "bg-white text-slate-900 shadow-md"
                }`}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Drawer */}
          <div 
            ref={mobileMenuRef}
            className="w-4/5 max-w-sm h-full bg-white dark:bg-slate-950 shadow-2xl relative flex flex-col animate-in slide-in-from-right duration-300"
          >
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
               <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Menu</span>
               <div className="sm:hidden">
                 <ThemeToggle />
               </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Navigation</p>
                {navItemsMap.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <MobileNavItem 
                      key={item.label} 
                      item={item} 
                      isActive={isActive} 
                      onClick={() => setIsMobileMenuOpen(false)} 
                    />
                  );
                })}
              </div>

              {!session?.user && (
                 <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Account</p>
                    <Link
                      href="/auth/signin"
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-center"
                    >
                      <UserCircle className="w-5 h-5" />
                      Sign In
                    </Link>
                 </div>
              )}
            </div>
            
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 mt-auto">
                <Link
                  href="/dashboard/seller/listings/new"
                  className="flex items-center justify-center w-full px-6 py-4 rounded-2xl bg-primary text-white font-bold tracking-wide shadow-lg shadow-primary/20"
                >
                  Add Property
                </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const DesktopNavItem = ({ item, isActive, isScrolled }: { item: { label: string; href: string; icon: React.ElementType }; isActive: boolean; isScrolled: boolean }) => {
  const iconRef = useRef<any>(null);
  
  return (
    <Link
      href={item.href}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
      className={`relative px-4 py-2 rounded-full text-sm font-bold tracking-wide transition-all duration-300 group overflow-hidden flex items-center gap-2 ${
        isActive
          ? "text-primary dark:text-primary"
          : isScrolled ? "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white" : "text-slate-700 dark:text-white hover:text-black dark:hover:text-slate-200"
      }`}
    >
      {isActive && (
        <span className="absolute inset-0 bg-primary/10 dark:bg-primary/20 rounded-full -z-10 animate-in fade-in zoom-in duration-300" />
      )}
      <item.icon
        ref={iconRef}
        size={18}
        className={`transition-all duration-300 ease-out ${
          isActive ? "text-primary scale-110" : "opacity-70 group-hover:opacity-100 group-hover:text-primary group-hover:scale-110"
        }`}
      />
      {item.label}
    </Link>
  );
};

const MobileNavItem = ({ item, isActive, onClick }: { item: { label: string; href: string; icon: React.ElementType }; isActive: boolean; onClick: () => void }) => {
  const iconRef = useRef<any>(null);
  
  return (
    <Link
      href={item.href}
      onClick={onClick}
      onMouseEnter={() => iconRef.current?.startAnimation?.()}
      onMouseLeave={() => iconRef.current?.stopAnimation?.()}
      className={`flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-colors group ${
        isActive
          ? "bg-primary/10 text-primary dark:bg-primary/20"
          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 hover:text-primary"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <item.icon 
          ref={iconRef}
          size={22}
          className={`transition-all duration-300 ease-out ${
            isActive ? "text-primary scale-110" : "group-hover:text-primary"
          }`} 
        />
      </div>
      {item.label}
    </Link>
  );
};

export default Navbar;

