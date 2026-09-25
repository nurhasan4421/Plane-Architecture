"use client";

import React from "react";
import Link from "next/link";

interface FooterProps {
  onOpenContact?: () => void;
}

export default function Footer({ onOpenContact }: FooterProps) {
  return (
    <footer className="w-full bg-white border-t border-neutral-100 py-10 px-6 md:px-12 lg:px-20 text-[11px] text-[#797979] uppercase tracking-wider select-none">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-medium text-black">BIG — Bjarke Ingels Group</p>
          <p className="text-[10px] mt-1 text-neutral-400">
            Architecture • Landscape • Engineering • Planning • Product Design
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link href="/" className="hover:text-black transition-colors">
            Projects
          </Link>
          <Link href="/news" className="hover:text-black transition-colors">
            News
          </Link>
          <Link href="/about" className="hover:text-black transition-colors">
            About
          </Link>
          {onOpenContact && (
            <button
              onClick={onOpenContact}
              className="hover:text-black transition-colors uppercase cursor-pointer"
            >
              Contact
            </button>
          )}
        </div>

        <div className="text-[10px] text-neutral-400">
          © {new Date().getFullYear()} Bjarke Ingels Group. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
