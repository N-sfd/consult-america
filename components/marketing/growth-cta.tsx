"use client";

import { useState } from "react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const interestOptions = [
  "Enterprise Transformation",
  "Oracle",
  "CRM",
  "AI & Data",
  "Application Engineering",
  "Enterprise Platforms",
  "Managed Services",
];

export default function GrowthCta() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    areaOfInterest: "Enterprise Transformation",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      setError("Please fill in your name and business email.");
      return;
    }
    setError("");
    setSubmitted(true);
  };

  return (
    <section id="contact-conversion" className="bg-[#7D2639] py-16 sm:py-24 text-white">
      <div className="mkt-shell">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Copy */}
          <div className="lg:col-span-5">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
              START A CONVERSATION
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="mt-4 text-3xl font-extrabold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl"
            >
              What should your technology make possible next?
            </motion.h2>
            <p className="mt-4 text-base leading-relaxed text-[#F1DCE1] sm:text-lg">
              Tell us what you&apos;re transforming, modernizing or building.
              Our practice leaders partner directly from early strategy through
              production go-live.
            </p>

            <div className="mt-8 space-y-3 text-xs text-[#F1DCE1]">
              <p className="font-semibold text-white uppercase tracking-wider">
                What happens next?
              </p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DFE4DA]" />
                <span>Confidential review by practice leads within 1 business day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DFE4DA]" />
                <span>Architecture and scoping working session without slide-deck fluff</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-conversion Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-white/20 bg-[#FFFDF8] p-8 sm:p-10 text-[#261F1B] shadow-2xl">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DFE4DA] text-[#657766]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 text-2xl font-bold text-[#261F1B]">
                    Thank you for reaching out
                  </h3>
                  <p className="mt-2 text-sm text-[#695F57]">
                    We have received your message. A Consult America practice leader
                    will be in touch within 24 hours.
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
                        message: "",
                      });
                    }}
                    className="mt-6 text-xs font-bold text-[#7D2639] hover:underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="rounded-lg bg-[#B93838]/10 p-3 text-xs font-semibold text-[#B93838]">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                        Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Your full name"
                        className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                        Business Email *
                      </label>
                      <input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@company.com"
                        className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="company" className="block text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                        Company
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Organization name"
                        className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor="areaOfInterest" className="block text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                        Area of Interest
                      </label>
                      <select
                        id="areaOfInterest"
                        value={formData.areaOfInterest}
                        onChange={(e) => setFormData({ ...formData, areaOfInterest: e.target.value })}
                        className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] focus:border-[#7D2639] focus:outline-none"
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
                    <label htmlFor="message" className="block text-xs font-bold uppercase tracking-wider text-[#261F1B]">
                      Message / Project Scope
                    </label>
                    <textarea
                      id="message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Briefly describe what you are looking to solve or build..."
                      className="mt-1.5 w-full rounded-lg border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#7D2639] px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-[#681F30] cursor-pointer"
                    >
                      <span>Submit Inquiry</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
