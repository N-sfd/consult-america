import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";
import {
  careerPaths,
  howWeWork,
  whyWorkHere,
} from "@/data/careers";

const CAREERS_HERO_IMAGE =
  "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1400&q=80";

export const metadata: Metadata = {
  title: "Careers | ConsultAmerica",
  description:
    "Build what's next at ConsultAmerica — enterprise transformation, Oracle, AI, data, and digital engineering careers.",
};

export default function CareersPage() {
  return (
    <>
      <Section className="bg-[var(--cr-bg-soft)] text-[var(--cr-navy)]">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-7">
              <span className="ca-eyebrow text-[var(--cr-blue)]">CAREERS</span>
              <h1 className="ca-h1 mt-6 max-w-2xl text-[var(--cr-navy)]">
                Build what&apos;s next.
              </h1>
              <p className="mt-8 max-w-xl text-lg leading-8 text-[var(--cr-text-secondary)]">
                Join ConsultAmerica and work on complex enterprise
                transformation, Oracle, AI, data, and digital engineering
                initiatives that move organizations forward.
              </p>
              <Link href="/jobs" className="ca-button-primary mt-10">
                Explore Open Roles
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[16/10] lg:aspect-[4/3]">
                <Image
                  src={CAREERS_HERO_IMAGE}
                  alt="ConsultAmerica team collaborating"
                  fill
                  priority
                  className="object-cover object-center"
                  sizes="(max-width: 1023px) 100vw, 40vw"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white text-[var(--cr-navy)]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="ca-eyebrow text-[var(--cr-text-secondary)]">
                WHY WORK HERE
              </span>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:col-span-8">
              {whyWorkHere.map((item) => (
                <article key={item.title}>
                  <h2 className="text-2xl font-medium tracking-[-0.03em] text-[var(--cr-navy)]">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-base leading-7 text-[var(--cr-text-secondary)]">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white text-[#05070d]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="ca-eyebrow text-black/45">CAREER PATHS</span>
            </div>
            <div className="lg:col-span-8">
              <div className="border-t border-black/10">
                {careerPaths.map((path) => (
                  <Link
                    key={path.title}
                    href={path.href}
                    className="group grid gap-4 border-b border-black/10 py-8 md:grid-cols-12 md:items-center"
                  >
                    <div className="md:col-span-2">
                      <span className="ca-eyebrow text-black/40">
                        {path.number}
                      </span>
                    </div>
                    <div className="md:col-span-4">
                      <h2 className="text-xl font-medium tracking-[-0.03em] transition-colors group-hover:text-[var(--ca-blue)] md:text-2xl">
                        {path.title}
                      </h2>
                    </div>
                    <div className="md:col-span-5">
                      <p className="text-sm leading-6 text-black/55">
                        {path.description}
                      </p>
                    </div>
                    <div className="flex md:col-span-1 md:justify-end">
                      <ArrowUpRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[var(--ca-off-white)] text-[#05070d]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="ca-eyebrow text-black/45">
                LIFE AT CONSULTAMERICA
              </span>
            </div>
            <div className="lg:col-span-8">
              <p className="max-w-3xl text-lg leading-8 text-black/65">
                ConsultAmerica is built for people who want to work on meaningful
                enterprise challenges — where business context, technology depth,
                and delivery discipline come together. Our teams operate across
                Oracle platforms, AI and data, digital engineering, and
                transformation programs with senior involvement throughout.
              </p>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-white text-[#05070d]">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <span className="ca-eyebrow text-black/45">HOW WE WORK</span>
            </div>
            <div className="lg:col-span-8">
              <ul className="space-y-4">
                {howWeWork.map((item) => (
                  <li
                    key={item}
                    className="border-b border-black/10 pb-4 text-lg leading-8 text-black/65"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-[#071A2F] text-white">
        <Container>
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div>
              <span className="ca-eyebrow text-white/45">OPEN ROLES</span>
              <h2 className="ca-h2 mt-6 max-w-2xl">
                Ready to explore opportunities?
              </h2>
              <p className="mt-4 max-w-xl text-white/65">
                Browse current openings across Oracle, AI, data, consulting, and
                early-career pathways.
              </p>
            </div>
            <Link href="/jobs" className="ca-button-light shrink-0">
              Explore Open Roles
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <p className="mt-12 border-t border-white/10 pt-8 text-xs leading-6 text-white/40">
            ConsultAmerica is committed to providing equal employment
            opportunities to qualified applicants and employees in accordance
            with applicable law.
          </p>
        </Container>
      </Section>
    </>
  );
}
