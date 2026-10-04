"use client";

import React, { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitContactInquiry } from "@/lib/supabase";

import { useSiteContent } from "@/components/SiteContentProvider";

export default function ContactPage() {
  const { settings } = useSiteContent();
  const address = settings.address || "Gulshan Architectural Quarter, Dhaka 1212, Bangladesh";
  const phone = settings.phone || "+8801234567891";
  const email = settings.email || "hello@planearchitect.com";
  const socialLinks = settings.socialLinks?.length ? settings.socialLinks : [
    { label: "Instagram", url: "https://www.instagram.com/plane.architect/" },
    { label: "LinkedIn", url: "https://www.linkedin.com/company/plane-architect/" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "New Project",
    budget: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const result = await submitContactInquiry({
        name: formData.name,
        email: formData.email,
        office: "Dhaka (Headquarters)",
        type: formData.type,
        message: `Estimated budget: ${formData.budget || "Not specified"}\n\n${formData.message}`,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.error || "Unable to send your inquiry. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0e0e0e] text-black dark:text-[#f5f5f5] transition-colors duration-200">
      <Header activeCategory="architecture" />

      <main className="pt-[86px] font-body">
        <section className="mx-auto grid max-w-[1440px] gap-12 px-5 pb-14 pt-10 sm:px-8 md:gap-16 md:pb-20 md:pt-16 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:px-16">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">{settings.siteName} / Dhaka</p>
            <h1 className="max-w-3xl font-display text-4xl font-normal leading-tight sm:text-5xl lg:text-6xl text-black dark:text-white">
              {settings.contact?.heading || "LET'S MAKE ROOM FOR WHAT'S NEXT."}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg sm:leading-8">
              {settings.contact?.intro || "Tell us about the place, the people, and the possibility. Our Dhaka studio will be in touch."}
            </p>
          </div>

          <div className="relative min-h-[260px] overflow-hidden bg-[#eef2ec] dark:bg-[#18201a] sm:min-h-[340px] lg:min-h-[390px]" aria-hidden="true">
            <svg viewBox="0 0 620 430" fill="none" className="absolute inset-0 h-full w-full" role="img">
              <path d="M0 360H620M0 390H620M56 0V430M96 0V430M136 0V430M176 0V430M216 0V430M256 0V430M296 0V430M336 0V430M376 0V430M416 0V430M456 0V430M496 0V430M536 0V430M576 0V430" stroke="#d7dfd5" strokeWidth="1" />
              <path d="M86 360V213L179 151V360M179 360V91L310 151V360M310 360V184L430 115V360M430 360V220L535 175V360" stroke="#294b3d" strokeWidth="3" />
              <path d="M86 213L179 151L310 91L430 115L535 175M179 151V91M310 151V91M430 115V220M86 260H179M179 260H310M310 260H430M430 260H535" stroke="#294b3d" strokeWidth="2" />
              <path d="M111 238H151V282H111zM205 126H239V169H205zM255 149H289V192H255zM337 206H379V250H337zM457 236H497V280H457z" stroke="#294b3d" strokeWidth="2" />
              <path d="M59 361H555" stroke="#d15d43" strokeWidth="4" />
              <path d="M112 361C112 338 130 320 153 320C176 320 194 338 194 361M455 361C455 338 473 320 496 320C519 320 537 338 537 361" stroke="#7c967d" strokeWidth="3" />
              <circle cx="310" cy="61" r="11" fill="#d15d43" />
              <path d="M310 42V20M298 61H276M322 61H344" stroke="#d15d43" strokeWidth="2" />
            </svg>
            <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.18em] text-[#45604f] dark:text-[#7fa58d]">A studio shaped by place</span>
          </div>
        </section>

        <section className="border-y border-neutral-200 dark:border-neutral-800 bg-[#f7f8f5] dark:bg-[#121212]">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-12 sm:px-8 md:grid-cols-[0.85fr_1.15fr] md:gap-16 md:py-16 lg:px-16">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">One studio, open to the world</p>
              <h2 className="font-display text-3xl font-normal sm:text-4xl text-black dark:text-white">Visit or get in touch</h2>
              <div className="mt-8 space-y-5 text-base leading-7 text-neutral-700 dark:text-neutral-300">
                <a href={`https://maps.google.com/?q=${encodeURIComponent(address)}`} target="_blank" rel="noreferrer" className="flex items-start gap-4 hover:text-black dark:hover:text-white transition-colors">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#476653] dark:text-[#6fa380]" aria-hidden="true" />
                  <span>{address}</span>
                </a>
                <a href={`tel:${phone}`} className="flex items-center gap-4 hover:text-black dark:hover:text-white transition-colors">
                  <Phone className="h-5 w-5 shrink-0 text-[#476653] dark:text-[#6fa380]" aria-hidden="true" />
                  <span>{phone}</span>
                </a>
                <a href={`mailto:${email}`} className="flex items-center gap-4 hover:text-black dark:hover:text-white transition-colors">
                  <Mail className="h-5 w-5 shrink-0 text-[#476653] dark:text-[#6fa380]" aria-hidden="true" />
                  <span>{email}</span>
                </a>
              </div>
              <div className="mt-8 flex items-center gap-3">
                {socialLinks.map(({ label, url }) => {
                  const isInstagram = label.toLowerCase().includes("instagram");
                  return (
                    <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} title={label} className="flex h-11 w-11 items-center justify-center border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 transition-colors hover:border-black dark:hover:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black">
                      {isInstagram ? (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
                          <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
                          <circle cx="17.5" cy="6.8" r="1" fill="currentColor" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                          <path d="M5.2 8.7a1.9 1.9 0 1 0 0-3.8 1.9 1.9 0 0 0 0 3.8ZM3.6 10h3.2v10H3.6V10Zm5.2 0h3.1v1.4h.1c.4-.8 1.5-1.7 3.1-1.7 3.3 0 3.9 2.1 3.9 4.9V20h-3.2v-4.8c0-1.2 0-2.8-1.8-2.8s-2.1 1.3-2.1 2.7V20H8.8V10Z" />
                        </svg>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-800 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
              <p className="mb-6 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Project inquiries</p>
              {submitted ? (
                <div className="border-l-2 border-[#476653] dark:border-[#6fa380] bg-white dark:bg-[#181818] p-6 sm:p-8">
                  <h3 className="font-display text-2xl text-black dark:text-white">Thank you, {formData.name}.</h3>
                  <p className="mt-3 text-base leading-7 text-neutral-600 dark:text-neutral-300">Your inquiry has been sent. Our Dhaka studio will follow up at {formData.email}.</p>
                  <button type="button" onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", type: "New Project", budget: "", message: "" }); }} className="mt-6 text-sm underline underline-offset-4 text-black dark:text-white">Send another inquiry</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
                  <label className="grid gap-2 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Your name *
                    <input required autoComplete="name" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] px-4 text-base normal-case tracking-normal text-black dark:text-white outline-none focus:border-black dark:focus:border-white" placeholder="Name" />
                  </label>
                  <label className="grid gap-2 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Email address *
                    <input required type="email" autoComplete="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] px-4 text-base normal-case tracking-normal text-black dark:text-white outline-none focus:border-black dark:focus:border-white" placeholder="you@example.com" />
                  </label>
                  <label className="grid gap-2 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Inquiry type
                    <select value={formData.type} onChange={(event) => setFormData({ ...formData, type: event.target.value })} className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] px-4 text-base normal-case tracking-normal text-black dark:text-white outline-none focus:border-black dark:focus:border-white">
                      {(settings.contact?.inquiryTypes?.length ? settings.contact.inquiryTypes : ["New Project", "Masterplanning", "Press & Media", "Careers", "General"]).map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400">
                    Estimated budget
                    <select value={formData.budget} onChange={(event) => setFormData({ ...formData, budget: event.target.value })} className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] px-4 text-base normal-case tracking-normal text-black dark:text-white outline-none focus:border-black dark:focus:border-white">
                      <option value="">Select a range</option>
                      {(settings.contact?.budgetOptions?.length ? settings.contact.budgetOptions : ["Under BDT 10 lakh", "BDT 10-50 lakh", "BDT 50 lakh-2 crore", "Above BDT 2 crore", "Not sure yet"]).map((budget) => (
                        <option key={budget} value={budget}>{budget}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-2 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 sm:col-span-2">
                    Tell us about your project *
                    <textarea required rows={5} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} className="resize-y border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#181818] px-4 py-3 text-base normal-case tracking-normal text-black dark:text-white outline-none focus:border-black dark:focus:border-white" placeholder="Location, project type, timing, or anything else we should know" />
                  </label>
                  {errorMessage && <p role="alert" className="text-sm text-red-700 dark:text-red-400 sm:col-span-2">{errorMessage}</p>}
                  <button type="submit" disabled={submitting} className="min-h-12 bg-black dark:bg-white px-6 text-sm uppercase tracking-widest text-white dark:text-black transition-colors hover:bg-[#294b3d] dark:hover:bg-neutral-200 disabled:opacity-60 sm:col-span-2 cursor-pointer font-medium">
                    {submitting ? "Sending inquiry..." : "Send inquiry"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}