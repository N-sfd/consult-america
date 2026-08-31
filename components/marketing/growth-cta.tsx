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
    <section id="contact-conversion" className="relative overflow-hidden py-24 sm:py-28 lg:py-32 bg-[#211E1B] text-[#FFFDF8] border-b border-[#3A302B]">
      {/* 1. Cinematic Background Photograph with Slow Drift Motion (Requirements 24 & 25) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1.02, 1.035, 1.02],
                  y: [0, -8, 0],
                  x: [0, 8, 0],
                }
          }
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative h-full w-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2200&q=85"
            alt="Modern enterprise architecture and operations boardroom"
            fill
            className="object-cover object-center opacity-30 filter grayscale contrast-125"
            sizes="100vw"
          />
        </motion.div>

        {/* 2. Foreground Structural Framing Depth Edge (Requirement 25) */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{
              x: [0, 5, 0],
            }}
            transition={{
              duration: 13,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none opacity-20 z-[1]"
          >
            <div className="relative h-full w-full border-r border-[#D8D0C5]/20 bg-gradient-to-r from-[#B63A3A]/10 to-transparent" />
          </motion.div>
        )}

        {/* 3. Recurring Brand Arc Motif 3/3 (Subtle CA C-Curve in Contact) */}
        <div
          className="ca-brand-arc-motif -bottom-32 -right-32 sm:-bottom-24 sm:-right-24 w-[420px] h-[420px] opacity-30 pointer-events-none"
          aria-hidden="true"
        />

        {/* Dark Neutral Gradient Overlay */}
        <div
          className="absolute inset-0 z-[2] pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(24,22,20,0.95) 0%, rgba(24,22,20,0.85) 45%, rgba(24,22,20,0.76) 100%)",
          }}
        />
        <div className="absolute inset-0 z-[2] bg-radial-[circle_at_20%_30%] from-[#B63A3A]/15 via-transparent to-transparent pointer-events-none" />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Left Column (52% width): Heading, Copy & Trust Commitments */}
          <div className="lg:col-span-6 space-y-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#D8C5AA] flex items-center gap-2">
              <span className="h-0.5 w-6 bg-[#B63A3A]" />
              WHAT COULD YOUR ENTERPRISE DO NEXT?
            </span>

            <motion.h2
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl font-semibold tracking-tight text-[#FFFDF8] sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              Bring us the problem
              <br />
              <span className="text-[#D8C5AA]">that matters.</span>
            </motion.h2>

            <p className="text-base sm:text-lg leading-relaxed text-[rgba(255,253,248,0.72)] max-w-lg">
              Whether you&apos;re modernizing Oracle, connecting enterprise data,
              building an AI capability, or launching a digital platform,
              our teams can help move it from idea to production.
            </p>

            {/* Direct Contact Points */}
            <div className="pt-4 space-y-3 text-xs sm:text-sm text-[rgba(255,253,248,0.8)] border-t border-[#3A302B]">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#D8C5AA] text-[0.68rem] uppercase w-28">PRACTICE LEAD</span>
                <a href="mailto:inquiries@consultamerica.com" className="hover:text-white transition-colors underline decoration-[#B63A3A]">
                  inquiries@consultamerica.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-[#D8C5AA] text-[0.68rem] uppercase w-28">MAIN OFFICE</span>
                <span className="text-[rgba(255,253,248,0.65)]">Washington D.C. Metro Area &middot; Nationwide Delivery</span>
              </div>
            </div>

            {/* Trust Commitments */}
            <div className="pt-2 flex flex-wrap gap-4 text-xs text-[#D8C5AA]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-[#B63A3A]" />
                <span>Response within 1 business day</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-[#357C78]" />
                <span>Direct consultation with practice leaders</span>
              </div>
            </div>
          </div>

          {/* Right Column (48% width): Direct Contact Form */}
          <div className="lg:col-span-6">
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="rounded-2xl border border-[#3A302B] bg-[#2B2420]/90 p-8 sm:p-10 shadow-2xl backdrop-blur-md"
            >
              {submitted ? (
                <div className="py-12 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#357C78]/20 text-[#357C78]">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[#FFFDF8]">
                    Inquiry Received
                  </h3>
                  <p className="text-sm text-[rgba(255,253,248,0.72)] max-w-sm mx-auto">
                    Thank you. A senior practice leader will review your objectives and contact you within one business day.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        company: "",
                        areaOfInterest: "Enterprise Transformation",
                        objectives: "",
                      });
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#D8C5AA] hover:text-white"
                  >
                    Send another inquiry &rarr;
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div className="border-b border-[#3A302B] pb-4">
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#FFFDF8]">
                      Start a Conversation
                    </h3>
                    <p className="mt-1 text-xs text-[rgba(255,253,248,0.65)]">
                      Connect directly with our consulting and engineering practice leads.
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-lg bg-[#B63A3A]/20 border border-[#B63A3A]/40 p-3 text-xs text-[#FFFDF8]">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-medium text-[#D8C5AA] mb-1">
                        Full Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full rounded-lg border border-[#3A302B] bg-[#1F1A17] px-3.5 py-2.5 text-xs text-[#FFFDF8] placeholder:text-[rgba(255,253,248,0.3)] focus:border-[#B63A3A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-medium text-[#D8C5AA] mb-1">
                        Work Email *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sjenkins@enterprise.com"
                        className="w-full rounded-lg border border-[#3A302B] bg-[#1F1A17] px-3.5 py-2.5 text-xs text-[#FFFDF8] placeholder:text-[rgba(255,253,248,0.3)] focus:border-[#B63A3A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-medium text-[#D8C5AA] mb-1">
                        Organization / Enterprise
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="e.g. Apex Health Systems"
                        className="w-full rounded-lg border border-[#3A302B] bg-[#1F1A17] px-3.5 py-2.5 text-xs text-[#FFFDF8] placeholder:text-[rgba(255,253,248,0.3)] focus:border-[#B63A3A] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="contact-interest" className="block text-xs font-medium text-[#D8C5AA] mb-1">
                        Area of Interest
                      </label>
                      <select
                        id="contact-interest"
                        value={formData.areaOfInterest}
                        onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                        className="w-full rounded-lg border border-[#3A302B] bg-[#1F1A17] px-3.5 py-2.5 text-xs text-[#FFFDF8] focus:border-[#B63A3A] focus:outline-none"
                      >
                        {interestOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-[#1F1A17]">
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-objectives" className="block text-xs font-medium text-[#D8C5AA] mb-1">
                      Transformation Objectives or Key Questions
                    </label>
                    <textarea
                      id="contact-objectives"
                      rows={3}
                      value={formData.objectives}
                      onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                      placeholder="Share current systems, timeline, or specific challenges..."
                      className="w-full rounded-lg border border-[#3A302B] bg-[#1F1A17] px-3.5 py-2.5 text-xs text-[#FFFDF8] placeholder:text-[rgba(255,253,248,0.3)] focus:border-[#B63A3A] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group w-full inline-flex items-center justify-center gap-2 rounded-lg bg-[#B63A3A] py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:bg-[#942E31] cursor-pointer"
                    >
                      <span>Submit Inquiry to Practice Leadership</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
