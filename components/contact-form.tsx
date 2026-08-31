"use client";

import { FormEvent, useState } from "react";

import { submitContactAction } from "@/app/actions/contact-actions";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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
      source: "contact-page",
    });

    setPending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  }

  if (submitted) {
    return (
      <p className="text-lg text-white/70">
        Thank you. Your submission has been received.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-2">
      <label className="sr-only" htmlFor="page-name">
        Full Name
      </label>
      <input
        id="page-name"
        name="name"
        required
        placeholder="*Full Name"
        className="ca-underline-input"
      />
      <label className="sr-only" htmlFor="page-email">
        Email
      </label>
      <input
        id="page-email"
        name="email"
        type="email"
        required
        placeholder="*Email"
        className="ca-underline-input"
      />
      <label className="sr-only" htmlFor="page-company">
        Company
      </label>
      <input
        id="page-company"
        name="company"
        required
        placeholder="*Company"
        className="ca-underline-input"
      />
      <label className="sr-only" htmlFor="page-message">
        Message
      </label>
      <textarea
        id="page-message"
        name="message"
        rows={5}
        placeholder="Message"
        className="ca-underline-input resize-none"
      />
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="ca-button-primary mt-8 justify-self-start disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
