"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import NavigationDrawer from "@/components/NavigationDrawer";
import ProjectFeed from "@/components/ProjectFeed";
import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";
import { PROJECTS } from "@/lib/projects-data";

export default function HomePage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("architecture");
  const [activeSubcategory, setActiveSubcategory] = useState<string | undefined>(undefined);
  const [scale, setScale] = useState(1);

  const handleSelectCategory = (category: string, subcategory?: string) => {
    setActiveCategory(category);
    setActiveSubcategory(subcategory);
  };

  return (
    <main className="min-h-screen bg-white text-black flex flex-col justify-between">
      {/* Top Header */}
      <Header
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        scale={scale}
        onScaleChange={setScale}
      />

      {/* Slide-out Navigation Drawer */}
      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Main Project Feed */}
      <ProjectFeed
        projects={PROJECTS}
        activeCategory={activeCategory}
        activeSubcategory={activeSubcategory}
        scale={scale}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Footer */}
      <Footer onOpenContact={() => setIsContactOpen(true)} />
    </main>
  );
}
