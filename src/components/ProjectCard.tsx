"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Trigger entrance if already in viewport on mount, or observe on scroll
    const rect = card.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setHasEntered(true);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  const staggerDelay = (index % 3) * 110;

  return (
    <article
      ref={cardRef}
      style={{
        transitionDuration: "950ms",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: `${staggerDelay}ms`,
      }}
      className={`group w-full font-body will-change-[transform,opacity] transition-[opacity,transform,filter] motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        hasEntered
          ? "translate-y-0 opacity-100 scale-100 blur-none"
          : "translate-y-10 sm:translate-y-14 opacity-0 scale-[0.98] blur-[1px]"
      }`}
    >
      <Link
        href={`/projects/${project.slug}`}
        scroll={false}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900"
      >
        {/* Placeholder skeleton with subtle shimmer while image loads */}
        <div
          className={`absolute inset-0 bg-neutral-200/90 dark:bg-neutral-800/90 transition-opacity duration-700 ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 dark:via-white/10 to-transparent animate-shimmer" />
        </div>

        <img
          src={project.heroImage}
          alt={`${project.title} | Plane Architect`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`relative h-full w-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03] ${
            isLoaded
              ? "opacity-100 scale-100 blur-none"
              : "opacity-0 scale-[1.04] blur-xs"
          }`}
        />
      </Link>

      <div className="pt-4">
        <Link
          href={`/projects/${project.slug}`}
          scroll={false}
          className="text-black dark:text-white hover:opacity-70 transition-opacity"
        >
          <h2 className="font-display text-lg font-normal leading-snug sm:text-xl">
            {project.title}
          </h2>
        </Link>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
          {project.typology} / {project.category} / {project.year}
        </p>
        <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-500">{project.location}</p>
      </div>
    </article>
  );
}
