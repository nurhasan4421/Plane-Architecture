"use client";

import React, { useEffect, useState } from "react";

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("plane_splash_seen");
    if (seen) {
      setVisible(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setAnimatingOut(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("plane_splash_seen", "true");
    }, 1900);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black transition-opacity duration-700 ease-in-out pointer-events-none ${
        animatingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div
        className={`flex flex-col items-center justify-center transition-all duration-700 ease-out transform ${
          animatingOut ? "scale-110 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* Plane Architectural Geometry */}
        <svg
          viewBox="0 0 120 60"
          className="w-28 sm:w-36 md:w-44 h-auto mb-4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polyline
            className="stroke-white"
            strokeWidth="5"
            strokeLinecap="square"
            strokeLinejoin="miter"
            points="10,50 10,10 50,10 50,32 10,32"
          />
          <line
            className="stroke-white"
            strokeWidth="5"
            strokeLinecap="square"
            x1="62"
            y1="10"
            x2="62"
            y2="50"
          />
          <line
            className="stroke-white"
            strokeWidth="5"
            strokeLinecap="square"
            x1="62"
            y1="50"
            x2="90"
            y2="50"
          />
          <line
            className="stroke-white"
            strokeWidth="5"
            strokeLinecap="square"
            x1="100"
            y1="10"
            x2="118"
            y2="50"
          />
        </svg>

        <span className="font-display text-white text-sm md:text-base tracking-[0.3em] uppercase">
          PLANE ARCHITECT
        </span>
        <span className="font-body text-neutral-400 text-[9px] md:text-[10px] tracking-[0.35em] uppercase mt-1">
          DHAKA, BANGLADESH
        </span>
      </div>
    </div>
  );
}
