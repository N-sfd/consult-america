import type { Metadata } from "next";

import Container from "@/components/layout/container";
import Hero from "@/components/marketing/hero";

export const metadata: Metadata = {
  title: "ConsultAmerica | Oracle, AI & Enterprise Transformation",
  description:
    "We help enterprises transform operations, modernize platforms, and unlock intelligent growth through Oracle, cloud, data and AI.",
};

export default function Home() {
  return (
    <main>
      <Hero />

      <section className="bg-white py-24 md:py-32">
        <Container>
          <p className="ca-eyebrow text-[var(--ca-muted)]">
            CONSULTAMERICA
          </p>

          <h2 className="ca-h2 mt-8 max-w-4xl">
            We work where business, technology and transformation come
            together.
          </h2>
        </Container>
      </section>
    </main>
  );
}
