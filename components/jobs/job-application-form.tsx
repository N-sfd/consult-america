"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

import ResumeUpload from "@/components/jobs/resume-upload";
import { submitJobApplication } from "@/lib/recruiting/actions";
import type { SubmitApplicationResult } from "@/lib/recruiting/repository";

interface JobApplicationFormProps {
  jobTitle: string;
  jobSlug: string;
  requisitionId: string;
  postingId: string;
  department: string;
  location: string;
  workplaceType: string;
  employmentType: string;
}

const STEP_LABELS = ["Personal", "Experience", "Documents", "Review"] as const;

type Values = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  currentTitle: string;
  yearsOfExperience: string;
  workAuthorization: string;
  relocate: "" | "yes" | "no" | "maybe";
  coverLetter: string;
};

const EMPTY_VALUES: Values = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  portfolio: "",
  currentTitle: "",
  yearsOfExperience: "",
  workAuthorization: "",
  relocate: "",
  coverLetter: "",
};

export default function JobApplicationForm({
  jobTitle,
  jobSlug,
  requisitionId,
  postingId,
  department,
  location,
  workplaceType,
  employmentType,
}: JobApplicationFormProps) {
  const [step, setStep] = useState(0);
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SubmitApplicationResult | null>(null);

  function set<K extends keyof Values>(key: K, value: Values[K]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  const canContinue =
    step === 0
      ? values.firstName.trim() !== "" &&
        values.lastName.trim() !== "" &&
        values.email.trim() !== ""
      : step === 2
        ? resumeFile !== null
        : true;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await submitJobApplication({
        requisitionId,
        postingId,
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        location: values.location || undefined,
        linkedinUrl: values.linkedin || undefined,
        portfolioUrl: values.portfolio || undefined,
        currentTitle: values.currentTitle || undefined,
        yearsOfExperience: values.yearsOfExperience || undefined,
        workAuthorization: values.workAuthorization || undefined,
        willingToRelocate: values.relocate || undefined,
        resumeFileName: resumeFile?.name,
        coverLetter: values.coverLetter || undefined,
      });
      setResult(res);
    } catch {
      setError(
        "Something went wrong submitting your application. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (result) {
    return (
      <SuccessScreen
        firstName={values.firstName}
        jobTitle={jobTitle}
        applicationNumber={result.applicationNumber}
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
      <div className="lg:col-span-8">
        <div className="cr-card p-6 md:p-8 lg:p-10">
          <StepIndicator step={step} />

          {error && (
            <p className="mt-6 rounded-lg border border-[var(--cr-error)]/30 bg-[var(--cr-error)]/5 px-4 py-3 text-sm text-[var(--cr-error)]">
              {error}
            </p>
          )}

          <div className="mt-8">
            {step === 0 && (
              <PersonalStep values={values} set={set} />
            )}
            {step === 1 && <ExperienceStep values={values} set={set} />}
            {step === 2 && (
              <DocumentsStep
                values={values}
                set={set}
                resumeFile={resumeFile}
                setResumeFile={setResumeFile}
              />
            )}
            {step === 3 && (
              <ReviewStep
                values={values}
                resumeFile={resumeFile}
                agree={agree}
                setAgree={setAgree}
              />
            )}
          </div>

          <div className="mt-10 flex items-center justify-between gap-4 border-t border-[var(--cr-border)] pt-6">
            {step > 0 ? (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="text-sm font-medium text-[var(--cr-text-secondary)] hover:text-[var(--cr-text)]"
              >
                ← Back
              </button>
            ) : (
              <span />
            )}

            {step < 3 ? (
              <button
                type="button"
                disabled={!canContinue}
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex h-12 min-w-[220px] items-center justify-center rounded-lg bg-[var(--cr-blue)] px-6 font-semibold text-white transition hover:bg-[var(--cr-blue-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continue
              </button>
            ) : (
              <button
                type="button"
                disabled={!agree || submitting}
                onClick={handleSubmit}
                className="inline-flex h-12 min-w-[220px] items-center justify-center gap-2 rounded-lg bg-[var(--cr-blue)] px-6 font-semibold text-white transition hover:bg-[var(--cr-blue-hover)] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {submitting ? "Submitting…" : "Submit Application"}
                {!submitting && <ArrowUpRight className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4">
        <div className="cr-card p-6 lg:sticky lg:top-28">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
            Role Summary
          </p>
          <h3 className="mt-3 text-lg font-medium text-[var(--cr-navy)]">
            {jobTitle}
          </h3>
          <p className="mt-4 text-sm text-[var(--cr-text)]">
            {location} · {workplaceType}
          </p>
          <p className="mt-1 text-sm text-[var(--cr-text)]">{employmentType}</p>
          <p className="mt-4 text-sm text-[var(--cr-text-secondary)]">
            {department}
          </p>
          <Link
            href={`/jobs/${jobSlug}`}
            className="ca-link mt-6 inline-flex text-sm"
          >
            View role details
          </Link>
        </div>
      </aside>
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  return (
    <>
      <div className="hidden items-center sm:flex">
        {STEP_LABELS.map((label, index) => (
          <div key={label} className="flex flex-1 items-center last:flex-none">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  index < step
                    ? "bg-[var(--cr-blue)] text-white"
                    : index === step
                      ? "border-2 border-[var(--cr-blue)] text-[var(--cr-blue)]"
                      : "border border-[var(--cr-border)] text-[var(--cr-text-secondary)]"
                }`}
              >
                {index < step ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              <span
                className={`text-sm font-medium ${
                  index <= step ? "text-[var(--cr-navy)]" : "text-[var(--cr-text-secondary)]"
                }`}
              >
                {label}
              </span>
            </div>
            {index < STEP_LABELS.length - 1 && (
              <span
                className={`mx-3 h-px flex-1 ${
                  index < step ? "bg-[var(--cr-blue)]" : "bg-[var(--cr-border)]"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      <div className="sm:hidden">
        <p className="text-sm font-medium text-[var(--cr-text-secondary)]">
          Step {step + 1} of {STEP_LABELS.length}
        </p>
        <p className="mt-1 text-lg font-medium text-[var(--cr-navy)]">
          {STEP_LABELS[step]} Information
        </p>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[var(--cr-border)]">
          <div
            className="h-full rounded-full bg-[var(--cr-blue)] transition-[width]"
            style={{ width: `${((step + 1) / STEP_LABELS.length) * 100}%` }}
          />
        </div>
      </div>
    </>
  );
}

function Field({
  id,
  label,
  required,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="cr-label">
        {label} {required && <span className="text-[var(--cr-error)]">*</span>}
      </label>
      {children}
    </div>
  );
}

function PersonalStep({
  values,
  set,
}: {
  values: Values;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
        01 · Personal Information
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="firstName" label="First Name" required>
          <input
            id="firstName"
            className="cr-input"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            autoComplete="given-name"
          />
        </Field>
        <Field id="lastName" label="Last Name" required>
          <input
            id="lastName"
            className="cr-input"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            autoComplete="family-name"
          />
        </Field>
        <Field id="email" label="Email" required>
          <input
            id="email"
            type="email"
            className="cr-input"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            autoComplete="email"
          />
        </Field>
        <Field id="phone" label="Phone">
          <input
            id="phone"
            type="tel"
            className="cr-input"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            autoComplete="tel"
          />
        </Field>
      </div>
      <Field id="location" label="Location">
        <input
          id="location"
          className="cr-input"
          value={values.location}
          onChange={(e) => set("location", e.target.value)}
          placeholder="City, State"
          autoComplete="address-level2"
        />
      </Field>
    </div>
  );
}

function ExperienceStep({
  values,
  set,
}: {
  values: Values;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
}) {
  return (
    <div className="space-y-5">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
        02 · Professional Profile
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="linkedin" label="LinkedIn URL">
          <input
            id="linkedin"
            type="url"
            className="cr-input"
            value={values.linkedin}
            onChange={(e) => set("linkedin", e.target.value)}
          />
        </Field>
        <Field id="portfolio" label="Portfolio URL">
          <input
            id="portfolio"
            type="url"
            className="cr-input"
            value={values.portfolio}
            onChange={(e) => set("portfolio", e.target.value)}
          />
        </Field>
        <Field id="currentTitle" label="Current Title">
          <input
            id="currentTitle"
            className="cr-input"
            value={values.currentTitle}
            onChange={(e) => set("currentTitle", e.target.value)}
          />
        </Field>
        <Field id="yearsOfExperience" label="Years of Experience">
          <input
            id="yearsOfExperience"
            className="cr-input"
            value={values.yearsOfExperience}
            onChange={(e) => set("yearsOfExperience", e.target.value)}
            inputMode="numeric"
          />
        </Field>
      </div>

      <h2 className="pt-2 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
        03 · Work Authorization
      </h2>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="workAuthorization" label="Authorized to work in the U.S.?">
          <input
            id="workAuthorization"
            className="cr-input"
            value={values.workAuthorization}
            onChange={(e) => set("workAuthorization", e.target.value)}
            placeholder="e.g. Yes, U.S. Citizen"
          />
        </Field>
        <Field id="relocate" label="Willing to relocate?">
          <select
            id="relocate"
            className="cr-input"
            value={values.relocate}
            onChange={(e) => set("relocate", e.target.value as Values["relocate"])}
          >
            <option value="">Select an option</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Open to discussion</option>
          </select>
        </Field>
      </div>
    </div>
  );
}

function DocumentsStep({
  values,
  set,
  resumeFile,
  setResumeFile,
}: {
  values: Values;
  set: <K extends keyof Values>(key: K, value: Values[K]) => void;
  resumeFile: File | null;
  setResumeFile: (file: File | null) => void;
}) {
  return (
    <div className="space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
        04 · Resume &amp; Documents
      </h2>
      <ResumeUpload file={resumeFile} onChange={setResumeFile} />
      <Field id="coverLetter" label="Cover Letter / Notes">
        <textarea
          id="coverLetter"
          rows={5}
          className="cr-input h-auto resize-none py-3"
          value={values.coverLetter}
          onChange={(e) => set("coverLetter", e.target.value)}
        />
      </Field>
    </div>
  );
}

function ReviewStep({
  values,
  resumeFile,
  agree,
  setAgree,
}: {
  values: Values;
  resumeFile: File | null;
  agree: boolean;
  setAgree: (value: boolean) => void;
}) {
  const rows: Array<[string, string]> = [
    ["Name", `${values.firstName} ${values.lastName}`.trim()],
    ["Email", values.email],
    ["Phone", values.phone || "—"],
    ["Location", values.location || "—"],
    ["LinkedIn", values.linkedin || "—"],
    ["Portfolio", values.portfolio || "—"],
    ["Current Title", values.currentTitle || "—"],
    ["Years of Experience", values.yearsOfExperience || "—"],
    ["Work Authorization", values.workAuthorization || "—"],
    [
      "Willing to Relocate",
      values.relocate
        ? { yes: "Yes", no: "No", maybe: "Open to discussion" }[values.relocate]
        : "—",
    ],
    ["Resume", resumeFile?.name ?? "—"],
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
        05 · Review &amp; Submit
      </h2>
      <dl className="grid gap-4 sm:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt className="text-xs text-[var(--cr-text-secondary)]">{label}</dt>
            <dd className="mt-1 text-sm font-medium text-[var(--cr-text)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>

      {values.coverLetter && (
        <div>
          <dt className="text-xs text-[var(--cr-text-secondary)]">
            Cover Letter / Notes
          </dt>
          <dd className="mt-1 text-sm leading-6 whitespace-pre-wrap text-[var(--cr-text)]">
            {values.coverLetter}
          </dd>
        </div>
      )}

      <label className="flex items-start gap-3 rounded-lg bg-[var(--cr-bg-soft)] p-4 text-sm text-[var(--cr-text)]">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          className="mt-0.5 h-4 w-4"
        />
        <span>
          By submitting this application, you agree that Consult America may
          process the information provided for recruiting purposes.{" "}
          <Link href="/privacy" className="text-[var(--cr-blue)] hover:underline">
            Privacy Policy
          </Link>
        </span>
      </label>
    </div>
  );
}

function SuccessScreen({
  firstName,
  jobTitle,
  applicationNumber,
}: {
  firstName: string;
  jobTitle: string;
  applicationNumber: string;
}) {
  return (
    <div className="cr-card mx-auto max-w-xl p-8 text-center md:p-12">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--cr-success)]/10 text-[var(--cr-success)]">
        <Check className="h-6 w-6" />
      </span>
      <h2 className="mt-6 text-2xl font-medium tracking-[-0.03em] text-[var(--cr-navy)]">
        Application submitted
      </h2>
      <p className="mt-3 text-[var(--cr-text-secondary)]">
        Thank you, {firstName}. Your application for
      </p>
      <p className="mt-1 text-lg font-medium text-[var(--cr-navy)]">
        {jobTitle}
      </p>
      <p className="mt-1 text-[var(--cr-text-secondary)]">has been received.</p>

      <div className="mx-auto mt-6 inline-block rounded-lg bg-[var(--cr-bg-soft)] px-5 py-3">
        <p className="text-xs uppercase tracking-[0.1em] text-[var(--cr-text-secondary)]">
          Application ID
        </p>
        <p className="mt-1 font-medium text-[var(--cr-navy)]">
          {applicationNumber}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link href="/jobs" className="ca-button-primary">
          View Other Opportunities
        </Link>
        <Link
          href="/careers"
          className="inline-flex h-12 items-center justify-center rounded-lg border border-[var(--cr-border)] px-6 font-medium text-[var(--cr-text)] hover:bg-[var(--cr-bg-soft)]"
        >
          Return to Careers
        </Link>
      </div>
    </div>
  );
}
