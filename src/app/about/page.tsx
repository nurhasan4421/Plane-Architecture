"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import NavigationDrawer from "@/components/NavigationDrawer";
import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";

const PARTNERS = [
  { name: "Bjarke Ingels", role: "Founder & Creative Director", office: "Copenhagen / New York" },
  { name: "Sheela Maini Søgaard", role: "Chief Executive Officer & Partner", office: "Copenhagen" },
  { name: "Kai-Uwe Bergmann", role: "Partner, Global Business Development", office: "New York" },
  { name: "David Zahle", role: "Partner & Architect", office: "Copenhagen" },
  { name: "Jakob Lange", role: "Partner & Head of BIG Ideas", office: "Copenhagen" },
  { name: "Finn Nørkjær", role: "Partner & Architect", office: "Copenhagen" },
  { name: "Daniel Sundlin", role: "Partner & Architect", office: "New York" },
  { name: "Leon Rost", role: "Partner & Architect", office: "New York" },
  { name: "Catherine Huang", role: "Partner & Architect", office: "Shenzhen" },
  { name: "João Albuquerque", role: "Partner & Architect", office: "Barcelona" },
  { name: "Giulia Frittoli", role: "Partner & Head of Landscape", office: "Copenhagen" },
];

export default function AboutPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between select-none">
      <Header
        onToggleDrawer={() => setIsDrawerOpen(!isDrawerOpen)}
        isDrawerOpen={isDrawerOpen}
        activeCategory="architecture"
      />

      <NavigationDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      <div className="pt-28 pb-20 px-6 md:px-16 lg:px-28 max-w-6xl mx-auto w-full">
        {/* Intro Manifesto */}
        <section className="mb-20">
          <span className="text-xs uppercase tracking-widest text-[#797979] block mb-3">
            About Bjarke Ingels Group
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-light leading-tight tracking-tight text-black max-w-4xl mb-10">
            BIG is an architectural laboratory dedicated to exploring how society evolutes and how
            buildings can actively enrich human life.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-sm leading-relaxed text-neutral-700">
            <p>
              Founded in 2005 by Bjarke Ingels in Copenhagen, BIG has evolved into a global studio of
              more than 700 architects, landscape professionals, urbanists, researchers, and
              inventors across Copenhagen, New York, London, Barcelona, and Shenzhen.
            </p>
            <p>
              Historically, the architectural field has been dominated by two opposing ideas: a
              pragmatic, boring box that conforms to all standards, or an eccentric, avant-garde form
              unsuited to real life. BIG operates in the fertile overlap between the pragmatic and the
              utopian.
            </p>
          </div>
        </section>

        {/* Hedonistic Sustainability */}
        <section id="sustainability" className="mb-20 border-t border-neutral-200 pt-16">
          <span className="text-xs uppercase tracking-widest text-[#797979] block mb-2">
            Design Philosophy
          </span>
          <h2 className="text-xl sm:text-2xl font-normal text-black mb-6">
            Hedonistic Sustainability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-sm leading-relaxed text-neutral-700">
            <p>
              Sustainability cannot be a moral sacrifice or an aesthetic compromise. Instead,
              ecological design should improve quality of life and expand the possibilities of human
              enjoyment. A clean harbor where people can swim, or a power plant on whose roof citizens
              can ski, proves that sustainable architecture creates a richer everyday experience.
            </p>
            <p>
              By treating ecological challenges as creative catalysts, our projects integrate passive
              climatization, mass timber systems, renewable micro-grids, and circular materials into
              sculptural public works.
            </p>
          </div>
        </section>

        {/* Global Partners */}
        <section id="people" className="mb-20 border-t border-neutral-200 pt-16">
          <span className="text-xs uppercase tracking-widest text-[#797979] block mb-2">
            Leadership
          </span>
          <h2 className="text-xl sm:text-2xl font-normal text-black mb-8">Studio Partners</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {PARTNERS.map((partner, idx) => (
              <div key={idx} className="border-b border-neutral-100 pb-4">
                <h3 className="text-sm font-semibold uppercase text-black">{partner.name}</h3>
                <p className="text-xs text-[#797979] mt-0.5">{partner.role}</p>
                <p className="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
                  {partner.office}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Careers & Call to Action */}
        <section id="careers" className="border-t border-neutral-200 pt-16 text-center">
          <h2 className="text-xl font-normal text-black mb-2">Join the Laboratory</h2>
          <p className="text-xs text-[#797979] uppercase tracking-wider max-w-lg mx-auto mb-6">
            We are always seeking passionate architects, landscape designers, computational specialists,
            and model makers.
          </p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="px-6 py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Apply or Contact Us
          </button>
        </section>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Footer onOpenContact={() => setIsContactOpen(true)} />
    </div>
  );
}
