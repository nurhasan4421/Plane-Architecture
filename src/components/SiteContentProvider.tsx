"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  getFallbackSiteSettings,
  getNewsItems,
  getProjects,
  getSiteSettings,
  getTestimonials,
  SiteSettings,
} from "@/lib/site-content";
import { NEWS_ITEMS, PROJECTS } from "@/lib/projects-data";
import { NewsItem, Project, ProjectTestimonial } from "@/types/project";

interface SiteContentContextValue {
  settings: SiteSettings;
  projects: Project[];
  newsItems: NewsItem[];
  testimonials: ProjectTestimonial[];
  refreshSettings: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextValue>({
  settings: getFallbackSiteSettings(),
  projects: PROJECTS,
  newsItems: NEWS_ITEMS,
  testimonials: [],
  refreshSettings: async () => undefined,
});

export function useSiteContent() {
  return useContext(SiteContentContext);
}

export default function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState(getFallbackSiteSettings());
  const [projects, setProjects] = useState(PROJECTS);
  const [newsItems, setNewsItems] = useState(NEWS_ITEMS);
  const [testimonials, setTestimonials] = useState<ProjectTestimonial[]>([]);
  const pathname = usePathname();

  const refreshSettings = async () => {
    const [nextSettings, nextProjects, nextNews, nextTestimonials] = await Promise.all([
      getSiteSettings(),
      getProjects(),
      getNewsItems(),
      getTestimonials(),
    ]);
    setSettings(nextSettings);
    setProjects(nextProjects);
    setNewsItems(nextNews);
    setTestimonials(nextTestimonials);
  };

  useEffect(() => {
    let cancelled = false;
    const loadContent = async () => {
      const [nextSettings, nextProjects, nextNews, nextTestimonials] = await Promise.all([
        getSiteSettings(),
        getProjects(),
        getNewsItems(),
        getTestimonials(),
      ]);
      if (cancelled) return;
      setSettings(nextSettings);
      setProjects(nextProjects);
      setNewsItems(nextNews);
      setTestimonials(nextTestimonials);
    };
    void loadContent();

    const handleCmsUpdate = () => void refreshSettings();
    const handleWindowFocus = () => void loadContent();
    window.addEventListener("plane-cms-updated", handleCmsUpdate);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      cancelled = true;
      window.removeEventListener("plane-cms-updated", handleCmsUpdate);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [pathname]);

  return (
    <SiteContentContext.Provider value={{ settings, projects, newsItems, testimonials, refreshSettings }}>
      {children}
    </SiteContentContext.Provider>
  );
}