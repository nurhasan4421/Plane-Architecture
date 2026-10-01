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

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={cardRef}
      style={{ transitionDelay: `${(index % 3) * 70}ms` }}
      className={`group w-full font-body transform-gpu transition-[opacity,transform] duration-700 ease-out motion-reduce:translate-y-0 motion-reduce:opacity-100 motion-reduce:transition-none ${
        hasEntered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-neutral-100"
      >
        <div
          className={`absolute inset-0 bg-neutral-200 transition-opacity duration-700 ${
            isLoaded ? "opacity-0" : "opacity-100 animate-pulse"
          }`}
        />
        <img
          src={project.heroImage}
          alt={`${project.title} | Plane Architect`}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className="relative h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
        />
      </Link>

      <div className="pt-4">
        <Link href={`/projects/${project.slug}`} className="text-black hover:opacity-70">
          <h2 className="font-display text-lg font-normal leading-snug sm:text-xl">
            {project.title}
          </h2>
        </Link>
        <p className="mt-1 text-[11px] uppercase tracking-wider text-neutral-600">
          {project.typology} / {project.category} / {project.year}
        </p>
        <p className="mt-2 text-xs text-neutral-500">{project.location}</p>
      </div>
    </article>
  );
}
