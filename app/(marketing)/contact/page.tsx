import type { Metadata } from "next";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

import { ContactForm } from "@/components/contact-form";
import Reveal from "@/components/marketing/inner-page/reveal";
import { companyContact } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Consult America regarding Oracle transformation, AI & data, enterprise platforms, or application engineering.",
};

export default function ContactPage() {
  const contactRows = [
    {
      icon: Building2,
      label: companyContact.headquarters.label,
      value: (
        <>
          {companyContact.headquarters.address}
          <br />
          {companyContact.headquarters.cityStateZip}
        </>
      ),
    },
    {
      icon: MapPin,
      label: companyContact.office.label,
      value: (
        <>
          {companyContact.office.address}
          <br />
          {companyContact.office.cityStateZip}
        </>
      ),
    },
    {
      icon: Mail,
      label: "Email",
      value: companyContact.email,
      href: `mailto:${companyContact.email}`,
    },
    {
      icon: Phone,
      label: "Phone",
      value: companyContact.phone,
      href: `tel:${companyContact.phoneTel}`,
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
                Let&apos;s Talk
              </h1>
              <p className="mt-5 max-w-md text-[1.0625rem] leading-relaxed text-white/72">
                Share a brief overview of your program, timeline, or operating
                challenge. Practice leads review every inquiry directly.
              </p>
            </Reveal>

            <Reveal delay={0.12} className="mt-8 space-y-5 text-sm text-white/70">
              {contactRows.map((row) => {
                const Icon = row.icon;
                const value =
                  "href" in row && row.href ? (
                    <a
                      href={row.href}
                      className="font-medium text-white transition-colors hover:text-[#9BC4B8]"
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
