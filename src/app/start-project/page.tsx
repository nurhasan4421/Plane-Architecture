"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Check, Plus, Minus, Mail, Phone } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";
import { submitContactInquiry } from "@/lib/supabase";

/* ──────── Default Step Data ──────── */
const DEFAULT_STEPS = [
  {
    number: "01",
    title: "Project Scope & Vision",
    subtitle: "Tell us about your dream",
    description:
      "Every great building starts with a conversation. Share your vision — the site location, land area, intended use (residential, commercial, institutional), and any spatial inspirations. We will understand the context, constraints, and aspirations before drawing a single line.",
    fields: [
      { id: "projectType", label: "Project Type", type: "select", options: ["Residential", "Commercial", "Institutional", "Mixed-Use", "Interior", "Landscape", "Masterplan", "Other"] },
      { id: "location", label: "Site Location", type: "text", placeholder: "City, area, or full address" },
      { id: "landArea", label: "Approximate Land Area", type: "text", placeholder: "e.g. 5 katha, 10,000 sqft" },
      { id: "vision", label: "Your Vision (brief)", type: "textarea", placeholder: "Describe your dream project in a few sentences..." },
    ],
  },
  {
    number: "02",
    title: "Budget & Investment",
    subtitle: "Financial planning from day one",
    description:
      "Transparent budgeting is central to our practice. Share your estimated construction budget so we can align the design ambition with financial feasibility. Our fee structure is milestone-based with no hidden costs — you will know exactly what you are investing at every stage.",
    fields: [
      { id: "budget", label: "Estimated Construction Budget", type: "select", options: ["Under BDT 50 Lakh", "BDT 50 Lakh – 1 Crore", "BDT 1 – 3 Crore", "BDT 3 – 10 Crore", "Above BDT 10 Crore", "Not decided yet"] },
      { id: "floors", label: "Number of Floors (if applicable)", type: "text", placeholder: "e.g. G+5, or 3 floors" },
      { id: "budgetNotes", label: "Any budget considerations", type: "textarea", placeholder: "Phased construction, material preferences, etc." },
    ],
  },
  {
    number: "03",
    title: "Timeline & Milestones",
    subtitle: "When do you want to begin?",
    description:
      "Architecture has rhythm — from concept sketches to construction supervision. Share your ideal project timeline: when you want to start design, when you need municipal approvals, and your target completion date. We will create a phased roadmap tailored to your schedule.",
    fields: [
      { id: "startDate", label: "Preferred Design Start", type: "select", options: ["Immediately", "Within 1 month", "Within 3 months", "Within 6 months", "Flexible / Not sure"] },
      { id: "completionTarget", label: "Target Completion", type: "text", placeholder: "e.g. December 2027, or 18 months" },
      { id: "timelineNotes", label: "Any scheduling constraints", type: "textarea", placeholder: "Events, seasons, permit deadlines..." },
    ],
  },
  {
    number: "04",
    title: "Your Details",
    subtitle: "Let's get in touch",
    description:
      "Share your contact details and we will schedule an initial consultation — either at our Dhaka studio or virtually. This first meeting is complimentary and is where we explore whether we are the right partners for your project.",
    fields: [
      { id: "name", label: "Full Name", type: "text", placeholder: "Your name", required: true },
      { id: "email", label: "Email Address", type: "email", placeholder: "you@example.com", required: true },
      { id: "phone", label: "Phone Number", type: "text", placeholder: "+880 1XXX XXX XXX" },
      { id: "referral", label: "How did you hear about us?", type: "select", options: ["Google Search", "Instagram", "LinkedIn", "Friend / Referral", "Publication / Press", "Other"] },
    ],
  },
];

const PROJECT_FAQS = [
  {
    question: "How long does the design phase typically take?",
    answer:
      "Design timelines vary by project scale. A residential project typically takes 3-5 months from concept to construction documentation. Larger commercial or institutional projects may require 6-12 months. We establish clear milestones at the start so you always know what to expect.",
  },
  {
    question: "What is included in your architectural fee?",
    answer:
      "Our fee covers the complete design journey: site analysis, concept design, schematic design, design development, construction documentation, permitting coordination, and periodic site supervision. Structural, MEP, and landscape engineering coordination is also included as part of our integrated service.",
  },
  {
    question: "Do you work outside Dhaka?",
    answer:
      "Yes. While our studio is based in Dhaka, we undertake projects across Bangladesh and internationally. For distant sites, we conduct initial visits and leverage digital collaboration tools for ongoing design reviews, supplemented by key milestone site visits.",
  },
  {
    question: "Can I make changes during the design process?",
    answer:
      "Absolutely. Our design process is iterative and collaborative. We present options at each milestone and welcome your feedback. Major scope changes after design development may require timeline and fee adjustments, which we discuss transparently before proceeding.",
  },
  {
    question: "What happens after the design is approved?",
    answer:
      "We prepare detailed construction tender documents, assist you in evaluating contractor bids, and provide construction supervision. Our site architects conduct regular inspections to ensure the built outcome matches the approved design in quality and precision.",
  },
  {
    question: "Is the initial consultation free?",
    answer:
      "Yes. The first consultation — whether at our studio or virtually — is complimentary. It is an opportunity for both parties to discuss the project vision, understand the scope, and determine if we are the right fit to work together.",
  },
];

interface FieldConfig {
  id: string;
  label: string;
  type: string;
  placeholder?: string;
  options?: string[];
  required?: boolean;
}

export default function StartProjectPage() {
  const { settings } = useSiteContent();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const steps = DEFAULT_STEPS;
  const totalSteps = steps.length;
  const step = steps[currentStep];

  const updateField = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const canProceed = () => {
    const requiredFields = step.fields.filter((f: FieldConfig) => f.required);
    return requiredFields.every((f: FieldConfig) => formData[f.id]?.trim());
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage("");

    try {
      const message = [
        `Project Type: ${formData.projectType || "N/A"}`,
        `Location: ${formData.location || "N/A"}`,
        `Land Area: ${formData.landArea || "N/A"}`,
        `Vision: ${formData.vision || "N/A"}`,
        `Budget: ${formData.budget || "N/A"}`,
        `Floors: ${formData.floors || "N/A"}`,
        `Budget Notes: ${formData.budgetNotes || "N/A"}`,
        `Preferred Start: ${formData.startDate || "N/A"}`,
        `Target Completion: ${formData.completionTarget || "N/A"}`,
        `Timeline Notes: ${formData.timelineNotes || "N/A"}`,
        `Referral: ${formData.referral || "N/A"}`,
        `Phone: ${formData.phone || "N/A"}`,
      ].join("\n");

      const result = await submitContactInquiry({
        name: formData.name || "Anonymous",
        email: formData.email || "",
        office: "Dhaka (Headquarters)",
        type: "New Project Inquiry (Start Project Flow)",
        message,
      });

      if (result.success) {
        setSubmitted(true);
      } else {
        setErrorMessage(result.error || "Unable to submit. Please try again.");
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FieldConfig) => {
    const value = formData[field.id] || "";

    if (field.type === "select" && field.options) {
      return (
        <label key={field.id} className="grid gap-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {field.label} {field.required && "*"}
          </span>
          <select
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
          >
            <option value="">Select...</option>
            {field.options.map((opt: string) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      );
    }

    if (field.type === "textarea") {
      return (
        <label key={field.id} className="grid gap-2 sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            {field.label} {field.required && "*"}
          </span>
          <textarea
            rows={4}
            value={value}
            onChange={(e) => updateField(field.id, e.target.value)}
            placeholder={field.placeholder}
            required={field.required}
            className="resize-y border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
          />
        </label>
      );
    }

    return (
      <label key={field.id} className="grid gap-2">
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
          {field.label} {field.required && "*"}
        </span>
        <input
          type={field.type || "text"}
          value={value}
          onChange={(e) => updateField(field.id, e.target.value)}
          placeholder={field.placeholder}
          required={field.required}
          className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
        />
      </label>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] transition-colors duration-200">
      <Header activeCategory="architecture" />

      <main className="pt-[86px] font-body">
        {/* Hero */}
        <section className="mx-auto max-w-[1440px] px-5 pt-10 pb-8 sm:px-8 sm:pt-16 sm:pb-12 lg:px-16">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            {settings.siteName} / New Commission
          </p>
          <h1 className="max-w-3xl font-display text-3xl font-normal leading-tight sm:text-4xl lg:text-5xl text-black dark:text-white">
            Begin Your Architectural Journey
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-neutral-600 dark:text-neutral-300 sm:text-lg sm:leading-8">
            Four simple steps to help us understand your project. No commitment required — just the start of a thoughtful conversation about space, place, and possibility.
          </p>
        </section>

        {/* Step Progress */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-6">
          <div className="flex items-center gap-0">
            {steps.map((s, idx) => (
              <React.Fragment key={idx}>
                <button
                  onClick={() => setCurrentStep(idx)}
                  className={`relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 text-sm font-semibold transition-all duration-300 cursor-pointer shrink-0 ${
                    idx === currentStep
                      ? "bg-black dark:bg-white text-white dark:text-black scale-110"
                      : idx < currentStep
                      ? "bg-[#294b3d] text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {idx < currentStep ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    s.number
                  )}
                </button>
                {idx < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-[2px] transition-colors duration-300 ${
                      idx < currentStep
                        ? "bg-[#294b3d]"
                        : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 flex justify-between">
            {steps.map((s, idx) => (
              <span
                key={idx}
                className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors ${
                  idx === currentStep
                    ? "text-black dark:text-white font-semibold"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
                style={{ width: `${100 / totalSteps}%`, textAlign: idx === 0 ? "left" : idx === totalSteps - 1 ? "right" : "center" }}
              >
                <span className="hidden sm:inline">{s.title}</span>
                <span className="sm:hidden">{s.number}</span>
              </span>
            ))}
          </div>
        </section>

        {/* Current Step Content */}
        {!submitted ? (
          <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-16">
            <div className="border border-neutral-200 dark:border-neutral-700 bg-[#fafaf9] dark:bg-[#252525] p-6 sm:p-10 lg:p-14 transition-colors duration-200">
              <div className="mb-8">
                <p className="text-xs uppercase tracking-[0.2em] text-[#294b3d] dark:text-[#6fa380] font-medium mb-2">
                  Step {step.number} of {String(totalSteps).padStart(2, "0")}
                </p>
                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-normal text-black dark:text-white">
                  {step.title}
                </h2>
                <p className="mt-1 text-sm uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                  {step.subtitle}
                </p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300">
                  {step.description}
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {step.fields.map((field: FieldConfig) => renderField(field))}
              </div>

              {errorMessage && (
                <p role="alert" className="mt-4 text-sm text-red-700 dark:text-red-400">
                  {errorMessage}
                </p>
              )}

              {/* Step Navigation */}
              <div className="mt-10 flex items-center justify-between">
                <button
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-wider transition-colors cursor-pointer ${
                    currentStep === 0
                      ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                      : "text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-600"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>

                {currentStep < totalSteps - 1 ? (
                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black transition-colors hover:bg-[#294b3d] dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !canProceed()}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-[#294b3d] text-white transition-colors hover:bg-[#1d3a2d] disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Success State */
          <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-16">
            <div className="border-l-4 border-[#294b3d] bg-[#fafaf9] dark:bg-[#252525] p-8 sm:p-12 lg:p-16 text-center transition-colors">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-[#294b3d] text-white">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-black dark:text-white">
                Thank you, {formData.name || "there"}.
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-base leading-7 text-neutral-600 dark:text-neutral-300">
                Your project inquiry has been received. Our Dhaka studio will follow up at{" "}
                <strong className="text-black dark:text-white">{formData.email}</strong> within 2 business days.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black transition-colors hover:bg-[#294b3d] dark:hover:bg-neutral-200"
                >
                  Browse Projects
                </Link>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                    setFormData({});
                  }}
                  className="px-6 py-3 text-xs font-medium uppercase tracking-wider border border-neutral-300 dark:border-neutral-600 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="border-y border-neutral-200 dark:border-neutral-800 bg-[#f7f8f5] dark:bg-[#1a1a1a] py-16 sm:py-24 transition-colors duration-200">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-6">
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
                  Project Guide
                </p>
                <h2 className="font-display text-3xl font-normal sm:text-4xl lg:text-5xl text-black dark:text-white">
                  Common Questions
                </h2>
              </div>
              <p className="max-w-md text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                Everything you need to know about working with Plane Architect on your next project.
              </p>
            </div>

            <div className="divide-y divide-neutral-200 dark:divide-white/10 border-y border-neutral-200 dark:border-white/10">
              {PROJECT_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-6 sm:py-7">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="flex w-full items-start justify-between gap-6 text-left group cursor-pointer focus:outline-none"
                    >
                      <span className="font-display text-lg sm:text-xl font-normal text-black dark:text-white group-hover:opacity-75 transition-opacity">
                        {faq.question}
                      </span>
                      <span className="shrink-0 mt-1 flex h-7 w-7 items-center justify-center border border-neutral-300 dark:border-white/20 text-neutral-600 dark:text-neutral-300 group-hover:border-black dark:group-hover:border-white transition-colors">
                        {isOpen ? (
                          <Minus className="h-3.5 w-3.5 transition-transform duration-300" />
                        ) : (
                          <Plus className="h-3.5 w-3.5 transition-transform duration-300" />
                        )}
                      </span>
                    </button>

                    <div
                      className={`grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-4"
                          : "grid-rows-[0fr] opacity-0 mt-0"
                      }`}
                    >
                      <div className="overflow-hidden min-h-0">
                        <div className="max-w-4xl text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300 font-body pb-2">
                          {faq.answer}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Get in Touch Mini Section */}
        <section className="bg-white dark:bg-[#303030] py-16 sm:py-20 transition-colors duration-200">
          <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 text-center">
            <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white mb-4">
              Prefer to talk directly?
            </h2>
            <p className="max-w-lg mx-auto text-base text-neutral-600 dark:text-neutral-300 leading-7 mb-8">
              Our door is always open. Reach out directly and we will be happy to discuss your project in person or over a call.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 px-6 py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-600 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Mail className="h-4 w-4" />
                {settings.email}
              </a>
              <a
                href={`tel:${settings.phone}`}
                className="flex items-center gap-3 px-6 py-3 text-sm font-medium border border-neutral-300 dark:border-neutral-600 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Phone className="h-4 w-4" />
                {settings.phone}
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
