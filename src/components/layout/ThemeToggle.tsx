"use client";

import * as React from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

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
      className="w-10 h-10 rounded-full flex items-center justify-center text-slate-900 dark:text-slate-100 transition-all"
      aria-label="Toggle theme"
    >
      <span className="material-icons-round text-xl">
        {theme === "dark" ? "light_mode" : "dark_mode"}
      </span>
    </button>
  );
}
