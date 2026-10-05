"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PlaneLogo from "./PlaneLogo";
import NavigationDrawer from "./NavigationDrawer";
import ThemeToggle from "./ThemeToggle";
import { CATEGORIES_CONFIG } from "@/lib/projects-data";
import { useSiteContent } from "./SiteContentProvider";

interface HeaderProps {
  activeCategory?: string;
  activeSubcategory?: string;
  onSelectCategory?: (category: string, subcategory?: string) => void;
}

const filterSubcategories = (subs: Array<{ id: string; label: string; slug?: string }>) => {
  return (subs || []).filter(
    (sub) => sub.id.toLowerCase() !== "all" && sub.label.toLowerCase() !== "view all"
  );
};

export default function Header({
  activeCategory = "architecture",
  activeSubcategory,
  onSelectCategory,
}: HeaderProps) {
  const router = useRouter();
  const { settings, projects } = useSiteContent();
  const categories = settings.categories.length ? settings.categories : CATEGORIES_CONFIG;
  const getProjectCount = (categoryId: string, subcategoryId: string) => projects.filter((project) => {
    if (project.isPublished === false || (categoryId !== "all" && project.category !== categoryId)) return false;
    if (subcategoryId === "all") return true;
    return project.subcategory.toLowerCase().includes(subcategoryId.toLowerCase()) ||
      project.typology.toLowerCase().includes(subcategoryId.toLowerCase());
  }).length;

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mobileCategory, setMobileCategory] = useState(activeCategory === "all" ? (categories[0]?.id || "architecture") : activeCategory);
  const [isLogoMenuOpen, setIsLogoMenuOpen] = useState(false);
  const [submenuOffset, setSubmenuOffset] = useState(0);
  const [hoveredSubcategory, setHoveredSubcategory] = useState<string | null>(null);
  const desktopBarRef = useRef<HTMLDivElement>(null);

  const hoveredConfig = categories.find((category) => category.id === hoveredCategory);
  const hoveredSubcategories = hoveredConfig ? filterSubcategories(hoveredConfig.subcategories) : [];

  const mobileConfig =
    categories.find((category) => category.id === mobileCategory) || categories[0];
  const mobileSubcategories = mobileConfig ? filterSubcategories(mobileConfig.subcategories) : [];

  const handleHamburgerClick = () => {
    setIsMobileNavOpen((prev) => !prev);
    setIsLogoMenuOpen(false);
  };

  const handleCategoryClick = (categoryId: string) => {
    setHoveredCategory(null);
    setHoveredSubcategory(null);
    setIsMobileNavOpen(false);

    if (onSelectCategory) {
      onSelectCategory(categoryId, undefined);
    } else {
      router.push(`/?category=${encodeURIComponent(categoryId)}`);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string) => {
    setHoveredCategory(null);
    setHoveredSubcategory(null);
    setIsMobileNavOpen(false);

    if (onSelectCategory) {
      onSelectCategory(categoryId, subcategoryId);
    } else {
      router.push(`/?category=${encodeURIComponent(categoryId)}&type=${encodeURIComponent(subcategoryId)}`);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-30 select-none border-b border-transparent bg-white/95 dark:bg-[#303030]/95 dark:border-white/10 font-body backdrop-blur-xs transition-colors duration-200"
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
              setHoveredCategory(null);
              if (window.matchMedia("(hover: hover)").matches) setIsLogoMenuOpen(true);
            }}
            onFocus={() => {
              setHoveredCategory(null);
              setIsLogoMenuOpen(true);
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
          className={`hidden lg:flex lg:flex-1 items-center ${categories.length <= 2 ? "justify-end" : "justify-center"} gap-7 xl:gap-10 text-sm xl:text-base tracking-[0.12em] uppercase font-medium text-[#6b6b6b] dark:text-[#a0a0a0]`}
        >
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
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
                onClick={() => handleCategoryClick(cat.id)}
                className={`py-2 px-1 uppercase transition-colors duration-150 cursor-pointer ${
                  isActive || hoveredCategory === cat.id
                    ? "text-black dark:text-white font-semibold"
                    : "hover:text-black dark:hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Theme Toggle + Start Project CTA (Desktop) + Hamburger (Mobile) */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />

          {/* Desktop: Start Project CTA */}
          <Link
            href="/start-project"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] bg-black dark:bg-white text-white dark:text-black transition-all duration-200 hover:bg-[#294b3d] dark:hover:bg-neutral-200 active:scale-[0.97]"
          >
            Start Project
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={handleHamburgerClick}
            className="lg:hidden p-2 text-black dark:text-white cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation"
            aria-expanded={isMobileNavOpen}
          >
            <div className="flex flex-col items-end gap-1">
              <div className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileNavOpen ? "w-5 rotate-45 translate-y-[6px]" : "w-5"}`} />
              <div className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileNavOpen ? "w-0 opacity-0" : "w-4"}`} />
              <div className={`h-[2px] bg-black dark:bg-white transition-all duration-300 ${isMobileNavOpen ? "w-5 -rotate-45 -translate-y-[6px]" : "w-3"}`} />
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Subcategory Dropdown */}
      <div
        aria-hidden={!hoveredConfig || isLogoMenuOpen}
        inert={!hoveredConfig || isLogoMenuOpen}
        className={`absolute left-1/2 right-auto top-full z-40 w-screen -translate-x-1/2 overflow-hidden bg-white dark:bg-[#282828] dark:border-b dark:border-white/10 shadow-lg dark:shadow-2xl transition-[max-height,opacity,transform] duration-500 ease-out ${
          hoveredConfig && !isLogoMenuOpen
            ? "max-h-[520px] translate-y-0 opacity-100"
            : "pointer-events-none max-h-0 -translate-y-3 opacity-0"
        }`}
      >
        <div className="mx-auto w-full max-w-[1600px] px-5 sm:px-8 lg:px-16">
          <nav
            aria-label={`${hoveredConfig?.label || "Project"} subcategories`}
            className="flex w-full flex-col items-start justify-center gap-3 py-7 text-base uppercase tracking-wider text-neutral-600 dark:text-neutral-400 xl:text-lg"
            style={{ paddingLeft: `${submenuOffset}px` }}
          >
            {hoveredSubcategories.map((subcategory) => {
              const isActive = activeCategory === hoveredConfig?.id && activeSubcategory === subcategory.id;
              const isHighlighted = isActive || hoveredSubcategory === subcategory.id;

              return (
                <button
                  key={subcategory.id}
                  type="button"
                  aria-pressed={isActive}
                  onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                  onMouseLeave={() => setHoveredSubcategory(null)}
                  onFocus={() => setHoveredSubcategory(subcategory.id)}
                  onClick={() => handleSubcategoryClick(hoveredConfig!.id, subcategory.id)}
                  className={`flex w-full items-center justify-between py-1 pr-5 uppercase transition-colors duration-150 cursor-pointer ${isHighlighted ? "font-semibold text-black dark:text-white" : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"}`}
                >
                  <span>{subcategory.label}</span>
                  <span className="ml-8 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">{getProjectCount(hoveredConfig!.id, subcategory.id)}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Mobile Menu (Hamburger open: Horizontal panel first, then Category/Subcategory menus, then CTA below) */}
      {isMobileNavOpen && (
        <div className="lg:hidden border-t border-neutral-200 dark:border-white/10 bg-white dark:bg-[#282828] shadow-2xl animate-in fade-in slide-in-from-top-1 duration-200">
          {/* 1. Horizontal Panel: News, FAQ, Contact, About */}
          <div className="border-b border-neutral-200 dark:border-white/10 bg-neutral-50/50 dark:bg-neutral-900/30">
            <nav aria-label="Mobile site navigation" className="flex items-center justify-center gap-1 px-3 py-2.5 sm:gap-2 sm:px-6">
              {[
                { label: "Awards", href: "/awards" },
                { label: "News", href: "/news" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQ", href: "/contact#faq" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileNavOpen(false)}
                  className="flex-1 text-center py-2 px-1 text-xs font-medium uppercase tracking-[0.12em] text-neutral-700 dark:text-neutral-300 transition-colors hover:text-black dark:hover:text-white hover:bg-neutral-200/60 dark:hover:bg-neutral-800 active:bg-neutral-300 dark:active:bg-neutral-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* 2. Middle: Navbar Menus & Submenu */}
          <div className="grid grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
            <nav aria-label="Project categories" className="max-h-[min(60vh,420px)] overflow-y-auto border-r border-neutral-200 dark:border-white/10 py-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={mobileCategory === category.id}
                  onClick={() => setMobileCategory(category.id)}
                  className={`block w-full px-4 py-3 text-left text-xs font-medium uppercase tracking-wide transition-colors sm:px-6 sm:text-sm ${
                    mobileCategory === category.id
                      ? "bg-black dark:bg-white text-white dark:text-black"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white"
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </nav>
            <nav
              aria-label={`${mobileConfig.label} subcategories`}
              className="max-h-[min(60vh,420px)] overflow-y-auto px-4 py-3 sm:px-6"
            >
              <div className="mb-2 flex items-center justify-between border-b border-neutral-100 dark:border-white/10 pb-2">
                <button
                  type="button"
                  onClick={() => handleCategoryClick(mobileCategory)}
                  className="text-left text-xs font-semibold uppercase tracking-[0.14em] text-black dark:text-white hover:underline cursor-pointer"
                >
                  All {mobileConfig.label} →
                </button>
                <span className="text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                  {getProjectCount(mobileCategory, "all")}
                </span>
              </div>
              <div className="flex flex-col">
                {mobileSubcategories.map((subcategory) => {
                  const isActive = activeCategory === mobileCategory && activeSubcategory === subcategory.id;
                  const isHighlighted = isActive || hoveredSubcategory === subcategory.id;

                  return (
                    <button
                      key={subcategory.id}
                      type="button"
                      aria-pressed={isActive}
                      onMouseEnter={() => setHoveredSubcategory(subcategory.id)}
                      onMouseLeave={() => setHoveredSubcategory(null)}
                      onFocus={() => setHoveredSubcategory(subcategory.id)}
                      onClick={() => handleSubcategoryClick(mobileCategory, subcategory.id)}
                      className={`flex items-center justify-between py-3 text-left text-xs uppercase tracking-wide transition-colors cursor-pointer sm:text-sm ${
                        isHighlighted
                          ? "font-semibold text-black dark:text-white"
                          : "text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                      }`}
                    >
                      <span>{subcategory.label}</span>
                      <span className="ml-4 text-xs tabular-nums text-neutral-400 dark:text-neutral-500">
                        {getProjectCount(mobileCategory, subcategory.id)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>
          </div>

        </div>
      )}
    </header>
  );
}
