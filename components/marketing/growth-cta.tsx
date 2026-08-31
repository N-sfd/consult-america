"use client";

import Image from "next/image";
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
    <section id="contact-conversion" className="relative overflow-hidden py-24 sm:py-32 bg-[#7D2639] text-white">
      {/* Background Architectural/Collaboration Image with Dark Burgundy Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80"
          alt="Modern enterprise workplace and conference space"
          fill
          className="object-cover object-center opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#7D2639]/95 via-[#7D2639]/92 to-[#681F30]/96" />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Subheadline */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#D8C5AA]">
              START A CONVERSATION
            </span>
            <motion.h2
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
              className="font-serif text-3xl font-semibold tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl lg:leading-[1.12]"
            >
              What should your technology make possible next?
            </motion.h2>
            <p className="text-base leading-relaxed text-[#F1DCE1] sm:text-lg">
              Tell us what you&apos;re transforming, modernizing or building.
              Our practice leaders partner directly from early strategy through
              production go-live.
            </p>

            <div className="space-y-3 pt-6 border-t border-white/20 text-xs text-[#F1DCE1]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DFE4DA] shrink-0" />
                <span>Confidential review by practice leads within 1 business day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DFE4DA] shrink-0" />
                <span>Architecture and scoping working session without sales overhead</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-conversion Warm White Form */}
          <div className="lg:col-span-7">
            <div className="rounded-lg border border-white/20 bg-[#FFFDF8] p-8 sm:p-10 text-[#261F1B] shadow-2xl">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#DFE4DA] text-[#657766]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-[#261F1B]">
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
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="rounded-md bg-[#B93838]/10 p-3 text-xs font-semibold text-[#B93838]">
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
                        className="mt-1.5 w-full rounded-md border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-md border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-md border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none"
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
                        className="mt-1.5 w-full rounded-md border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] focus:border-[#7D2639] focus:outline-none"
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
                      className="mt-1.5 w-full rounded-md border border-[#D7CCBD] bg-white px-3.5 py-2.5 text-sm text-[#261F1B] placeholder:text-[#695F57]/60 focus:border-[#7D2639] focus:outline-none resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group flex w-full items-center justify-center gap-2 rounded-md bg-[#7D2639] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#681F30] cursor-pointer"
                    >
                      <span>Submit Inquiry</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
