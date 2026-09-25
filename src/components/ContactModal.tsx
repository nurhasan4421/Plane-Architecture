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
    city: "Copenhagen",
    country: "Denmark",
    address: "Kløvermarksvej 70, 2300 København S",
    phone: "+45 7221 7221",
    email: "cph@big.dk",
  },
  {
    city: "New York",
    country: "USA",
    address: "45 Main Street, 9th Floor, Brooklyn, NY 11201",
    phone: "+1 347 549 4141",
    email: "nyc@big.dk",
  },
  {
    city: "London",
    country: "United Kingdom",
    address: "1 Finsbury Avenue, London EC2M 2PF",
    phone: "+44 20 3740 6860",
    email: "lon@big.dk",
  },
  {
    city: "Barcelona",
    country: "Spain",
    address: "Carrer de Pujades 77-79, 08005 Barcelona",
    phone: "+34 93 639 3690",
    email: "bcn@big.dk",
  },
  {
    city: "Shenzhen",
    country: "China",
    address: "Tower 2, Kerry Plaza, Futian District, Shenzhen",
    phone: "+86 755 8272 5810",
    email: "szn@big.dk",
  },
];

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    office: "Copenhagen",
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 select-none">
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
            <h2 className="text-sm font-semibold uppercase tracking-widest text-black">
              Contact & Studios
            </h2>
            <p className="text-[11px] text-[#797979] uppercase tracking-wider">
              Bjarke Ingels Group Global Directory
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
            <h3 className="text-xs uppercase font-medium tracking-wider text-black mb-4">
              Send an Inquiry
            </h3>

            {submitted ? (
              <div className="bg-neutral-50 p-6 text-center border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center mx-auto mb-3">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="text-sm uppercase font-semibold text-black mb-1">
                  Thank You for Reaching Out
                </h4>
                <p className="text-xs text-[#797979] leading-relaxed">
                  Your message has been dispatched to our {formData.office} studio. A partner or
                  communications director will reply promptly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      name: "",
                      email: "",
                      office: "Copenhagen",
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
                    placeholder="E.g. Jane Doe"
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
                    placeholder="jane@organization.com"
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
                      <option value="Press & Media">Press & Media</option>
                      <option value="Lecture">Lecture & Speaking</option>
                      <option value="Careers">Careers & Internship</option>
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
                    placeholder="Briefly describe the site, program, or press request..."
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

          {/* Right Column: Global Studios */}
          <div className="border-t md:border-t-0 md:border-l border-neutral-100 md:pl-8">
            <h3 className="text-xs uppercase font-medium tracking-wider text-black mb-4">
              Worldwide Studios
            </h3>
            <div className="space-y-4">
              {STUDIOS.map((studio) => (
                <div key={studio.city} className="border-b border-neutral-100 pb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase text-black">
                      {studio.city}
                    </span>
                    <span className="text-[10px] uppercase text-[#797979]">{studio.country}</span>
                  </div>
                  <p className="text-[11px] text-neutral-600 mt-0.5">{studio.address}</p>
                  <div className="flex items-center gap-4 mt-1 text-[10px] text-[#797979]">
                    <span>{studio.phone}</span>
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
