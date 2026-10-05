"use client";

import React from "react";
import Header from "@/components/Header";
import HorizontalProjectViewer from "@/components/HorizontalProjectViewer";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface ProjectDetailClientWrapperProps {
  project: Project;
  nextProject?: Project;
}

export default function ProjectDetailClientWrapper({
  project,
  nextProject,
}: ProjectDetailClientWrapperProps) {
  const router = useRouter();

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [project.slug]);

  const handleSelectCategory = (category: string) => {
    router.push(`/?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] transition-colors duration-200 animate-in fade-in duration-500">
      {/* Top Header */}
      <Header
        activeCategory={project.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* Horizontal Storytelling Viewer */}
      <HorizontalProjectViewer project={project} nextProject={nextProject} />
    </div>
  );
}
