import type { DetailPageContent } from "@/lib/marketing/detail-page-types";
import { stockImage } from "@/lib/marketing/stock-images";

export const industryPages: Record<string, DetailPageContent> = {
  "government-public-sector": {
    slug: "government-public-sector",
    kicker: "Industries",
    title: "Government & Public Sector",
    headline: "Modernize public-sector operations without losing control.",
    description:
      "Modernize public-sector finance, procurement, grants, workforce, data, and service delivery with the controls and accountability oversight requires.",
    heroImage: stockImage("industryPageGovernment", { w: 1600, q: 80 }),
    heroImageAlt: "Legislative chamber interior",
    focusAreas: [
      "Public Finance",
      "Procurement & Grants",
      "Workforce Systems",
      "Data & Reporting",
      "Service Delivery",
      "Compliance & Audit",
    ],
    overview: [
      {
        title: "Public Finance Modernization",
        description:
          "Replace legacy finance systems without disrupting appropriations, encumbrances, or audit trails.",
      },
      {
        title: "Procurement & Grants",
        description:
          "Streamline sourcing, contracts, and grant management while preserving the controls oversight bodies require.",
      },
      {
        title: "Workforce & HR",
        description:
          "Modernize civil-service workforce systems across classification, payroll, and benefits administration.",
      },
      {
        title: "Data & Service Delivery",
        description:
          "Give agencies shared analytics and digital service channels constituents can actually use.",
      },
    ],
    outcomes: [
      {
        title: "Control and accountability, preserved",
        description:
          "Every modernization keeps the audit trails and approval chains that public accountability requires.",
      },
      {
        title: "Fewer manual workarounds",
        description:
          "Procurement, grants, and finance staff spend less time on spreadsheets bridging legacy systems.",
      },
      {
        title: "Reporting agencies can trust",
        description:
          "Shared data platforms replace siloed reports with a single, auditable source of truth.",
      },
    ],
    complianceHighlights: [
      {
        title: "FedRAMP & StateRAMP awareness",
        description:
          "Cloud architecture decisions account for FedRAMP and StateRAMP authorization boundaries from the design phase, not as a retrofit.",
      },
      {
        title: "NIST 800-53 / FISMA alignment",
        description:
          "Security controls map to NIST 800-53 control families so agency ATO packages have less rework to do.",
      },
      {
        title: "Appropriations & audit controls",
        description:
          "Encumbrance tracking, approval chains, and audit trails are treated as functional requirements, not add-ons.",
      },
    ],
    domainUseCases: [
      {
        title: "Grants lifecycle management",
        description:
          "Award, drawdown, and compliance reporting connected end to end instead of tracked across disconnected spreadsheets.",
      },
      {
        title: "Multi-agency data sharing",
        description:
          "Shared reference data and reporting layers across agencies without duplicating systems of record.",
      },
      {
        title: "Constituent-facing service delivery",
        description:
          "Public-facing application and case-status portals connected to the same backend systems staff already use.",
      },
    ],
    insightCategory: "industry-perspectives",
    metaDescription:
      "Modernize public-sector finance, procurement, grants, workforce, data, and service delivery.",
  },

  "financial-services": {
    slug: "financial-services",
    kicker: "Industries",
    title: "Financial Services",
    headline: "Modernize operations without losing control.",
    description:
      "Connect financial operations, data, governance and enterprise systems across complex regulated environments.",
    heroImage: stockImage("industryPageFinancial", { w: 1600, q: 80 }),
    heroImageAlt: "Financial operations and market data environment",
    focusAreas: [
      "Core Finance Systems",
      "Regulatory Reporting",
      "Data & Analytics",
      "Process Automation",
      "Enterprise Platforms",
      "Risk & Controls",
    ],
    overview: [
      {
        title: "Core Finance Modernization",
        description:
          "Modernize general ledger, close, and consolidation processes without introducing reconciliation risk.",
      },
      {
        title: "Regulatory Reporting",
        description:
          "Build reporting pipelines that hold up under audit and adapt as requirements change.",
      },
      {
        title: "Process Automation",
        description:
          "Automate reconciliation, exception handling, and controls testing across finance operations.",
      },
      {
        title: "Enterprise Platforms",
        description:
          "Integrate core banking, ERP, and data platforms so operations aren't reconciling systems by hand.",
      },
    ],
    outcomes: [
      {
        title: "Faster, more reliable close",
        description:
          "Automated reconciliation and reporting shrink the close cycle without adding risk.",
      },
      {
        title: "Audit-ready by default",
        description:
          "Controls and evidence trails are built into the process, not assembled after the fact.",
      },
      {
        title: "Systems that reconcile themselves",
        description:
          "Integrated platforms replace manual reconciliation between core banking, ERP, and reporting tools.",
      },
    ],
    complianceHighlights: [
      {
        title: "SOX-aligned controls",
        description:
          "Financial reporting changes are built with the change-control and evidence trail SOX testing expects.",
      },
      {
        title: "GLBA data safeguards",
        description:
          "Customer financial data handling follows GLBA Safeguards Rule practices across integrations and storage.",
      },
      {
        title: "SOC 2 / PCI-DSS environments",
        description:
          "Architecture and access controls are designed to operate inside SOC 2 Type II and PCI-DSS-scoped environments.",
      },
    ],
    domainUseCases: [
      {
        title: "Regulatory reporting automation",
        description:
          "Pipelines that assemble call reports and regulatory filings from source systems instead of manual spreadsheet rollups.",
      },
      {
        title: "Reconciliation & exception management",
        description:
          "Automated matching across core banking, ERP, and sub-ledgers, with exceptions routed for review instead of buried in spreadsheets.",
      },
      {
        title: "Core banking / ERP integration",
        description:
          "Connected data flows between core banking platforms and enterprise finance systems, replacing manual bridges.",
      },
    ],
    metaDescription:
      "Connect finance, data, automation, reporting, and enterprise platforms for operational control.",
  },

  healthcare: {
    slug: "healthcare",
    kicker: "Industries",
    title: "Healthcare",
    headline: "Modernize operations without disrupting care.",
    description:
      "Modernize enterprise operations, workforce, financial systems, and clinical technology environments while protecting continuity of care.",
    heroImage: stockImage("healthcareClinical", { w: 1600, q: 88 }),
    heroImageAlt: "Clinician and care team reviewing patient information",
    focusAreas: [
      "Clinical Systems",
      "Workforce Operations",
      "Financial Systems",
      "Data & Interoperability",
      "Patient Experience",
      "Responsible AI",
    ],
    overview: [
      {
        title: "Clinical Technology",
        description:
          "Modernize clinical and operational systems with the change controls patient safety requires.",
      },
      {
        title: "Workforce Operations",
        description:
          "Streamline scheduling, credentialing, and workforce management across clinical and administrative staff.",
      },
      {
        title: "Financial Systems",
        description:
          "Connect billing, finance, and supply chain systems for cleaner revenue cycle operations.",
      },
      {
        title: "Data & Responsible AI",
        description:
          "Apply AI to patient communication and operations with the governance healthcare data demands.",
      },
    ],
    outcomes: [
      {
        title: "Continuity of care, protected",
        description:
          "Every modernization is sequenced around clinical operations, not the other way around.",
      },
      {
        title: "Clearer patient communication",
        description:
          "Responsible AI applied to patient-facing workflows, with human review where it matters.",
      },
      {
        title: "Cleaner revenue cycle",
        description:
          "Connected billing, finance, and supply-chain data reduces reconciliation work downstream.",
      },
    ],
    complianceHighlights: [
      {
        title: "HIPAA-aligned data handling",
        description:
          "PHI flows are mapped and access-controlled to HIPAA Privacy and Security Rule requirements across every integration.",
      },
      {
        title: "HITRUST-aligned controls",
        description:
          "Technical and administrative controls follow the HITRUST CSF framework healthcare organizations are assessed against.",
      },
      {
        title: "Interoperability standards (HL7 / FHIR)",
        description:
          "Clinical data exchange is built on HL7 FHIR so integrations stay portable across EHR and care-coordination platforms.",
      },
    ],
    domainUseCases: [
      {
        title: "Clinical documentation workflows",
        description:
          "Structured capture and review workflows that fit inside existing clinician documentation time, not alongside it.",
      },
      {
        title: "Revenue cycle & claims processing",
        description:
          "Billing and claims data connected end to end to cut denial rework and reconciliation across finance and clinical systems.",
      },
      {
        title: "Care coordination & interoperability",
        description:
          "FHIR-based data exchange between care teams, payers, and downstream systems without one-off point integrations.",
      },
    ],
    metaDescription:
      "Modernize enterprise operations, workforce, financial systems, and clinical technology environments.",
  },

  "retail-consumer": {
    slug: "retail-consumer",
    kicker: "Industries",
    title: "Retail & Consumer",
    headline: "Connected commerce. Smarter operations.",
    description:
      "We help retail and consumer organizations modernize commerce, product discovery, customer experience, inventory visibility, data, and intelligent automation.",
    heroImage: stockImage("industryPageRetail", { w: 1600, q: 80 }),
    heroImageAlt: "Retail commerce and product discovery environment",
    focusAreas: [
      "Digital Commerce",
      "AI Product Discovery",
      "Customer Experience",
      "Inventory & Operations",
      "Analytics",
      "Automation",
    ],
    overview: [
      {
        title: "Digital Commerce",
        description:
          "Build and modernize commerce platforms that connect product, pricing, and fulfillment.",
      },
      {
        title: "AI Product Discovery",
        description:
          "Apply AI to search, recommendations, and customer support so shoppers find what they need faster.",
      },
      {
        title: "Inventory & Operations",
        description:
          "Give operations teams real-time visibility into inventory across channels and locations.",
      },
      {
        title: "Analytics & Automation",
        description:
          "Automate demand planning and reporting workflows that today run on spreadsheets.",
      },
    ],
    outcomes: [
      {
        title: "Shoppers find what they need",
        description:
          "AI-powered discovery and recommendations reduce the gap between intent and purchase.",
      },
      {
        title: "Inventory visibility across channels",
        description:
          "Operations teams see stock levels in real time instead of reconciling systems at day's end.",
      },
      {
        title: "Less manual reporting",
        description:
          "Automation replaces recurring spreadsheet work with connected analytics.",
      },
    ],
    metaDescription:
      "Modernize commerce, product discovery, customer experience, inventory visibility, data, and automation for retail and consumer organizations.",
  },

  transportation: {
    slug: "transportation",
    kicker: "Industries",
    title: "Transportation",
    headline: "Modernize the systems behind the network.",
    description:
      "Improve asset, project, procurement, workforce, and operational processes across transportation and infrastructure organizations.",
    heroImage: stockImage("industryPageTransportation", { w: 1600, q: 80 }),
    heroImageAlt: "Transportation infrastructure and logistics network",
    focusAreas: [
      "Asset Management",
      "Project & Program Controls",
      "Procurement",
      "Workforce Operations",
      "Data & Reporting",
      "Compliance",
    ],
    overview: [
      {
        title: "Asset Management",
        description:
          "Track asset condition and lifecycle costs across large, distributed infrastructure portfolios.",
      },
      {
        title: "Project & Program Controls",
        description:
          "Bring cost, schedule, and risk visibility to multi-year capital programs.",
      },
      {
        title: "Procurement & Compliance",
        description:
          "Modernize procurement processes while maintaining the compliance federal and state funding requires.",
      },
      {
        title: "Workforce Operations",
        description:
          "Streamline scheduling, certification tracking, and operations workforce management.",
      },
    ],
    outcomes: [
      {
        title: "Capital programs under control",
        description:
          "Cost, schedule, and risk visibility across every phase of multi-year infrastructure programs.",
      },
      {
        title: "Compliance built in",
        description:
          "Procurement processes that satisfy funding requirements without slowing delivery down.",
      },
      {
        title: "Assets tracked, not guessed at",
        description:
          "Condition and lifecycle data replace tribal knowledge about aging infrastructure.",
      },
    ],
    metaDescription:
      "Improve asset, project, procurement, workforce, and operational processes across transportation and infrastructure.",
  },

  technology: {
    slug: "technology",
    kicker: "Industries",
    title: "Technology",
    headline: "Build platforms that scale with the business.",
    description:
      "Scale enterprise platforms, automate operations, integrate systems, and turn data into decisions for technology and software organizations.",
    heroImage: stockImage("technologyEngineering", { w: 1600, q: 88 }),
    heroImageAlt: "Product engineering and software architecture collaboration",
    focusAreas: [
      "Cloud-Native Applications",
      "AI Products",
      "SaaS Platforms",
      "APIs",
      "Data",
      "Automation",
    ],
    overview: [
      {
        title: "Cloud-Native Applications",
        description:
          "Architect applications and platforms that scale with demand instead of requiring a rewrite.",
      },
      {
        title: "AI Products",
        description:
          "Ship AI-powered features and products with the evaluation and monitoring production requires.",
      },
      {
        title: "SaaS Platforms & APIs",
        description:
          "Build multi-tenant platforms and the APIs that let customers and partners integrate with them.",
      },
      {
        title: "Data & Automation",
        description:
          "Turn operational data into decisions with pipelines and automation that don't require manual babysitting.",
      },
    ],
    outcomes: [
      {
        title: "Platforms that scale without a rewrite",
        description:
          "Cloud-native architecture absorbs growth instead of requiring a re-platform at the next order of magnitude.",
      },
      {
        title: "AI features that hold up in production",
        description:
          "Evaluation and monitoring built in from the start, not bolted on after an incident.",
      },
      {
        title: "Data teams can act on",
        description:
          "Pipelines and automation turn raw operational data into decisions without manual intervention.",
      },
    ],
    metaDescription:
      "Scale enterprise platforms, automate operations, integrate systems, and turn data into decisions.",
  },
};

export function getIndustryPageSlugs(): string[] {
  return Object.keys(industryPages);
}
