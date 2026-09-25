"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { ChevronLeft, ChevronRight, Share2, Mail } from "lucide-react";

interface HorizontalProjectViewerProps {
  project: Project;
  nextProject?: Project;
}

export default function HorizontalProjectViewer({
  project,
  nextProject,
}: HorizontalProjectViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [diagramStep, setDiagramStep] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  // Wheel horizontal scroll support
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      // In large screen horizontal mode, convert vertical wheel into horizontal scroll
      if (window.innerWidth >= 1024) {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          el.scrollLeft += e.deltaY * 1.2;
        }
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => el.removeEventListener("wheel", handleWheel);
  }, []);

  const totalDiagrams = project.diagrams?.length || 0;
  const currentDiagram = project.diagrams ? project.diagrams[diagramStep] : null;

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-screen min-h-screen bg-white select-none pt-[50px] lg:pt-[60px] pb-16">
      {/* Horizontal Storytelling Track */}
      <div
        ref={containerRef}
        className="horizontal-track no-scrollbar flex flex-col lg:flex-row items-start gap-8 lg:gap-16 px-4 md:px-12 lg:px-20 overflow-y-auto lg:overflow-y-hidden lg:overflow-x-auto w-full lg:h-[84vh] pt-4"
      >
        {/* SECTION 1: HERO VIEW + METADATA */}
        <div className="relative flex flex-col lg:flex-row items-start shrink-0">
          {/* Metadata Block on Left */}
          <div className="w-full lg:w-[280px] shrink-0 mb-6 lg:mb-0 lg:mr-10 flex flex-col justify-between">
            <div>
              {/* Black Project Icon */}
              <div className="w-[42px] h-[42px] lg:w-[50px] lg:h-[50px] bg-black text-white flex items-center justify-center p-2 mb-4">
                {project.iconSvg ? (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    dangerouslySetInnerHTML={{ __html: project.iconSvg }}
                  />
                ) : (
                  <span className="text-[11px] font-bold uppercase">{project.title.slice(0, 3)}</span>
                )}
              </div>

              {/* Title & Location */}
              <h1 className="text-xl lg:text-2xl font-normal leading-tight text-black mb-1">
                {project.title}
              </h1>
              <p className="text-xs lg:text-sm text-[#797979] uppercase tracking-wider mb-6 font-light">
                {project.location}
              </p>

              {/* Architectural Spec Sheet */}
              <div className="space-y-4 border-t border-neutral-100 pt-4 text-left">
                <div>
                  <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">Year</h4>
                  <p className="text-xs uppercase text-black font-medium">{project.year}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">Client</h4>
                  <p className="text-xs uppercase text-black leading-relaxed font-medium">
                    {project.client}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">Typology</h4>
                  <p className="text-xs uppercase text-black font-medium">{project.typology}</p>
                </div>
                <div>
                  <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">
                    Size m² / ft²
                  </h4>
                  <p className="text-xs uppercase text-black font-medium">
                    {project.sizeM2} m² {project.sizeFt2 ? `/ ${project.sizeFt2} ft²` : ""}
                  </p>
                </div>
                <div>
                  <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">Status</h4>
                  <p className="text-xs uppercase text-black font-medium">{project.status}</p>
                </div>
              </div>
            </div>

            {/* Share Links */}
            <div className="mt-6 pt-4 border-t border-neutral-100">
              <span className="text-[10px] text-[#797979] uppercase tracking-widest block mb-2">
                Share
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyLink}
                  className="w-7 h-7 bg-black text-white flex items-center justify-center cursor-pointer hover:bg-neutral-800 transition-colors"
                  title="Copy project link"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                <a
                  href={`mailto:?subject=${encodeURIComponent(project.title)}&body=${encodeURIComponent(
                    `Check out ${project.title} by BIG: `
                  )}`}
                  className="w-7 h-7 bg-black text-white flex items-center justify-center hover:bg-neutral-800 transition-colors"
                  title="Share via Email"
                >
                  <Mail className="w-3.5 h-3.5" />
                </a>
                {isCopied && (
                  <span className="text-[10px] uppercase text-emerald-600 font-medium">
                    Copied!
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Hero Render */}
          <div className="relative shrink-0 overflow-hidden bg-neutral-50 h-[50vh] lg:h-[76vh]">
            <img
              src={project.heroImage}
              alt={project.title}
              className="w-full h-full object-contain max-w-[92vw] lg:max-w-none"
            />
          </div>
        </div>

        {/* SECTION 2: INTERACTIVE CONCEPT DIAGRAMS */}
        {totalDiagrams > 0 && currentDiagram && (
          <div className="relative shrink-0 flex flex-col justify-center items-center w-full lg:w-[480px] bg-neutral-50/50 p-6 lg:h-[76vh] border border-neutral-100">
            <div className="relative w-full h-[320px] lg:h-[420px] flex items-center justify-center overflow-hidden">
              <img
                key={currentDiagram.step}
                src={currentDiagram.image}
                alt={currentDiagram.title}
                className="max-h-full max-w-full object-contain transition-all duration-300 animate-in fade-in"
              />
            </div>

            {/* Stepper info */}
            <div className="w-full mt-4 text-center">
              <div className="flex items-center justify-between text-[11px] text-[#797979] uppercase tracking-wider mb-2">
                <span>
                  STEP {currentDiagram.step} / 0{totalDiagrams}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setDiagramStep((prev) => (prev > 0 ? prev - 1 : totalDiagrams - 1))
                    }
                    className="p-1 text-black hover:bg-neutral-200 cursor-pointer transition-colors"
                    aria-label="Previous Diagram"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setDiagramStep((prev) => (prev < totalDiagrams - 1 ? prev + 1 : 0))
                    }
                    className="p-1 text-black hover:bg-neutral-200 cursor-pointer transition-colors"
                    aria-label="Next Diagram"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="text-xs uppercase font-semibold text-black tracking-wide">
                {currentDiagram.title}
              </h3>
              <p className="text-xs text-neutral-600 mt-1 leading-normal">
                {currentDiagram.description}
              </p>
            </div>
          </div>
        )}

        {/* SECTION 3: BJARKE INGELS QUOTE */}
        {project.quote && (
          <div className="relative shrink-0 flex flex-col justify-center w-full lg:w-[580px] p-6 lg:p-10 lg:h-[76vh] bg-white border-l border-neutral-100">
            <blockquote className="text-[15px] sm:text-[17px] lg:text-[19px] leading-relaxed font-light text-black tracking-tight mb-6">
              &ldquo;{project.quote}&rdquo;
            </blockquote>
            <div className="text-[11px] uppercase tracking-wider text-[#797979]">
              <span className="text-black font-medium">{project.quoteAuthor || "Bjarke Ingels"}</span>
              <span className="block mt-0.5">{project.quoteAuthorRole || "BIG"}</span>
            </div>
          </div>
        )}

        {/* SECTION 4: GALLERY PHOTOGRAPHS */}
        {project.gallery?.map((img, idx) => (
          <div
            key={idx}
            className="relative shrink-0 flex flex-col justify-between h-[50vh] lg:h-[76vh] bg-neutral-50 overflow-hidden"
          >
            <div className="relative h-full flex items-center justify-center">
              <img
                src={img.url}
                alt={`${project.title} - View ${idx + 1}`}
                className="h-full w-auto object-contain max-w-[92vw] lg:max-w-none"
              />
            </div>
            {img.caption && (
              <p className="text-[10px] text-center text-[#797979] uppercase tracking-wider py-2 bg-white/90">
                {img.caption}
              </p>
            )}
          </div>
        ))}

        {/* SECTION 5: CREDITS & COLLABORATORS */}
        <div className="relative shrink-0 flex flex-col justify-center w-full lg:w-[320px] p-6 lg:h-[76vh] bg-neutral-50 border border-neutral-100 text-left">
          <h3 className="text-xs uppercase font-semibold tracking-widest text-black mb-4">
            Project Credits
          </h3>
          <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-2">
            {project.credits?.map((credit, i) => (
              <div key={i} className="text-left">
                <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">
                  {credit.role}
                </h4>
                <p className="text-xs text-black leading-snug font-normal mt-0.5">
                  {credit.people.join(", ")}
                </p>
              </div>
            ))}

            {project.collaborators && project.collaborators.length > 0 && (
              <div className="border-t border-neutral-200 pt-3">
                <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">
                  Collaborators
                </h4>
                <p className="text-xs text-black leading-snug font-normal mt-0.5">
                  {project.collaborators.join(", ")}
                </p>
              </div>
            )}

            {project.awards && project.awards.length > 0 && (
              <div className="border-t border-neutral-200 pt-3">
                <h4 className="text-[10px] text-[#797979] uppercase tracking-widest">Awards</h4>
                <p className="text-xs text-black leading-snug font-normal mt-0.5">
                  {project.awards.join(" • ")}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* SECTION 6: NEXT PROJECT TEASER */}
        {nextProject && (
          <div className="relative shrink-0 flex flex-col justify-center items-center w-full lg:w-[360px] p-8 lg:h-[76vh] bg-black text-white text-center">
            <span className="text-[10px] uppercase tracking-widest text-neutral-400 mb-2">
              Next Project
            </span>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="group flex flex-col items-center"
            >
              <h3 className="text-lg lg:text-xl font-normal leading-tight group-hover:underline mb-1">
                {nextProject.title}
              </h3>
              <p className="text-xs text-neutral-400 uppercase tracking-wider mb-6">
                {nextProject.location}
              </p>
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center group-hover:scale-110 group-hover:border-white transition-all">
                <ChevronRight className="w-5 h-5 text-white" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
