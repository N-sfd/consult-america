export type CaseStudyOutcome = {
  title: string;
  description: string;
};

export type CaseStudyRelatedWork = {
  number: string;
  category: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type CaseStudy = {
  slug: string;
  category: string;
  title: string;
  headline: string;
  summary: string;
  image: string;
  imageAlt: string;
  capabilities: string[];
  clientContext: string;
  challenge: string;
  approach: string;
  solution: string;
  outcomes: CaseStudyOutcome[];
  relatedWork: CaseStudyRelatedWork[];
  metaDescription: string;
};

const RELATED_WORK_POOL: Record<string, CaseStudyRelatedWork> = {
  "oracle-cloud-transformation": {
    number: "01",
    category: "Oracle",
    title: "Oracle Cloud Transformation",
    description:
      "Modernizing finance and procurement for complex multi-entity operations.",
    href: "/work/case-studies/oracle-cloud-transformation",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Enterprise finance operations center",
  },
  "ai-document-intelligence": {
    number: "02",
    category: "AI + Data",
    title: "AI Document Intelligence",
    description:
      "Turning complex contracts into structured, searchable enterprise intelligence.",
    href: "/work/case-studies/ai-document-intelligence",
    image:
      "https://images.unsplash.com/photo-1568992687947-868a62a9f521?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Document intelligence and data extraction workspace",
  },
  "public-sector-finance-procurement": {
    number: "03",
    category: "Public Sector",
    title: "Public Sector Finance & Procurement",
    description:
      "Modernizing finance and procurement for complex government operations.",
    href: "/work/case-studies/public-sector-finance-procurement",
    image:
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=1600&q=80",
    imageAlt: "Public sector operations and reporting environment",
  },
};

function relatedTo(...slugs: string[]): CaseStudyRelatedWork[] {
  return slugs.map((slug) => RELATED_WORK_POOL[slug]);
}

export const caseStudies: Record<string, CaseStudy> = {
  "public-sector-finance-procurement": {
    slug: "public-sector-finance-procurement",
    category: "Public Sector",
    title: "Public Sector Finance & Procurement",
    headline: "Modernizing finance and procurement for complex government operations.",
    summary:
      "An end-to-end Oracle Cloud transformation connecting financial management, procurement, and project accounting for a multi-agency public-sector organization.",
    image: RELATED_WORK_POOL["public-sector-finance-procurement"].image,
    imageAlt: RELATED_WORK_POOL["public-sector-finance-procurement"].imageAlt,
    capabilities: [
      "Oracle Financials",
      "Procurement",
      "PPM / Projects",
      "Integration",
      "Testing",
      "Reporting",
      "Change Readiness",
    ],
    clientContext:
      "A multi-agency public-sector organization operating legacy finance and procurement systems across separate business units, each with its own approval paths, chart of accounts conventions, and reporting requirements — with audit and appropriations controls that any modernization had to preserve, not just survive.",
    challenge:
      "Public-sector finance and procurement environments often span multiple business units, approval paths, legacy integrations, project accounting structures, and reporting requirements. The transformation required more than a system replacement. It required connected processes, stronger controls, and a clear path from design through testing and production readiness.",
    approach:
      "ConsultAmerica supported an end-to-end transformation approach across financial management, procurement, projects, integrations, testing, reporting, and operational readiness — sequencing the program so legacy processes could be retired without a gap in appropriations tracking, encumbrances, or audit trails.",
    solution:
      "Oracle Cloud Financials and Procurement now operate as a connected system of record, with Project Portfolio Management carrying capital and grant-funded work, integrations replacing manual bridges between agencies, and a shared reporting layer giving finance leadership one auditable source of truth instead of reconciled spreadsheets.",
    outcomes: [
      {
        title: "Control and accountability, preserved",
        description:
          "Every approval chain and audit trail public accountability requires carried through the transformation intact.",
      },
      {
        title: "Fewer manual workarounds",
        description:
          "Finance and procurement staff spend less time bridging systems by hand across business units.",
      },
      {
        title: "Reporting leadership can trust",
        description:
          "A single connected reporting layer replaced siloed, spreadsheet-reconciled reports.",
      },
      {
        title: "Production-ready from day one",
        description:
          "A structured testing and change-readiness track meant go-live didn't surface first-week surprises.",
      },
    ],
    relatedWork: relatedTo("oracle-cloud-transformation", "ai-document-intelligence"),
    metaDescription:
      "How ConsultAmerica modernized finance and procurement for a multi-agency public-sector organization on Oracle Cloud.",
  },

  "oracle-cloud-transformation": {
    slug: "oracle-cloud-transformation",
    category: "Oracle",
    title: "Oracle Cloud Transformation",
    headline: "Modernizing finance and procurement for complex multi-entity operations.",
    summary:
      "A phased Oracle Cloud rollout connecting finance, procurement, and reporting across a multi-entity organization without disrupting month-end close.",
    image: RELATED_WORK_POOL["oracle-cloud-transformation"].image,
    imageAlt: RELATED_WORK_POOL["oracle-cloud-transformation"].imageAlt,
    capabilities: [
      "Oracle Financials",
      "Procurement",
      "Integration",
      "Data Migration",
      "Testing",
      "Change Management",
    ],
    clientContext:
      "A multi-entity organization running disconnected legacy ERP instances per business unit, with finance teams closing the books through manual consolidation rather than a shared chart of accounts.",
    challenge:
      "Each entity had grown its own chart of accounts, approval hierarchy, and close process. A single Oracle Cloud rollout risked breaking close timelines the business depended on if sequencing and data migration weren't handled entity by entity.",
    approach:
      "ConsultAmerica ran a phased, entity-by-entity migration — standardizing the chart of accounts first, then cutting over financials and procurement per entity with a parallel-close validation step before each legacy system was retired.",
    solution:
      "Oracle Cloud Financials and Procurement now run as the single system of record across every entity, with standardized approval workflows and a consolidated close process that no longer depends on manual entity-by-entity reconciliation.",
    outcomes: [
      {
        title: "Close cycle shortened",
        description:
          "Consolidated financials cut days out of month-end close across entities.",
      },
      {
        title: "One chart of accounts",
        description:
          "Standardized structure replaced entity-specific charts that made consolidation manual.",
      },
      {
        title: "Zero missed close cycles",
        description:
          "Phased, parallel-validated cutovers meant no entity missed a close during migration.",
      },
    ],
    relatedWork: relatedTo("public-sector-finance-procurement", "ai-document-intelligence"),
    metaDescription:
      "How ConsultAmerica modernized finance and procurement across a multi-entity organization on Oracle Cloud.",
  },

  "ai-document-intelligence": {
    slug: "ai-document-intelligence",
    category: "AI + Data",
    title: "AI Document Intelligence",
    headline: "Turning complex contracts into structured, searchable enterprise intelligence.",
    summary:
      "A production document-intelligence pipeline that extracts, validates, and indexes contract terms at scale — with human review built into the workflow, not bolted on after.",
    image: RELATED_WORK_POOL["ai-document-intelligence"].image,
    imageAlt: RELATED_WORK_POOL["ai-document-intelligence"].imageAlt,
    capabilities: [
      "Document AI",
      "Data Engineering",
      "Search",
      "Workflow Automation",
      "Governance",
      "Integration",
    ],
    clientContext:
      "An organization managing thousands of active contracts across legal, procurement, and finance, with key terms trapped in unstructured PDFs and no reliable way to search or report on them.",
    challenge:
      "Contract terms — renewal dates, obligations, pricing structures — existed only inside scanned and native PDFs. Manual review didn't scale, and off-the-shelf extraction tools produced results nobody trusted enough to act on without re-checking the source document.",
    approach:
      "ConsultAmerica built a document-intelligence pipeline combining extraction, clause detection, and confidence scoring, with a review queue that routes low-confidence extractions to a human reviewer instead of silently guessing.",
    solution:
      "Contracts are now ingested, extracted, and indexed automatically, with structured terms searchable across the organization and a governance layer that keeps a human in the loop wherever extraction confidence drops.",
    outcomes: [
      {
        title: "Contract terms, searchable",
        description:
          "Renewal dates, obligations, and pricing are now a search query, not a re-read of the PDF.",
      },
      {
        title: "Review time cut sharply",
        description:
          "Confidence-scored extraction means reviewers spend time only where it's actually needed.",
      },
      {
        title: "Governance built in",
        description:
          "Every extraction is traceable back to source, with human review where confidence is low.",
      },
    ],
    relatedWork: relatedTo("public-sector-finance-procurement", "oracle-cloud-transformation"),
    metaDescription:
      "How ConsultAmerica built a production document-intelligence pipeline for contract data at scale.",
  },
};

export function getCaseStudySlugs(): string[] {
  return Object.keys(caseStudies);
}

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies[slug];
}

export function listCaseStudies(): CaseStudy[] {
  return Object.values(caseStudies);
}
