"use client";

import React from "react";
import Link from "next/link";

interface BigLogoProps {
  className?: string;
  onClick?: () => void;
  showText?: boolean;
}

export default function BigLogo({ className = "", onClick }: BigLogoProps) {
  return (
    <Link
      href="/"
      onClick={onClick}
      className={`group relative inline-flex items-center cursor-pointer select-none ${className}`}
      aria-label="BIG - Bjarke Ingels Group Homepage"
    >
      <svg
        id="biglogo"
        viewBox="0 0 216 98"
        className="w-[38px] h-[17px] md:w-[48px] md:h-[22px] transition-transform duration-300 group-hover:scale-105"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Letter B */}
        <polyline
          className="stroke-black transition-all duration-300 group-hover:stroke-gray-700"
          strokeWidth="10"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points="9.82 78.44 9.82 9.82 49.04 9.82 49.04 39.27"
        />
        <polyline
          className="stroke-black transition-all duration-300 group-hover:stroke-gray-700"
          strokeWidth="10"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points="68.67,78.44 68.67,49.04 19.63,49.04"
        />
        <line
          className="stroke-black"
          strokeWidth="10"
          x1="0"
          y1="88.26"
          x2="215.7"
          y2="88.26"
        />

        {/* Letter I */}
        <line
          className="stroke-black"
          x1="107.895"
          y1="0"
          x2="107.895"
          y2="98.08"
          strokeWidth="19.63"
        />
        <line
          className="stroke-black"
          strokeWidth="10"
          x1="0"
          y1="49"
          x2="215.7"
          y2="49"
        />

        {/* Letter G */}
        <line
          className="stroke-black"
          strokeWidth="10"
          x1="0"
          y1="9.82"
          x2="215.7"
          y2="9.82"
        />
        <polyline
          className="stroke-black transition-all duration-300 group-hover:stroke-gray-700"
          strokeWidth="10"
          strokeLinecap="square"
          strokeLinejoin="miter"
          points="147.07,19.63 147.07,88.26 205.88,88.26 205.88,49.04 176.52,49.04"
        />
      </svg>
    </Link>
  );
}
