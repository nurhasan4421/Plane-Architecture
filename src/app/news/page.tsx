"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import NavigationDrawer from "@/components/NavigationDrawer";
import ContactModal from "@/components/ContactModal";
import Footer from "@/components/Footer";
import { NEWS_ITEMS } from "@/lib/projects-data";

export default function NewsPage() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col justify-between select-none font-body">
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
        <div className="mb-12">
          <span className="font-body text-xs uppercase tracking-widest text-[#797979] block mb-2">
            Plane Architect • Dhaka Dispatches
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-normal text-black tracking-tight">
            News, Monographs & Dispatches
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {NEWS_ITEMS.map((item) => (
            <article key={item.id} className="group flex flex-col border-b border-neutral-100 pb-8">
              <div className="relative aspect-[16/9] overflow-hidden bg-neutral-100 mb-4">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex items-center gap-3 text-[10px] uppercase text-[#797979] tracking-wider mb-2 font-body">
                <span>{item.date}</span>
                <span>•</span>
                <span className="text-black font-semibold">{item.category}</span>
                <span>•</span>
                <span>{item.readTime}</span>
              </div>

              <h2 className="font-display text-lg font-normal leading-snug text-black group-hover:opacity-75 transition-opacity mb-2">
                {item.title}
              </h2>

              <p className="font-body text-xs text-neutral-600 leading-relaxed font-light">
                {item.excerpt}
              </p>
            </article>
          ))}
        </div>
      </div>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <Footer onOpenContact={() => setIsContactOpen(true)} />
    </div>
  );
}
