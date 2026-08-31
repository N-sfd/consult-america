"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { stockImage } from "@/lib/marketing/stock-images";

const interestOptions = [
  "Enterprise Transformation",
  "Oracle Cloud Modernization",
  "AI & Data Engineering",
  "CRM & Customer Experience",
  "Application Engineering & Labs",
  "Managed Services & Support",
];

export default function GrowthCta() {
  const shouldReduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    areaOfInterest: "Enterprise Transformation",
    objectives: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please provide your name and business email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section
      id="contact-cta"
      className="relative overflow-hidden py-16 sm:py-20 lg:py-24 text-white ca-grad-emerald"
    >
      {/* Background Architectural Workplace Texture with Rich Green Overlay (Section 34 Specification) */}
      <div
        className="absolute inset-0 pointer-events-none bg-cover bg-center opacity-10"
        style={{
          backgroundImage: `url('${stockImage("heroTexture", { w: 1920, q: 80 })}')`,
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#073B3A]/95 via-[#073B3A]/85 to-[#105A55]/90 pointer-events-none" />

      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10 relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#9BC4B8] flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#9BC4B8]" />
              START A CONVERSATION
            </span>

            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-[-0.03em] text-white leading-[1.08]"
            >
              What should your technology make possible next?
            </motion.h2>

            <p className="text-base sm:text-lg leading-relaxed text-white/90">
              Tell us what you&apos;re transforming, modernizing or building.
            </p>

            <div className="space-y-3 pt-6 border-t border-white/20 text-xs text-white/85">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#9BC4B8] shrink-0" />
                <span>Direct review by senior practice leaders within 1 business day</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#9BC4B8] shrink-0" />
                <span>Confidential scoping, architectural readiness &amp; feasibility assessment</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#9BC4B8] shrink-0" />
                <span>Timeline and delivery roadmap evaluation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean White Form */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 rounded-[14px] border border-white/20 bg-white text-[#122D2E] p-7 sm:p-9 shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
          >
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E1ECE8] text-[#0B4A47]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#122D2E]">
                  Inquiry Received
                </h3>
                <p className="mx-auto max-w-md text-sm text-[#5B6D6B]">
                  Thank you, {formData.name}. Our practice leads have received your project details and will connect with you at {formData.email} within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#B83A3A] hover:underline cursor-pointer"
                >
                  Submit another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-name" className="block text-xs font-bold text-[#122D2E]">
                      Name <span className="text-[#B83A3A]">*</span>
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 w-full rounded-md border border-[#C9DDD7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#122D2E] placeholder:text-[#5B6D6B]/60 focus:border-[#B83A3A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-email" className="block text-xs font-bold text-[#122D2E]">
                      Work Email <span className="text-[#B83A3A]">*</span>
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      required
                      placeholder="jane@enterprise.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 w-full rounded-md border border-[#C9DDD7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#122D2E] placeholder:text-[#5B6D6B]/60 focus:border-[#B83A3A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-company" className="block text-xs font-bold text-[#122D2E]">
                      Company / Organization
                    </label>
                    <input
                      id="cta-company"
                      type="text"
                      placeholder="Organization Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1.5 w-full rounded-md border border-[#C9DDD7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#122D2E] placeholder:text-[#5B6D6B]/60 focus:border-[#B83A3A] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-interest" className="block text-xs font-bold text-[#122D2E]">
                      Practice Area of Interest
                    </label>
                    <select
                      id="cta-interest"
                      value={formData.areaOfInterest}
                      onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                      className="mt-1.5 w-full rounded-md border border-[#C9DDD7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#122D2E] focus:border-[#B83A3A] focus:outline-none"
                    >
                      {interestOptions.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="cta-objectives" className="block text-xs font-bold text-[#122D2E]">
                    Transformation Scope or Key Objectives
                  </label>
                  <textarea
                    id="cta-objectives"
                    rows={3}
                    placeholder="Tell us what you're transforming, modernizing or building..."
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    className="mt-1.5 w-full rounded-md border border-[#C9DDD7] bg-white px-3.5 py-2.5 text-xs sm:text-sm text-[#122D2E] placeholder:text-[#5B6D6B]/60 focus:border-[#B83A3A] focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#B83A3A]">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full sm:w-auto !min-h-[48px] !px-8 text-sm font-bold rounded-[8px] cursor-pointer flex items-center justify-center gap-2 bg-[#B83A3A] text-white hover:bg-[#992F31] shadow-[0_4px_16px_rgba(184,58,58,0.25)] transition-all"
                  >
                    <span>Start the Conversation</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
