"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function NewsPage() {
  const { newsItems, settings } = useSiteContent();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    newsItems.forEach((item) => {
      if (item.category) set.add(item.category);
    });
    return ["All", ...Array.from(set)];
  }, [newsItems]);

  const filteredItems = useMemo(() => {
    return newsItems.filter((item) => {
      if (item.isPublished === false) return false;
      const matchesCategory =
        selectedCategory === "All" ||
        item.category?.toLowerCase() === selectedCategory.toLowerCase();
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.excerpt.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.body && item.body.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [newsItems, selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#303030] dark:text-[#f5f5f5] flex flex-col justify-between font-body transition-colors duration-200">
      <Header activeCategory="architecture" />

      <div className="pt-28 pb-20 px-6 md:px-16 lg:px-28 max-w-6xl mx-auto w-full">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-2">
              {settings.siteName} • {settings.tagline} Dispatches
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-normal text-black dark:text-white tracking-tight">
              News, Monographs & Dispatches
            </h1>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dispatches..."
              className="w-full pl-9 pr-8 py-2 text-xs border border-neutral-200 dark:border-white/15 bg-transparent text-black dark:text-white placeholder:text-neutral-400 outline-none focus:border-black dark:focus:border-white transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                title="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-10 flex flex-wrap items-center gap-2 border-b border-neutral-100 dark:border-white/10 pb-6">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-neutral-400 dark:text-neutral-500 font-mono">
            {filteredItems.length} {filteredItems.length === 1 ? "article" : "articles"}
          </span>
        </div>

        {/* News Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex flex-col border-b border-neutral-100 dark:border-white/10 pb-8"
              >
                <article>
                  <div className="relative mb-4 aspect-[16/9] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
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

                  <h2 className="mb-2 font-display text-lg sm:text-xl font-normal leading-snug text-black dark:text-white transition-opacity group-hover:opacity-75">
                    {item.title}
                  </h2>

                  <p className="font-body text-xs sm:text-sm leading-relaxed font-light text-neutral-600 dark:text-neutral-400 line-clamp-3">
                    {item.excerpt}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-neutral-200 dark:border-white/10 p-8">
            <p className="font-display text-xl text-neutral-700 dark:text-neutral-300">
              No dispatches found matching your search.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Try adjusting your keyword or category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 text-xs uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black cursor-pointer"
            >
              Reset filters
            </button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
