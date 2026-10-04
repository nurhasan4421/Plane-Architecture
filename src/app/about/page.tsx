"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, Minus } from "lucide-react";
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

const CLIENT_FAQS = [
  {
    question: "How do we initiate a new architectural commission or project?",
    answer:
      "Starting begins with an initial briefing consultation — either at our studio in Dhaka or virtually. You share your site parameters, aspirational goals, functional requirements, and target timeline. From there, we formulate an initial spatial brief, site feasibility appraisal, and a structured roadmap before commencing concept design.",
  },
  {
    question: "How are architectural design fees and project budgets structured?",
    answer:
      "We prioritize financial transparency and cost predictability from day one. Design fees are typically structured as milestone-based phases (Concept Design, Schematic Design, Design Development, Permitting & Construction Documentation, and Site Supervision) or as an agreed percentage of construction valuation depending on project scale and typology. We establish cost benchmarks early to guide spatial choices responsibly.",
  },
  {
    question: "What does the contractual framework and onboarding process look like?",
    answer:
      "We execute standard professional architectural service agreements aligned with recognized industry standards (such as IAB - Institute of Architects Bangladesh and international practice norms). The contract clearly defines the scope of works, deliverables, project timeline, intellectual property rights, and phased payment schedules so you have complete legal clarity and peace of mind before design commences.",
  },
  {
    question: "How involved will the client be throughout the design journey?",
    answer:
      "Our design process is deeply collaborative and communicative. We conduct structured review sessions at each design milestone — presenting physical study models, 3D spatial walkthroughs, microclimate/sunlight simulations, and material palettes. Key decision gates ensure the architecture continuously reflects your vision, practical needs, and lifestyle.",
  },
  {
    question: "Do you handle municipal approvals, permits, and engineering disciplines?",
    answer:
      "Yes. We lead and coordinate municipal building submissions (including RAJUK, CDA, RDA, or regional development authorities) for statutory clearances. Furthermore, our studio integrates and oversees all specialized consulting disciplines — structural computation, MEP (mechanical, electrical, plumbing), landscape ecology, acoustic design, and lighting engineering — as a cohesive project team.",
  },
  {
    question: "Does Plane Architect supervise construction on site and assist contractor tendering?",
    answer:
      "Yes. A great design relies on rigorous execution. We compile detailed tender documentation, assist you in evaluating contractor bids, and conduct regular on-site inspections. Our site architects monitor material quality, construction tolerances, and craftsmanship fidelity to guarantee the realized building matches the approved architectural drawings and specifications.",
  },
];

export default function AboutPage() {
  const { settings } = useSiteContent();
  const leadership = settings.about?.leadership?.length ? settings.about.leadership : FALLBACK_LEADERSHIP;
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

        {/* Client FAQs Section */}
        <section id="faq" className="mb-20 border-t border-neutral-200 dark:border-neutral-800 pt-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
            <div>
              <span className="font-body text-xs uppercase tracking-widest text-[#797979] dark:text-neutral-400 block mb-2">
                Client Guide & Inquiries
              </span>
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-normal text-black dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="font-body text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
              Practical guidance on how we collaborate with clients from concept inception to site completion.
            </p>
          </div>

          <div className="divide-y divide-neutral-200 dark:divide-white/10 border-y border-neutral-200 dark:border-white/10">
            {CLIENT_FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="py-5 sm:py-6 transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-start justify-between gap-6 text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="font-display text-base sm:text-lg font-normal text-black dark:text-white group-hover:opacity-75 transition-opacity">
                      {faq.question}
                    </span>
                    <span className="shrink-0 mt-1 flex h-6 w-6 items-center justify-center rounded-full border border-neutral-300 dark:border-white/20 text-neutral-600 dark:text-neutral-300 group-hover:border-black dark:group-hover:border-white transition-all">
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-4 pr-10 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 font-body animate-in fade-in slide-in-from-top-1 duration-200">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
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
