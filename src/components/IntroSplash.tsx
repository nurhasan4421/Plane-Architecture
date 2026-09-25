"use client";

import React, { useEffect, useState } from "react";

export default function IntroSplash() {
  const [visible, setVisible] = useState(true);
  const [animatingOut, setAnimatingOut] = useState(false);

  useEffect(() => {
    // Check if splash was already shown this session
    const seen = sessionStorage.getItem("big_splash_seen");
    if (seen) {
      setVisible(false);
      return;
    }

    const timer1 = setTimeout(() => {
      setAnimatingOut(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("big_splash_seen", "true");
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
        className={`w-28 sm:w-36 md:w-44 transition-all duration-700 ease-out transform ${
          animatingOut ? "scale-125 opacity-0" : "scale-100 opacity-100"
        }`}
      >
        <svg viewBox="0 0 475 216" className="w-full h-auto">
          {/* Exact BIG blocky SVG paths from big.dk */}
          <path
            className="fill-white"
            d="M43 87V130V174H0V0H130V87H87V43H43V87Z"
          />
          <path
            className="fill-white"
            d="M0 216V173H43H130H173V216H0Z"
          />
          <path
            className="fill-white"
            d="M173 86V174H130V129H42V86H86H130H173Z"
          />
          <path
            className="fill-white"
            d="M216 216V0H259V216H216Z"
          />
          <path
            className="fill-white"
            d="M345 43H302V0H475V43H345Z"
          />
          <path
            className="fill-white"
            d="M475 216H302V42H345V173H432V129H389V86H475V216Z"
          />
        </svg>
      </div>
    </div>
  );
}
