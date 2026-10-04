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

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (!category || !settings.categories.some((item) => item.id === category)) return;

    const timeout = window.setTimeout(() => {
      setActiveCategory(category);
      setActiveSubcategory(undefined);
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [settings.categories]);

  const handleSelectCategory = (category: string, subcategory?: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  const showCarousel = settings.carouselEnabled && activeCategory === "all";

  return (
    <main className="min-h-screen bg-white dark:bg-[#0e0e0e] text-black dark:text-[#f5f5f5] flex flex-col justify-between transition-colors duration-200">
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
          key={`${activeCategory}:${activeSubcategory ?? "all"}:${settings.carouselEnabled ? "carousel" : "direct"}`}
          projects={projects}
          activeCategory={activeCategory}
          activeSubcategory={activeSubcategory}
          testimonials={testimonials}
          initialSort={!settings.carouselEnabled && activeCategory === "all" ? "random" : "default"}
          showSortFilter={!settings.carouselEnabled && activeCategory === "all"}
        />
      </div>

      {/* Footer */}
      <Footer onSelectCategory={handleSelectCategory} />
    </main>
  );
}
