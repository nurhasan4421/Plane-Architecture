"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileStartProjectCTA() {
  const [visible, setVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  // Hide on start-project and admin pages
  const shouldHide =
    Boolean(pathname?.startsWith("/start-project") || pathname?.startsWith("/admin"));

  useEffect(() => {
    if (shouldHide) {
      setVisible(false);
      return;
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isScrollingUp = currentScrollY < lastScrollY;
      const pastThreshold = currentScrollY > 200;

      if (isScrollingUp && pastThreshold) {
        setVisible(true);
      } else if (!isScrollingUp) {
        setVisible(false);
      }

      // At top of page, hide
      if (currentScrollY < 100) {
        setVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, shouldHide]);

  if (shouldHide) return null;

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
        visible
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-8 opacity-0 scale-90 pointer-events-none"
      }`}
    >
      <Link
        href="/start-project"
        className="flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.14em] bg-black dark:bg-white text-white dark:text-black shadow-2xl backdrop-blur-sm transition-all duration-200 hover:bg-[#294b3d] dark:hover:bg-neutral-200 active:scale-95"
      >
        <svg
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-3.5 w-3.5"
        >
          <path d="M10 4v12M4 10h12" strokeLinecap="round" />
        </svg>
        Start Project
      </Link>
    </div>
  );
}
