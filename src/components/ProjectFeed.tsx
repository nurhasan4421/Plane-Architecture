"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, Shuffle, Star } from "lucide-react";
import ProjectCard from "./ProjectCard";
import { Project, ProjectTestimonial } from "@/types/project";

interface ProjectFeedProps {
  projects: Project[];
  testimonials: ProjectTestimonial[];
  activeCategory: string;
  activeSubcategory?: string;
  initialSort?: "default" | "random" | "latest" | "oldest";
  showSortFilter?: boolean;
}

const PROJECTS_PER_BATCH = 30;

function ClientTestimonials({ projects, managedTestimonials }: { projects: Project[]; managedTestimonials: ProjectTestimonial[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [hasEntered, setHasEntered] = useState(false);
  const [randomProjects, setRandomProjects] = useState<Project[]>([]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const projectsWithQuotes = useMemo(
    () => projects.filter((project) => project.quote),
    [projects],
  );
  const latestProjects = useMemo(
    () => projectsWithQuotes.slice(-3).reverse(),
    [projectsWithQuotes],
  );
  const randomCandidates = useMemo(() => {
    const latestIds = new Set(latestProjects.map((project) => project.id));
    return projectsWithQuotes.filter((project) => !latestIds.has(project.id));
  }, [latestProjects, projectsWithQuotes]);

  useEffect(() => {
    const shuffled = [...randomCandidates];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [shuffled[index], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[index]];
    }
    const timeout = window.setTimeout(() => {
      setRandomProjects(shuffled.slice(0, 3));
    }, 0);
    return () => window.clearTimeout(timeout);
  }, [randomCandidates]);

  const fallbackTestimonials = [...randomProjects, ...latestProjects].slice(0, 6).map((project) => ({
    id: project.id,
    projectSlug: project.slug,
    projectTitle: project.title,
    quote: project.quote || "",
    author: project.quoteAuthor || "Plane Architect",
    role: project.quoteAuthorRole || "",
    rating: 5,
  }));
  const testimonials = managedTestimonials.length
    ? managedTestimonials.slice(0, 6).map((item) => ({
        ...item,
        projectTitle: projects.find((project) => project.slug === item.projectSlug)?.title || "Plane Architect",
      }))
    : fallbackTestimonials;

  const scrollTestimonials = (direction: -1 | 1) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction * scrollRef.current.clientWidth * 0.8,
      behavior: "smooth",
    });
  };

  if (testimonials.length === 0) return null;

  return (
    <section
      ref={containerRef}
      aria-labelledby="client-testimonials"
      style={{
        transitionDuration: "1000ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`border-t border-neutral-200 dark:border-neutral-800 pt-6 sm:pt-8 will-change-[transform,opacity] transition-[opacity,transform] ${
        hasEntered ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
      }`}
    >
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="mb-1 text-[9px] uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500">Testimonials</p>
          <h2 id="client-testimonials" className="font-display text-xl sm:text-2xl font-normal text-black dark:text-white">
            What Our Clients Say
          </h2>
        </div>
        <div className="hidden sm:flex shrink-0 gap-1.5">
          <button
            type="button"
            onClick={() => scrollTestimonials(-1)}
            aria-label="Previous testimonials"
            className="flex h-8 w-8 items-center justify-center border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#383838] text-black dark:text-white transition-colors hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-[#404040] cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollTestimonials(1)}
            aria-label="Next testimonials"
            className="flex h-8 w-8 items-center justify-center border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#383838] text-black dark:text-white transition-colors hover:border-black dark:hover:border-white hover:bg-neutral-50 dark:hover:bg-[#404040] cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
      <div
        ref={scrollRef}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((item) => {
          const card = (
            <>
              <div>
                <div className="mb-2 flex gap-0.5" aria-label={`${item.rating} out of 5 stars`}>
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star key={index} className={`h-3 w-3 ${index < item.rating ? "fill-current text-[#b18342]" : "text-neutral-200 dark:text-neutral-700"}`} />
                  ))}
                </div>
                <blockquote className="font-display text-xs sm:text-sm leading-relaxed text-neutral-800 dark:text-neutral-200 line-clamp-3">
                  &ldquo;{item.quote}&rdquo;
                </blockquote>
              </div>
              <div className="mt-3 border-t border-neutral-100 dark:border-white/10 pt-2.5">
                <p className="text-xs font-semibold text-black dark:text-white">{item.author}</p>
                {item.role && <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{item.role}</p>}
                <p className="mt-0.5 text-[10px] text-neutral-400 dark:text-neutral-500 truncate">{item.projectTitle}</p>
              </div>
            </>
          );
          const className = "group flex w-[75%] max-w-[280px] shrink-0 snap-start flex-col justify-between border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#383838] p-3.5 sm:p-4 transition-colors hover:border-neutral-500 dark:hover:border-neutral-400 sm:w-[260px] lg:w-[280px]";
          return item.projectSlug ? (
            <Link key={item.id} href={`/projects/${item.projectSlug}`} scroll={false} className={className}>{card}</Link>
          ) : (
            <article key={item.id} className={className}>{card}</article>
          );
        })}
      </div>
    </section>
  );
}

export default function ProjectFeed({
  projects,
  testimonials,
  activeCategory,
  activeSubcategory,
  initialSort = "default",
  showSortFilter = false,
}: ProjectFeedProps) {
  const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_BATCH);
  const [sortOrder, setSortOrder] = useState<"default" | "random" | "latest" | "oldest">(initialSort);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [randomSeed, setRandomSeed] = useState(1);

  const baseProjects = useMemo(() => {
    return projects.filter((project) => {
      if (activeCategory && activeCategory !== "all") {
        if (project.category.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }
      if (activeSubcategory && activeSubcategory !== "all") {
        const matchesTypology =
          project.typology.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
          project.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase());
        if (!matchesTypology) return false;
      }
      return true;
    });
  }, [projects, activeCategory, activeSubcategory]);

  const filteredProjects = useMemo(() => {
    const list = [...baseProjects];
    if (sortOrder === "random") {
      // Deterministic shuffle with seed so it doesn't flicker on every render
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.sin(i * 9999 + randomSeed) * 10000) % (i + 1);
        const index = Math.abs(j);
        [list[i], list[index]] = [list[index], list[i]];
      }
      return list;
    }
    if (sortOrder === "latest") {
      return list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (parseInt(a.year, 10) || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (parseInt(b.year, 10) || 0);
        return timeB - timeA;
      });
    }
    if (sortOrder === "oldest") {
      return list.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : (parseInt(a.year, 10) || 0);
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : (parseInt(b.year, 10) || 0);
        return timeA - timeB;
      });
    }
    return list;
  }, [baseProjects, sortOrder, randomSeed]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);
  const hasMoreProjects = visibleProjects.length < filteredProjects.length;

  return (
    <div className="w-full px-5 pb-24 pt-10 sm:px-8 lg:px-16">
      {/* Filter bar: hidden on mobile per user requirements, desktop shows clean filter icon with floating popover */}
      {showSortFilter && (
        <div className="mx-auto mb-8 hidden sm:flex max-w-[1600px] items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <p className="text-xs uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-500">
            {filteredProjects.length} {filteredProjects.length === 1 ? "project" : "projects"}
          </p>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsSortMenuOpen((open) => !open)}
              className="inline-flex h-8 w-8 items-center justify-center rounded-[4px] border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#383838] text-neutral-600 dark:text-neutral-300 transition hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white cursor-pointer shadow-xs"
              aria-label="Filter projects by order"
              title={`Filter: ${sortOrder === "random" ? "Random" : sortOrder === "latest" ? "Latest" : sortOrder === "oldest" ? "Oldest" : "Default"}`}
              aria-expanded={isSortMenuOpen}
            >
              <ArrowUpDown className="h-3.5 w-3.5" />
            </button>

            {isSortMenuOpen && (
              <div
                className="absolute right-0 top-full z-30 mt-2 w-44 rounded-[6px] border border-neutral-200 dark:border-white/10 bg-white/95 dark:bg-[#383838]/95 p-1 shadow-xl backdrop-blur-md font-body"
                onMouseLeave={() => setIsSortMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[9px] uppercase tracking-[0.16em] text-neutral-400 dark:text-neutral-400 font-medium border-b border-neutral-100 dark:border-white/10 mb-1">
                  Sort Projects
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("random");
                    setRandomSeed((s) => s + 1);
                    setIsSortMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-left text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${sortOrder === "random" ? "font-semibold text-black dark:text-white bg-neutral-50 dark:bg-neutral-800/80" : "text-neutral-600 dark:text-neutral-400"}`}
                >
                  <span>Random</span>
                  <Shuffle className="h-3 w-3 text-neutral-400" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("latest");
                    setIsSortMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-left text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${sortOrder === "latest" ? "font-semibold text-black dark:text-white bg-neutral-50 dark:bg-neutral-800/80" : "text-neutral-600 dark:text-neutral-400"}`}
                >
                  <span>Latest</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortOrder("oldest");
                    setIsSortMenuOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-[4px] px-3 py-2 text-left text-xs uppercase tracking-[0.12em] transition hover:bg-neutral-100 dark:hover:bg-neutral-800 ${sortOrder === "oldest" ? "font-semibold text-black dark:text-white bg-neutral-50 dark:bg-neutral-800/80" : "text-neutral-600 dark:text-neutral-400"}`}
                >
                  <span>Oldest</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {filteredProjects.length === 0 ? (
        <div className="py-24 text-center">
          <p className="text-sm uppercase tracking-widest text-[#797979] dark:text-neutral-400">
            No projects found in this category
          </p>
        </div>
      ) : (
        <div className="mx-auto grid w-full max-w-[1600px] grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-14 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
          {visibleProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      )}

      {hasMoreProjects && (
        <div className="mx-auto mt-16 flex max-w-[1600px] justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PROJECTS_PER_BATCH)}
            className="min-h-12 border border-neutral-400 dark:border-neutral-700 px-8 text-sm uppercase tracking-[0.14em] transition-colors hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black cursor-pointer text-black dark:text-white"
          >
            See more projects
          </button>
        </div>
      )}

      {filteredProjects.length > 0 && !hasMoreProjects && (
        <div className="mx-auto mt-20 w-full max-w-[1600px]">
          <ClientTestimonials projects={projects} managedTestimonials={testimonials} />
        </div>
      )}
    </div>
  );
}