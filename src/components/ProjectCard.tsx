"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";

interface ProjectCardProps {
  project: Project;
  scale?: number;
}

export default function ProjectCard({ project, scale = 1 }: ProjectCardProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="project-item relative select-none w-full flex justify-center mb-8 md:mb-14 lg:mb-20 font-body">
      <div className="relative flex flex-col md:flex-row items-start">
        {/* Project Metadata + Icon (Left-aligned on desktop) */}
        <div className="order-2 md:order-1 mt-3 md:mt-0 md:absolute md:top-0 md:-left-8 lg:-left-12 md:-translate-x-full flex md:flex-col items-center md:items-end text-left md:text-right w-full md:w-[260px] lg:w-[320px] shrink-0 z-10">
          {/* Black Square Project Glyphs / Monogram */}
          <div className="w-[36px] h-[36px] md:w-[44px] md:h-[44px] lg:w-[50px] lg:h-[50px] bg-black text-white flex items-center justify-center p-2 shrink-0 transition-transform duration-300 hover:scale-105">
            {project.iconSvg ? (
              <div
                className="w-full h-full flex items-center justify-center"
                dangerouslySetInnerHTML={{ __html: project.iconSvg }}
              />
            ) : (
              <span className="font-display text-[11px] font-bold tracking-tighter uppercase">
                {project.title.slice(0, 3)}
              </span>
            )}
          </div>

          {/* Title & Location */}
          <div className="ml-3 md:ml-0 md:mt-4 lg:mt-5">
            <Link href={`/projects/${project.slug}`}>
              <h3 className="font-display text-[16px] sm:text-[17px] md:text-[18px] lg:text-[21px] leading-snug font-normal text-black hover:opacity-75 transition-opacity">
                {project.title}
              </h3>
            </Link>
            <p className="font-body text-[11px] md:text-[12px] lg:text-[13px] text-[#797979] uppercase tracking-wider mt-0.5 md:mt-1 font-light">
              {project.location}
            </p>
            <div className="hidden lg:flex items-center gap-2 justify-end mt-1 text-[11px] text-[#a0a0a0] uppercase font-body">
              <span>{project.typology}</span>
              <span>•</span>
              <span>{project.year}</span>
            </div>
          </div>
        </div>

        {/* Project Hero Image */}
        <div className="order-1 md:order-2 relative flex flex-col group">
          <Link
            href={`/projects/${project.slug}`}
            className="block relative overflow-hidden bg-neutral-100 cursor-pointer"
            style={{
              aspectRatio: project.aspectRatio || "16 / 9",
              width:
                scale === 1
                  ? "min(90vw, 68vh)"
                  : scale === 0.75
                  ? "min(75vw, 50vh)"
                  : "min(60vw, 38vh)",
              maxHeight: "74vh",
            }}
          >
            {/* Subtle skeleton placeholder */}
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
              className="relative w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.015]"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
