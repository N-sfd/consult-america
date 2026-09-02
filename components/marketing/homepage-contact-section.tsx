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

export default function HomepageContactSection() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const practice = String(formData.get("practice") ?? "");
    const message = String(formData.get("message") ?? "");
    const combinedMessage = practice ? `Practice: ${practice}\n\n${message}` : message;

    const result = await submitContactAction({
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      company: String(formData.get("organization") ?? ""),
      message: combinedMessage,
      source: "homepage",
    });

    setPending(false);
    if (result.ok) {
      setSubmitted(true);
    } else {
      setError(result.message);
    }
  }

  return (
    <section id="contact" className="border-b border-[#E1ECE8] bg-[#F8FAF9] py-12 sm:py-14 lg:py-16">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
              Start a Conversation
            </p>
            <h2 className="mt-3 font-serif text-[clamp(1.5rem,2.8vw,2.25rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
              What should your technology make possible next?
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-[#5B6D6B]">
              Share a brief overview of your program or operating challenge. Your inquiry will be
              routed to the appropriate practice team.
            </p>
          </div>

          <div className="lg:col-span-7">
            {submitted ? (
              <p className="text-base text-[#073B3A]">
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
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[#073B3A] outline-none focus:border-[#176A63] focus:ring-1 focus:ring-[#176A63]"
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
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[#073B3A] outline-none focus:border-[#176A63] focus:ring-1 focus:ring-[#176A63]"
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
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[#073B3A] outline-none focus:border-[#176A63] focus:ring-1 focus:ring-[#176A63]"
                  />
                </div>
                <div className="sm:col-span-1">
                  <label htmlFor="home-practice" className="sr-only">
                    Practice
                  </label>
                  <select
                    id="home-practice"
                    name="practice"
                    className="w-full rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[#073B3A] outline-none focus:border-[#176A63] focus:ring-1 focus:ring-[#176A63]"
                    defaultValue=""
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
                <div className="sm:col-span-2">
                  <label htmlFor="home-message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="home-message"
                    name="message"
                    rows={3}
                    placeholder="Brief overview of your program or challenge"
                    className="w-full resize-none rounded-lg border border-[#DDE6E3] bg-white px-4 py-3 text-sm text-[#073B3A] outline-none focus:border-[#176A63] focus:ring-1 focus:ring-[#176A63]"
                  />
                </div>
                {error ? (
                  <p className="sm:col-span-2 text-sm text-[#B83A3A]">{error}</p>
                ) : null}
                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={pending}
                    className="inline-flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#B83A3A] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#992F31] disabled:cursor-not-allowed disabled:opacity-60"
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
