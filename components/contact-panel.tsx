"use client";

import { type FormEvent, useEffect, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";
import { submitContactAction } from "@/app/actions/contact-actions";

function readUtmParams(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }
  return utm;
}

export default function ContactPanel() {
  const { open, setOpen } = useContactPanel();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [sourcePage, setSourcePage] = useState("/");
  const [utm, setUtm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    setSourcePage(`${window.location.pathname}${window.location.search}`);
    setUtm(readUtmParams());
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const result = await submitContactAction({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("company") ?? ""),
      message: String(formData.get("message") ?? ""),
      source: "contact-panel",
      sourcePage,
      campaign: utm.utm_campaign,
      utm,
      consentGiven: formData.get("consent") === "on",
    });

    setPending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close contact form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-[#101828]/50 backdrop-blur-xs"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl flex-col bg-[#FFFFFF] text-[#101828] px-6 py-8 sm:px-10 shadow-[-16px_0_48px_rgba(20,30,45,0.15)] border-l border-[#E2E7EC]"
          >
            <div className="flex items-center justify-between border-b border-[#E2E7EC] pb-4">
              <div>
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-teal)]">
                  DIRECT INQUIRY
                </span>
                <p className="mt-1 font-serif text-2xl font-semibold text-[#101828]">
                  Contact Practice Leadership
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#F7F8FA] text-[#101828] transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <div className="py-16 text-center">
                <p className="font-serif text-xl font-semibold text-[#101828]">
                  Thank you. Your message has been received.
                </p>
                <p className="mt-2 text-sm text-[#475467]">
                  A practice leader will follow up with you within one business day.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-bold text-[var(--ca-teal)] hover:underline cursor-pointer"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 flex flex-1 flex-col">
                <label className="sr-only" htmlFor="contact-name">
                  Full Name
                </label>
                <input
                  id="contact-name"
                  name="name"
                  required
                  placeholder="*Full Name"
                  className="ca-underline-input"
                />
                <label className="sr-only" htmlFor="contact-email">
                  Email
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  required
                  placeholder="*Email"
                  className="ca-underline-input mt-2"
                />
                <label className="sr-only" htmlFor="contact-company">
                  Company
                </label>
                <input
                  id="contact-company"
                  name="company"
                  required
                  placeholder="*Company"
                  className="ca-underline-input mt-2"
                />
                <label className="sr-only" htmlFor="contact-message">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  placeholder="Tell us about your program, platform, or timeline..."
                  className="ca-underline-input mt-2 resize-none"
                />
                <label className="mt-6 flex items-start gap-2 text-sm leading-5 text-[#475467]">
                  <input type="checkbox" name="consent" required className="mt-1" />
                  <span>
                    I agree to be contacted by Consult America about this inquiry.
                  </span>
                </label>
                {error && <p className="mt-3 text-sm text-[var(--ca-error)]">{error}</p>}
                <button
                  type="submit"
                  disabled={pending}
                  className="ca-button-primary mt-10 self-start cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? "Submitting…" : "Submit Direct Inquiry"}
                </button>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
