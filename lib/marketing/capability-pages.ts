import type { DetailPageContent } from "@/lib/marketing/detail-page-types";
import { stockImage } from "@/lib/marketing/stock-images";

export const capabilityPages: Record<string, DetailPageContent> = {
  "enterprise-transformation": {
    slug: "enterprise-transformation",
    kicker: "Capabilities",
    title: "Enterprise Transformation",
    headline: "Transform strategy into operating reality.",
    description:
      "Align strategy, processes, operating models, and technology to modernize the enterprise and create measurable business value.",
    heroImage: stockImage("capabilityPageEnterpriseTransformation", { w: 1600, q: 80 }),
    heroImageAlt: "Enterprise strategy and transformation planning",
    focusAreas: [
      "Strategy",
      "Operating Model",
      "Business Process Transformation",
      "Program Delivery",
      "Change Management",
      "Technology Roadmaps",
    ],
    overview: [
      {
        title: "Strategy & Roadmapping",
        description:
          "Translate business goals into a sequenced roadmap that funding, staffing, and governance can actually support.",
      },
      {
        title: "Operating Model Design",
        description:
          "Redesign org structure, decision rights, and processes so the new platform is actually used the way it was built.",
      },
      {
        title: "Program Delivery",
        description:
          "Run multi-year change with the milestones, controls, and reporting that keep sponsors and delivery teams aligned.",
      },
      {
        title: "Change Management",
        description:
          "Bring people along with communication, training, and adoption plans built for the way your teams actually work.",
      },
    ],
    outcomes: [
      {
        title: "One roadmap, not five",
        description:
          "Strategy, technology, and operating-model work move on a single sequenced plan instead of competing initiatives.",
      },
      {
        title: "Adoption, not just go-live",
        description:
          "Change management is built into the program from day one, so usage holds up after the delivery team leaves.",
      },
      {
        title: "Governance that scales",
        description:
          "Decision rights and controls that work at pilot scale keep working as the program expands across the business.",
      },
    ],
    insightCategory: "enterprise-transformation",
    metaDescription:
      "Align strategy, operating model, and technology to modernize the enterprise and create measurable business value.",
  },

  "digital-engineering": {
    slug: "digital-engineering",
    kicker: "Capabilities",
    title: "Digital Engineering",
    headline: "Build modern digital products and platforms.",
    description:
      "Design and build modern digital products, applications, APIs, integrations, and experiences that connect people, processes, and platforms.",
    heroImage: stockImage("capabilityPageDigitalEngineering", { w: 1600, q: 80 }),
    heroImageAlt: "Digital engineering and product development",
    focusAreas: [
      "Web Applications",
      "SaaS Platforms",
      "APIs",
      "Cloud-Native Architecture",
      "Responsive UX",
      "Integration",
      "Automation",
    ],
    overview: [
      {
        title: "Product Engineering",
        description:
          "Ship web and SaaS applications with the architecture, testing, and CI/CD discipline that survives real usage.",
      },
      {
        title: "APIs & Integration",
        description:
          "Connect systems with APIs and event flows designed to stay in sync as the underlying platforms evolve.",
      },
      {
        title: "Cloud-Native Architecture",
        description:
          "Build on infrastructure that scales with demand instead of requiring a rewrite at the next order of magnitude.",
      },
      {
        title: "Experience Design",
        description:
          "Responsive, accessible interfaces that make complex enterprise workflows feel like consumer software.",
      },
    ],
    outcomes: [
      {
        title: "Ship faster without breaking prod",
        description:
          "Automated testing and CI/CD pipelines catch regressions before they reach users.",
      },
      {
        title: "Systems that talk to each other",
        description:
          "Point-to-point integrations replaced with monitored, documented interfaces teams can build on.",
      },
      {
        title: "Software people actually want to use",
        description:
          "Interfaces designed around how the work really happens, not just what the data model allows.",
      },
    ],
    metaDescription:
      "Design and build modern digital products, applications, APIs, and integrations that connect people, processes, and platforms.",
  },

  "managed-delivery": {
    slug: "managed-delivery",
    kicker: "Capabilities",
    title: "Managed Delivery",
    headline: "Keep transformation moving.",
    description:
      "Provide the program leadership, functional expertise, technical delivery, testing, and operational support needed to keep transformation moving from plan to production.",
    heroImage: stockImage("capabilityPageManagedDelivery", { w: 1600, q: 80 }),
    heroImageAlt: "Managed delivery and program leadership",
    focusAreas: [
      "Program Management",
      "Functional Consulting",
      "Technical Delivery",
      "Testing & QA",
      "Release Management",
      "Production Support",
      "Managed Services",
    ],
    overview: [
      {
        title: "Program Management",
        description:
          "Own the plan, the risk log, and the steering-committee reporting so sponsors always know where the program stands.",
      },
      {
        title: "Functional Consulting",
        description:
          "Bring finance, HR, supply chain, and operations expertise to bear on requirements and process design.",
      },
      {
        title: "Testing & Release Management",
        description:
          "Run the test cycles and release gates that make cutover a non-event instead of a fire drill.",
      },
      {
        title: "Production Support",
        description:
          "Stay on after go-live to stabilize, tune, and support the environment while your team ramps up.",
      },
    ],
    outcomes: [
      {
        title: "One team through go-live and beyond",
        description:
          "The same delivery team that builds the program supports it after launch, not a handoff to someone new.",
      },
      {
        title: "Fewer surprises at cutover",
        description:
          "Structured test cycles and release gates catch issues before they reach production.",
      },
      {
        title: "Support that scales down over time",
        description:
          "Managed services taper as your internal team absorbs the operating model, not a permanent dependency.",
      },
    ],
    metaDescription:
      "Program leadership, functional consulting, technical delivery, testing, and production support to keep transformation moving.",
  },
};

export function getCapabilityPageSlugs(): string[] {
  return Object.keys(capabilityPages);
}
