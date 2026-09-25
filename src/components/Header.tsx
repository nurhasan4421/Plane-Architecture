"use client";

import React, { useState } from "react";
import PlaneLogo from "./PlaneLogo";
import { CATEGORIES_CONFIG } from "@/lib/projects-data";

interface HeaderProps {
  onToggleDrawer: () => void;
  isDrawerOpen: boolean;
  activeCategory?: string;
  onSelectCategory?: (category: string, subcategory?: string) => void;
  scale?: number;
  onScaleChange?: (scale: number) => void;
}

export default function Header({
  onToggleDrawer,
  isDrawerOpen,
  activeCategory = "architecture",
  onSelectCategory,
  scale = 1,
  onScaleChange,
}: HeaderProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const currentCategory = hoveredCategory || activeCategory;
  const activeConfig =
    CATEGORIES_CONFIG.find((c) => c.id === currentCategory) || CATEGORIES_CONFIG[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xs border-b border-transparent select-none font-body">
      {/* Top Main Bar */}
      <div className="relative flex items-center justify-between h-[46px] md:h-[50px] px-4 md:px-8 lg:px-10">
        {/* Left: Logo & Menu trigger */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDrawer}
            className="flex items-center gap-2 p-1 cursor-pointer focus:outline-none"
            aria-label="Toggle Navigation Menu"
            title="Menu"
          >
            <PlaneLogo />
          </button>
        </div>

        {/* Center: Desktop Categories */}
        <nav
          className="hidden lg:flex items-center justify-center gap-6 xl:gap-10 text-[12px] xl:text-[13px] tracking-widest uppercase font-medium text-[#6b6b6b]"
          onMouseLeave={() => setHoveredCategory(null)}
        >
          {CATEGORIES_CONFIG.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onMouseEnter={() => setHoveredCategory(cat.id)}
                onClick={() => onSelectCategory?.(cat.id)}
                className={`py-2 px-1 transition-colors duration-150 cursor-pointer ${
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

        {/* Right: Scale Slider & Mobile Filter trigger */}
        <div className="flex items-center gap-4">
          {/* Desktop Scale Controls */}
          {onScaleChange && (
            <div className="hidden md:flex items-center gap-2 text-[11px] text-[#797979] uppercase tracking-wider">
              <span className="text-[10px]">Scale</span>
              <div className="flex items-center gap-1.5 bg-neutral-100 rounded-xs p-0.5">
                <button
                  onClick={() => onScaleChange(0.6)}
                  className={`px-2 py-0.5 text-[10px] rounded-xs cursor-pointer transition-colors ${
                    scale === 0.6 ? "bg-black text-white" : "hover:text-black"
                  }`}
                  title="Compact Grid"
                >
                  S
                </button>
                <button
                  onClick={() => onScaleChange(0.75)}
                  className={`px-2 py-0.5 text-[10px] rounded-xs cursor-pointer transition-colors ${
                    scale === 0.75 ? "bg-black text-white" : "hover:text-black"
                  }`}
                  title="Medium View"
                >
                  M
                </button>
                <button
                  onClick={() => onScaleChange(1)}
                  className={`px-2 py-0.5 text-[10px] rounded-xs cursor-pointer transition-colors ${
                    scale === 1 ? "bg-black text-white" : "hover:text-black"
                  }`}
                  title="Full Hero View"
                >
                  L
                </button>
              </div>
            </div>
          )}

          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="lg:hidden p-2 text-black cursor-pointer focus:outline-none"
            aria-label="Filter Categories"
          >
            <div className="flex flex-col items-end gap-1">
              <div className="w-4 h-[1.5px] bg-black" />
              <div className="w-3 h-[1.5px] bg-black" />
              <div className="w-2 h-[1.5px] bg-black" />
            </div>
          </button>
        </div>
      </div>

      {/* Desktop Subcategory Bar */}
      <div
        className="hidden lg:flex items-center justify-center gap-5 xl:gap-8 py-1.5 px-4 bg-white/95 border-t border-neutral-100/60 text-[11px] xl:text-[12px] tracking-wider uppercase text-[#797979] transition-all duration-200"
        onMouseEnter={() => setHoveredCategory(currentCategory)}
        onMouseLeave={() => setHoveredCategory(null)}
      >
        {activeConfig.subcategories.map((sub) => (
          <button
            key={sub.id}
            onClick={() =>
              onSelectCategory?.(activeConfig.id, sub.id === "all" ? undefined : sub.id)
            }
            className="hover:text-black transition-colors duration-150 py-0.5 cursor-pointer"
          >
            {sub.label}
          </button>
        ))}
      </div>

      {/* Mobile Categories Slide-down */}
      {isMobileFilterOpen && (
        <div className="lg:hidden bg-white border-t border-neutral-200 px-6 py-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col gap-3">
            {CATEGORIES_CONFIG.map((cat) => (
              <div key={cat.id} className="border-b border-neutral-100 pb-2">
                <button
                  onClick={() => {
                    onSelectCategory?.(cat.id);
                    setIsMobileFilterOpen(false);
                  }}
                  className={`text-[12px] tracking-widest uppercase font-semibold ${
                    activeCategory === cat.id ? "text-black" : "text-neutral-500"
                  }`}
                >
                  {cat.label}
                </button>
                <div className="flex flex-wrap gap-2 mt-2">
                  {cat.subcategories.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => {
                        onSelectCategory?.(cat.id, sub.id === "all" ? undefined : sub.id);
                        setIsMobileFilterOpen(false);
                      }}
                      className="text-[10px] uppercase text-neutral-600 bg-neutral-100 px-2 py-1 rounded-xs"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
