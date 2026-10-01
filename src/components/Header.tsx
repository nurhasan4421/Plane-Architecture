"use client";

import React, { useRef, useState } from "react";
import PlaneLogo from "./PlaneLogo";
import NavigationDrawer from "./NavigationDrawer";
import { CATEGORIES_CONFIG } from "@/lib/projects-data";
import { useSiteContent } from "./SiteContentProvider";

interface HeaderProps {
  activeCategory?: string;
  activeSubcategory?: string;
  onSelectCategory?: (category: string, subcategory?: string) => void;
}

export default function Header({
  activeCategory = "architecture",
  activeSubcategory,
  onSelectCategory,
}: HeaderProps) {
  const { settings, projects } = useSiteContent();
  const categories = settings.categories.length ? settings.categories : CATEGORIES_CONFIG;
  const getProjectCount = (categoryId: string, subcategoryId: string) => projects.filter((project) => {
    if (project.isPublished === false || (categoryId !== "all" && project.category !== categoryId)) return false;
    if (subcategoryId === "all") return true;
    return project.subcategory.toLowerCase().includes(subcategoryId.toLowerCase()) ||
      project.typology.toLowerCase().includes(subcategoryId.toLowerCase());
  }).length;
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(activeCategory);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [submenuOffset, setSubmenuOffset] = useState(0);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const desktopBarRef = useRef<HTMLDivElement>(null);

  const hoveredConfig = categories.find((category) => category.id === hoveredCategory);
  const mobileSubcategories = mobileCategory === "all"
    ? [{ id: "all", label: "All projects", slug: "/" }]
    : (categories.find((category) => category.id === mobileCategory) || categories[0]).subcategories;
  const mobileConfig =
    categories.find((category) => category.id === mobileCategory) || categories[0];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 select-none border-b border-transparent bg-white/95 font-body backdrop-blur-xs"
      onMouseLeave={() => {
        setHoveredCategory(null);
        setIsLogoMenuOpen(false);
      }}
    >
      {/* Top Main Bar */}
      <div ref={desktopBarRef} className="relative mx-auto flex h-[58px] w-full max-w-[1600px] items-center justify-between px-5 sm:px-8 sm:h-[68px] lg:px-16 lg:h-[80px]">
        {/* Left: Logo & Menu trigger */}
        <div className="flex items-center gap-3">
          <div
            className="relative flex items-center"
            onMouseEnter={() => {
              if (window.matchMedia("(hover: hover)").matches) setIsLogoMenuOpen(true);
            }}
            onBlur={(event) => {
              const nextTarget = event.relatedTarget as HTMLElement | null;
              if (!nextTarget?.closest("[data-site-menu]")) {
                setIsLogoMenuOpen(false);
              }
            }}
          >
            <PlaneLogo
              onClick={() => setIsLogoMenuOpen(false)}
              className="p-0"
              imageClassName="h-[40px] sm:h-[48px] lg:h-[58px]"
            />
          </div>
        </div>

        <NavigationDrawer isOpen={isLogoMenuOpen} onClose={() => setIsLogoMenuOpen(false)} />

        {/* Center: Desktop Categories */}
        <nav
          className={`hidden lg:flex lg:flex-1 items-center ${categories.length <= 2 ? "justify-end" : "justify-center"} gap-7 xl:gap-10 text-sm xl:text-base tracking-[0.12em] uppercase font-medium text-[#6b6b6b]`}
        >
          <button
            type="button"
            onMouseEnter={() => setHoveredCategory(null)}
            onClick={() => {
              setHoveredCategory(null);
              onSelectCategory?.("all");
            }}
            className={`py-2 px-1 uppercase transition-colors duration-150 ${activeCategory === "all" ? "font-semibold text-black" : "hover:text-black"}`}
          >
            All Projects
          </button>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onMouseEnter={(event) => {
                  setHoveredCategory(cat.id);
                  setIsLogoMenuOpen(false);
                  const bar = desktopBarRef.current;
                  if (bar) {
                    const barStyle = getComputedStyle(bar);
                    const contentLeft = bar.getBoundingClientRect().left + parseFloat(barStyle.paddingLeft);
                    setSubmenuOffset(Math.max(0, event.currentTarget.getBoundingClientRect().left - contentLeft));
                  }
                }}
                onFocus={() => setIsLogoMenuOpen(false)}
                onClick={() => onSelectCategory?.(cat.id)}
                className={`py-2 px-1 uppercase transition-colors duration-150 cursor-pointer ${
                  isActive || hoveredCategory === cat.id
                    ? "text-black font-semibold"
                    : "hover:text-black"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Mobile Filter trigger */}
        <div className="flex items-center gap-4">
          {/* Mobile Filter Button */}
          <button
            onClick={() => {
              setIsMobileFilterOpen((open) => !open);
              setIsLogoMenuOpen(false);
            }}
            className="lg:hidden p-2 text-black cursor-pointer focus:outline-none"
            aria-label="Filter Categories"
          >
            <div className="flex flex-col items-end gap-1">
              <div className="w-5 h-[2px] bg-black" />
              <div className="w-4 h-[2px] bg-black" />
              <div className="w-3 h-[2px] bg-black" />
            </div>
          </button>
        </div>
      </div>

      <div
        aria-hidden={!hoveredConfig}
        inert={!hoveredConfig}
        className={`absolute left-1/2 right-auto top-full z-40 w-screen -translate-x-1/2 overflow-hidden bg-white shadow-lg transition-[max-height,opacity,transform] duration-500 ease-out ${
          hoveredConfig
            ? "max-h-[520px] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-16">
          <nav
            aria-label={`${hoveredConfig?.label || "Project"} subcategories`}
            className="flex w-full flex-col items-start justify-center gap-3 py-7 text-base uppercase tracking-wider text-neutral-600 xl:text-lg"
            style={{ paddingLeft: `${submenuOffset}px` }}
          >
            {hoveredConfig?.subcategories.map((subcategory) => {
              const isActive = activeCategory === hoveredConfig.id && (
                subcategory.id === "all"
                  ? !activeSubcategory
                  : activeSubcategory === subcategory.id
              );
              const isHighlighted = isActive || hoveredSubcategory === subcategory.id;

              return (
              <button
                key={subcategory.id}
                type="button"
                aria-pressed={isActive}
                onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                onMouseLeave={() => setHoveredSubcategory(null)}
                onFocus={() => setHoveredSubcategory(subcategory.id)}
                onClick={() =>
                  onSelectCategory?.(
                    hoveredConfig.id,
                    subcategory.id === "all" ? undefined : subcategory.id,
                  )
                }
                className={`flex w-full items-center justify-between py-1 pr-5 uppercase transition-colors duration-150 ${isHighlighted ? "font-semibold text-black" : "text-neutral-600"}`}
              >
                <span>{subcategory.label}</span>
                <span className="ml-8 text-xs tabular-nums text-neutral-400">{getProjectCount(hoveredConfig.id, subcategory.id)}</span>
              </button>
              );
            })}
          </nav>
        </div>
      </div>

      {isMobileFilterOpen && (
        <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] border-t border-neutral-200 bg-white shadow-lg lg:hidden">
          <nav aria-label="Project categories" className="max-h-[min(70vh,480px)] overflow-y-auto border-r border-neutral-200 py-2">
            <button
              type="button"
              aria-pressed={mobileCategory === "all"}
              onClick={() => setMobileCategory("all")}
              className={`block w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition-colors sm:px-6 sm:text-sm ${
                mobileCategory === "all"
                  ? "bg-black text-white"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
              }`}
            >
              All Projects
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={mobileCategory === category.id}
                onClick={() => setMobileCategory(category.id)}
                className={`block w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition-colors sm:px-6 sm:text-sm ${
                  mobileCategory === category.id
                    ? "bg-black text-white"
                    : "text-neutral-600 hover:bg-neutral-100 hover:text-black"
                }`}
              >
                {category.label}
              </button>
            ))}
          </nav>
          <nav
            aria-label={mobileCategory === "all" ? "All projects" : `${mobileConfig.label} subcategories`}
            className="max-h-[min(70vh,480px)] overflow-y-auto px-4 py-3 sm:px-6"
          >
            <p className="mb-2 text-[10px] uppercase tracking-[0.16em] text-neutral-400">
              {mobileCategory === "all" ? "All Projects" : mobileConfig.label}
            </p>
            <div className="flex flex-col">
              {mobileSubcategories.map((subcategory) => {
                const isActive = activeCategory === mobileCategory && (
                  subcategory.id === "all"
                    ? !activeSubcategory
                    : activeSubcategory === subcategory.id
                );
                const isHighlighted = isActive || hoveredSubcategory === subcategory.id;

                return (
                <button
                  key={subcategory.id}
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                  onMouseLeave={() => setHoveredSubcategory(null)}
                  onFocus={() => setHoveredSubcategory(subcategory.id)}
                  onClick={() => {
                    onSelectCategory?.(
                      mobileCategory,
                      subcategory.id === "all" ? undefined : subcategory.id,
                    );
                    setIsMobileFilterOpen(false);
                  }}
                  className={`flex items-center justify-between py-3 text-left text-xs uppercase tracking-wide transition-colors sm:text-sm ${isHighlighted ? "font-semibold text-black" : "text-neutral-600"}`}
                >
                  <span>{subcategory.label}</span>
                  <span className="ml-4 text-xs tabular-nums text-neutral-400">{getProjectCount(mobileCategory, subcategory.id)}</span>
                </button>
                );
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
