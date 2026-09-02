export type InsightCategory =
  | "oracle"
  | "ai-data"
  | "enterprise-transformation"
  | "industry-perspectives"
  | "research"
  | "news";

export type InsightSection = {
  id: string;
  title: string;
  paragraphs: string[];
  pullQuote?: string;
  diagram?: {
    title: string;
    caption: string;
    bullets?: string[];
  };
};

export type InsightFaq = {
  question: string;
  answer: string;
};

export type InsightCta = {
  headline: string;
  body: string;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export type Insight = {
  slug: string;
  title: string;
  summary: string;
  category: InsightCategory;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  featured?: boolean;
  /** Short body used for cards / fallback when sections omitted. */
  body: string[];
  introduction?: string[];
  sections?: InsightSection[];
  faqs?: InsightFaq[];
  cta?: InsightCta;
  insertCtaAfterSectionId?: string;
};

export const insightCategoryLabels: Record<InsightCategory, string> = {
  oracle: "Oracle",
  "ai-data": "AI & Data",
  "enterprise-transformation": "Enterprise Transformation",
  "industry-perspectives": "Industry Perspectives",
  research: "Research",
  news: "News",
};

/** Longer labels for article headers (editorial). */
export const insightCategoryHeadings: Record<InsightCategory, string> = {
  oracle: "Oracle & Enterprise Platforms",
  "ai-data": "AI & Data",
  "enterprise-transformation": "Enterprise Transformation",
  "industry-perspectives": "Industry Perspectives",
  research: "Research & Perspectives",
  news: "News",
};

const defaultCta: InsightCta = {
  headline: "We solve complex enterprise problems through strategy, technology and execution.",
  body: "Consult America partners with leaders on Oracle, AI, data, and transformation programs that have to work in production—not only in workshops.",
  primaryHref: "/oracle",
  primaryLabel: "Explore Oracle",
  secondaryHref: "/contact",
  secondaryLabel: "Let's Talk",
};

export const insights: Insight[] = [
  {
    slug: "what-stalls-fusion-programs",
    title: "How to Prepare for a Successful Oracle Cloud Transformation",
    summary:
      "The operating-model gaps that show up after design workshops—and how to close them before cutover.",
    category: "oracle",
    publishedAt: "2026-08-19",
    updatedAt: "2026-08-25",
    readingTime: "8 min",
    featured: true,
    body: [
      "Most Oracle Fusion programs do not stall because of missing configuration knowledge. They stall when the operating model, process ownership, and cutover decisions remain unresolved after workshops feel complete.",
      "Consult America approaches Fusion delivery as enterprise transformation: process design, solution architecture, integration, testing, adoption, and production support working as one program.",
    ],
    introduction: [
      "Oracle Cloud transformations succeed when strategy, data, integration, and execution are treated as one operating system—not as a sequence of disconnected workstreams.",
      "This article outlines the preparation disciplines we see separate durable programs from stalled ones: clear strategy, trustworthy data contracts, integration ownership, testing that mirrors the business, and a go-live model that can decide under pressure.",
    ],
    sections: [
      {
        id: "strategy",
        title: "Strategy",
        paragraphs: [
          "Start with the operating outcomes the business must run on day one—not with a catalog of modules. Finance close, procure-to-pay, order-to-cash, and workforce processes need named owners before configuration volume ramps.",
          "Strategy also means deciding what will not go live. Deferred scope without an owner becomes silent risk. Capture deferrals with criteria, owners, and a post-go-live path.",
        ],
        pullQuote:
          "If ownership is unclear in workshops, it will be contested on go-live weekend.",
      },
      {
        id: "data",
        title: "Data",
        paragraphs: [
          "Data readiness is not a conversion spreadsheet exercise alone. Masters, charts, open transactions, and historical cut lines must be agreed with business owners who will reconcile after go-live.",
          "Treat data quality as a control: thresholds, owners, and a stop/go rule. Programs that “clean later” usually pay for that optimism during hypercare.",
        ],
        diagram: {
          title: "Data readiness lens",
          caption: "A practical view of what must be decided before conversion freezes.",
          bullets: [
            "Master ownership and golden sources",
            "Open transaction policy",
            "Historical depth vs. archive strategy",
            "Reconciliation owners and SLAs",
          ],
        },
      },
      {
        id: "integration",
        title: "Integration",
        paragraphs: [
          "Integrations fail quietly when contracts are deferred. Define mandatory versus deferred interfaces early, with latency, error handling, and business impact stated in plain language.",
          "Integration testing should prove business continuity—not only that a payload lands. Pair technical owners with process owners for each critical path.",
        ],
      },
      {
        id: "testing",
        title: "Testing",
        paragraphs: [
          "Screen-based testing creates false confidence. End-to-end scenarios should follow real roles, real approvals, and real exception paths.",
          "Defect triage needs a shared command structure: business severity, technical root cause, and a decision clock that does not wait for the next steering committee.",
        ],
        pullQuote:
          "Testing that cannot fail a release is not testing—it is documentation theater.",
      },
      {
        id: "go-live",
        title: "Go-Live",
        paragraphs: [
          "Go-live is an operating event. The checklist should be short, owned, and pass/fail. Reconciliation, access, integration health, and communications sit above vanity runbook length.",
          "Name the decision makers for cutover weekend. If a control cannot be decided in minutes, it does not belong on the board.",
        ],
      },
    ],
    insertCtaAfterSectionId: "integration",
    cta: {
      ...defaultCta,
      primaryHref: "/oracle",
      primaryLabel: "Explore Oracle",
    },
    faqs: [
      {
        question: "When should we freeze scope?",
        answer:
          "Freeze when process ownership, mandatory integrations, and data cut lines are agreed—not when workshops feel complete. Late scope without owners is the most common stall pattern.",
      },
      {
        question: "How much history should we convert?",
        answer:
          "Convert what the business must operate and audit on day one. Archive the rest with a retrieval path. History volume without reconciliation owners slows conversion and confuses hypercare.",
      },
      {
        question: "What does Consult America own in these programs?",
        answer:
          "We partner across strategy, Oracle architecture, integration, testing, cutover, and production support—so transformation is measured by what runs, not by what was designed.",
      },
    ],
  },
  {
    slug: "ai-without-a-data-contract",
    title: "AI without a data contract",
    summary:
      "Why AI pilots fail when nobody owns data quality, access, evaluation, or production accountability.",
    category: "ai-data",
    publishedAt: "2026-08-18",
    updatedAt: "2026-08-18",
    readingTime: "5 min",
    featured: true,
    body: [
      "Enterprise AI initiatives often begin with a promising demo and end without a production owner. The missing ingredient is rarely the model. It is the data contract.",
      "A useful data contract defines sources, freshness, access controls, evaluation criteria, and the human oversight required when the system is wrong.",
      "Without that agreement, teams optimize prompts against incomplete knowledge bases, then discover that legal, security, and operations were never prepared to support the workflow.",
      "Practical enterprise AI starts with a use case, a governed data path, and a production operating model—not with unconstrained experimentation.",
    ],
    introduction: [
      "Enterprise AI initiatives often begin with a promising demo and end without a production owner. The missing ingredient is rarely the model. It is the data contract.",
    ],
    sections: [
      {
        id: "contract",
        title: "The data contract",
        paragraphs: [
          "A useful data contract defines sources, freshness, access controls, evaluation criteria, and the human oversight required when the system is wrong.",
        ],
        pullQuote:
          "If nobody owns evaluation, the pilot owns the narrative—and production owns the risk.",
      },
      {
        id: "operations",
        title: "Production operations",
        paragraphs: [
          "Without that agreement, teams optimize prompts against incomplete knowledge bases, then discover that legal, security, and operations were never prepared to support the workflow.",
          "Practical enterprise AI starts with a use case, a governed data path, and a production operating model—not with unconstrained experimentation.",
        ],
      },
    ],
    insertCtaAfterSectionId: "contract",
    cta: {
      ...defaultCta,
      primaryHref: "/ai-data",
      primaryLabel: "Explore AI & Data",
    },
    faqs: [
      {
        question: "Do we need a custom model?",
        answer:
          "Often no. Start with governed data access and a measurable workflow. Model choice follows accountability—not the reverse.",
      },
    ],
  },
  {
    slug: "cutover-checklists-that-work",
    title: "Cutover checklists that work",
    summary:
      "The few controls we refuse to skip on go-live weekend—and why they matter more than longer runbooks.",
    category: "enterprise-transformation",
    publishedAt: "2026-07-14",
    updatedAt: "2026-07-14",
    readingTime: "4 min",
    featured: true,
    body: [
      "Long cutover runbooks can create false confidence. What matters is a short list of controls that prove the business can operate on Monday morning.",
      "We prioritize reconciliation of critical transactions, confirmation of integration health, role-based access verification, and a named command structure for defects and communications.",
      "Every control should have an owner, a pass/fail criterion, and a fallback. If a checklist item cannot be decided in minutes, it does not belong on the weekend board.",
      "Transformation is measured by what goes live. Cutover discipline is how that becomes operational reality.",
    ],
    introduction: [
      "Long cutover runbooks can create false confidence. What matters is a short list of controls that prove the business can operate on Monday morning.",
    ],
    sections: [
      {
        id: "controls",
        title: "The controls that matter",
        paragraphs: [
          "We prioritize reconciliation of critical transactions, confirmation of integration health, role-based access verification, and a named command structure for defects and communications.",
          "Every control should have an owner, a pass/fail criterion, and a fallback. If a checklist item cannot be decided in minutes, it does not belong on the weekend board.",
        ],
      },
      {
        id: "outcome",
        title: "What go-live proves",
        paragraphs: [
          "Transformation is measured by what goes live. Cutover discipline is how that becomes operational reality.",
        ],
      },
    ],
    insertCtaAfterSectionId: "controls",
    cta: defaultCta,
  },
  {
    slug: "buying-vs-building-copilots",
    title: "Buying vs. building copilots",
    summary:
      "A practical filter for when a vendor tool is enough—and when enterprise context requires a custom workflow.",
    category: "ai-data",
    publishedAt: "2026-07-02",
    updatedAt: "2026-07-02",
    readingTime: "5 min",
    body: [
      "Not every AI opportunity needs a custom platform. Many organizations can start with governed vendor copilots for productivity use cases.",
      "Build when the workflow depends on proprietary enterprise data, strict access boundaries, domain-specific validation, or integration into operational systems of record.",
      "Buy when the value is primarily general knowledge assistance and the risk profile can be managed with standard enterprise controls.",
      "The decision should be framed around workflow ownership, data sensitivity, and measurable outcomes—not novelty.",
    ],
    introduction: [
      "Not every AI opportunity needs a custom platform. Many organizations can start with governed vendor copilots for productivity use cases.",
    ],
    sections: [
      {
        id: "build",
        title: "When to build",
        paragraphs: [
          "Build when the workflow depends on proprietary enterprise data, strict access boundaries, domain-specific validation, or integration into operational systems of record.",
        ],
      },
      {
        id: "buy",
        title: "When to buy",
        paragraphs: [
          "Buy when the value is primarily general knowledge assistance and the risk profile can be managed with standard enterprise controls.",
          "The decision should be framed around workflow ownership, data sensitivity, and measurable outcomes—not novelty.",
        ],
      },
    ],
    insertCtaAfterSectionId: "build",
    cta: {
      ...defaultCta,
      primaryHref: "/ai-data",
      primaryLabel: "Explore AI & Data",
    },
  },
  {
    slug: "public-sector-finance-modernization",
    title: "Modernizing public-sector finance without losing control",
    summary:
      "How government and public-sector teams can modernize financials while preserving transparency, auditability, and accountability.",
    category: "industry-perspectives",
    publishedAt: "2026-06-20",
    updatedAt: "2026-06-20",
    readingTime: "7 min",
    body: [
      "Public-sector finance modernization is not only a technology upgrade. It is a control and accountability redesign.",
      "Successful programs connect financial management, procurement, grants, projects, and reporting with clear ownership and audit-ready processes.",
      "Oracle and related enterprise platforms can support that outcome when implementation stays grounded in operating procedures and oversight requirements.",
      "The goal is stronger execution with stronger control—not speed at the expense of transparency.",
    ],
    introduction: [
      "Public-sector finance modernization is not only a technology upgrade. It is a control and accountability redesign.",
    ],
    sections: [
      {
        id: "control",
        title: "Control and accountability",
        paragraphs: [
          "Successful programs connect financial management, procurement, grants, projects, and reporting with clear ownership and audit-ready processes.",
        ],
      },
      {
        id: "platforms",
        title: "Platforms in service of oversight",
        paragraphs: [
          "Oracle and related enterprise platforms can support that outcome when implementation stays grounded in operating procedures and oversight requirements.",
          "The goal is stronger execution with stronger control—not speed at the expense of transparency.",
        ],
      },
    ],
    insertCtaAfterSectionId: "control",
    cta: defaultCta,
  },
  {
    slug: "integration-before-analytics",
    title: "Integration before analytics",
    summary:
      "Why disconnected systems produce disconnected dashboards—and how to sequence enterprise data work.",
    category: "research",
    publishedAt: "2026-06-05",
    updatedAt: "2026-06-05",
    readingTime: "5 min",
    body: [
      "Organizations often fund analytics before they stabilize the integrations that feed those dashboards.",
      "When source systems disagree on masters, statuses, or timing, reporting becomes a negotiation instead of a decision tool.",
      "A stronger sequence is: clarify the business process, stabilize integrations and data contracts, then design analytics on trustworthy foundations.",
      "This approach reduces rework and makes AI and automation investments more durable.",
    ],
    introduction: [
      "Organizations often fund analytics before they stabilize the integrations that feed those dashboards.",
    ],
    sections: [
      {
        id: "sequence",
        title: "A stronger sequence",
        paragraphs: [
          "When source systems disagree on masters, statuses, or timing, reporting becomes a negotiation instead of a decision tool.",
          "A stronger sequence is: clarify the business process, stabilize integrations and data contracts, then design analytics on trustworthy foundations.",
          "This approach reduces rework and makes AI and automation investments more durable.",
        ],
      },
    ],
    insertCtaAfterSectionId: "sequence",
    cta: {
      ...defaultCta,
      primaryHref: "/ai-data",
      primaryLabel: "Explore AI & Data",
    },
  },
  {
    slug: "consultamerica-careers-platform-direction",
    title: "Building the foundation for careers and delivery talent",
    summary:
      "How Consult America is connecting public careers experiences to a future recruiting and HR platform.",
    category: "news",
    publishedAt: "2026-08-20",
    updatedAt: "2026-08-20",
    readingTime: "3 min",
    body: [
      "Consult America is expanding its digital platform from corporate marketing into careers, recruiting, and eventual employee experiences.",
      "The public careers and jobs experience is intentionally designed as the front door to a later ATS and HR foundation—without exposing internal administration on the marketing site.",
      "The architectural rule is simple: Candidate becomes Employee through hire conversion, not through disconnected databases.",
      "This foundation supports long-term delivery capacity across Oracle, AI, data, and enterprise transformation programs.",
    ],
    introduction: [
      "Consult America is expanding its digital platform from corporate marketing into careers, recruiting, and eventual employee experiences.",
    ],
    sections: [
      {
        id: "architecture",
        title: "One continuum",
        paragraphs: [
          "The public careers and jobs experience is intentionally designed as the front door to a later ATS and HR foundation—without exposing internal administration on the marketing site.",
          "The architectural rule is simple: Candidate becomes Employee through hire conversion, not through disconnected databases.",
          "This foundation supports long-term delivery capacity across Oracle, AI, data, and enterprise transformation programs.",
        ],
      },
    ],
    insertCtaAfterSectionId: "architecture",
    cta: {
      ...defaultCta,
      primaryHref: "/careers",
      primaryLabel: "Explore Careers",
    },
  },
];
