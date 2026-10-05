"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { Award, ArrowUpRight, Search, Trophy, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function AwardsPage() {
  const { awards, settings } = useSiteContent();
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const years = useMemo(() => {
    const set = new Set<string>();
    awards.forEach((award) => {
      if (award.year) set.add(award.year);
    });
    return ["All", ...Array.from(set).sort((a, b) => Number(b) - Number(a))];
  }, [awards]);

  const filteredAwards = useMemo(() => {
    return awards
      .filter((award) => {
        if (award.isPublished === false) return false;
        const matchesYear = selectedYear === "All" || award.year === selectedYear;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          award.title.toLowerCase().includes(q) ||
          award.project.toLowerCase().includes(q) ||
          award.organization.toLowerCase().includes(q) ||
          award.category.toLowerCase().includes(q) ||
          (award.description && award.description.toLowerCase().includes(q));
        return matchesYear && matchesSearch;
      })
      .sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
          return a.sortOrder - b.sortOrder;
        }
        return Number(b.year) - Number(a.year);
      });
  }, [awards, selectedYear, searchQuery]);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#303030] dark:text-[#f5f5f5] flex flex-col justify-between select-none font-body transition-colors duration-200">
      <Header activeCategory="architecture" />

      <main className="pt-28 pb-24 px-5 sm:px-8 md:px-16 lg:px-24 max-w-[1600px] mx-auto w-full flex-1">
        {/* Page Header */}
        <div className="mb-12 max-w-4xl">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
            <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400">
              {settings.siteName} • Accolades & Peer Recognition
            </span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-normal text-black dark:text-white tracking-tight">
            Awards & Citations
          </h1>
          <p className="mt-4 font-body text-sm sm:text-base text-neutral-600 dark:text-neutral-300 max-w-2xl font-light leading-relaxed">
            A chronicle of design excellence, environmental honors, and jury commendations celebrating over a decade of contextual materiality and bioclimatic architecture in the Bengal delta.
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="mb-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 border-y border-neutral-100 dark:border-white/10 py-5">
          {/* Year pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 mr-1 hidden sm:inline">Year:</span>
            {years.map((year) => (
              <button
                key={year}
                type="button"
                onClick={() => setSelectedYear(year)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all cursor-pointer ${
                  selectedYear === year
                    ? "bg-black text-white dark:bg-white dark:text-black font-medium"
                    : "bg-neutral-100 text-neutral-600 dark:bg-white/5 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-white/10"
                }`}
              >
                {year}
              </button>
            ))}
          </div>

          {/* Search box & counter */}
          <div className="flex items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search awards, projects..."
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

            <span className="text-xs text-neutral-400 dark:text-neutral-500 font-mono whitespace-nowrap">
              {filteredAwards.length} {filteredAwards.length === 1 ? "citation" : "citations"}
            </span>
          </div>
        </div>

        {/* Awards Showcase Grid */}
        {filteredAwards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-12">
            {filteredAwards.map((award) => (
              <article
                key={award.id}
                className="group flex flex-col justify-between border border-neutral-200/80 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/40 p-6 sm:p-7 transition-all duration-300 hover:border-black dark:hover:border-white/40 hover:shadow-lg"
              >
                <div>
                  {/* Top Bar: Year & Rank Badge */}
                  <div className="flex items-center justify-between gap-3 mb-5 border-b border-neutral-200/60 dark:border-white/10 pb-3">
                    <span className="font-mono text-xs font-semibold tracking-wider text-black dark:text-white">
                      {award.year}
                    </span>
                    {award.rank && (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-white/15">
                        <Award className="h-3 w-3 text-[#b18342]" />
                        {award.rank}
                      </span>
                    )}
                  </div>

                  {/* Image (if provided) */}
                  {award.image && (
                    <div className="relative mb-5 aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src={award.image}
                        alt={award.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  )}

                  {/* Category & Organization */}
                  <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    <span className="font-semibold text-black dark:text-white">{award.category}</span>
                    <span>•</span>
                    <span>{award.organization}</span>
                  </div>

                  {/* Award Title */}
                  <h2 className="font-display text-xl sm:text-2xl font-normal leading-snug text-black dark:text-white mb-3 group-hover:opacity-90">
                    {award.title}
                  </h2>

                  {/* Citation / Description */}
                  <p className="font-body text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 font-light leading-relaxed mb-6">
                    {award.description}
                  </p>
                </div>

                {/* Footer: Associated Project Link */}
                <div className="border-t border-neutral-200/60 dark:border-white/10 pt-4 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-neutral-400 block">Conferred For</span>
                    <span className="font-medium text-black dark:text-white">{award.project}</span>
                  </div>

                  {award.projectSlug && (
                    <Link
                      href={`/projects/${award.projectSlug}`}
                      className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                      title={`View ${award.project}`}
                    >
                      View project
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="py-24 text-center border border-dashed border-neutral-200 dark:border-white/10 p-8">
            <p className="font-display text-2xl text-neutral-700 dark:text-neutral-300">
              No citations found matching your criteria.
            </p>
            <p className="mt-2 text-xs text-neutral-500">
              Try adjusting your year or search keywords.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedYear("All");
                setSearchQuery("");
              }}
              className="mt-5 px-5 py-2.5 text-xs uppercase tracking-wider bg-black text-white dark:bg-white dark:text-black cursor-pointer transition hover:opacity-85"
            >
              Reset filters
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
