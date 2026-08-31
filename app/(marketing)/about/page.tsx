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
          <h1 className="mt-6 max-w-4xl text-4xl font-extrabold tracking-[-0.03em] text-[#261F1B] sm:text-5xl lg:text-6xl">
            A technology delivery firm built for high-stakes enterprise programs.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[#695F57] sm:text-xl">
            We connect business strategy, Oracle Cloud platforms, data intelligence,
            and digital application engineering so transformation reaches production
            with less friction and measurable business return.
          </p>
        </div>
      </section>

      {/* Leadership Philosophy */}
      <section className="mkt-section bg-[#FFFAF2] text-[#261F1B]">
        <div className="mkt-shell">
          <SectionLabel tone="burgundy">Delivery Philosophy</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">
            Strategy that stays connected to the code.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {leadershipPrinciples.map((item) => (
              <div
                key={item.num}
                className="rounded-2xl border border-[#D7CCBD] bg-[#FFFDF8] p-8 shadow-[0_8px_24px_rgba(38,31,27,0.04)]"
              >
                <span className="text-2xl font-light text-[#7D2639]">
                  {item.num}
                </span>
                <h3 className="mt-3 text-lg font-bold text-[#261F1B]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#695F57]">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery Hubs & Offices */}
      <section className="mkt-section bg-[#2B2420] text-[#F7F0E7]">
        <div className="mkt-shell">
          <SectionLabel tone="light">Delivery Locations</SectionLabel>
          <h2 className="mt-4 text-3xl font-bold tracking-[-0.02em] text-[#F7F0E7] sm:text-4xl">
            National delivery centers and client hubs.
          </h2>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {offices.map((office) => (
              <div
                key={office.city}
                className="rounded-xl border border-[#6F6259] bg-[#342B27] p-6"
              >
                <p className="text-lg font-bold text-[#F7F0E7]">{office.city}</p>
                <p className="mt-2 text-xs leading-relaxed text-[#CFC4BA]">
                  {office.detail}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-14 border-t border-[#6F6259] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-[#CFC4BA]">
              Looking to discuss an enterprise transformation or engineering engagement?
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFFAF2] px-6 py-3 text-sm font-bold text-[#7D2639] hover:bg-[#FFFDF8] hover:text-[#681F30] transition-colors"
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
