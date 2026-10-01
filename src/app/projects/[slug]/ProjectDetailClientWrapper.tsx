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

  const handleSelectCategory = (category: string) => {
    router.push(`/?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-white text-black">
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
