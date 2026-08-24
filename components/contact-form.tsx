"use client";

import { FormEvent, useState } from "react";

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
      <button type="submit" className="ca-button-primary mt-8 justify-self-start">
        Submit
      </button>
    </form>
  );
}
