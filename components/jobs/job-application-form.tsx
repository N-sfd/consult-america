"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

import { submitJobApplication } from "@/lib/recruiting/actions";

interface JobApplicationFormProps {
  jobTitle: string;
  requisitionId: string;
  postingId: string;
}

export default function JobApplicationForm({
  jobTitle,
  requisitionId,
  postingId,
}: JobApplicationFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const relocate = formData.get("relocate");

    try {
      await submitJobApplication({
        requisitionId,
        postingId,
        firstName: String(formData.get("firstName") ?? ""),
        lastName: String(formData.get("lastName") ?? ""),
        email: String(formData.get("email") ?? ""),
        phone: (formData.get("phone") as string) || undefined,
        location: (formData.get("location") as string) || undefined,
        linkedinUrl: (formData.get("linkedin") as string) || undefined,
        portfolioUrl: (formData.get("portfolio") as string) || undefined,
        workAuthorization: (formData.get("workAuthorization") as string) || undefined,
        willingToRelocate:
          relocate === "yes" || relocate === "no" || relocate === "maybe"
            ? relocate
            : undefined,
        coverLetter: (formData.get("coverLetter") as string) || undefined,
        additionalInformation: (formData.get("additional") as string) || undefined,
      });
      setSubmitted(true);
    } catch {
      setError(
        "Something went wrong submitting your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="border border-white/10 p-8 md:p-10">
        <h2 className="text-2xl font-medium tracking-[-0.03em]">
          Application received
        </h2>
        <p className="mt-4 max-w-xl text-white/65">
          Thank you for your interest in the {jobTitle} role at ConsultAmerica.
          Our recruiting team will follow up if there&apos;s a fit.
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
      {error && (
        <p className="border border-[var(--ca-error)]/40 bg-[var(--ca-error)]/10 px-4 py-3 text-sm text-white">
          {error}
        </p>
      )}

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

      <button
        type="submit"
        disabled={submitting}
        className="ca-button-primary justify-self-start disabled:opacity-60"
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}
