"use client";

import React, { useMemo } from "react";
import ProjectCard from "./ProjectCard";
import { Project } from "@/types/project";

interface ProjectFeedProps {
  projects: Project[];
  activeCategory: string;
  activeSubcategory?: string;
  scale?: number;
}

export default function ProjectFeed({
  projects,
  activeCategory,
  activeSubcategory,
  scale = 1,
}: ProjectFeedProps) {
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Category match
      if (activeCategory && activeCategory !== "all") {
        if (project.category.toLowerCase() !== activeCategory.toLowerCase()) {
          return false;
        }
      }
      // Subcategory / Typology match
      if (activeSubcategory && activeSubcategory !== "all") {
        const matchesTypology =
          project.typology.toLowerCase().includes(activeSubcategory.toLowerCase()) ||
          project.subcategory.toLowerCase().includes(activeSubcategory.toLowerCase());
        if (!matchesTypology) return false;
      }
      return true;
    });
  }, [projects, activeCategory, activeSubcategory]);

  return (
    <div className="projects-container w-full overflow-x-hidden pt-[90px] md:pt-[110px] pb-24">
      {/* Scaler matching big.dk projects-scaler */}
      <div
        className="projects-scaler flex min-h-screen flex-col items-center select-none transition-transform duration-500 ease-out"
        style={{
          transform: `scale(${scale === 1 ? 1 : scale === 0.75 ? 0.85 : 0.7})`,
          transformOrigin: "top center",
        }}
      >
        {filteredProjects.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-sm uppercase tracking-widest text-[#797979]">
              No projects found in this category
            </p>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} scale={scale} />
          ))
        )}
      </div>
    </div>
  );
}
