"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2, ShieldCheck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const interestOptions = [
  "Enterprise Transformation",
  "Oracle Cloud Modernization",
  "AI & Data Engineering",
  "CRM & Customer Experience",
  "Digital Engineering & Platforms",
  "Managed Services & Support",
];

export default function GrowthCta() {
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
    <section id="contact-conversion" className="bg-[#F4EFE6] text-[#261F1B] py-20 sm:py-24 lg:py-28 border-b border-[#D7CCBD]">
      <div className="mkt-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-start">
          {/* Left Column: Heading, Copy & Commitments */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#7D2639]">
              WHAT COULD YOUR ENTERPRISE DO NEXT?
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl font-semibold tracking-tight text-[#261F1B] sm:text-4xl lg:text-5xl lg:leading-[1.1]"
            >
              Bring us the problem
              <br />
              <span className="text-[#7D2639]">that matters.</span>
            </motion.h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#695F57]">
              Whether you&apos;re modernizing Oracle, connecting enterprise data,
              building an AI capability or launching a digital platform,
              our teams can help move it from idea to production.
            </p>

            <div className="space-y-3 pt-6 border-t border-[#D7CCBD] text-xs text-[#695F57]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#657766] shrink-0" />
                <span className="text-[#261F1B] font-medium">Direct review by senior practice leaders within 1 business day</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#657766] shrink-0" />
                <span>Confidential NDA scoping, architectural readiness, and timeline estimation</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#657766] shrink-0" />
                <span>Zero obligation scoping and feasibility evaluation</span>
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Premium Contact Form */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="lg:col-span-7 rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-7 sm:p-9 shadow-[0_16px_50px_rgba(38,31,27,0.06)]"
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
                  Thank you, {formData.name}. Our practice team has received your project objectives and will reach out to {formData.email} within 24 hours.
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
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-[#FFFDF8] focus:outline-none"
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
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-[#FFFDF8] focus:outline-none"
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
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-[#FFFDF8] focus:outline-none"
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
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] focus:border-[#7D2639] focus:bg-[#FFFDF8] focus:outline-none"
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
                    Project Objectives &amp; Timeline
                  </label>
                  <textarea
                    id="cta-objectives"
                    rows={3}
                    placeholder="Briefly describe what you're transforming, key constraints, target launch..."
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-[#FFFAF2] px-3.5 py-2.5 text-xs sm:text-sm text-[#261F1B] placeholder:text-[#8A7E75] focus:border-[#7D2639] focus:bg-[#FFFDF8] focus:outline-none resize-none"
                  />
                </div>

                {error && (
                  <p className="text-xs font-semibold text-[#7D2639]">{error}</p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    className="ca-button-primary w-full sm:w-auto !min-h-12 !px-8 text-sm font-semibold rounded-md cursor-pointer flex items-center justify-center gap-2"
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
