"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

interface JobApplicationFormProps {
  jobTitle: string;
}

export default function JobApplicationForm({ jobTitle }: JobApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="border border-white/10 p-8 md:p-10">
        <h2 className="text-2xl font-medium tracking-[-0.03em]">
          Application received
        </h2>
        <p className="mt-4 max-w-xl text-white/65">
          Thank you for your interest in the {jobTitle} role at ConsultAmerica.
          This is a demonstration application flow — submissions are not yet
          connected to an ATS.
        </p>
        <Link href="/jobs" className="ca-link mt-8 inline-flex">
          Back to open roles
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-6 border border-white/10 p-8 md:p-10"
    >
      <p className="text-sm text-white/45">
        Demo application form — not connected to ATS yet.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="first-name" className="text-sm text-white/70">
            First Name *
          </label>
          <input
            id="first-name"
            name="firstName"
            required
            autoComplete="given-name"
            className="ca-underline-input mt-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="last-name" className="text-sm text-white/70">
            Last Name *
          </label>
          <input
            id="last-name"
            name="lastName"
            required
            autoComplete="family-name"
            className="ca-underline-input mt-2 w-full"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="email" className="text-sm text-white/70">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="ca-underline-input mt-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="phone" className="text-sm text-white/70">
            Phone
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="ca-underline-input mt-2 w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="location" className="text-sm text-white/70">
          Location
        </label>
        <input
          id="location"
          name="location"
          autoComplete="address-level2"
          className="ca-underline-input mt-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="resume" className="text-sm text-white/70">
          Resume *
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx"
          className="mt-2 block w-full text-sm text-white/65 file:mr-4 file:border-0 file:bg-[var(--ca-blue)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white"
        />
        <p className="mt-2 text-xs text-white/40">
          PDF or Word document, up to 10 MB.
        </p>
      </div>

      <div>
        <label htmlFor="cover-letter" className="text-sm text-white/70">
          Cover Letter
        </label>
        <textarea
          id="cover-letter"
          name="coverLetter"
          rows={5}
          className="ca-underline-input mt-2 w-full resize-none"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="linkedin" className="text-sm text-white/70">
            LinkedIn URL
          </label>
          <input
            id="linkedin"
            name="linkedin"
            type="url"
            className="ca-underline-input mt-2 w-full"
          />
        </div>

        <div>
          <label htmlFor="portfolio" className="text-sm text-white/70">
            Portfolio URL
          </label>
          <input
            id="portfolio"
            name="portfolio"
            type="url"
            className="ca-underline-input mt-2 w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="work-authorization" className="text-sm text-white/70">
          Work Authorization
        </label>
        <input
          id="work-authorization"
          name="workAuthorization"
          className="ca-underline-input mt-2 w-full"
        />
      </div>

      <div>
        <label htmlFor="relocate" className="text-sm text-white/70">
          Are you willing to relocate?
        </label>
        <select
          id="relocate"
          name="relocate"
          className="ca-underline-input mt-2 w-full bg-transparent"
        >
          <option value="">Select an option</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Open to discussion</option>
        </select>
      </div>

      <div>
        <label htmlFor="additional" className="text-sm text-white/70">
          Additional Information
        </label>
        <textarea
          id="additional"
          name="additional"
          rows={4}
          className="ca-underline-input mt-2 w-full resize-none"
        />
      </div>

      <button type="submit" className="ca-button-primary justify-self-start">
        Submit Application
      </button>
    </form>
  );
}
