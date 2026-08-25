export type InsightCategory =
  | "oracle"
  | "ai-data"
  | "enterprise-transformation"
  | "industry-perspectives"
  | "research"
  | "news";

export type Insight = {
  slug: string;
  title: string;
  summary: string;
  category: InsightCategory;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
  body: string[];
};

export const insightCategoryLabels: Record<InsightCategory, string> = {
  oracle: "Oracle",
  "ai-data": "AI & Data",
  "enterprise-transformation": "Enterprise Transformation",
  "industry-perspectives": "Industry Perspectives",
  research: "Research",
  news: "News",
};

export const insights: Insight[] = [
  {
    slug: "what-stalls-fusion-programs",
    title: "What stalls Fusion programs",
    summary:
      "The operating-model gaps that show up after design workshops—and how to close them before cutover.",
    category: "oracle",
    publishedAt: "2026-08-19",
    readingTime: "6 min",
    featured: true,
    body: [
      "Most Oracle Fusion programs do not stall because of missing configuration knowledge. They stall when the operating model, process ownership, and cutover decisions remain unresolved after workshops feel complete.",
      "Common friction points include unclear finance and procurement ownership, integration contracts that were deferred, and testing that focuses on screens instead of end-to-end business outcomes.",
      "ConsultAmerica approaches Fusion delivery as enterprise transformation: process design, solution architecture, integration, testing, adoption, and production support working as one program—not as disconnected workstreams.",
      "Before go-live, teams should confirm who owns each process after cutover, which integrations are mandatory versus deferred, and how defects will be triaged with business and technical owners in the same room.",
    ],
  },
  {
    slug: "ai-without-a-data-contract",
    title: "AI without a data contract",
    summary:
      "Why AI pilots fail when nobody owns data quality, access, evaluation, or production accountability.",
    category: "ai-data",
    publishedAt: "2026-08-18",
    readingTime: "5 min",
    featured: true,
    body: [
      "Enterprise AI initiatives often begin with a promising demo and end without a production owner. The missing ingredient is rarely the model. It is the data contract.",
      "A useful data contract defines sources, freshness, access controls, evaluation criteria, and the human oversight required when the system is wrong.",
      "Without that agreement, teams optimize prompts against incomplete knowledge bases, then discover that legal, security, and operations were never prepared to support the workflow.",
      "Practical enterprise AI starts with a use case, a governed data path, and a production operating model—not with unconstrained experimentation.",
    ],
  },
  {
    slug: "cutover-checklists-that-work",
    title: "Cutover checklists that work",
    summary:
      "The few controls we refuse to skip on go-live weekend—and why they matter more than longer runbooks.",
    category: "enterprise-transformation",
    publishedAt: "2026-07-14",
    readingTime: "4 min",
    featured: true,
    body: [
      "Long cutover runbooks can create false confidence. What matters is a short list of controls that prove the business can operate on Monday morning.",
      "We prioritize reconciliation of critical transactions, confirmation of integration health, role-based access verification, and a named command structure for defects and communications.",
      "Every control should have an owner, a pass/fail criterion, and a fallback. If a checklist item cannot be decided in minutes, it does not belong on the weekend board.",
      "Transformation is measured by what goes live. Cutover discipline is how that becomes operational reality.",
    ],
  },
  {
    slug: "buying-vs-building-copilots",
    title: "Buying vs. building copilots",
    summary:
      "A practical filter for when a vendor tool is enough—and when enterprise context requires a custom workflow.",
    category: "ai-data",
    publishedAt: "2026-07-02",
    readingTime: "5 min",
    body: [
      "Not every AI opportunity needs a custom platform. Many organizations can start with governed vendor copilots for productivity use cases.",
      "Build when the workflow depends on proprietary enterprise data, strict access boundaries, domain-specific validation, or integration into operational systems of record.",
      "Buy when the value is primarily general knowledge assistance and the risk profile can be managed with standard enterprise controls.",
      "The decision should be framed around workflow ownership, data sensitivity, and measurable outcomes—not novelty.",
    ],
  },
  {
    slug: "public-sector-finance-modernization",
    title: "Modernizing public-sector finance without losing control",
    summary:
      "How government and public-sector teams can modernize financials while preserving transparency, auditability, and accountability.",
    category: "industry-perspectives",
    publishedAt: "2026-06-20",
    readingTime: "7 min",
    body: [
      "Public-sector finance modernization is not only a technology upgrade. It is a control and accountability redesign.",
      "Successful programs connect financial management, procurement, grants, projects, and reporting with clear ownership and audit-ready processes.",
      "Oracle and related enterprise platforms can support that outcome when implementation stays grounded in operating procedures and oversight requirements.",
      "The goal is stronger execution with stronger control—not speed at the expense of transparency.",
    ],
  },
  {
    slug: "integration-before-analytics",
    title: "Integration before analytics",
    summary:
      "Why disconnected systems produce disconnected dashboards—and how to sequence enterprise data work.",
    category: "research",
    publishedAt: "2026-06-05",
    readingTime: "5 min",
    body: [
      "Organizations often fund analytics before they stabilize the integrations that feed those dashboards.",
      "When source systems disagree on masters, statuses, or timing, reporting becomes a negotiation instead of a decision tool.",
      "A stronger sequence is: clarify the business process, stabilize integrations and data contracts, then design analytics on trustworthy foundations.",
      "This approach reduces rework and makes AI and automation investments more durable.",
    ],
  },
  {
    slug: "consultamerica-careers-platform-direction",
    title: "Building the foundation for careers and delivery talent",
    summary:
      "How ConsultAmerica is connecting public careers experiences to a future recruiting and HR platform.",
    category: "news",
    publishedAt: "2026-08-20",
    readingTime: "3 min",
    body: [
      "ConsultAmerica is expanding its digital platform from corporate marketing into careers, recruiting, and eventual employee experiences.",
      "The public careers and jobs experience is intentionally designed as the front door to a later ATS and HR foundation—without exposing internal administration on the marketing site.",
      "The architectural rule is simple: Candidate becomes Employee through hire conversion, not through disconnected databases.",
      "This foundation supports long-term delivery capacity across Oracle, AI, data, and enterprise transformation programs.",
    ],
  },
];
