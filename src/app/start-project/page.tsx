"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Plus,
  Minus,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ExternalLink,
  Search,
  X,
  Compass,
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSiteContent } from "@/components/SiteContentProvider";
import { submitContactInquiry } from "@/lib/supabase";

/* ──────── Country Codes List ──────── */
interface CountryCodeOption {
  code: string;
  country: string;
  flag: string;
  minDigits: number;
  maxDigits: number;
}

const COUNTRY_CODES: CountryCodeOption[] = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", minDigits: 10, maxDigits: 11 },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸", minDigits: 10, maxDigits: 10 },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧", minDigits: 10, maxDigits: 11 },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪", minDigits: 9, maxDigits: 9 },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", minDigits: 9, maxDigits: 9 },
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10, maxDigits: 10 },
  { code: "+65", country: "Singapore", flag: "🇸🇬", minDigits: 8, maxDigits: 8 },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", minDigits: 9, maxDigits: 10 },
  { code: "+974", country: "Qatar", flag: "🇶🇦", minDigits: 8, maxDigits: 8 },
  { code: "+965", country: "Kuwait", flag: "🇰🇼", minDigits: 8, maxDigits: 8 },
  { code: "+968", country: "Oman", flag: "🇴🇲", minDigits: 8, maxDigits: 8 },
  { code: "+973", country: "Bahrain", flag: "🇧🇭", minDigits: 8, maxDigits: 8 },
  { code: "+61", country: "Australia", flag: "🇦🇺", minDigits: 9, maxDigits: 9 },
  { code: "+49", country: "Germany", flag: "🇩🇪", minDigits: 10, maxDigits: 11 },
  { code: "+33", country: "France", flag: "🇫🇷", minDigits: 9, maxDigits: 9 },
  { code: "+39", country: "Italy", flag: "🇮🇹", minDigits: 9, maxDigits: 10 },
  { code: "+81", country: "Japan", flag: "🇯🇵", minDigits: 10, maxDigits: 10 },
  { code: "+82", country: "South Korea", flag: "🇰🇷", minDigits: 9, maxDigits: 10 },
  { code: "+86", country: "China", flag: "🇨🇳", minDigits: 11, maxDigits: 11 },
  { code: "+90", country: "Turkey", flag: "🇹🇷", minDigits: 10, maxDigits: 10 },
  { code: "+92", country: "Pakistan", flag: "🇵🇰", minDigits: 10, maxDigits: 10 },
  { code: "+977", country: "Nepal", flag: "🇳🇵", minDigits: 10, maxDigits: 10 },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰", minDigits: 9, maxDigits: 9 },
  { code: "+41", country: "Switzerland", flag: "🇨🇭", minDigits: 9, maxDigits: 9 },
  { code: "+31", country: "Netherlands", flag: "🇳🇱", minDigits: 9, maxDigits: 9 },
  { code: "+46", country: "Sweden", flag: "🇸🇪", minDigits: 9, maxDigits: 10 },
  { code: "+47", country: "Norway", flag: "🇳🇴", minDigits: 8, maxDigits: 8 },
  { code: "+353", country: "Ireland", flag: "🇮🇪", minDigits: 9, maxDigits: 9 },
  { code: "+64", country: "New Zealand", flag: "🇳🇿", minDigits: 8, maxDigits: 10 },
  { code: "+27", country: "South Africa", flag: "🇿🇦", minDigits: 9, maxDigits: 9 },
  { code: "+20", country: "Egypt", flag: "🇪🇬", minDigits: 10, maxDigits: 10 },
  { code: "+55", country: "Brazil", flag: "🇧🇷", minDigits: 10, maxDigits: 11 },
];

/* ──────── Map Preset Hotspots ──────── */
interface MapLocationPreset {
  name: string;
  area: string;
  coords: string;
  plusCode: string;
  lat: number;
  lng: number;
}

const MAP_PRESETS: MapLocationPreset[] = [
  { name: "Gulshan 1 & 2", area: "Dhaka North", coords: "23.7925° N, 90.4078° E", plusCode: "8J8V+3R", lat: 23.7925, lng: 90.4078 },
  { name: "Banani", area: "Dhaka North", coords: "23.7937° N, 90.4043° E", plusCode: "8J8V+HG", lat: 23.7937, lng: 90.4043 },
  { name: "Dhanmondi", area: "Dhaka South", coords: "23.7461° N, 90.3742° E", plusCode: "8H7C+CR", lat: 23.7461, lng: 90.3742 },
  { name: "Uttara Model Town", area: "Dhaka North", coords: "23.8759° N, 90.3795° E", plusCode: "8HVH+77", lat: 23.8759, lng: 90.3795 },
  { name: "Bashundhara R/A", area: "Dhaka North", coords: "23.8191° N, 90.4326° E", plusCode: "8J9M+JC", lat: 23.8191, lng: 90.4326 },
  { name: "Baridhara Diplomatic", area: "Dhaka North", coords: "23.7998° N, 90.4223° E", plusCode: "8JXX+WW", lat: 23.7998, lng: 90.4223 },
  { name: "Purbachal New Town", area: "Greater Dhaka", coords: "23.8344° N, 90.5186° E", plusCode: "8GMW+PG", lat: 23.8344, lng: 90.5186 },
  { name: "Mirpur DOHS", area: "Dhaka North", coords: "23.8364° N, 90.3694° E", plusCode: "8HPR+HQ", lat: 23.8364, lng: 90.3694 },
  { name: "Mohakhali DOHS", area: "Dhaka Central", coords: "23.7788° N, 90.3957° E", plusCode: "8HHP+GR", lat: 23.7788, lng: 90.3957 },
  { name: "Nasirabad", area: "Chittagong", coords: "22.3687° N, 91.8219° E", plusCode: "9R9C+FQ", lat: 22.3687, lng: 91.8219 },
  { name: "Khulshi", area: "Chittagong", coords: "22.3621° N, 91.8028° E", plusCode: "9R63+R4", lat: 22.3621, lng: 91.8028 },
  { name: "Zindabazar", area: "Sylhet", coords: "24.8949° N, 91.8687° E", plusCode: "VVW9+XF", lat: 24.8949, lng: 91.8687 },
  { name: "Marine Drive", area: "Cox's Bazar", coords: "21.4272° N, 91.9702° E", plusCode: "CRGW+V3", lat: 21.4272, lng: 91.9702 },
  { name: "Padma Riverfront", area: "Mawa / Munshiganj", coords: "23.4754° N, 90.2612° E", plusCode: "F7G6+5C", lat: 23.4754, lng: 90.2612 },
];

/* ──────── Floor Presets (1 to 20) ──────── */
const FLOOR_PRESETS = [
  "1 Floor (Ground Only)",
  "2 Floors (G+1)",
  "3 Floors (G+2)",
  "4 Floors (G+3)",
  "5 Floors (G+4)",
  "6 Floors (G+5)",
  "7 Floors (G+6)",
  "8 Floors (G+7)",
  "9 Floors (G+8)",
  "10 Floors (G+9)",
  "11 Floors (G+10)",
  "12 Floors (G+11)",
  "13 Floors (G+12)",
  "14 Floors (G+13)",
  "15 Floors (G+14)",
  "16 Floors (G+15)",
  "17 Floors (G+16)",
  "18 Floors (G+17)",
  "19 Floors (G+18)",
  "20 Floors (G+19)",
];

const REFERRAL_OPTIONS = [
  "Google Search",
  "Instagram",
  "LinkedIn",
  "Architectural Publication / Press",
  "Friend / Client Referral",
  "Project Site Signboard",
  "Other (Specify manually)",
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

export default function StartProjectPage() {
  const { settings } = useSiteContent();
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

  // Map Modal State
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [mapSearch, setMapSearch] = useState("");
  const [selectedMapPin, setSelectedMapPin] = useState<MapLocationPreset>(MAP_PRESETS[1]); // Default to Banani

  // Calendar refs for native datepickers
  const startDateRef = useRef<HTMLInputElement>(null);
  const completionDateRef = useRef<HTMLInputElement>(null);

  const totalSteps = 4;

  const updateField = (fieldId: string, value: string) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  /* ──────── Strict Validations ──────── */
  const validateEmail = (val: string): string => {
    if (!val || !val.trim()) return "Email address is required.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(val.trim())) {
      return "Please enter a valid email address (e.g. name@example.com).";
    }
    return "";
  };

  const validatePhone = (digits: string, code: string): string => {
    if (!digits || !digits.trim()) return "Phone number is required.";
    const clean = digits.replace(/\D/g, "");
    if (code === "+880") {
      if (clean.length < 10 || clean.length > 11) {
        return "Bangladesh numbers must be 10 or 11 digits (e.g. 017XXXXXXXX).";
      }
    } else {
      if (clean.length < 7 || clean.length > 15) {
        return "International numbers must be between 7 and 15 digits.";
      }
    }
    return "";
  };

  const isEmailValid = validateEmail(formData.email || "") === "";
  const isPhoneValid = validatePhone(formData.phoneDigits || "", formData.countryCode || "+880") === "";

  const canProceed = () => {
    if (currentStep === 0) {
      return Boolean(formData.projectType?.trim());
    }
    if (currentStep === 1) {
      return Boolean(formData.budget?.trim());
    }
    if (currentStep === 2) {
      return true; // Timeline is optional / exploratory
    }
    if (currentStep === 3) {
      return Boolean(formData.name?.trim()) && isEmailValid && isPhoneValid;
    }
    return true;
  };

  const handleNext = () => {
    if (!canProceed()) {
      if (currentStep === 3) {
        if (!formData.name?.trim()) {
          setErrorMessage("Please enter your name.");
          return;
        }
        const emailErr = validateEmail(formData.email || "");
        if (emailErr) {
          setErrorMessage(emailErr);
          return;
        }
        const phoneErr = validatePhone(formData.phoneDigits || "", formData.countryCode || "+880");
        if (phoneErr) {
          setErrorMessage(phoneErr);
          return;
        }
      }
      setErrorMessage("Please complete the required fields to continue.");
      return;
    }
    setErrorMessage("");
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setErrorMessage("");
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = async () => {
    if (!canProceed()) {
      const emailErr = validateEmail(formData.email || "");
      if (emailErr) {
        setErrorMessage(emailErr);
        return;
      }
      const phoneErr = validatePhone(formData.phoneDigits || "", formData.countryCode || "+880");
      if (phoneErr) {
        setErrorMessage(phoneErr);
        return;
      }
      setErrorMessage("Please complete all required fields correctly.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const fullPhone = `${formData.countryCode || "+880"} ${formData.phoneDigits || ""}`.trim();
      const floorCombined = [formData.floorsPreset, formData.floorsManual].filter(Boolean).join(" / ") || "N/A";
      const referralCombined = [formData.referralSelect, formData.referralManual].filter(Boolean).join(" - ") || "N/A";

      const message = [
        `Project Type: ${formData.projectType || "N/A"}`,
        `Site Location: ${formData.location || "N/A"}`,
        `Land Area: ${formData.landArea || "N/A"}`,
        `Vision: ${formData.vision || "N/A"}`,
        `Budget: ${formData.budget || "N/A"}`,
        `Floors: ${floorCombined}`,
        `Budget Notes: ${formData.budgetNotes || "N/A"}`,
        `Preferred Start: ${formData.startDate || "N/A"}`,
        `Target Completion: ${formData.completionTarget || "N/A"}`,
        `Timeline Notes: ${formData.timelineNotes || "N/A"}`,
        `Referral Source: ${referralCombined}`,
        `Phone Number: ${fullPhone}`,
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

  /* ──────── Handle Floor Input (No Negative Input) ──────── */
  const handleFloorsManualChange = (val: string) => {
    // Strip minus sign and any non-numeric / non-alphanumeric negative symbols
    const clean = val.replace(/[-]/g, "");
    updateField("floorsManual", clean);
  };

  /* ──────── Handle Datepickers ──────── */
  const handleDateSelect = (fieldId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (!raw) return;
    try {
      const [year, month, day] = raw.split("-");
      const d = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const formatted = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      updateField(fieldId, formatted);
    } catch {
      updateField(fieldId, raw);
    }
  };

  /* ──────── Confirm Map Location ──────── */
  const handleConfirmMapPin = () => {
    const formattedAddress = `${selectedMapPin.name}, ${selectedMapPin.area} (${selectedMapPin.coords} • Plus Code: ${selectedMapPin.plusCode})`;
    updateField("location", formattedAddress);
    setIsMapModalOpen(false);
  };

  const filteredMapPresets = MAP_PRESETS.filter(
    (p) =>
      p.name.toLowerCase().includes(mapSearch.toLowerCase()) ||
      p.area.toLowerCase().includes(mapSearch.toLowerCase()) ||
      p.plusCode.toLowerCase().includes(mapSearch.toLowerCase())
  );

  const googleMapsUrl = formData.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(formData.location)}`
    : null;

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

        {/* Step Progress Bar */}
        <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-6">
          <div className="flex items-center gap-0">
            {[
              { num: "01", title: "Project Scope" },
              { num: "02", title: "Budget & Area" },
              { num: "03", title: "Timeline" },
              { num: "04", title: "Your Details" },
            ].map((s, idx) => (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  onClick={() => {
                    if (idx < currentStep) setCurrentStep(idx);
                  }}
                  className={`relative flex items-center justify-center h-10 w-10 sm:h-11 sm:w-11 text-xs sm:text-sm font-semibold transition-all duration-300 cursor-pointer shrink-0 ${
                    idx === currentStep
                      ? "bg-black dark:bg-white text-white dark:text-black scale-105"
                      : idx < currentStep
                      ? "bg-[#294b3d] text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                  }`}
                >
                  {idx < currentStep ? <Check className="h-4 w-4" /> : s.num}
                </button>
                {idx < 3 && (
                  <div
                    className={`flex-1 h-[2px] transition-colors duration-300 ${
                      idx < currentStep ? "bg-[#294b3d]" : "bg-neutral-200 dark:bg-neutral-700"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="mt-3 flex justify-between">
            {[
              "01 Scope & Vision",
              "02 Budget & Scale",
              "03 Timeline",
              "04 Contact Details",
            ].map((label, idx) => (
              <span
                key={idx}
                className={`text-[10px] sm:text-xs uppercase tracking-wider transition-colors ${
                  idx === currentStep
                    ? "text-black dark:text-white font-semibold"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
                style={{ width: "25%", textAlign: idx === 0 ? "left" : idx === 3 ? "right" : "center" }}
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        {/* Current Step Content */}
        {!submitted ? (
          <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-16">
            <div className="border border-neutral-200 dark:border-neutral-700 bg-[#fafaf9] dark:bg-[#252525] p-6 sm:p-10 lg:p-14 transition-colors duration-200">
              
              {/* ──────── STEP 01: Project Scope & Vision ──────── */}
              {currentStep === 0 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#294b3d] dark:text-[#6fa380] font-medium mb-1">
                      Step 01 of 04
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white">
                      Project Scope & Vision
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                      Share the typology, site location, and your initial vision for the property.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Project Type */}
                    <label className="grid gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Project Typology *
                      </span>
                      <select
                        value={formData.projectType || ""}
                        onChange={(e) => updateField("projectType", e.target.value)}
                        className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="">Select Project Typology...</option>
                        {[
                          "Residential (Private Residence / Villa)",
                          "Residential (Multi-Family / Apartment Complex)",
                          "Commercial (Office / Headquarters)",
                          "Hospitality (Hotel / Resort / Pavilion)",
                          "Institutional & Cultural (Museum / School)",
                          "Landscape & Environmental Architecture",
                          "Urban Masterplanning",
                          "Interior Architecture",
                          "Other / Mixed Typology",
                        ].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </label>

                    {/* Site Location with Google Map Icon & Pin Selector */}
                    <div className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                          Site Location
                        </span>
                        {googleMapsUrl && (
                          <a
                            href={googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-[#294b3d] dark:text-[#6fa380] hover:underline"
                            title="Open in Google Maps"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>View on Google Maps</span>
                          </a>
                        )}
                      </div>

                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.location || ""}
                          onChange={(e) => updateField("location", e.target.value)}
                          placeholder="Type address or pick location with Google Map..."
                          className="min-h-12 w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] pl-4 pr-32 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setIsMapModalOpen(true)}
                          className="absolute right-1 top-1 bottom-1 flex items-center gap-1.5 px-3 bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-xs font-medium cursor-pointer"
                          title="Pick on Google Map overlay"
                        >
                          <MapPin className="h-4 w-4 text-red-500 shrink-0" />
                          <span className="hidden sm:inline">Map Pin</span>
                        </button>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Type manually or click <strong>Map Pin</strong> to select GPS coordinates & Plus Code.
                      </p>
                    </div>

                    {/* Land Area */}
                    <label className="grid gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Approximate Land Area
                      </span>
                      <input
                        type="text"
                        value={formData.landArea || ""}
                        onChange={(e) => updateField("landArea", e.target.value)}
                        placeholder="e.g. 5 Katha, 10,000 sqft, 1.5 Bigha"
                        className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </label>

                    {/* Vision Textarea */}
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Project Vision & Aspirations
                      </span>
                      <textarea
                        rows={4}
                        value={formData.vision || ""}
                        onChange={(e) => updateField("vision", e.target.value)}
                        placeholder="Describe your design aspirations, natural light preferences, functional needs, or spatial inspirations..."
                        className="resize-y border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ──────── STEP 02: Budget & Investment ──────── */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#294b3d] dark:text-[#6fa380] font-medium mb-1">
                      Step 02 of 04
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white">
                      Budget & Scale
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                      Help us understand your investment bracket and building scale for financial predictability.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Construction Budget */}
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Estimated Construction Budget *
                      </span>
                      <select
                        value={formData.budget || ""}
                        onChange={(e) => updateField("budget", e.target.value)}
                        className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                      >
                        <option value="">Select budget range...</option>
                        {[
                          "Under BDT 50 Lakh",
                          "BDT 50 Lakh – 1 Crore",
                          "BDT 1 – 3 Crore",
                          "BDT 3 – 5 Crore",
                          "BDT 5 – 10 Crore",
                          "Above BDT 10 Crore",
                          "Flexible / To be benchmarked during feasibility",
                        ].map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </label>

                    {/* Number of Floors (1 to 20 selector + manual input + NO NEGATIVE numbers) */}
                    <div className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Number of Floors (Select 1–20 or type manually)
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* 1 to 20 Setup Floor Selector */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            Choose from 1 to 20 floors:
                          </label>
                          <select
                            value={formData.floorsPreset || ""}
                            onChange={(e) => {
                              updateField("floorsPreset", e.target.value);
                              if (e.target.value) {
                                updateField("floorsManual", e.target.value.split(" ")[0]);
                              }
                            }}
                            className="min-h-12 w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                          >
                            <option value="">Select floor count (1 to 20)...</option>
                            {FLOOR_PRESETS.map((f) => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>

                        {/* Manual Input Box (Strictly positive, no negative) */}
                        <div>
                          <label className="block text-[11px] uppercase tracking-wider text-neutral-500 mb-1">
                            Or manual floor specification (no negatives):
                          </label>
                          <input
                            type="text"
                            inputMode="numeric"
                            value={formData.floorsManual || ""}
                            onKeyDown={(e) => {
                              if (e.key === "-" || e.key === "e") e.preventDefault();
                            }}
                            onChange={(e) => handleFloorsManualChange(e.target.value)}
                            placeholder="e.g. 6 floors, G+14, Duplex, B+G+4"
                            className="min-h-12 w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                          />
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        You can select from the 1–20 floor dropdown or type custom configurations (e.g. Duplex, Penthouse, Basement + Floors). Negative inputs are disallowed.
                      </p>
                    </div>

                    {/* Budget Notes */}
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Budget Notes & Material Preferences
                      </span>
                      <textarea
                        rows={3}
                        value={formData.budgetNotes || ""}
                        onChange={(e) => updateField("budgetNotes", e.target.value)}
                        placeholder="Mention any phasing preferences, premium material expectations, or cost priorities..."
                        className="resize-y border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ──────── STEP 03: Timeline & Milestones ──────── */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#294b3d] dark:text-[#6fa380] font-medium mb-1">
                      Step 03 of 04
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white">
                      Timeline & Milestones
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                      Select target dates using the calendar picker or enter dates manually.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Preferred Design Start with Calendar Picker */}
                    <div className="grid gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Preferred Design Start
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.startDate || ""}
                          onChange={(e) => updateField("startDate", e.target.value)}
                          placeholder="Select date or type 'Immediately' / 'Next month'..."
                          className="min-h-12 w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] pl-4 pr-12 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => startDateRef.current?.showPicker()}
                          className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer"
                          title="Open Calendar Picker"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        <input
                          ref={startDateRef}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => handleDateSelect("startDate", e)}
                          className="sr-only"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {["Immediately", "Within 1 Month", "Within 3 Months", "Flexible"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateField("startDate", opt)}
                            className="px-2.5 py-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Completion with Calendar Picker */}
                    <div className="grid gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Target Completion Date
                      </span>
                      <div className="relative flex items-center">
                        <input
                          type="text"
                          value={formData.completionTarget || ""}
                          onChange={(e) => updateField("completionTarget", e.target.value)}
                          placeholder="Select completion date or enter timeline..."
                          className="min-h-12 w-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] pl-4 pr-12 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => completionDateRef.current?.showPicker()}
                          className="absolute right-1 top-1 bottom-1 flex items-center justify-center px-3 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white cursor-pointer"
                          title="Open Calendar Picker"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                        <input
                          ref={completionDateRef}
                          type="date"
                          min={new Date().toISOString().split("T")[0]}
                          onChange={(e) => handleDateSelect("completionTarget", e)}
                          className="sr-only"
                        />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {["Within 12 Months", "18 Months", "24 Months", "To be defined"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => updateField("completionTarget", opt)}
                            className="px-2.5 py-1 text-[11px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Timeline Notes */}
                    <label className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Scheduling Deadlines or Constraints
                      </span>
                      <textarea
                        rows={3}
                        value={formData.timelineNotes || ""}
                        onChange={(e) => updateField("timelineNotes", e.target.value)}
                        placeholder="e.g. RAJUK clearance target, family moving schedule, seasonal monsoons, lease expirations..."
                        className="resize-y border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 py-3 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* ──────── STEP 04: Your Details (Strict Validation) ──────── */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-[#294b3d] dark:text-[#6fa380] font-medium mb-1">
                      Step 04 of 04
                    </p>
                    <h2 className="font-display text-2xl sm:text-3xl text-black dark:text-white">
                      Your Details & Contact
                    </h2>
                    <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300 max-w-2xl">
                      Provide your validated contact information so our Dhaka studio can arrange a private consultation.
                    </p>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    {/* Full Name */}
                    <label className="grid gap-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        Full Name *
                      </span>
                      <input
                        type="text"
                        required
                        value={formData.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                        placeholder="Your full name"
                        className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                      />
                    </label>

                    {/* Email Address with STRICT VALIDATION */}
                    <label className="grid gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                          Email Address *
                        </span>
                        {formData.email && (
                          <span className={`text-[11px] font-medium ${isEmailValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                            {isEmailValid ? "Valid email ✓" : "Invalid format"}
                          </span>
                        )}
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="name@example.com"
                        className={`min-h-12 border bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none transition-colors ${
                          formData.email && !isEmailValid
                            ? "border-red-500 focus:border-red-600"
                            : "border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
                        }`}
                      />
                      {formData.email && !isEmailValid && (
                        <p className="text-xs text-red-500">
                          Please enter a valid email address with a domain (e.g. name@domain.com).
                        </p>
                      )}
                    </label>

                    {/* Phone Number with All Country Codes + Digit Count Validation */}
                    <div className="grid gap-2 sm:col-span-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                          Phone Number * (Country Code + Valid Digits)
                        </span>
                        {formData.phoneDigits && (
                          <span className={`text-[11px] font-medium ${isPhoneValid ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"}`}>
                            {isPhoneValid ? `${formData.phoneDigits.length} digits ✓` : `${formData.phoneDigits.length} digits (Invalid)`}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-[minmax(0,140px)_1fr] sm:grid-cols-[minmax(0,180px)_1fr] gap-2">
                        {/* Country Code Selector */}
                        <select
                          value={formData.countryCode || "+880"}
                          onChange={(e) => updateField("countryCode", e.target.value)}
                          className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-3 text-xs sm:text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                        >
                          {COUNTRY_CODES.map((c) => (
                            <option key={`${c.code}-${c.country}`} value={c.code}>
                              {c.flag} {c.code} ({c.country})
                            </option>
                          ))}
                        </select>

                        {/* Phone Digits Input (Numbers only, no negatives) */}
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={formData.phoneDigits || ""}
                          onKeyDown={(e) => {
                            if (e.key === "-" || e.key === "e") e.preventDefault();
                          }}
                          onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "");
                            updateField("phoneDigits", digitsOnly);
                          }}
                          placeholder={formData.countryCode === "+880" ? "017XXXXXXXX (10 or 11 digits)" : "Phone digits"}
                          className={`min-h-12 border bg-white dark:bg-[#1a1a1a] px-4 text-base text-black dark:text-white outline-none transition-colors ${
                            formData.phoneDigits && !isPhoneValid
                              ? "border-red-500 focus:border-red-600"
                              : "border-neutral-300 dark:border-neutral-700 focus:border-black dark:focus:border-white"
                          }`}
                        />
                      </div>

                      {formData.phoneDigits && !isPhoneValid && (
                        <p className="text-xs text-red-500">
                          {validatePhone(formData.phoneDigits, formData.countryCode || "+880")}
                        </p>
                      )}
                    </div>

                    {/* How did you hear about us? (Select + Manual Input) */}
                    <div className="grid gap-2 sm:col-span-2">
                      <span className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
                        How Did You Hear About Us? (Select & Manual Input)
                      </span>
                      <div className="grid gap-3 sm:grid-cols-2">
                        {/* Select dropdown */}
                        <select
                          value={formData.referralSelect || ""}
                          onChange={(e) => updateField("referralSelect", e.target.value)}
                          className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                        >
                          <option value="">Select source...</option>
                          {REFERRAL_OPTIONS.map((r) => (
                            <option key={r} value={r}>{r}</option>
                          ))}
                        </select>

                        {/* Manual input box */}
                        <input
                          type="text"
                          value={formData.referralManual || ""}
                          onChange={(e) => updateField("referralManual", e.target.value)}
                          placeholder="Or type manual referral source..."
                          className="min-h-12 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-[#1a1a1a] px-4 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                        Choose from common channels or type the specific person, publication, or exhibition where you found us.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {errorMessage && (
                <div role="alert" className="mt-6 p-4 border border-red-200 dark:border-red-900 bg-red-50/80 dark:bg-red-950/40 text-sm text-red-700 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="mt-10 flex items-center justify-between border-t border-neutral-200 dark:border-neutral-700 pt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex items-center gap-2 px-5 py-3 text-xs font-medium uppercase tracking-wider transition-colors ${
                    currentStep === 0
                      ? "text-neutral-300 dark:text-neutral-600 cursor-not-allowed"
                      : "text-black dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 cursor-pointer"
                  }`}
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back
                </button>

                {currentStep < totalSteps - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black transition-colors hover:bg-[#294b3d] dark:hover:bg-neutral-200 cursor-pointer"
                  >
                    Continue
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting || !canProceed()}
                    className="flex items-center gap-2 px-7 py-3 text-xs font-semibold uppercase tracking-wider bg-[#294b3d] text-white transition-colors hover:bg-[#1d3a2d] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {submitting ? "Submitting..." : "Submit Inquiry"}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </section>
        ) : (
          /* Success Screen */
          <section className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16 pb-16">
            <div className="border-l-4 border-[#294b3d] bg-[#fafaf9] dark:bg-[#252525] p-8 sm:p-12 lg:p-16 text-center transition-colors">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center bg-[#294b3d] text-white">
                <Check className="h-8 w-8" />
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-black dark:text-white">
                Thank you, {formData.name || "there"}.
              </h2>
              <p className="mt-4 max-w-lg mx-auto text-base leading-7 text-neutral-600 dark:text-neutral-300">
                Your architectural project inquiry has been received. Our studio team will review your site parameters and reach out at{" "}
                <strong className="text-black dark:text-white">{formData.email}</strong> or{" "}
                <strong className="text-black dark:text-white">{formData.countryCode} {formData.phoneDigits}</strong> within 2 business days.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href="/"
                  className="px-6 py-3 text-xs font-semibold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black transition-colors hover:bg-[#294b3d] dark:hover:bg-neutral-200"
                >
                  Browse Projects
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setCurrentStep(0);
                    setFormData({
                      countryCode: "+880",
                      phoneDigits: "",
                      floorsPreset: "",
                      floorsManual: "",
                      referralSelect: "",
                      referralManual: "",
                    });
                  }}
                  className="px-6 py-3 text-xs font-medium uppercase tracking-wider border border-neutral-300 dark:border-neutral-600 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            </div>
          </section>
        )}

        {/* ──────── Google Maps Pin Modal Overlay ──────── */}
        {isMapModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#222222] border border-neutral-200 dark:border-neutral-700 shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <button
                type="button"
                onClick={() => setIsMapModalOpen(false)}
                className="absolute right-5 top-5 p-1 text-neutral-400 hover:text-black dark:hover:text-white transition-colors cursor-pointer"
                aria-label="Close Map Modal"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-2 mb-2">
                <Compass className="h-5 w-5 text-[#294b3d] dark:text-[#6fa380]" />
                <h3 className="font-display text-2xl text-black dark:text-white">
                  Select Site Location on Map
                </h3>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
                Pick a known site pin or select coordinates. The location pin code and address will automatically populate your project brief.
              </p>

              {/* Search Bar */}
              <div className="relative mb-5">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <input
                  type="text"
                  value={mapSearch}
                  onChange={(e) => setMapSearch(e.target.value)}
                  placeholder="Filter Dhaka areas, Chittagong, Sylhet, or Plus Codes..."
                  className="w-full min-h-11 border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 pl-10 pr-4 text-sm text-black dark:text-white outline-none focus:border-black dark:focus:border-white transition-colors"
                />
              </div>

              {/* Map Canvas Visual Mockup with Interactive Hotspots */}
              <div className="relative mb-6 h-52 sm:h-64 border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-950 overflow-hidden flex flex-col items-center justify-center p-4 text-center">
                {/* Visual coordinate grid lines */}
                <div className="absolute inset-0 opacity-15 dark:opacity-25 bg-[radial-gradient(#000_1px,transparent_1px)] dark:bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="relative z-10 flex flex-col items-center">
                  <div className="animate-bounce">
                    <MapPin className="h-9 w-9 text-red-600 drop-shadow-md" />
                  </div>
                  <div className="mt-2 bg-white/95 dark:bg-black/90 px-4 py-2 border border-neutral-300 dark:border-neutral-700 shadow-md">
                    <p className="text-xs font-semibold text-black dark:text-white">
                      {selectedMapPin.name} ({selectedMapPin.area})
                    </p>
                    <p className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                      {selectedMapPin.coords} • Plus Code: {selectedMapPin.plusCode}
                    </p>
                  </div>
                </div>

                <div className="absolute bottom-2 left-3 text-[10px] text-neutral-400 dark:text-neutral-500 font-mono">
                  PLANE GEO-SURVEYOR • BANGLADESH GRID
                </div>
              </div>

              {/* Preset Hotspot Locations Grid */}
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2 font-medium">
                  Popular Architectural Hotspots:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto border border-neutral-200 dark:border-neutral-800 p-2 bg-neutral-50/50 dark:bg-neutral-900/40">
                  {filteredMapPresets.map((loc) => {
                    const isSelected = selectedMapPin.name === loc.name;
                    return (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => setSelectedMapPin(loc)}
                        className={`text-left p-2.5 border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? "border-black dark:border-white bg-black dark:bg-white text-white dark:text-black font-medium"
                            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <p className="truncate font-semibold">{loc.name}</p>
                        <p className={`text-[10px] truncate ${isSelected ? "text-neutral-200 dark:text-neutral-700" : "text-neutral-400"}`}>
                          {loc.area}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Modal Actions */}
              <div className="mt-6 flex items-center justify-end gap-3 border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <button
                  type="button"
                  onClick={() => setIsMapModalOpen(false)}
                  className="px-4 py-2.5 text-xs uppercase tracking-wider text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmMapPin}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold uppercase tracking-wider bg-black dark:bg-white text-white dark:text-black hover:bg-[#294b3d] dark:hover:bg-neutral-200 transition-colors cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  Confirm Location Pin
                </button>
              </div>
            </div>
          </div>
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
                        isOpen ? "grid-rows-[1fr] opacity-100 mt-4" : "grid-rows-[0fr] opacity-0 mt-0"
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
