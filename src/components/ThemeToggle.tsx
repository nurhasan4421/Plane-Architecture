"use client";

import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`group relative flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full text-black dark:text-white transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 cursor-pointer focus:outline-none ${className}`}
    >
      {isDark ? (
        <Sun className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-100 transition-transform duration-300 group-hover:rotate-45" />
      ) : (
        <Moon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-neutral-800 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
