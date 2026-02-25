"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted)
    return (
      <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 animate-pulse"></div>
    );

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isDashboard
          ? "text-slate-800 dark:text-slate-200"
          : isScrolled
            ? "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            : "text-white/90 hover:text-white"
      }`}
      aria-label="Toggle theme"
    >
      <span className="material-icons-round text-xl">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
