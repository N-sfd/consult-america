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
      {/* 1. Cinematic Background Photograph with Slow Drift Motion (Requirement 22) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={
            shouldReduceMotion
              ? {}
              : {
                  scale: [1.02, 1.04, 1.02],
                  y: [0, -6, 0],
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

        {/* 2. Foreground Structural Framing Depth Edge (Requirement 23) */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{
              x: [0, 5, 0],
            }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="hidden lg:block absolute left-0 top-0 bottom-0 w-1/4 pointer-events-none opacity-20 z-[1]"
          >
            <div className="relative h-full w-full border-r border-[#D8D0C5]/20 bg-gradient-to-r from-[#B63A3A]/10 to-transparent" />
          </motion.div>
        )}

        {/* Dark Neutral Gradient Overlay (rgba(22,20,18,0.76)) */}
        <div
          className="absolute inset-0 z-[2]"
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

            <div className="space-y-3 pt-6 border-t border-[#3A302B] text-xs text-[rgba(255,253,248,0.65)]">
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
            className="lg:col-span-6 rounded-2xl border border-[#D8D0C5] bg-[#FFFDF8] text-[#261F1B] p-7 sm:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-md"
          >
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F3EC] text-[#357C78]">
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
                  className="mt-4 text-xs font-bold text-[#B63A3A] hover:underline cursor-pointer"
                >
                  Submit another inquiry →
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cta-name" className="block text-xs font-bold text-[#261F1B]">
                      Name <span className="text-[#B63A3A]">*</span>
                    </label>
                    <input
                      id="cta-name"
                      type="text"
                      required
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D8D0C5] bg-[#F7F3EC] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#B63A3A] focus:bg-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label htmlFor="cta-email" className="block text-xs font-bold text-[#261F1B]">
                      Work Email <span className="text-[#B63A3A]">*</span>
                    </label>
                    <input
                      id="cta-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1.5 w-full rounded-lg border border-[#D8D0C5] bg-[#F7F3EC] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#B63A3A] focus:bg-white focus:outline-none"
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
                      className="mt-1.5 w-full rounded-lg border border-[#D8D0C5] bg-[#F7F3EC] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#B63A3A] focus:bg-white focus:outline-none"
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
                      className="mt-1.5 w-full rounded-lg border border-[#D8D0C5] bg-[#F7F3EC] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] focus:border-[#B63A3A] focus:bg-white focus:outline-none"
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
                    className="mt-1.5 w-full rounded-lg border border-[#D8D0C5] bg-[#F7F3EC] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#B63A3A] focus:bg-white focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#B63A3A]">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="ca-button-primary w-full sm:w-auto !min-h-[50px] !px-8 text-sm font-semibold rounded-lg cursor-pointer flex items-center justify-center gap-2 !bg-[#B63A3A] hover:!bg-[#942E31] shadow-md text-white"
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
