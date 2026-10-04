"use client";

import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";

const FALLBACK_LEADERSHIP = [
  { name: "K. M. Rahman", role: "Principal Architect & Founder", studio: "Dhaka" },
  { name: "S. N. Chowdhury", role: "Director of Urban Design & Partner", studio: "Dhaka" },
  { name: "Tariq Ahmed", role: "Head of Environmental Engineering", studio: "Dhaka" },
  { name: "Nadia Hasan", role: "Partner, Landscape Ecology", studio: "Dhaka" },
  { name: "Asif Karim", role: "Director of Research & Materiality", studio: "Dhaka" },
  { name: "M. Siddique", role: "Head of Structural Computation", studio: "Chittagong" },
];

export default function AboutPage() {
  const { settings } = useSiteContent();
  const leadership = settings.about?.leadership?.length ? settings.about.leadership : FALLBACK_LEADERSHIP;

  return (
    <div className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] flex flex-col justify-between select-none font-body transition-colors duration-200">
      <Header activeCategory="architecture" />

      <div className="pt-28 pb-20 px-6 md:px-16 lg:px-28 max-w-6xl mx-auto w-full">
        {/* Intro Manifesto */}
        <section className="mb-20">
          <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-3">
            {settings.about?.eyebrow || `About ${settings.siteName} • ${settings.tagline}`}
          </span>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl font-normal leading-tight tracking-tight text-black dark:text-white max-w-4xl mb-10">
            {settings.about?.headline || `${settings.siteName} is an architectural and spatial laboratory based in Dhaka, Bangladesh, investigating how geometric planes mediate climate, water, and human community.`}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-body">
            <p>
              Founded in Dhaka, Bangladesh, Plane Architect operates at the nexus of deltaic
              geography, tropical climate resilience, and rigorous architectural geometry. Our work
              spans cultural institutions, master plans, public riverfronts, and sustainable
              structures across South Asia and abroad.
            </p>
            <p>
              Rather than importing generic glass containers unsuited to tropical heat, Plane Architect
              articulates tactile envelopes: perforated brick jalis, deep monsoon overhangs, breathing
              timber frames, and shaded internal courtyards that temper heat and invite natural light.
            </p>
          </div>
        </section>

        {/* Delta Ecology & Sustainability */}
        <section id="sustainability" className="mb-20 border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-2">
            Design Philosophy
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-normal text-black dark:text-white mb-6">
            Contextual Materiality & Delta Ecology
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300 font-body">
            <p>
              In Bangladesh, the landscape is in continuous motion with river cycles and seasonal
              monsoons. We view architecture not as a static barrier against nature, but as an
              inhabitable filter that responds gracefully to seasonal waters, rainfall, and prevailing
              winds.
            </p>
            <p>
              Our research focuses on low-carbon local materials — locally manufactured gas-cured
              terracotta, compressed earth, structural bamboo, and reclaimed timber — paired with
              high-performance computational envelope modeling.
            </p>
          </div>
        </section>

        {/* Leadership */}
        <section id="people" className="mb-20 border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-2">
            Leadership
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-normal text-black dark:text-white mb-8">
            Studio Partners & Directors
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 font-body">
            {leadership.map((leader, idx) => (
              <div key={idx} className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <h3 className="font-display text-sm font-semibold uppercase text-black dark:text-white">
                  {leader.name}
                </h3>
                <p className="text-xs text-[#797979] dark:text-neutral-400 mt-0.5">{leader.role}</p>
                <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                  {leader.studio} Studio
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Studio Info & Inquiries */}
        <section id="careers" className="border-t border-neutral-200 dark:border-neutral-800 pt-16 text-center font-body">
          <h2 className="font-display text-xl font-normal text-black dark:text-white mb-2">Connect With {settings.siteName}</h2>
          <p className="text-xs text-[#797979] dark:text-neutral-400 uppercase tracking-wider max-w-lg mx-auto mb-2">
            {settings.tagline || "Dhaka, Bangladesh"} • {settings.phone} • {settings.email}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto mb-6">
            We welcome commissions, collaborative competitions, academic partnerships, and career
            inquiries.
          </p>
          <Link
            href="/contact"
            className="inline-flex px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs uppercase tracking-widest hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors"
          >
            Contact {settings.siteName}
          </Link>
        </section>
      </div>

      <Footer />
    </div>
  );
}
