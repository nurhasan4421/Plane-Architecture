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
    }, 1400);

    const timer2 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("plane_splash_seen", "true");
    }, 2100);

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
        className={`flex flex-col items-center justify-center gap-6 transition-all duration-700 ease-out transform ${
          animatingOut ? "scale-110 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        {/* User-provided logo — white filter for dark background */}
        <img
          src="/logo.png"
          alt="Plane Architects"
          className="w-48 sm:w-56 md:w-64 h-auto object-contain"
          style={{ filter: "invert(1)" }}
        />
        <span className="font-body text-neutral-400 text-[10px] md:text-[11px] tracking-[0.35em] uppercase mt-1">
          DHAKA, BANGLADESH
        </span>
      </div>
    </div>
  );
}
