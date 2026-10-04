"use client";

import React from "react";
import { useSiteContent } from "./SiteContentProvider";

interface PlaneLogoProps {
  className?: string;
  imageClassName?: string;
  onClick?: () => void;
}

export default function PlaneLogo({ className = "", imageClassName = "", onClick }: PlaneLogoProps) {
  const { settings } = useSiteContent();

  const shouldInvert = !imageClassName.includes("invert");

  return (
    // Full document navigation guarantees the logo always returns to the homepage.
    // eslint-disable-next-line @next/next/no-html-link-for-pages
    <a
      href="/"
      onClick={onClick}
      className={`group relative inline-flex items-center cursor-pointer select-none ${className}`}
      aria-label={`${settings.siteName} - Homepage`}
    >
      {/* User-provided PNG logo */}
      <img
        src={settings.logoUrl || "/logo.png"}
        alt={settings.siteName}
        className={`${imageClassName || "h-[28px] md:h-[34px] lg:h-[38px]"} ${shouldInvert ? "dark:invert" : ""} w-auto object-contain transition-all duration-200 group-hover:opacity-75`}
      />
    </a>
  );
}
