"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  X,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { submitContactInquiry } from "@/lib/supabase";

/* ──────── Country Codes ──────── */
interface CountryOption {
  code: string;
  country: string;
  flag: string;
}

const COUNTRY_CODES: CountryOption[] = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+1", country: "US / Canada", flag: "🇺🇸" },
  { code: "+44", country: "UK", flag: "🇬🇧" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
];

/* ──────── Map Presets ──────── */
const MAP_HOTSPOTS = [
  { name: "Gulshan", city: "Dhaka", coords: "23.7925° N, 90.4078° E", code: "8J8V+3R" },
  { name: "Banani", city: "Dhaka", coords: "23.7937° N, 90.4043° E", code: "8J8V+HG" },
  { name: "Dhanmondi", city: "Dhaka", coords: "23.7461° N, 90.3742° E", code: "8H7C+CR" },
  { name: "Uttara", city: "Dhaka", coords: "23.8759° N, 90.3795° E", code: "8HVH+77" },
  { name: "Bashundhara", city: "Dhaka", coords: "23.8191° N, 90.4326° E", code: "8J9M+JC" },
  { name: "Baridhara", city: "Dhaka", coords: "23.7998° N, 90.4223° E", code: "8JXX+WW" },
  { name: "Purbachal", city: "Dhaka", coords: "23.8344° N, 90.5186° E", code: "8GMW+PG" },
  { name: "Nasirabad", city: "Chittagong", coords: "22.3687° N, 91.8219° E", code: "9R9C+FQ" },
  { name: "Zindabazar", city: "Sylhet", coords: "24.8949° N, 91.8687° E", code: "VVW9+XF" },
  { name: "Marine Drive", city: "Cox's Bazar", coords: "21.4272° N, 91.9702° E", code: "CRGW+V3" },
];

const FLOOR_PRESETS = [
  "1 Floor (Ground)",
  "2 Floors (G+1)",
  "3 Floors (G+2)",
  "4 Floors (G+3)",
  "5 Floors (G+4)",
  "6 Floors (G+5)",
  "7 Floors (G+6)",
  "8 Floors (G+7)",
  "9 Floors (G+8)",
  "10 Floors (G+9)",
  "12 Floors",
  "14 Floors",
  "16 Floors",
  "18 Floors",
  "20 Floors",
];

const STEP_TITLES = [
  "Scope & Typology",
  "Budget & Floors",
  "Timeline",
  "Contact Details",
];

const PROJECT_FAQS = [
  {
    question: "How long does the design phase typically take?",
    answer:
      "A residential commission typically takes 3 to 5 months from concept through construction drawings. Larger commercial and masterplan developments require 6 to 12 months.",
  },
  {
    question: "What is included in the architectural scope?",
    answer:
      "Site feasibility, concept exploration, schematic design, statutory approval submissions, engineering coordination, and periodic site construction supervision.",
  },
  {
    question: "Do you undertake projects outside Dhaka?",
    answer:
      "Yes. We design and deliver projects throughout Bangladesh and internationally, combining site inspections with structured digital reviews.",
  },
  {
    question: "Is the first briefing consultation complimentary?",
    answer:
      "Yes. The initial consultation at our Dhaka studio or online is complimentary to review your project goals and determine suitability.",
  },
];

export default function StartProjectPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({
    countryCode: "+880",
    phoneDigits: "",
    floorsPreset: "",
    floorsManual: "",
    referralSelect: "",
    referralManual: "",
  });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Map Picker Modal
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSearch, setMapSearch] = useState("");
  const [selectedHotspot, setSelectedHotspot] = useState(MAP_HOTSPOTS[1]);

  // Calendar refs
  const startDateRef = useRef<HTMLInputElement>(null);
  const completionDateRef = useRef<HTMLInputElement>(null);

  const updateField = (id: string, value: string) => {
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  /* Validation */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const isEmailValid = Boolean(formData.email && emailRegex.test(formData.email.trim()));
  const cleanPhone = (formData.phoneDigits || "").replace(/\D/g, "");
  const isPhoneValid =
    formData.countryCode === "+880"
      ? cleanPhone.length === 10 || cleanPhone.length === 11
      : cleanPhone.length >= 7 && cleanPhone.length <= 15;

  const canContinue = () => {
    if (currentStep === 0) return Boolean(formData.projectType?.trim());
    if (currentStep === 1) return Boolean(formData.budget?.trim());
    if (currentStep === 2) return true;
    if (currentStep === 3) return Boolean(formData.name?.trim()) && isEmailValid && isPhoneValid;
    return true;
  };

  const handleNext = () => {
    setErrorMessage("");
    if (!canContinue()) {
      if (currentStep === 0) setErrorMessage("Please select a project typology.");
      else if (currentStep === 1) setErrorMessage("Please select an estimated budget.");
      else if (currentStep === 3) {
        if (!formData.name?.trim()) setErrorMessage("Please enter your name.");
        else if (!isEmailValid) setErrorMessage("Please enter a valid email address.");
        else if (!isPhoneValid) setErrorMessage("Please enter a valid phone number (10 or 11 digits).");
      }
      return;
    }
    setCurrentStep((s) => s + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setErrorMessage("");
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!canContinue()) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const fullPhone = `${formData.countryCode} ${cleanPhone}`.trim();
      const floorInfo = [formData.floorsPreset, formData.floorsManual].filter(Boolean).join(" / ") || "N/A";
      const referralInfo = [formData.referralSelect, formData.referralManual].filter(Boolean).join(" - ") || "N/A";

      const message = [
        `Project Typology: ${formData.projectType || "N/A"}`,
        `Site Location: ${formData.location || "N/A"}`,
        `Land Area: ${formData.landArea || "N/A"}`,
        `Vision: ${formData.vision || "N/A"}`,
        `Budget: ${formData.budget || "N/A"}`,
        `Floors: ${floorInfo}`,
        `Budget Notes: ${formData.budgetNotes || "N/A"}`,
        `Start Date: ${formData.startDate || "N/A"}`,
        `Target Completion: ${formData.completionTarget || "N/A"}`,
        `Timeline Notes: ${formData.timelineNotes || "N/A"}`,
        `Referral: ${referralInfo}`,
        `Phone: ${fullPhone}`,
      ].join("\n");

      const result = await submitContactInquiry({
        name: formData.name || "Anonymous",
        email: formData.email || "",
        office: "Dhaka (Headquarters)",
        type: "Start Project Inquiry",
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

  const googleMapsUrl = formData.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`
    : null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#303030] text-black dark:text-[#f5f5f5] transition-colors duration-200">
      <Header activeCategory="architecture" />

      <main className="pt-20 sm:pt-24 pb-16 font-body">
        {/* Clean, Minimalist Header */}
        <section className="mx-auto max-w-3xl px-5 sm:px-8 text-center pt-6 pb-6">
          <p className="text-[11px] uppercase tracking-[0.24em] text-neutral-400 dark:text-neutral-500 mb-2 font-medium">
            New Commission
          </p>
          <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl font-normal text-black dark:text-white tracking-tight">
            Start a Project
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            Four simple steps to outline your commission.
          </p>
        </section>

        {/* Clean Step Progress Bar */}
        <section className="mx-auto max-w-3xl px-5 sm:px-8 mb-6">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
            <span>Step {currentStep + 1} of 4</span>
            <span className="text-black dark:text-white font-semibold">
              {STEP_TITLES[currentStep]}
            </span>
          </div>
          {/* Progress track */}
          <div className="h-1 w-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            <div
              className="h-full bg-black dark:bg-white transition-all duration-300 ease-out"
              style={{ width: `${((currentStep + 1) / 4) * 100}%` }}
            />
          </div>
        </section>

        {/* Form Container */}
        <div className="mx-auto max-w-3xl px-5 sm:px-8">
          {!submitted ? (
            <div className="border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#262626] p-5 sm:p-8 lg:p-10 transition-colors">
              
              {/* ──────── STEP 1: SCOPE ──────── */}
              {currentStep === 0 && (
                <div className="space-y-5">
                  <div className="border-b border-neutral-100 dark:border-white/10 pb-3">
                    <h2 className="font-display text-xl sm:text-2xl text-black dark:text-white">
                      Project Scope
                    </h2>
                  </div>

                  {/* Typology */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Typology *
                    </label>
                    <select
                      value={formData.projectType || ""}
                      onChange={(e) => updateField("projectType", e.target.value)}
                      className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                    >
                      <option value="">Select project type...</option>
                      {[
                        "Residential (Private Residence / Villa)",
                        "Residential (Multi-Family / Apartments)",
                        "Commercial (Office / Headquarters)",
                        "Hospitality (Resort / Hotel / Pavilion)",
                        "Institutional & Cultural",
                        "Landscape Architecture",
                        "Urban Masterplanning",
                        "Interior Architecture",
                        "Other",
                      ].map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Site Location with Map Pin & Link */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400">
                        Site Location
                      </label>
                      {googleMapsUrl && (
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-[#294b3d] dark:text-[#6fa380] hover:underline"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span>Google Maps</span>
                        </a>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.location || ""}
                        onChange={(e) => updateField("location", e.target.value)}
                        placeholder="Road, area, city or coordinates"
                        className="flex-1 h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setIsMapModalOpen(true)}
                        className="h-11 px-3 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white text-xs font-medium flex items-center gap-1 shrink-0 cursor-pointer"
                        title="Pick location on map"
                      >
                        <MapPin className="h-4 w-4 text-red-500" />
                        <span className="hidden sm:inline">Map</span>
                      </button>
                    </div>
                  </div>

                  {/* Land Area */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Land Area
                    </label>
                    <input
                      type="text"
                      value={formData.landArea || ""}
                      onChange={(e) => updateField("landArea", e.target.value)}
                      placeholder="e.g. 5 Katha, 10,000 sqft, 2 Bigha"
                      className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>

                  {/* Vision */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Brief Vision
                    </label>
                    <textarea
                      rows={3}
                      value={formData.vision || ""}
                      onChange={(e) => updateField("vision", e.target.value)}
                      placeholder="Functional goals, natural light, aesthetics..."
                      className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] p-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors resize-y"
                    />
                  </div>
                </div>
              )}

              {/* ──────── STEP 2: BUDGET & SCALE ──────── */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  <div className="border-b border-neutral-100 dark:border-white/10 pb-3">
                    <h2 className="font-display text-xl sm:text-2xl text-black dark:text-white">
                      Budget & Scale
                    </h2>
                  </div>

                  {/* Budget */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Estimated Construction Budget *
                    </label>
                    <select
                      value={formData.budget || ""}
                      onChange={(e) => updateField("budget", e.target.value)}
                      className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                    >
                      <option value="">Select budget range...</option>
                      {[
                        "Under BDT 50 Lakh",
                        "BDT 50 Lakh – 1 Crore",
                        "BDT 1 – 3 Crore",
                        "BDT 3 – 5 Crore",
                        "BDT 5 – 10 Crore",
                        "Above BDT 10 Crore",
                        "Flexible / To be benchmarked",
                      ].map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>

                  {/* Floors (1-20 setup + manual, strictly no negative) */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Number of Floors
                    </label>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <select
                        value={formData.floorsPreset || ""}
                        onChange={(e) => {
                          updateField("floorsPreset", e.target.value);
                          if (e.target.value) {
                            updateField("floorsManual", e.target.value.split(" ")[0]);
                          }
                        }}
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="">Choose 1 to 20 floors...</option>
                        {FLOOR_PRESETS.map((f) => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>

                      <input
                        type="text"
                        inputMode="numeric"
                        value={formData.floorsManual || ""}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") e.preventDefault();
                        }}
                        onChange={(e) => updateField("floorsManual", e.target.value.replace(/[-]/g, ""))}
                        placeholder="Or custom: e.g. G+6, Duplex"
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>

                  {/* Budget Notes */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Budget Considerations
                    </label>
                    <textarea
                      rows={3}
                      value={formData.budgetNotes || ""}
                      onChange={(e) => updateField("budgetNotes", e.target.value)}
                      placeholder="Phased construction, finishes, priorities..."
                      className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] p-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors resize-y"
                    />
                  </div>
                </div>
              )}

              {/* ──────── STEP 3: TIMELINE ──────── */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  <div className="border-b border-neutral-100 dark:border-white/10 pb-3">
                    <h2 className="font-display text-xl sm:text-2xl text-black dark:text-white">
                      Timeline
                    </h2>
                  </div>

                  {/* Preferred Start */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Preferred Design Start
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={formData.startDate || ""}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        placeholder="Pick date or type e.g. Immediately"
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] pl-3 pr-10 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => startDateRef.current?.showPicker()}
                        className="absolute right-2 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer p-1"
                        title="Pick date"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <input
                        ref={startDateRef}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => updateField("startDate", e.target.value)}
                        className="sr-only"
                      />
                    </div>
                    {/* Quick chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["Immediately", "Within 1 Month", "Within 3 Months", "Flexible"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField("startDate", opt)}
                          className="px-2.5 py-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Target Completion */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Target Completion Date
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={formData.completionTarget || ""}
                        onChange={(e) => updateField("completionTarget", e.target.value)}
                        placeholder="Pick date or enter timeline"
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] pl-3 pr-10 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => completionDateRef.current?.showPicker()}
                        className="absolute right-2 text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer p-1"
                        title="Pick date"
                      >
                        <Calendar className="h-4 w-4" />
                      </button>
                      <input
                        ref={completionDateRef}
                        type="date"
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(e) => updateField("completionTarget", e.target.value)}
                        className="sr-only"
                      />
                    </div>
                    {/* Quick chips */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {["12 Months", "18 Months", "24 Months", "Flexible"].map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => updateField("completionTarget", opt)}
                          className="px-2.5 py-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scheduling notes */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Scheduling Constraints
                    </label>
                    <textarea
                      rows={2}
                      value={formData.timelineNotes || ""}
                      onChange={(e) => updateField("timelineNotes", e.target.value)}
                      placeholder="Permits, milestones, family move..."
                      className="w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] p-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors resize-y"
                    />
                  </div>
                </div>
              )}

              {/* ──────── STEP 4: CONTACT DETAILS ──────── */}
              {currentStep === 3 && (
                <div className="space-y-5">
                  <div className="border-b border-neutral-100 dark:border-white/10 pb-3">
                    <h2 className="font-display text-xl sm:text-2xl text-black dark:text-white">
                      Your Details
                    </h2>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name || ""}
                      onChange={(e) => updateField("name", e.target.value)}
                      placeholder="Your full name"
                      className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                    />
                  </div>

                  {/* Email with validation */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400">
                        Email Address *
                      </label>
                      {formData.email && (
                        <span className={`text-[11px] ${isEmailValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {isEmailValid ? "Valid ✓" : "Invalid email"}
                        </span>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                      placeholder="name@example.com"
                      className={`w-full h-11 border bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none transition-colors ${
                        formData.email && !isEmailValid
                          ? "border-red-500"
                          : "border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
                      }`}
                    />
                  </div>

                  {/* Phone with Country Code + Digit Count */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400">
                        Phone Number *
                      </label>
                      {formData.phoneDigits && (
                        <span className={`text-[11px] ${isPhoneValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                          {isPhoneValid ? `${cleanPhone.length} digits ✓` : "Invalid length"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode || "+880"}
                        onChange={(e) => updateField("countryCode", e.target.value)}
                        className="w-28 sm:w-36 h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-2 text-xs text-black dark:text-white outline-none shrink-0 cursor-pointer"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={formData.phoneDigits || ""}
                        onKeyDown={(e) => {
                          if (e.key === "-" || e.key === "e") e.preventDefault();
                        }}
                        onChange={(e) => updateField("phoneDigits", e.target.value.replace(/\D/g, ""))}
                        placeholder={formData.countryCode === "+880" ? "017XXXXXXXX" : "Phone number"}
                        className={`flex-1 h-11 border bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none transition-colors ${
                          formData.phoneDigits && !isPhoneValid
                            ? "border-red-500"
                            : "border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Referral Source */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-medium text-neutral-600 dark:text-neutral-400 mb-1.5">
                      How Did You Hear About Us?
                    </label>
                    <div className="space-y-2">
                      <select
                        value={formData.referralSelect || ""}
                        onChange={(e) => updateField("referralSelect", e.target.value)}
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="">Select source...</option>
                        {[
                          "Google Search",
                          "Instagram",
                          "LinkedIn",
                          "Friend / Client Referral",
                          "Architectural Press",
                          "Other",
                        ].map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        value={formData.referralManual || ""}
                        onChange={(e) => updateField("referralManual", e.target.value)}
                        placeholder="Or specify details..."
                        className="w-full h-11 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div role="alert" className="mt-4 p-3 bg-red-50 dark:bg-red-950/40 text-xs text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900">
                  {errorMessage}
                </div>
              )}

              {/* Step Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-neutral-100 dark:border-white/10 pt-5 gap-3">
                {currentStep > 0 ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="h-11 px-4 text-xs uppercase tracking-wider border border-neutral-300 dark:border-neutral-700 text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                ) : (
                  <div />
                )}

                {currentStep < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="h-11 px-6 text-xs uppercase tracking-wider font-semibold bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !canContinue()}
                    className="h-11 px-6 text-xs uppercase tracking-wider font-semibold bg-[#294b3d] text-white hover:bg-[#1e382c] disabled:opacity-40 transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Clean Success View */
            <div className="border border-neutral-200 dark:border-white/10 bg-white dark:bg-[#262626] p-8 sm:p-12 text-center transition-colors">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center bg-[#294b3d] text-white">
                <Check className="h-6 w-6" />
              </div>
              <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white">
                Thank you, {formData.name || "there"}.
              </h2>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto">
                Your inquiry has been received. Our studio will review your site parameters and contact you at{" "}
                <strong className="text-black dark:text-white">{formData.email}</strong>.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link
                  href="/"
                  className="h-10 px-5 text-xs uppercase tracking-wider font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors inline-flex items-center"
                >
                  Return to Projects
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* ──────── Google Maps Pin Modal Overlay ──────── */}
        {isMapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="relative w-full max-w-lg bg-white dark:bg-[#222] border border-neutral-200 dark:border-neutral-700 shadow-2xl p-5 sm:p-6">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="absolute right-4 top-4 p-1 text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-red-500" />
                <h3 className="font-display text-lg text-black dark:text-white">
                  Select Site Location
                </h3>
              </div>
              <p className="text-xs text-neutral-400 mb-4">
                Choose a known area to populate coordinates & plus code.
              </p>

              {/* Search */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Filter areas..."
                  className="w-full h-10 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-9 pr-3 text-xs text-black dark:text-white outline-none"
                />
              </div>

              {/* Hotspots List */}
              <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto border border-neutral-200 dark:border-neutral-800 p-2 mb-4">
                {MAP_HOTSPOTS.filter(
                  (h) =>
                    h.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
                    h.city.toLowerCase().includes(mapSearch.toLowerCase())
                ).map((loc) => {
                  const isSelected = selectedHotspot.name === loc.name;
                  return (
                    <button
                      key={loc.name}
                      type="button"
                      onClick={() => setSelectedHotspot(loc)}
                      className={`text-left p-2 border text-xs cursor-pointer transition-colors ${
                        isSelected
                          ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black"
                          : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <p className="font-semibold truncate">{loc.name}</p>
                      <p className="text-[10px] opacity-75">{loc.city}</p>
                    </button>
                  );
                })}
              </div>

              {/* Selected Preview */}
              <div className="p-2.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs mb-4">
                <span className="font-medium text-black dark:text-white">
                  {selectedHotspot.name}, {selectedHotspot.city}
                </span>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400 font-mono mt-0.5">
                  {selectedHotspot.coords} • Plus Code: {selectedHotspot.code}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="h-9 px-3 text-xs uppercase text-neutral-500 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    updateField(
                      "location",
                      `${selectedHotspot.name}, ${selectedHotspot.city} (${selectedHotspot.coords} • Code: ${selectedHotspot.code})`
                    );
                    setIsMapModalOpen(false);
                  }}
                  className="h-9 px-4 text-xs uppercase font-medium bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  Confirm Pin
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ──────── FAQ Section ──────── */}
        <section className="mt-20 border-t border-neutral-200 dark:border-white/10 pt-16">
          <div className="mx-auto max-w-3xl px-5 sm:px-8">
            <h2 className="font-display text-xl sm:text-2xl text-black dark:text-white mb-6">
              Frequently Asked Questions
            </h2>

            <div className="divide-y divide-neutral-200 dark:divide-white/10 border-y border-neutral-200 dark:border-white/10">
              {PROJECT_FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-start justify-between gap-4 text-left group cursor-pointer"
                    >
                      <span className="font-display text-base text-black dark:text-white group-hover:opacity-75 transition-opacity">
                        {faq.question}
                      </span>
                      <span className="shrink-0 mt-0.5 flex h-6 w-6 items-center justify-center border border-neutral-300 dark:border-white/20 text-neutral-600 dark:text-neutral-300">
                        {isOpen ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                      </span>
                    </button>

                    {isOpen && (
                      <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
                        {faq.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
