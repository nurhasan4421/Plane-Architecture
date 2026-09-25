"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import NavigationDrawer from "@/components/NavigationDrawer";
import ContactModal from "@/components/ContactModal";
import HorizontalProjectViewer from "@/components/HorizontalProjectViewer";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";

interface ProjectDetailClientWrapperProps {
  project: Project;
  nextProject: Project;
}

export default function ProjectDetailClientWrapper({
  project,
  nextProject,
}: ProjectDetailClientWrapperProps) {
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  const handleSelectCategory = (category: string) => {
    router.push(`/?category=${category}`);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Top Header */}
      <Header
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        activeCategory={project.category}
        onSelectCategory={handleSelectCategory}
      />

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Horizontal Storytelling Viewer */}
      <HorizontalProjectViewer project={project} nextProject={nextProject} />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
