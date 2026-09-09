import type { Metadata } from "next";
import {
  Building2,
  CheckCircle2,
  Globe,
  Mail,
  MapPin,
  Phone,
  Smartphone,
} from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import Reveal from "@/components/marketing/inner-page/reveal";
import { companyContact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact & Practice Inquiry | Consult America",
  description:
    "Contact Consult America leadership regarding Oracle transformation, AI & data, enterprise platforms, or application engineering.",
};

export default function ContactPage() {
  const contactRows = [
    {
      icon: Phone,
      label: "Phone",
      value: companyContact.phone,
      href: `tel:${companyContact.phone.replace(/-/g, "")}`,
    },
    {
      icon: Smartphone,
      label: "Mobile",
      value: companyContact.mobile,
      href: `tel:${companyContact.mobile.replace(/-/g, "")}`,
    },
    {
      icon: Mail,
      label: "Email",
      value: companyContact.email,
      href: `mailto:${companyContact.email}`,
    },
    {
      icon: Building2,
      label: companyContact.office.label,
      value: companyContact.office.full,
    },
    {
      icon: MapPin,
      label: companyContact.headquarters.label,
      value: companyContact.headquarters.full,
    },
    {
      icon: Globe,
      label: "Web",
      value: companyContact.web,
      href: companyContact.webUrl,
    },
  ];

  return (
    <section className="ca-contact-emerald relative min-h-[calc(100vh-140px)] py-16 sm:py-20 lg:py-24">
      <div className="mkt-shell relative z-10">
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="text-[0.75rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
                Contact
              </p>
              <h1 className="mkt-inner-hero-heading mt-5 !text-white !max-w-xl">
                Tell us what you&apos;re looking to build.
              </h1>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-white/72">
                Share a brief overview of your program, timeline, or operating
                challenge. Practice leads review every inquiry directly.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-8 rounded-2xl border border-white/12 bg-white/5 p-5">
              <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#9BC4B8]">
                {companyContact.leadership.title}
              </p>
              <p className="mt-2 text-lg font-semibold text-white">
                {companyContact.leadership.name}
              </p>
              <p className="mt-1 text-sm text-white/65">
                {companyContact.experienceTagline}
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-6 space-y-4">
              {[
                "Your inquiry will be routed to the appropriate practice team",
                "Architecture and scoping working session without sales overhead",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 text-sm text-white/75">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#9BC4B8]" />
                  <span>{item}</span>
                </div>
              ))}
            </Reveal>

            <Reveal delay={0.15} className="mt-8 space-y-3 text-sm text-white/70">
              {contactRows.map((row) => {
                const Icon = row.icon;
                const value = row.href ? (
                  <a
                    href={row.href}
                    className="font-medium text-white transition-colors hover:text-[#9BC4B8]"
                    {...(row.href.startsWith("http")
                      ? { target: "_blank", rel: "noreferrer" }
                      : {})}
                  >
                    {row.value}
                  </a>
                ) : (
                  <span className="font-medium text-white">{row.value}</span>
                );

                return (
                  <div key={row.label} className="flex items-start gap-2.5">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9BC4B8]" />
                    <div>
                      <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-white/45">
                        {row.label}
                      </p>
                      <div className="mt-0.5">{value}</div>
                    </div>
                  </div>
                );
              })}
            </Reveal>
          </div>

          <Reveal delay={0.12} className="lg:col-span-7">
            <div className="rounded-2xl border border-white/10 bg-white p-8 shadow-[0_24px_64px_rgba(0,0,0,0.2)] sm:p-10">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
