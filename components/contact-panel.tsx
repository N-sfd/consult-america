"use client";

import { type FormEvent, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

import { useContactPanel } from "@/components/providers/contact-provider";

export default function ContactPanel() {
  const { open, setOpen } = useContactPanel();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
                <span className="text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[#B63838]">
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
                  className="mt-6 text-xs font-bold text-[#B63838] hover:underline cursor-pointer"
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
                <button type="submit" className="ca-button-primary mt-10 self-start cursor-pointer">
                  Submit Direct Inquiry
                </button>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
