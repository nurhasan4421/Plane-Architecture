"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types/project";
import { ChevronRight, Mail, Share2, X } from "lucide-react";

interface HorizontalProjectViewerProps {
  project: Project;
  nextProject?: Project;
}

export default function HorizontalProjectViewer({
  project,
  nextProject,
}: HorizontalProjectViewerProps) {
  const [isCopied, setIsCopied] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; alt: string } | null>(null);

  useEffect(() => {
    if (!selectedImage) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const openImage = (url: string, alt: string) => setSelectedImage({ url, alt });

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
            onClick={() => openImage(project.heroImage, project.title)}
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

        <section aria-labelledby="project-overview" className="grid gap-8 border-t border-neutral-200 pt-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.65fr)] lg:gap-16">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Project Overview</p>
            <h2 id="project-overview" className="mb-5 max-w-3xl font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl">
              {project.title}
            </h2>
            <p className="max-w-3xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8 lg:text-xl lg:leading-9">
              {project.description}
            </p>
          </div>

          <div className="flex flex-col justify-between gap-8">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-2">
              {[
                ["Location", project.location],
                ["Year", project.year],
                ["Client", project.client],
                ["Typology", project.typology],
                ["Size", `${project.sizeM2} m²${project.sizeFt2 ? ` / ${project.sizeFt2} ft²` : ""}`],
                ["Status", project.status],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="mb-1 text-[10px] uppercase tracking-widest text-neutral-500 lg:text-xs">{label}</dt>
                  <dd className="text-sm leading-5 text-black lg:text-base lg:leading-6">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="flex items-center gap-3">
              <span className="mr-1 text-[10px] uppercase tracking-widest text-neutral-500">Share project</span>
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
        </section>

        {project.gallery && project.gallery.length > 0 && (
          <section aria-labelledby="project-gallery">
            <div className="mb-6 flex items-end justify-between border-b border-neutral-200 pb-4">
              <div>
                <h2 id="project-gallery" className="font-display text-2xl font-normal sm:text-3xl">Project Gallery</h2>
              </div>
              <span className="text-xs text-neutral-500">{String(project.gallery.length).padStart(2, "0")} images</span>
            </div>
            <div className="grid grid-flow-dense grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12 lg:gap-5">
              {project.gallery.map((image, index) => {
                const tileLayouts = [
                  "lg:col-span-7 aspect-[4/3]",
                  "lg:col-span-5 aspect-[3/4]",
                  "lg:col-span-4 aspect-[4/3]",
                  "lg:col-span-4 aspect-[4/3]",
                  "lg:col-span-4 aspect-[4/3]",
                  "lg:col-span-8 aspect-[16/9]",
                ];
                const alt = image.caption || `${project.title} - View ${index + 1}`;

                return (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => openImage(image.url, alt)}
                    aria-label={`Open image: ${alt}`}
                    className={`group relative block w-full cursor-zoom-in overflow-hidden bg-neutral-100 text-left ${tileLayouts[index % tileLayouts.length]}`}
                  >
                    <img
                      src={image.url}
                      alt={alt}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25 group-focus-visible:bg-black/25" />
                    {image.caption && (
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-10 text-left text-xs leading-5 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                        {image.caption}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section aria-labelledby="project-credits" className="grid gap-6 border-t border-neutral-200 pt-8 sm:grid-cols-[minmax(160px,0.5fr)_1fr]">
          <div>
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500">People & partners</p>
            <h2 id="project-credits" className="font-display text-2xl font-normal sm:text-3xl">Project Credits</h2>
          </div>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            {project.credits?.map((credit, index) => (
              <div key={`${credit.role}-${index}`}>
                <h3 className="mb-2 text-[10px] uppercase tracking-widest text-neutral-500 lg:text-xs">{credit.role}</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{credit.people.join(", ")}</p>
              </div>
            ))}
            {project.collaborators && project.collaborators.length > 0 && (
              <div>
                <h3 className="mb-2 text-[10px] uppercase tracking-widest text-neutral-500 lg:text-xs">Collaborators</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{project.collaborators.join(", ")}</p>
              </div>
            )}
            {project.awards && project.awards.length > 0 && (
              <div>
                <h3 className="mb-2 text-[10px] uppercase tracking-widest text-neutral-500 lg:text-xs">Awards</h3>
                <p className="text-sm leading-6 lg:text-base lg:leading-7">{project.awards.join(" / ")}</p>
              </div>
            )}
          </div>
        </section>

        {project.quote && (
          <section aria-labelledby="project-testimonial" className="grid overflow-hidden bg-neutral-50 md:grid-cols-[minmax(240px,0.7fr)_1.3fr]">
            <div className="relative min-h-[280px] bg-neutral-200 md:min-h-[440px]">
              <img src={project.heroImage} alt={`${project.title} project`} className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="flex flex-col justify-between gap-10 p-6 sm:p-10 lg:p-14">
              <div>
                <p className="mb-6 text-[10px] uppercase tracking-[0.2em] text-neutral-500">Project Testimonial</p>
                <span aria-hidden="true" className="font-display text-5xl leading-none text-black">&ldquo;</span>
                <blockquote id="project-testimonial" className="font-display text-xl font-normal leading-relaxed text-neutral-800 sm:text-2xl lg:text-3xl">
                  {project.quote}
                </blockquote>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <p className="text-sm font-medium uppercase tracking-wide text-black">{project.quoteAuthor || "Plane Architect"}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-neutral-500">{project.quoteAuthorRole || "Dhaka, Bangladesh"}</p>
              </div>
            </div>
          </section>
        )}
      </div>

      {selectedImage && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 sm:p-8"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSelectedImage(null);
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            aria-label="Close image viewer"
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>
          <img src={selectedImage.url} alt={selectedImage.alt} className="max-h-full max-w-full object-contain" />
        </div>
      )}
    </main>
  );
}
