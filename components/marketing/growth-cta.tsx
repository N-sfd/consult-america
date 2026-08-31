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
    <section id="contact-conversion" className="relative overflow-hidden py-24 sm:py-32 bg-[#B63838] text-white">
      {/* Background Architectural/Collaboration Image with Burgundy Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1800&q=80"
          alt="Modern enterprise workplace and conference space"
          fill
          className="object-cover object-center opacity-15"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#B63838]/95 via-[#B63838]/92 to-[#8F292D]/96" />
      </div>

      <div className="mkt-shell relative z-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-start">
          {/* Left Column: Heading & Subheadline */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold uppercase tracking-[0.16em] text-[#E8B4B4]">
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
            <p className="text-base leading-relaxed text-[#F5DEDE] sm:text-lg">
              Tell us what you&apos;re transforming, modernizing or building.
              Our practice leaders partner directly from early strategy through
              production go-live.
            </p>

            <div className="space-y-3 pt-6 border-t border-white/20 text-xs text-[#F5DEDE]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DDEAE5] shrink-0" />
                <span>Confidential review by practice leads within 1 business day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#DDEAE5] shrink-0" />
                <span>Architecture and scoping working session without sales overhead</span>
              </div>
            </div>
          </div>

          {/* Right Column: High-conversion Clean White Form */}
          <div className="lg:col-span-7">
            <div className="rounded-xl border border-white/20 bg-[#FFFFFF] p-8 sm:p-10 text-[#101828] shadow-2xl">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#E7ECE8] text-[#5F7D75]">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <h3 className="mt-4 font-serif text-2xl font-semibold text-[#101828]">
                    Thank you for reaching out
                  </h3>
                  <p className="mt-2 text-sm text-[#475467]">
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
                    className="mt-6 text-xs font-bold text-[#B63838] hover:underline cursor-pointer"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cta-name"
                        className="block text-xs font-bold uppercase tracking-wider text-[#101828]"
                      >
                        Your Name *
                      </label>
                      <input
                        id="cta-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Jane Doe"
                        className="mt-1.5 w-full rounded-md border border-[#E2E7EC] bg-[#FCFCFD] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#475467]/50 focus:border-[#B63838] focus:outline-none focus:ring-1 focus:ring-[#B63838]"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="cta-email"
                        className="block text-xs font-bold uppercase tracking-wider text-[#101828]"
                      >
                        Business Email *
                      </label>
                      <input
                        id="cta-email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="jane@company.com"
                        className="mt-1.5 w-full rounded-md border border-[#E2E7EC] bg-[#FCFCFD] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#475467]/50 focus:border-[#B63838] focus:outline-none focus:ring-1 focus:ring-[#B63838]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="cta-company"
                        className="block text-xs font-bold uppercase tracking-wider text-[#101828]"
                      >
                        Organization / Company
                      </label>
                      <input
                        id="cta-company"
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        placeholder="Acme Corp"
                        className="mt-1.5 w-full rounded-md border border-[#E2E7EC] bg-[#FCFCFD] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#475467]/50 focus:border-[#B63838] focus:outline-none focus:ring-1 focus:ring-[#B63838]"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="cta-interest"
                        className="block text-xs font-bold uppercase tracking-wider text-[#101828]"
                      >
                        Primary Practice Area
                      </label>
                      <select
                        id="cta-interest"
                        value={formData.areaOfInterest}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            areaOfInterest: e.target.value,
                          })
                        }
                        className="mt-1.5 w-full rounded-md border border-[#E2E7EC] bg-[#FCFCFD] px-3.5 py-2.5 text-sm text-[#101828] focus:border-[#B63838] focus:outline-none focus:ring-1 focus:ring-[#B63838]"
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
                    <label
                      htmlFor="cta-message"
                      className="block text-xs font-bold uppercase tracking-wider text-[#101828]"
                    >
                      Project Objectives or Timeline
                    </label>
                    <textarea
                      id="cta-message"
                      rows={3}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Briefly describe your objectives, platform requirements, or key deadlines..."
                      className="mt-1.5 w-full rounded-md border border-[#E2E7EC] bg-[#FCFCFD] px-3.5 py-2.5 text-sm text-[#101828] placeholder:text-[#475467]/50 focus:border-[#B63838] focus:outline-none focus:ring-1 focus:ring-[#B63838]"
                    />
                  </div>

                  {error && (
                    <p className="text-xs font-semibold text-[#B93838]">{error}</p>
                  )}

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B63838] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#8F292D] cursor-pointer"
                    >
                      <span>Start the conversation</span>
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
