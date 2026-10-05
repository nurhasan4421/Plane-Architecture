"use client";

import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import FeaturedProjectCarousel from "@/components/FeaturedProjectCarousel";
import ProjectFeed from "@/components/ProjectFeed";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

export default function HomePage() {
  const { settings, projects, testimonials } = useSiteContent();
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(undefined);
  const [shuffleKey, setShuffleKey] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");
    const subcategory = params.get("type") || params.get("subcategory") || undefined;
    if (!category) return;

    const validCategory =
      category === "all" ||
      settings.categories.some((item) => item.id === category) ||
      ["architecture", "interiors", "landscape", "planning", "products"].includes(category);
    if (!validCategory) return;

    const timeout = window.setTimeout(() => {
      setActiveCategory(category);
      setActiveSubcategory(subcategory);
      if (!subcategory) {
        setShuffleKey((prev) => prev + 1);
      }
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [settings.categories]);

  const handleSelectCategory = (category: string, subcategory?: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
    if (!subcategory) {
      setShuffleKey((prev) => prev + 1);
    }
    const url = new URL(window.location.href);
    if (category === "all") {
      url.searchParams.delete("category");
    } else {
      url.searchParams.set("category", category);
    }
    if (subcategory) {
      url.searchParams.set("type", subcategory);
    } else {
      url.searchParams.delete("type");
      url.searchParams.delete("subcategory");
    }
    window.history.pushState({}, "", url.pathname + url.search);
  };

  const showCarousel = settings.carouselEnabled && activeCategory === "all";

  return (
    <main className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] flex flex-col justify-between transition-colors duration-200">
      {/* Top Header */}
      <Header
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        onSelectCategory={handleSelectCategory}
      />

      {showCarousel && (
        <FeaturedProjectCarousel
          projects={settings.featuredProjectSlugs
            .map((slug) => projects.find((project) => project.slug === slug))
            .filter((project): project is (typeof projects)[number] => Boolean(project))}
        />
      )}

      {/* Main Project Feed */}
      <div className={showCarousel ? "" : "pt-[68px] sm:pt-[78px] lg:pt-[90px]"}>
        <ProjectFeed
          key={`${activeCategory}:${activeSubcategory ?? "all"}:${shuffleKey}:${settings.carouselEnabled ? "carousel" : "direct"}`}
          projects={projects}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          testimonials={testimonials}
          initialSort={!activeSubcategory ? "random" : "default"}
          showSortFilter={true}
        />
      </div>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />
    </main>
  );
}
