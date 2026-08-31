"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

const interestOptions = [
  "Enterprise Transformation",
  "Oracle Cloud Modernization",
  "AI & Data Engineering",
  "CRM & Customer Experience",
  "Digital Engineering & Platforms",
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
      setError("Please provide your name and work email address.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="contact-conversion" className="relative overflow-hidden py-24 sm:py-28 lg:py-32 bg-[#211E1B] text-[#F7F3EC] border-b border-[#3A302B]">
      {/* 1. Cinematic Background Photograph with Dark Charcoal/Burgundy Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2200&q=85"
          alt="Modern enterprise architecture and operations boardroom"
          fill
          className="object-cover object-center opacity-25 filter grayscale contrast-125"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#211E1B]/98 via-[#211E1B]/90 to-[#211E1B]/80" />
        <div className="absolute inset-0 bg-radial-[circle_at_20%_30%] from-[#7D2639]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Column (52% width): Heading, Copy & Trust Commitments */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA] flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#D8C5AA]" />
              WHAT COULD YOUR ENTERPRISE DO NEXT?
            </span>

            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              Bring us the problem
              <br />
              <span className="text-[#D8C5AA]">that matters.</span>
            </motion.h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#C5BCB3] max-w-lg">
              Whether you&apos;re modernizing Oracle, connecting enterprise data,
              building an AI capability, or launching a digital platform,
              our teams can help move it from idea to production.
            </p>

            <div className="space-y-3 pt-6 border-t border-[#3A302B] text-xs text-[#C5BCB3]">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="h-4 w-4 text-[#D8C5AA] shrink-0" />
                <span className="text-white font-medium">Direct engagement with enterprise practice leadership</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-4 w-4 text-[#D8C5AA] shrink-0" />
                <span>Confidential NDA scoping, architectural readiness &amp; timeline estimation</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="h-4 w-4 text-[#D8C5AA] shrink-0" />
                <span>Initial discovery and architectural feasibility review</span>
              </div>
            </div>
          </div>

          {/* Right Column (48% width): Floating Warm-White Contact Form */}
          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-6 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] text-[#261F1B] p-7 sm:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DFE4DA] text-[#657766]">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#261F1B]">
                  Inquiry Received
                </h3>
                <p className="mx-auto max-w-md text-sm text-[#695F57]">
                  Thank you, {formData.name}. Our practice leads have received your inquiry and will follow up with you at {formData.email}.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs font-bold text-[#7D2639] hover:underline cursor-pointer"
                >
                  Submit another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-name" className="block text-xs font-bold text-[#261F1B]">
                      Name <span className="text-[#7D2639]">*</span>
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-email" className="block text-xs font-bold text-[#261F1B]">
                      Work Email <span className="text-[#7D2639]">*</span>
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-company" className="block text-xs font-bold text-[#261F1B]">
                      Company / Organization
                    </label>
                    <input
                      id="cta-company"
                      type="text"
                      placeholder="Enterprise Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-interest" className="block text-xs font-bold text-[#261F1B]">
                      Area of Interest
                    </label>
                    <select
                      id="cta-interest"
                      value={formData.areaOfInterest}
                      onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] focus:border-[#7D2639] focus:bg-white focus:outline-none"
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
                  <label htmlFor="cta-objectives" className="block text-xs font-bold text-[#261F1B]">
                    Project Objectives &amp; Scope
                  </label>
                  <textarea
                    id="cta-objectives"
                    rows={3}
                    placeholder="Describe your transformation goals, key challenges, or timeline..."
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#7D2639]">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="ca-button-primary w-full sm:w-auto !min-h-[50px] !px-8 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 shadow-md"
                  >
                    <span>Start the conversation</span>
                    <ArrowUpRight className="h-4 w-4" />
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
