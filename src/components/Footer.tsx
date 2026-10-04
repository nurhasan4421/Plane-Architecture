"use client";

import React from "react";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { CATEGORIES_CONFIG } from "@/lib/projects-data";
import PlaneLogo from "./PlaneLogo";
import { useSiteContent } from "./SiteContentProvider";

interface FooterProps {
  onSelectCategory?: (category: string, subcategory?: string) => void;
}

export default function Footer({ onSelectCategory }: FooterProps) {
  const { settings } = useSiteContent();
  const categories = settings.categories.length ? settings.categories : CATEGORIES_CONFIG;

  return (
    <footer className="w-full border-t border-neutral-800 bg-black font-body text-[#c6cec9]">
      <div className="mx-auto w-full max-w-[1600px] px-5 py-12 sm:px-8 md:py-16 lg:px-16">
        <div className="grid gap-10 border-b border-white/15 pb-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.7fr_0.9fr_1.2fr] lg:gap-12">
          <div>
            <PlaneLogo className="mb-5" imageClassName="h-12 brightness-0 invert sm:h-14 lg:h-16" />
            <p className="max-w-xs text-sm leading-6 text-[#c6cec9]">
              {settings.companyDescription}
            </p>
            <div className="mt-6 flex gap-2">
              {settings.socialLinks.map(({ label, url }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-[#e5ebe7] transition-colors hover:border-white hover:bg-white hover:text-black"
                >
                  {label.toLowerCase().includes("instagram") ? (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                      <path d="M5.2 8.7a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.6 10h3.2v10H3.6V10Zm5.2 0h3.1v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.9V20h-3.2v-4.8c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V20H8.8V10Z" />
                    </svg>
                  )}
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Explore</h2>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="transition-colors hover:text-white">Projects</Link></li>
              <li><Link href="/news" className="transition-colors hover:text-white">News</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">About</Link></li>
              <li><Link href="/contact" className="transition-colors hover:text-white">Contact</Link></li>
              <li><Link href="/contact#faq" className="transition-colors hover:text-white">FAQ</Link></li>
              <li><Link href="/start-project" className="transition-colors hover:text-white">Start Project</Link></li>
            </ul>
          </nav>

          <nav aria-label="Project categories">
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Categories</h2>
            <ul className="space-y-3 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/?category=${category.id}`}
                    onClick={() => onSelectCategory?.(category.id)}
                    className="transition-colors hover:text-white"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-white">Dhaka Studio</h2>
            <ul className="space-y-4 text-sm leading-6">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-[#a9b9ae]" aria-hidden="true" />
                <span>{settings.address}</span>
              </li>
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-3 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0 text-[#a9b9ae]" aria-hidden="true" />
                  {settings.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${settings.email}`} className="flex items-center gap-3 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0 text-[#a9b9ae]" aria-hidden="true" />
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-6 text-xs text-[#9daaa2] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Plane Architect. All rights reserved.</p>
          <p>Architecture / Landscape / Dhaka, Bangladesh</p>
        </div>
      </div>
    </footer>
  );
}
