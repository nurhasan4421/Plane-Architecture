"use client";

import React from "react";
import Link from "next/link";

interface PlaneLogoProps {
  className?: string;
  onClick?: () => void;
}

export default function PlaneLogo({ className = "", onClick }: PlaneLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group relative inline-flex items-center gap-2.5 cursor-pointer select-none ${className}`}
      aria-label="Plane Architect - Homepage"
    >
      {/* Architectural Plane Vector Glyph */}
      <svg
        viewBox="0 0 100 48"
        className="w-[38px] h-[18px] md:w-[46px] md:h-[22px] transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Intersecting horizontal and diagonal plane vectors */}
        <polyline
          className="stroke-black transition-all duration-300 group-hover:stroke-neutral-700"
          strokeWidth="6"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points="6,40 6,8 36,8 36,26 6,26"
        />
        <line
          className="stroke-black"
          strokeWidth="6"
          strokeLinecap="square"
          x1="46"
          y1="8"
          x2="46"
          y2="40"
        />
        <line
          className="stroke-black"
          strokeWidth="6"
          strokeLinecap="square"
          x1="46"
          y1="40"
          x2="70"
          y2="40"
        />
        <line
          className="stroke-black"
          strokeWidth="6"
          strokeLinecap="square"
          x1="80"
          y1="8"
          x2="96"
          y2="40"
        />
        <line
          className="stroke-black"
          strokeWidth="6"
          strokeLinecap="square"
          x1="80"
          y1="26"
          x2="93"
          y2="26"
        />
      </svg>

      {/* Typography Wordmark */}
      <div className="flex flex-col text-left">
        <span className="font-display text-[13px] md:text-[15px] tracking-[0.2em] font-normal uppercase leading-none text-black">
          PLANE
        </span>
        <span className="font-body text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[#797979] leading-tight">
          ARCHITECT
        </span>
      </div>
    </Link>
  );
}
