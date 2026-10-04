"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { ChevronLeft, ChevronRight, LayoutGrid, Rows3, Mail, Share2, X } from "lucide-react";

interface HorizontalProjectViewerProps {
  project: Project;
  nextProject?: Project;
}

export default function HorizontalProjectViewer({
  project,
  nextProject,
}: HorizontalProjectViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [mobileLayout, setMobileLayout] = useState<"stack" | "grid">("stack");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const collageImages = useMemo(() => {
    const list = [...(project.gallery || [])];
    const defaultCaptions = [
      "VIEW 1 - CONTEXTUAL MASSING & URBAN THRESHOLD",
      "VIEW 2 - MATERIAL TECTONICS & SURFACE TEXTURE",
      "VIEW 3 - INTERIOR SPATIAL CANOPY & LIGHT WELLS",
      "VIEW 4 - CIRCULATION FLOWS & COURTYARD CONTINUITY",
      "VIEW 5 - ELEVATED SKYLINE PROFILE & SUN SHADING",
      "VIEW 6 - OCULUS & INTEGRATED NATURAL LANDSCAPE",
    ];
    while (list.length < 6) {
      const idx = list.length;
      list.push({
        url: project.heroImage,
        caption: defaultCaptions[idx] || `View ${idx + 1}`,
      });
    }
    return list.slice(0, 6);
  }, [project.gallery, project.heroImage]);

  // Unified list of all project images for the full-view lightbox
  const allImages = useMemo(() => {
    const items: { url: string; caption?: string }[] = [];
    if (project.heroImage) {
      items.push({ url: project.heroImage, caption: `${project.title} - Main View` });
    }
    collageImages.forEach((img, idx) => {
      items.push({
        url: img.url,
        caption: img.caption || `View 0${idx + 1}`,
      });
    });
    if (project.gallery && project.gallery.length > 6) {
      project.gallery.slice(6).forEach((img, idx) => {
        items.push({
          url: img.url,
          caption: img.caption || `Additional View 0${idx + 7}`,
        });
      });
    }
    return items;
  }, [project.heroImage, project.title, project.gallery, collageImages]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightboxIndex(null);
      if (event.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : 0));
      }
      if (event.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allImages.length - 1));
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [lightboxIndex, allImages.length]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const openImageByIndex = (index: number) => {
    setLightboxIndex(index);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      setLightboxIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : 0));
    }
    if (distance < -50) {
      setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allImages.length - 1));
    }
  };

  return (
    <main className="w-full bg-white pt-[50px] font-body text-black lg:pt-[60px]">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-16 px-5 pb-20 pt-6 sm:px-10 lg:gap-24 lg:px-16">
        <section aria-labelledby="project-title">
          <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            {project.category} / {project.year}
          </p>
          <div className="mb-6 flex items-center justify-between gap-4">
            <h1 id="project-title" className="font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            {nextProject && (
              <Link
                href={`/projects/${nextProject.slug}`}
                aria-label={`Next ${project.category} project: ${nextProject.title}`}
                title={`Next project: ${nextProject.title}`}
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-300 transition-colors hover:bg-neutral-100"
              >
                <ChevronRight className="h-5 w-5" />
              </Link>
            )}
          </div>
          <button
            type="button"
            onClick={() => openImageByIndex(0)}
            aria-label={`Open image: ${project.title}`}
            className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-neutral-100"
          >
            <img
              src={project.heroImage}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
            />
            <span className="absolute bottom-4 right-4 bg-black/70 px-3 py-2 text-[10px] uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
              View image
            </span>
          </button>
        </section>

        {/* Project Overview without divider lines */}
        <section aria-labelledby="project-overview" className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:gap-16">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">Project Overview</p>
            <h2 id="project-overview" className="mb-5 max-w-3xl font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              {project.description}
            </p>

            <div className="mt-8 flex items-center gap-3">
              <span className="mr-1 text-[10px] uppercase tracking-widest text-neutral-400">Share project</span>
              <button
                onClick={handleCopyLink}
                className="flex h-9 w-9 items-center justify-center bg-black text-white transition-colors hover:bg-neutral-700"
                title="Copy project link"
                aria-label="Copy project link"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <a
                href={`mailto:hello@planearchitect.com?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(`Check out ${project.title} by Plane Architect: `)}`}
                className="flex h-9 w-9 items-center justify-center bg-black text-white transition-colors hover:bg-neutral-700"
                title="Share via email"
                aria-label="Share via email"
              >
                <Mail className="h-4 w-4" />
              </a>
              {isCopied && <span className="text-xs text-emerald-700">Copied</span>}
            </div>
          </div>

          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">Specifications & Data</p>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-2">
              {[
                ["Location", project.location],
                ["Year", project.year],
                ["Client", project.client],
                ["Typology", project.typology],
                ["Category", project.category],
                ["Subcategory", project.subcategory],
                ["Gross Floor Area", `${project.sizeM2} m²${project.sizeFt2 ? ` / ${project.sizeFt2} ft²` : ""}`],
                ["Site Area", project.siteArea || "Urban Waterfront Plot"],
                ["Status", project.status],
                ["Materiality", project.materials || "Board-formed concrete, local terracotta jali, low-E glazing"],
                ["Climate Strategy", project.climateStrategy || "Delta natural cross-ventilation, shaded courtyards"],
                ["Structural System", project.structuralSystem || "Cast-in-place reinforced concrete & post-tensioned slabs"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="mb-1 text-[10px] uppercase tracking-widest text-neutral-400 lg:text-[11px]">{label}</dt>
                  <dd className="text-xs leading-5 text-neutral-800 lg:text-sm lg:leading-6 font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Feature Images Section with Google Drive-style Layout Toggle for Mobile */}
        <section aria-labelledby="featured-collage" className="w-full space-y-4">
          {/* Mobile View Toggle Bar (Google Drive Pill Style) */}
          <div className="flex md:hidden items-center justify-between border-b border-black/10 pb-3 pt-1">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400 font-medium">Feature Views</p>
              <p className="text-xs text-neutral-600 font-medium">{collageImages.length} Photographs</p>
            </div>

            {/* Clean minimalist icons: Stack and Dashboard (Grid) */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileLayout("stack")}
                aria-label="Stack view"
                title="Stack view (one by one)"
                className={`p-1.5 transition-colors cursor-pointer ${
                  mobileLayout === "stack" ? "text-black" : "text-neutral-300 hover:text-neutral-600"
                }`}
              >
                <Rows3 className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileLayout("grid")}
                aria-label="Dashboard grid view"
                title="Dashboard view (2 in a row)"
                className={`p-1.5 transition-colors cursor-pointer ${
                  mobileLayout === "grid" ? "text-black" : "text-neutral-300 hover:text-neutral-600"
                }`}
              >
                <LayoutGrid className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* MOBILE VIEW OPTION 1: One-by-One Stack (Same size as head image: aspect-[16/10]) */}
          {mobileLayout === "stack" && (
            <div className="flex md:hidden flex-col gap-4 w-full">
              {collageImages.map((image, index) => (
                <button
                  key={`mobile-stack-${index}`}
                  type="button"
                  onClick={() => openImageByIndex(1 + index)}
                  aria-label={`Open photo: ${image.caption || `View ${index + 1}`}`}
                  className="group relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden bg-neutral-100"
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Collage view ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
                  />
                </button>
              ))}
            </div>
          )}

          {/* MOBILE VIEW OPTION 2: 2 Pictures in a Row Grid (Matching Picture 2) */}
          {mobileLayout === "grid" && (
            <div className="grid md:hidden grid-cols-2 gap-2.5 sm:gap-3 w-full">
              {collageImages.map((image, index) => (
                <button
                  key={`mobile-grid-${index}`}
                  type="button"
                  onClick={() => openImageByIndex(1 + index)}
                  aria-label={`Open photo: ${image.caption || `View ${index + 1}`}`}
                  className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-neutral-100"
                >
                  <img
                    src={image.url}
                    alt={image.caption || `Collage view ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                </button>
              ))}
            </div>
          )}

          {/* DESKTOP VIEW: 6-Photo Architectural Collage - Perfectly Aligned Top, Bottom & All Sides */}
          <div className="hidden md:grid md:grid-cols-3 gap-3 md:gap-4 w-full h-[680px] sm:h-[780px] lg:h-[880px] xl:h-[940px]">
            {/* Column 1: Top landscape (38%), Bottom tall vertical (62%) */}
            <div className="flex flex-col gap-3 md:gap-4 h-full min-h-0">
              {/* Photo 1: Landscape */}
              <button
                type="button"
                onClick={() => openImageByIndex(1)}
                aria-label={`Open photo: ${collageImages[0].caption || "View 1"}`}
                className="group relative block w-full flex-[0.38] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[0].url}
                  alt={collageImages[0].caption || "Collage view 1"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[0].caption || "VIEW 1 CONSTRUCTED PRIMARILY FROM BOARD-FORMED"}
                </span>
              </button>

              {/* Photo 2: Tall vertical - expanded height to flush-align with middle bottom */}
              <button
                type="button"
                onClick={() => openImageByIndex(2)}
                aria-label={`Open photo: ${collageImages[1].caption || "View 2"}`}
                className="group relative block w-full flex-[0.62] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[1].url}
                  alt={collageImages[1].caption || "Collage view 2"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 left-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[1].caption || "VIEW 2 MATERIAL & FORM ARCHITECTURE"}
                </span>
              </button>
            </div>

            {/* Column 2: Top square (45%), Bottom tall vertical (55%) */}
            <div className="flex flex-col gap-3 md:gap-4 h-full min-h-0">
              {/* Photo 3: Square canopy */}
              <button
                type="button"
                onClick={() => openImageByIndex(3)}
                aria-label={`Open photo: ${collageImages[2].caption || "View 3"}`}
                className="group relative block w-full flex-[0.45] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[2].url}
                  alt={collageImages[2].caption || "Collage view 3"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[2].caption || "VIEW 3 SCULPTURAL SOLID MASS AND CEILING CANOPY"}
                </span>
              </button>

              {/* Photo 4: Vertical - anchor height */}
              <button
                type="button"
                onClick={() => openImageByIndex(4)}
                aria-label={`Open photo: ${collageImages[3].caption || "View 4"}`}
                className="group relative block w-full flex-[0.55] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[3].url}
                  alt={collageImages[3].caption || "Collage view 4"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 left-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[3].caption || "VIEW 4 FLOWS AND CLEAN INTEGRATION"}
                </span>
              </button>
            </div>

            {/* Column 3: Top tall vertical spire (65%), Bottom landscape (35%) */}
            <div className="flex flex-col gap-3 md:gap-4 h-full min-h-0">
              {/* Photo 5: Tall spire */}
              <button
                type="button"
                onClick={() => openImageByIndex(5)}
                aria-label={`Open photo: ${collageImages[4].caption || "View 5"}`}
                className="group relative block w-full flex-[0.65] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[4].url}
                  alt={collageImages[4].caption || "Collage view 5"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute left-2.5 top-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[4].caption || "VIEW 5 ELEVATED SKYLINE SPIRE & SHADING"}
                </span>
              </button>

              {/* Photo 6: Landscape - expanded height to flush-align with middle bottom */}
              <button
                type="button"
                onClick={() => openImageByIndex(6)}
                aria-label={`Open photo: ${collageImages[5].caption || "View 6"}`}
                className="group relative block w-full flex-[0.35] min-h-0 cursor-zoom-in overflow-hidden bg-neutral-100"
              >
                <img
                  src={collageImages[5].url}
                  alt={collageImages[5].caption || "Collage view 6"}
                  className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <span className="absolute bottom-2.5 left-2.5 max-w-[88%] truncate bg-black/85 px-2.5 py-1 text-[9px] font-medium uppercase tracking-wider text-white shadow-sm sm:text-[10px]">
                  {collageImages[5].caption || "VIEW 6 PRIVATE COURTYARDS & OCULUS DETAIL"}
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Architectural Narrative, History & Design Concept */}
        <section aria-labelledby="project-narrative" className="space-y-10 pt-4">
          <div className="max-w-3xl">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">Design Biography & Narrative</p>
            <h2 id="project-narrative" className="font-display text-3xl font-normal sm:text-4xl text-black">
              Architecture, Planning & Concept
            </h2>
          </div>

          <div className="grid gap-10 md:grid-cols-2 lg:gap-14">
            {/* Story 1: Site Context & History */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Site Context & History
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
                {project.historyContext ||
                  "The project emerges from deep analysis of the historical Bengal delta topography, negotiating shifting waterfront boundaries, seasonal flood thresholds, and the vibrant civic fabric of the surrounding urban community."}
              </p>
            </div>

            {/* Story 2: Architectural & Spatial Concept */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Spatial Concept & Form
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
                {project.designConcept ||
                  "Sculpted as an interlocking composition of solid mass and porous voids, the architecture frames indirect northern light while creating deep shaded thresholds that invite spontaneous gathering, quiet contemplation, and natural ventilation."}
              </p>
            </div>

            {/* Story 3: Planning, Craft & Materiality */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Planning, Craft & Construction
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
                {project.planningStory ||
                  "Constructed through close collaboration between structural engineers and regional artisan bricklayers, the envelope celebrates board-formed textures, hand-fired terracotta jali screens, and precision post-tensioned spans engineered for generations of permanence."}
              </p>
            </div>

            {/* Story 4: Ecological Adaptation & Climate Strategy */}
            <div className="space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-neutral-900 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-black" />
                Climate Strategy & Ecology
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-600 font-light">
                {project.sustainabilityStory ||
                  "Harnessing seasonal breeze vectors, evaporative courtyard reflection basins, and full-volume rainwater collection, the project functions as a living ecological organism that minimizes operational carbon while maintaining exceptional thermal comfort."}
              </p>
            </div>
          </div>
        </section>

        {/* Extended Gallery if more than 6 images */}
        {project.gallery && project.gallery.length > 6 && (
          <section aria-labelledby="project-gallery">
            <div className="mb-6 flex items-end justify-between pb-3">
              <div>
                <h2 id="project-gallery" className="font-display text-2xl font-normal sm:text-3xl">Additional Views</h2>
              </div>
              <span className="text-xs text-neutral-400">{project.gallery.length - 6} more images</span>
            </div>
            <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-4">
              {project.gallery.slice(6).map((image, index) => {
                const alt = image.caption || `${project.title} - View ${index + 7}`;
                return (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => openImageByIndex(1 + 6 + index)}
                    aria-label={`Open image: ${alt}`}
                    className="group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-100 text-left lg:col-span-4 aspect-[4/3]"
                  >
                    <img
                      src={image.url}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25" />
                    {image.caption && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 pb-3 pt-8 text-left text-xs leading-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        {image.caption}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Project Credits & Engineering Partners */}
        <section aria-labelledby="project-credits" className="grid gap-6 sm:grid-cols-[minmax(160px,0.4fr)_1fr] pt-4">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">People & partners</p>
            <h2 id="project-credits" className="font-display text-2xl font-normal sm:text-3xl">Project Credits</h2>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {project.credits?.map((credit, index) => (
              <div key={`${credit.role}-${index}`}>
                <h3 className="mb-1 text-[10px] uppercase tracking-widest text-neutral-400 lg:text-xs">{credit.role}</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{credit.people.join(", ")}</p>
              </div>
            ))}
            {project.collaborators && project.collaborators.length > 0 && (
              <div>
                <h3 className="mb-1 text-[10px] uppercase tracking-widest text-neutral-400 lg:text-xs">Engineers & Collaborators</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{project.collaborators.join(", ")}</p>
              </div>
            )}
            {project.awards && project.awards.length > 0 && (
              <div>
                <h3 className="mb-1 text-[10px] uppercase tracking-widest text-neutral-400 lg:text-xs">Awards & Recognition</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{project.awards.join(" / ")}</p>
              </div>
            )}
          </div>
        </section>

        {/* Project Owner / Client Testimonial - Compact card without picture */}
        {project.quote && (
          <section aria-labelledby="project-testimonial" className="flex justify-center py-6">
            <div className="w-full max-w-xl border border-neutral-200 bg-[#faf9f6] p-6 sm:p-8">
              <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-400">Project Testimonial</p>
              <blockquote id="project-testimonial" className="font-display text-base italic leading-relaxed text-neutral-800 sm:text-lg">
                &ldquo;{project.quote}&rdquo;
              </blockquote>
              <div className="mt-4 border-t border-neutral-200/60 pt-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-black">{project.quoteAuthor || "Plane Architect"}</p>
                {project.quoteAuthorRole && (
                  <p className="mt-0.5 text-[11px] text-neutral-500">{project.quoteAuthorRole}</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Full-View Image Lightbox Modal with Top Counter, Swipe/Arrows, Round Dots, and Left-Bottom Metadata */}
      {lightboxIndex !== null && allImages[lightboxIndex] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Full-screen photo viewer"
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-black/95 text-white select-none backdrop-blur-md"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar: Left Project Category + Top Corner Picture Count (e.g. 4/32) & Close Button */}
          <div className="flex items-center justify-between p-4 sm:p-6 z-20">
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] text-neutral-400">
              {project.category} / {project.subcategory || project.typology}
            </span>

            <div className="flex items-center gap-3 sm:gap-4">
              {/* Picture Counter: where visitor is now / total pictures (e.g. 4/32) */}
              <div className="flex items-center gap-1 rounded-full bg-white/10 px-3.5 py-1 font-mono text-xs sm:text-sm tracking-wider text-white backdrop-blur-xs shadow-xs">
                <span className="text-white font-semibold">{lightboxIndex + 1}</span>
                <span className="text-neutral-400">/</span>
                <span className="text-neutral-400">{allImages.length}</span>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Close image viewer"
                className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Center Image Area with Previous / Next Arrows */}
          <div className="relative flex flex-1 items-center justify-center px-2 sm:px-14 min-h-0 overflow-hidden">
            {/* Previous Image Arrow */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : allImages.length - 1))
              }
              aria-label="Previous photo"
              className="absolute left-2 sm:left-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white/80 transition hover:bg-black/80 hover:text-white cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Current Full Image */}
            <img
              src={allImages[lightboxIndex].url}
              alt={allImages[lightboxIndex].caption || project.title}
              className="max-h-[64vh] sm:max-h-[72vh] max-w-full object-contain transition-opacity duration-300"
            />

            {/* Next Image Arrow */}
            <button
              type="button"
              onClick={() =>
                setLightboxIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : 0))
              }
              aria-label="Next photo"
              className="absolute right-2 sm:right-4 z-20 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/50 text-white/80 transition hover:bg-black/80 hover:text-white cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Bottom Bar: Left-Bottom Aligned Project Name, Location, Year, Category + Round Dots for Navigation */}
          <div className="z-20 border-t border-white/10 bg-black/60 px-4 py-3 sm:px-6 sm:py-4 backdrop-blur-md">
            <div className="mx-auto flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              {/* Left Bottom Aligned Project Info */}
              <div className="min-w-0 max-w-xl text-left">
                <h4 className="truncate font-display text-base sm:text-xl font-normal text-white">
                  {project.title}
                </h4>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {project.location} · {project.year} · {project.category}
                </p>
                {allImages[lightboxIndex].caption && (
                  <p className="mt-1 text-[11px] font-medium uppercase tracking-wider text-neutral-300 truncate">
                    {allImages[lightboxIndex].caption}
                  </p>
                )}
              </div>

              {/* Bottom Round Dots for Next and Previous Pic */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full sm:max-w-md scrollbar-none">
                {allImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    aria-label={`Go to photo ${idx + 1}`}
                    title={`View photo ${idx + 1}`}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      idx === lightboxIndex
                        ? "h-2 w-6 bg-white shadow-xs"
                        : "h-2 w-2 bg-white/35 hover:bg-white/75"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
