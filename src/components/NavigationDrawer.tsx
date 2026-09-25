"use client";

import React from "react";
import Link from "next/link";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact: () => void;
}

export default function NavigationDrawer({
  isOpen,
  onClose,
  onOpenContact,
}: NavigationDrawerProps) {
  return (
    <>
      {/* Background backdrop */}
      <div
        className={`fixed inset-0 z-30 bg-black/10 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-out drawer */}
      <nav
        className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col gap-1.5 bg-white pt-[70px] pr-10 pl-[5vw] md:pl-[50px] lg:pl-[36px] shadow-sm transition-all duration-300 ease-out select-none font-body ${
          isOpen
            ? "translate-x-0 opacity-100 pointer-events-auto"
            : "-translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <Link
          href="/"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          Projects
        </Link>
        <Link
          href="/news"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          News
        </Link>
        <Link
          href="/about"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          About
        </Link>
        <Link
          href="/about#sustainability"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          Sustainability
        </Link>
        <Link
          href="/about#people"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          People
        </Link>
        <Link
          href="/about#careers"
          onClick={onClose}
          className="text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1"
        >
          Careers
        </Link>
        <button
          onClick={() => {
            onClose();
            onOpenContact();
          }}
          className="text-left text-[13px] md:text-sm tracking-widest uppercase text-black/60 hover:text-black transition-colors duration-200 py-1 cursor-pointer"
        >
          Contact
        </button>

        <div className="mt-auto pb-8 text-[11px] text-[#797979] tracking-wider uppercase">
          <p className="font-display font-medium text-black text-xs">Plane Architect</p>
          <p className="mt-1 text-[10px] text-neutral-500">Dhaka, Bangladesh</p>
          <p className="mt-0.5 text-[10px] text-neutral-400">+8801234567891</p>
          <p className="text-[10px] text-neutral-400 lowercase">hello@planearchitect.com</p>
        </div>
      </nav>
    </>
  );
}
