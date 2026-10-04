"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function NewsPage() {
  const { newsItems, settings } = useSiteContent();

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#303030] dark:text-[#f5f5f5] flex flex-col justify-between select-none font-body transition-colors duration-200">
      <Header activeCategory="architecture" />

      <div className="pt-28 pb-20 px-6 md:px-16 lg:px-28 max-w-6xl mx-auto w-full">
        <div className="mb-12">
          <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-2">
            {settings.siteName} • {settings.tagline} Dispatches
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-black dark:text-white tracking-tight">
            News, Monographs & Dispatches
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {newsItems.map((item) => (
            <Link key={item.id} href={`/news/${item.slug}`} className="group flex flex-col border-b border-neutral-100 dark:border-white/10 pb-8">
              <article>
                <div className="relative mb-4 aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="mb-2 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#797979] dark:text-neutral-400 font-body">
                  <span>{item.date}</span>
                  <span>•</span>
                  <span className="font-semibold text-black dark:text-white">{item.category}</span>
                  <span>•</span>
                  <span>{item.readTime}</span>
                </div>

                <h2 className="mb-2 font-display text-lg font-normal leading-snug text-black dark:text-white transition-opacity group-hover:opacity-75">
                  {item.title}
                </h2>

                <p className="font-body text-xs leading-relaxed font-light text-neutral-600 dark:text-neutral-400">
                  {item.excerpt}
                </p>
              </article>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
