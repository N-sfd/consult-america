import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SectionLabel from "@/components/marketing/SectionLabel";
import { offices } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Company & Leadership | ConsultAmerica",
  description:
    "ConsultAmerica connects business strategy, Oracle transformation, AI intelligence, and application engineering from early architecture through production delivery.",
};

const leadershipPrinciples = [
  {
    num: "01",
    title: "Senior Practitioners Attached to Delivery",
    desc: "We do not sell with senior partners and deliver with junior substitutes. Experienced practitioners stay directly attached to code, configurations, and cutover decisions.",
  },
  {
    num: "02",
    title: "Accountability Measured by Production",
    desc: "Transformation is not complete when slide decks are delivered. We measure success by what reaches production, passes compliance scrutiny, and operates cleanly.",
  },
  {
    num: "03",
    title: "Consulting + Product Engineering",
    desc: "Alongside client delivery, Consult America Labs engineers focused enterprise software (Data Agent, MediGuide AI, Convera) to solve recurring operational gaps.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="mkt-hero-bg mkt-editorial-texture pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="mkt-shell">
          <SectionLabel tone="burgundy">About Consult America</SectionLabel>
          <h1 className="mt-6 max-w-4xl text-4xl font-serif font-semibold tracking-[-0.03em] text-[#101828] sm:text-5xl lg:text-6xl">
            A technology delivery firm built for high-stakes enterprise programs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#475467] sm:text-xl">
            We connect business strategy, Oracle Cloud platforms, data intelligence,
            and digital application engineering so transformation reaches production
            with less friction and measurable business return.
          </p>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="mkt-section bg-[#FCFCFD] text-[#101828] border-t border-[#E2E7EC]">
        <div className="mkt-shell">
          <SectionLabel tone="burgundy">Delivery Philosophy</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            Strategy that stays connected to the code.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {leadershipPrinciples.map((item) => (
              <div
                key={item.num}
                className="rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-8 shadow-[0_8px_24px_rgba(20,30,45,0.04)]"
              >
                <span className="font-serif text-2xl font-normal text-[#B63838]">
                  {item.num}
                </span>
                <h3 className="mt-3 text-lg font-bold text-[#101828]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#475467]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Hubs & Offices */}
      <section className="mkt-section bg-[#F7F8FA] text-[#101828] border-t border-[#E2E7EC]">
        <div className="mkt-shell">
          <SectionLabel tone="burgundy">Delivery Locations</SectionLabel>
          <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.02em] text-[#101828] sm:text-4xl">
            National delivery centers and client hubs.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {offices.map((office) => (
              <div
                key={office.city}
                className="rounded-xl border border-[#E2E7EC] bg-[#FFFFFF] p-6 shadow-2xs"
              >
                <p className="text-lg font-bold text-[#101828]">{office.city}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#475467]">
                  {office.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-[#E2E7EC] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#475467]">
              Looking to discuss an enterprise transformation or engineering engagement?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#B63838] px-6 py-3 text-sm font-semibold text-white hover:bg-[#8F292D] transition-colors cursor-pointer"
            >
              <span>Start a conversation</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
