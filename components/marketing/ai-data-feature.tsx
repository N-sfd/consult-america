"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

import Container from "@/components/layout/container";
import Section from "@/components/layout/section";

const aiAreas = [
  {
    number: "01",
    title: "Enterprise AI",
    description:
      "Apply AI to enterprise workflows, operations, knowledge, and decision-making with production readiness in mind.",
  },
  {
    number: "02",
    title: "Generative AI",
    description:
      "Use language and multimodal models to generate, summarize, classify, extract, and interact with enterprise information.",
  },
  {
    number: "03",
    title: "AI Agents",
    description:
      "Build task-oriented agents that can reason across systems, retrieve context, automate actions, and support business teams.",
  },
  {
    number: "04",
    title: "Document Intelligence",
    description:
      "Extract structured data, clauses, tables, specifications, and business context from complex enterprise documents.",
  },
  {
    number: "05",
    title: "Enterprise Search",
    description:
      "Create secure search experiences across contracts, policies, technical documents, knowledge bases, and business data.",
  },
  {
    number: "06",
    title: "Data Engineering",
    description:
      "Build reliable pipelines, integrations, data models, and platforms that make enterprise information usable and trustworthy.",
  },
  {
    number: "07",
    title: "Analytics",
    description:
      "Turn operational and enterprise data into dashboards, insights, trends, and decision support.",
  },
  {
    number: "08",
    title: "Intelligent Automation",
    description:
      "Combine APIs, workflows, AI, and business rules to automate repetitive processes while keeping people in control.",
  },
];

const aiWorkflow = ["Data", "Context", "AI", "Workflow", "Action"];

export default function AiDataFeature() {
  return (
    <Section
      id="ai-data"
      className="relative overflow-hidden bg-[var(--ca-off-white)] text-[#05070d]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-48 top-24 h-[520px] w-[520px] rounded-full bg-[var(--ca-blue)]/[0.06] blur-3xl"
      />

      <Container className="relative z-10">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="ca-eyebrow text-black/45">AI & DATA</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-8"
          >
            <h2 className="ca-h2 max-w-5xl text-[#05070d]">
              Move from AI experiments
              <br />
              to enterprise intelligence.
            </h2>

            <div className="mt-10 grid gap-8 md:grid-cols-2">
              <p className="text-lg leading-8 text-black/65">
                We help organizations connect enterprise data, AI models,
                automation, and business workflows to create intelligent systems
                that can operate securely in production.
              </p>

              <div>
                <p className="text-base leading-7 text-black/55">
                  From AI agents and document intelligence to enterprise search,
                  analytics, and data engineering, we focus on practical use
                  cases that improve decisions, productivity, and execution.
                </p>

                <p className="mt-6 max-w-2xl text-sm leading-6 text-black/45">
                  Designed around enterprise security, governance, data access,
                  and human oversight.
                </p>

                <Link href="/ai-data" className="ca-button-primary mt-8">
                  Explore AI & Data
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-20 grid border-t border-black/10 md:grid-cols-2 lg:grid-cols-4">
          {aiAreas.map((area, index) => (
            <motion.article
              key={area.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.5,
                delay: index * 0.04,
              }}
              className="group relative border-b border-black/10 py-8 md:border-r md:px-6 md:[&:nth-child(2n)]:border-r-0 lg:[&:nth-child(2n)]:border-r lg:[&:nth-child(4n)]:border-r-0"
            >
              <div className="absolute left-0 top-0 h-px w-0 bg-[var(--ca-blue)] transition-all duration-500 group-hover:w-full" />

              <p className="ca-eyebrow text-black/40">{area.number}</p>

              <h3 className="mt-5 text-xl font-medium tracking-[-0.03em] text-[#05070d] transition-colors duration-200 group-hover:text-[var(--ca-blue)] md:text-2xl">
                {area.title}
              </h3>

              <p className="mt-4 max-w-sm text-sm leading-6 text-black/50">
                {area.description}
              </p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mt-16 border-t border-black/10 pt-10"
        >
          <p className="ca-eyebrow text-black/40">FROM DATA TO ACTION</p>

          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            {aiWorkflow.map((item, index) => (
              <div key={item} className="flex items-center gap-6">
                <span className="text-sm font-medium text-[#05070d]">
                  {item}
                </span>

                {index < aiWorkflow.length - 1 && (
                  <span aria-hidden="true" className="text-black/30">
                    →
                  </span>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </Container>
    </Section>
  );
}
