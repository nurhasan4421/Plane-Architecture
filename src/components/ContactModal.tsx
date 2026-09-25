"use client";

import React, { useState } from "react";
import { X, Check } from "lucide-react";
import { submitContactInquiry } from "@/lib/supabase";

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STUDIOS = [
  {
    city: "Dhaka",
    country: "Bangladesh (Headquarters)",
    address: "Dhala, Gulshan Architectural Quarter, Dhaka 1212",
    phone: "+8801234567891",
    email: "hello@planearchitect.com",
    isHQ: true,
  },
  {
    city: "Chittagong",
    country: "Bangladesh (Coastal Division)",
    address: "Agrabad Commercial Area, Chittagong 4100",
    phone: "+8801234567891",
    email: "ctg@planearchitect.com",
    isHQ: false,
  },
  {
    city: "Sylhet",
    country: "Bangladesh (Highland Studio)",
    address: "Zindabazar Tea Valley Corridor, Sylhet 3100",
    phone: "+8801234567891",
    email: "sylhet@planearchitect.com",
    isHQ: false,
  },
  {
    city: "Singapore",
    country: "Southeast Asia Liaison",
    address: "Marina Bay Financial Centre, Tower 1, Singapore",
    phone: "+65 6789 0123",
    email: "sg@planearchitect.com",
    isHQ: false,
  },
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    office: "Dhaka (Headquarters)",
    type: "New Project",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await submitContactInquiry(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg(res.error || "Failed to send inquiry. Please try again.");
      }
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none font-body">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-4xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <div>
            <h2 className="font-display text-base md:text-lg font-normal uppercase tracking-wider text-black">
              Contact Plane Architect
            </h2>
            <p className="font-body text-[11px] text-[#797979] uppercase tracking-wider">
              Dhala, Bangladesh • +8801234567891 • hello@planearchitect.com
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-black hover:bg-neutral-100 transition-colors cursor-pointer"
            aria-label="Close Contact Dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Form */}
          <div>
            <h3 className="font-display text-sm uppercase font-normal tracking-wider text-black mb-4">
              Send an Inquiry
            </h3>

            {submitted ? (
              <div className="bg-neutral-50 p-6 text-center border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-display text-base uppercase font-normal text-black mb-1">
                  Inquiry Dispatched
                </h4>
                <p className="font-body text-xs text-[#797979] leading-relaxed">
                  Thank you for reaching out to Plane Architect. Our Dhaka team will review your
                  project parameters and contact you promptly at {formData.email}.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      office: "Dhaka (Headquarters)",
                      type: "New Project",
                      message: "",
                    });
                  }}
                  className="mt-4 px-4 py-1.5 bg-black text-white text-xs uppercase tracking-wider hover:bg-neutral-800 cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#797979] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black rounded-none"
                    placeholder="E.g. A. Rahman"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#797979] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black rounded-none"
                    placeholder="client@organization.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#797979] mb-1">
                      Studio
                    </label>
                    <select
                      value={formData.office}
                      onChange={(e) => setFormData({ ...formData, office: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black rounded-none bg-white"
                    >
                      {STUDIOS.map((s) => (
                        <option key={s.city} value={s.city}>
                          {s.city}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-[#797979] mb-1">
                      Inquiry Type
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black rounded-none bg-white"
                    >
                      <option value="New Project">New Project Commission</option>
                      <option value="Masterplanning">Masterplanning</option>
                      <option value="Press & Media">Press & Publication</option>
                      <option value="Careers">Careers & Apprenticeship</option>
                      <option value="General">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#797979] mb-1">
                    Message *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 text-xs text-black focus:outline-none focus:border-black rounded-none resize-none"
                    placeholder="Briefly describe the site location, typology, or inquiry..."
                  />
                </div>

                {errorMsg && (
                  <p className="text-[11px] text-red-600 uppercase font-medium">{errorMsg}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-black text-white text-xs uppercase tracking-widest hover:bg-neutral-800 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Sending to Supabase..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Studio Directory */}
          <div className="border-t md:border-t-0 md:border-l border-neutral-100 md:pl-8">
            <h3 className="font-display text-sm uppercase font-normal tracking-wider text-black mb-4">
              Studios & Directory
            </h3>
            <div className="space-y-4">
              {STUDIOS.map((studio) => (
                <div key={studio.city} className="border-b border-neutral-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold uppercase text-black">
                      {studio.city}
                    </span>
                    <span className="text-[10px] uppercase text-[#797979]">{studio.country}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">{studio.address}</p>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-[10px] text-[#797979]">
                    <a href={`tel:${studio.phone}`} className="hover:text-black">
                      {studio.phone}
                    </a>
                    <a href={`mailto:${studio.email}`} className="text-black hover:underline">
                      {studio.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
