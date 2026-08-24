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
            className="fixed inset-0 z-[70] bg-black/60"
            onClick={() => setOpen(false)}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-xl flex-col bg-black px-6 py-8 sm:px-10"
          >
            <div className="flex items-center justify-between">
              <p className="text-2xl">Contact Us</p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {submitted ? (
              <p className="mt-16 text-lg text-white/70">
                Thank you. Your submission has been received.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="mt-12 flex flex-1 flex-col">
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
                  placeholder="Message"
                  className="ca-underline-input mt-2 resize-none"
                />
                <button type="submit" className="ca-button-primary mt-10 self-start">
                  Submit
                </button>
              </form>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
