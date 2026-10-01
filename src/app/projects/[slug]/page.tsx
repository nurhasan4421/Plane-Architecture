import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getProjects } from "@/lib/site-content";
import ProjectDetailClientWrapper from "./ProjectDetailClientWrapper";

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | Plane Architect",
    };
  }

  return {
    title: `${project.title} | Plane Architect • Dhaka, Bangladesh`,
    description: project.description,
    openGraph: {
      title: `${project.title} | Plane Architect`,
      description: project.description,
      images: [{ url: project.heroImage }],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const sameCategoryProjects = allProjects.filter(
    (item) => item.category === project.category,
  );
  const categoryIndex = sameCategoryProjects.findIndex(
    (item) => item.slug === project.slug,
  );
  const nextProject =
    sameCategoryProjects.length > 1
      ? sameCategoryProjects[(categoryIndex + 1) % sameCategoryProjects.length]
      : undefined;

  return (
    <ProjectDetailClientWrapper project={project} nextProject={nextProject} />
  );
}
