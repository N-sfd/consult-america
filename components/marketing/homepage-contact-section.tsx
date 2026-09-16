"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { submitContactAction } from "@/app/actions/contact-actions";

const practices = [
  "Enterprise Transformation",
  "Oracle",
  "AI & Data",
  "Application Engineering",
  "CRM",
  "Other / Not sure",
];

type PracticeQuestion = {
  name: string;
  label: string;
  type: "text" | "select";
  options?: string[];
  placeholder?: string;
};

/** Extra qualification fields shown once a practice is picked — folded into
 * the inquiry message the same way `practice` already is, so no backend/
 * ClientFlow schema change is required to capture them. */
const PRACTICE_QUESTIONS: Record<string, PracticeQuestion[]> = {
  Oracle: [
    {
      name: "q_erp",
      label: "Current ERP / systems in place",
      type: "text",
      placeholder: "e.g. On-prem E-Business Suite, PeopleSoft, SAP",
    },
    {
      name: "q_modules",
      label: "Primary modules of interest",
      type: "select",
      options: ["Financials", "Procurement", "HCM", "Supply Chain", "Projects", "Multiple / Not sure"],
    },
  ],
  "AI & Data": [
    {
      name: "q_challenge",
      label: "Primary data challenge",
      type: "select",
      options: [
        "Data quality & governance",
        "Analytics & reporting",
        "Generative AI / agents",
        "Document intelligence",
        "Not sure",
      ],
    },
    {
      name: "q_scale",
      label: "Approximate data volume / scale",
      type: "text",
      placeholder: "e.g. 10M records across 5 systems",
    },
  ],
  "Application Engineering": [
    {
      name: "q_project_type",
      label: "Project type",
      type: "select",
      options: ["New application", "Modernize legacy app", "Integration / API work", "Not sure"],
    },
    {
      name: "q_timeline",
      label: "Target timeline",
      type: "select",
      options: ["ASAP / under 3 months", "3-6 months", "6-12 months", "Exploring options"],
    },
  ],
  CRM: [
    {
      name: "q_current_crm",
      label: "Current CRM platform",
      type: "text",
      placeholder: "e.g. Salesforce, HubSpot, none",
    },
    {
      name: "q_crm_goal",
      label: "Primary goal",
      type: "select",
      options: ["Sales pipeline", "Customer service", "Marketing automation", "Full replacement"],
    },
  ],
  "Enterprise Transformation": [
    {
      name: "q_objective",
      label: "Primary objective",
      type: "select",
      options: ["Strategy & roadmap", "Platform modernization", "Process redesign", "Not sure"],
    },
  ],
};

export default function HomepageContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [practice, setPractice] = useState("");
  const activeQuestions = PRACTICE_QUESTIONS[practice] ?? [];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const message = String(formData.get("message") ?? "");
    const qualificationLines = activeQuestions
      .map((q) => {
        const value = String(formData.get(q.name) ?? "").trim();
        return value ? `${q.label}: ${value}` : null;
      })
      .filter((line): line is string => Boolean(line));
    const detailBlock = [practice ? `Practice: ${practice}` : null, ...qualificationLines]
      .filter(Boolean)
      .join("\n");
    const combinedMessage = detailBlock ? `${detailBlock}\n\n${message}` : message;
    const serviceKey =
      practice === "Oracle"
        ? "oracle"
        : practice === "AI & Data"
          ? "ai_data"
          : practice === "Application Engineering"
            ? "application_engineering"
            : practice === "CRM"
              ? "crm_cx"
              : practice === "Enterprise Transformation"
                ? "general"
                : "general";

    const result = await submitContactAction({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("organization") ?? ""),
      message: combinedMessage,
      source: "homepage",
      sourcePage: typeof window !== "undefined" ? window.location.pathname : "/",
      serviceKey,
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
    <section
      id="contact"
      className="relative overflow-x-clip border-b border-[var(--ca-line)] bg-[var(--ca-teal-deep)] py-14 sm:py-16 lg:py-[4.5rem]"
    >
      {/* Extremely subtle cropped arc — not a SaaS ring graphic */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-[22%] bottom-[-40%] hidden h-[min(420px,55vw)] w-[min(420px,55vw)] rounded-full border border-white/[0.06] lg:block"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[var(--ca-lime)]">
              Start a Conversation
            </p>
            <h2 className="mt-4 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-white">
              What should your technology make possible next?
            </h2>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
              Share a brief overview of your program or operating challenge. Your inquiry will be
              routed to the appropriate practice team.
            </p>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <p className="text-base text-white">
                Thank you. Your inquiry has been received and will be routed to the appropriate
                practice team.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <label htmlFor="home-name" className="sr-only">
                    Name
                  </label>
                  <input
                    id="home-name"
                    name="name"
                    required
                    placeholder="Name"
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="home-email" className="sr-only">
                    Email
                  </label>
                  <input
                    id="home-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Email"
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="home-organization" className="sr-only">
                    Organization
                  </label>
                  <input
                    id="home-organization"
                    name="organization"
                    required
                    placeholder="Organization"
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="home-practice" className="sr-only">
                    Practice
                  </label>
                  <select
                    id="home-practice"
                    name="practice"
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                    value={practice}
                    onChange={(e) => setPractice(e.target.value)}
                  >
                    <option value="" disabled>
                      Practice area
                    </option>
                    {practices.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                {activeQuestions.map((q) => (
                  <div key={q.name} className="sm:col-span-1">
                    <label htmlFor={`home-${q.name}`} className="sr-only">
                      {q.label}
                    </label>
                    {q.type === "select" ? (
                      <select
                        id={`home-${q.name}`}
                        name={q.name}
                        className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {q.label}
                        </option>
                        {q.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`home-${q.name}`}
                        name={q.name}
                        placeholder={q.placeholder ?? q.label}
                        className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                      />
                    )}
                  </div>
                ))}
                <div className="sm:col-span-2">
                  <label htmlFor="home-message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="home-message"
                    name="message"
                    rows={3}
                    placeholder="Brief overview of your program or challenge"
                    className="w-full resize-none rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[var(--ca-teal-deep)] outline-none focus:border-[var(--ca-teal)] focus:ring-1 focus:ring-[var(--ca-teal)]"
                  />
                </div>
                {error ? (
                  <p className="sm:col-span-2 text-sm text-[var(--ca-lime-soft)]">{error}</p>
                ) : null}
                <label className="sm:col-span-2 flex items-start gap-2 text-sm leading-5 text-white/75">
                  <input type="checkbox" name="consent" required className="mt-1" />
                  <span>
                    I agree to be contacted by Consult America about this inquiry.
                  </span>
                </label>
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[var(--ca-lime)] px-6 text-sm font-semibold text-[var(--ca-ink)] transition-colors hover:bg-[var(--ca-accent-hover)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {pending ? "Submitting…" : "Submit Inquiry"}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
