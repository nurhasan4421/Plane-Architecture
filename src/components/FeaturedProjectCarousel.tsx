"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { Project } from "@/types/project";

interface FeaturedProjectCarouselProps {
  projects: Project[];
}

export default function FeaturedProjectCarousel({ projects }: FeaturedProjectCarouselProps) {
  const slides = projects.slice(0, 5);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  useEffect(() => {
    if (isPaused || isInteracting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % slides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [isInteracting, isPaused, slides.length]);

  if (slides.length === 0) return null;

  const activeProject = slides[activeIndex];
  const goToPrevious = () => setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  const goToNext = () => setActiveIndex((index) => (index + 1) % slides.length);

  return (
    <section
      aria-label="Featured projects"
      aria-roledescription="carousel"
      className="relative isolate h-svh min-h-[620px] w-full overflow-hidden bg-black font-body"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onFocusCapture={() => setIsInteracting(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsInteracting(false);
        }
      }}
    >
      <div className="absolute inset-0">
        {slides.map((project, index) => {
          const isActive = index === activeIndex;
          return (
            <Link
              key={project.id}
              href={`/projects/${project.slug}`}
              aria-label={`View featured project: ${project.title}`}
              aria-hidden={!isActive}
              tabIndex={isActive ? 0 : -1}
              className={`group absolute inset-0 block transition-opacity duration-1000 ease-in-out ${
                isActive ? "z-10 opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <img
                src={project.heroImage}
                alt={project.title}
                fetchPriority={isActive ? "high" : "auto"}
                className="h-full w-full object-cover opacity-75 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.02]"
              />
            </Link>
          );
        })}
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-black/5" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[90%] bg-gradient-to-t from-black via-black/85 to-transparent" />

      <div
        key={`content-${activeProject.id}`}
        className="featured-project-enter absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full flex-col gap-8 px-5 pb-7 pt-32 text-white sm:px-8 sm:pb-10 lg:w-[80%] lg:flex-row lg:items-end lg:justify-between lg:px-0 lg:pb-14"
      >
        <div className="max-w-5xl">
          <p className="mb-3 text-xs uppercase tracking-[0.18em] text-white drop-shadow-md sm:text-sm">
            <span className="sm:hidden">{activeProject.category} / {activeProject.location}</span>
            <span className="hidden sm:inline">{activeProject.category} / {activeProject.typology} / {activeProject.year} / {activeProject.location}</span>
          </p>
          <Link href={`/projects/${activeProject.slug}`} className="pointer-events-auto group/title inline-block">
            <h1 className="font-display text-3xl font-normal leading-[0.98] text-white drop-shadow-lg transition-opacity group-hover/title:opacity-75 sm:text-4xl md:text-5xl lg:text-7xl xl:text-[96px]">
              {activeProject.title}
            </h1>
          </Link>
          <p className="mt-4 hidden max-w-2xl text-sm leading-6 text-white drop-shadow-md sm:block sm:text-base sm:leading-7">
            {activeProject.description}
          </p>
        </div>

        <div className="pointer-events-auto flex shrink-0 items-center justify-between gap-4 lg:flex-col lg:items-end">
          <div className="flex items-center gap-2" aria-label={`Slide ${activeIndex + 1} of ${slides.length}`}>
            {slides.map((project, index) => (
              <button
                key={project.id}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-label={`Show featured project ${index + 1}: ${project.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "w-8 bg-white" : "w-2.5 bg-white/50 hover:bg-white"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous featured project"
              className="flex h-11 w-11 items-center justify-center bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next featured project"
              className="flex h-11 w-11 items-center justify-center bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPaused((paused) => !paused)}
              aria-label={isPaused ? "Play featured projects" : "Pause featured projects"}
              aria-pressed={isPaused}
              className="flex h-11 w-11 items-center justify-center bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}