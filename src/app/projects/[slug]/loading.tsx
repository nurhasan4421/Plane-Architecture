import React from "react";

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] transition-colors duration-200">
      {/* Top High-Precision Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[2.5px] w-full overflow-hidden bg-transparent">
        <div className="h-full bg-black dark:bg-white animate-progress-fast shadow-[0_0_8px_rgba(0,0,0,0.3)] dark:shadow-[0_0_8px_rgba(255,255,255,0.4)]" />
      </div>

      <div className="pt-[70px] lg:pt-[85px]">
        <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-10 px-5 pb-20 pt-6 sm:px-10 lg:px-16">
          {/* Category & Title Skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-28 bg-neutral-200 dark:bg-neutral-800 rounded-[2px] animate-pulse" />
            <div className="h-9 sm:h-12 w-2/3 max-w-lg bg-neutral-200 dark:bg-neutral-800 rounded-[2px] animate-pulse" />
          </div>

          {/* Hero Image Skeleton */}
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/50 dark:border-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/5 to-transparent animate-shimmer" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="h-6 w-6 border-2 border-black/20 dark:border-white/20 border-t-black dark:border-t-white rounded-full animate-spin" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 font-medium">
                Opening Project
              </span>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-3 pt-6 border-t border-neutral-100 dark:border-white/10">
            <div className="h-24 bg-neutral-100 dark:bg-neutral-900/60 rounded-[2px] animate-pulse" />
            <div className="h-24 bg-neutral-100 dark:bg-neutral-900/60 rounded-[2px] animate-pulse" />
            <div className="h-24 bg-neutral-100 dark:bg-neutral-900/60 rounded-[2px] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
