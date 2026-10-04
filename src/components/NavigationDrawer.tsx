"use client";

import React from "react";
import Link from "next/link";
import { useSiteContent } from "./SiteContentProvider";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
}: NavigationDrawerProps) {
  const { settings } = useSiteContent();

  return (
    <nav
      data-site-menu
      aria-label="Site navigation"
      aria-hidden={!isOpen}
      inert={!isOpen}
      onMouseLeave={onClose}
      className={`absolute left-1/2 right-auto top-full z-50 w-screen -translate-x-1/2 overflow-hidden bg-white dark:bg-[#282828] dark:border-b dark:border-white/10 font-body shadow-lg dark:shadow-2xl transition-[max-height,opacity,transform] duration-500 ease-out ${
        isOpen
          ? "max-h-[440px] translate-y-0 opacity-100"
          : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
      }`}
    >
      <div className="mx-auto grid w-full max-w-[1600px] gap-8 px-5 py-8 sm:px-8 sm:py-10 md:grid-cols-[1fr_0.8fr] lg:px-16 lg:py-12">
        <div className="flex flex-col">
          <Link href="/" onClick={onClose} className="py-3 font-display text-xl uppercase text-neutral-700 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white sm:text-2xl">
            Projects
          </Link>
          <Link href="/news" onClick={onClose} className="py-3 font-display text-xl uppercase text-neutral-700 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white sm:text-2xl">
            News
          </Link>
          <Link href="/about" onClick={onClose} className="py-3 font-display text-xl uppercase text-neutral-700 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white sm:text-2xl">
            About
          </Link>
          <Link href="/contact" onClick={onClose} className="py-3 font-display text-xl uppercase text-neutral-700 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white sm:text-2xl">
            Contact
          </Link>
        </div>
        <div className="flex flex-col justify-center border-t border-neutral-200 dark:border-white/10 pt-6 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 md:border-l md:border-t-0 md:pl-10 md:pt-0">
          <p className="font-display text-base font-medium text-black dark:text-white sm:text-lg">{settings.siteName}</p>
          <p className="mt-2">{settings.tagline || "Dhaka, Bangladesh"}</p>
          <a href={`tel:${settings.phone}`} className="mt-1 transition-colors hover:text-black dark:hover:text-white">{settings.phone}</a>
          <a href={`mailto:${settings.email}`} className="mt-1 transition-colors hover:text-black dark:hover:text-white">{settings.email}</a>
        </div>
      </div>
    </nav>
  );
}
