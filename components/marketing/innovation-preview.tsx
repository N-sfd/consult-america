"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCircle, Cpu, FileText, Layers, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import SectionLabel from "@/components/marketing/SectionLabel";
import ProductCard from "@/components/innovation/ProductCard";
import { listInnovationProducts } from "@/data/innovation-products";

const DATA_AGENT_TAGS = [
  "Gemini 1.5 Pro",
  "Local Ollama",
  "FAR / DFARS Compliance",
  "Oracle ERP Connector",
  "REST APIs",
  "n8n Automation",
];

export default function InnovationPreview() {
  const products = listInnovationProducts();
  if (products.length === 0) return null;

  const dataAgent = products.find((p) => p.slug === "data-agent") ?? products[0];
  const supporting = products.filter((p) => p.slug !== dataAgent.slug);

  return (
    <section id="innovation" className="mkt-section bg-[var(--mkt-white)]">
      <div className="mkt-shell">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel tone="blue">ConsultAmerica Innovation</SectionLabel>
            <h2 className="mkt-section-heading mt-4 text-[var(--mkt-navy)]">
              We don&apos;t just advise. We build.
            </h2>
          </div>
          <Link href="/work/innovation" className="ca-link text-sm font-semibold">
            View all innovation products
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Large Flagship Data Agent Product Feature */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="ca-app-window mt-10 grid overflow-hidden border border-[var(--mkt-border)] bg-[var(--mkt-cloud)] lg:grid-cols-12"
        >
          {/* Left info */}
          <div className="flex flex-col justify-between p-6 sm:p-8 lg:col-span-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-[var(--mkt-blue)] px-2.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-white">
                  Flagship Product
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--mkt-dim)]">
                  Enterprise AI
                </span>
              </div>

              <h3 className="mt-3 text-2xl font-bold tracking-[-0.02em] text-[var(--mkt-navy)] sm:text-3xl">
                {dataAgent.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--mkt-slate)]">
                Autonomous document intelligence engine with verified source citations,
                multi-modal OCR extraction, and human-in-the-loop review governance.
              </p>

              {/* 6-Stage Flow */}
              <div className="mt-6 rounded-xl border border-[var(--mkt-border)] bg-white p-4">
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-[var(--mkt-dim)]">
                  Platform Architecture Pipeline
                </p>
                <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs font-bold text-[var(--mkt-navy)]">
                  <span className="rounded-md bg-[var(--mkt-ice)] px-2 py-1">INGEST</span>
                  <span className="text-[var(--mkt-dim)]">→</span>
                  <span className="rounded-md bg-[var(--mkt-ice)] px-2 py-1">EXTRACT</span>
                  <span className="text-[var(--mkt-dim)]">→</span>
                  <span className="rounded-md bg-[var(--mkt-ice)] px-2 py-1">VERIFY</span>
                  <span className="text-[var(--mkt-dim)]">→</span>
                  <span className="rounded-md bg-[var(--mkt-ice)] px-2 py-1">REVIEW</span>
                  <span className="text-[var(--mkt-dim)]">→</span>
                  <span className="rounded-md bg-[var(--mkt-ice)] px-2 py-1">ANALYZE</span>
                  <span className="text-[var(--mkt-dim)]">→</span>
                  <span className="rounded-md bg-[var(--mkt-blue)] text-white px-2 py-1">INTEGRATE</span>
                </div>
              </div>

              {/* Technology Tags */}
              <div className="mt-5 flex flex-wrap gap-2">
                {DATA_AGENT_TAGS.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--mkt-border)] bg-white px-2.5 py-1 text-xs font-medium text-[var(--mkt-navy)]"
                  >
                    <CheckCircle className="h-3 w-3 text-[var(--mkt-blue)]" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-[var(--mkt-border)] pt-4">
              <Link
                href={`/work/innovation/${dataAgent.slug}`}
                className="ca-button-primary inline-flex text-sm font-semibold"
              >
                Explore Data Agent Platform
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Right workspace screenshot framing */}
          <div className="relative min-h-[300px] border-t border-[var(--mkt-border)] sm:min-h-[380px] lg:col-span-6 lg:border-t-0 lg:border-l">
            <Image
              src={dataAgent.heroImage}
              alt={dataAgent.heroImageAlt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </motion.div>

        {/* 2 Supporting Innovation Products */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {supporting.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
