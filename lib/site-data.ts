export const industryLinks = [
  { href: "/industries/government-public-sector", label: "Government & Public Sector", detail: "Federal & state ERP modernization and FAR/DFARS compliance" },
  { href: "/industries/financial-services", label: "Financial Services", detail: "Multi-entity Fusion Financials, subledger accounting and CRM" },
  { href: "/industries/healthcare", label: "Healthcare & Life Sciences", detail: "Clinical documentation intelligence and provider workflows" },
  { href: "/industries/technology", label: "Technology & Software", detail: "Full-stack digital engineering, API hubs and AI systems" },
  { href: "/industries/retail-consumer", label: "Retail & Commerce", detail: "Omnichannel inventory, supply chain and customer 360" },
  { href: "/industries/transportation", label: "Transportation", detail: "Asset management, project controls, procurement, and workforce operations" },
];

export const capabilityGroups = [
  {
    title: "Enterprise Transformation",
    href: "/capabilities/enterprise-transformation",
    description:
      "Align strategy, processes, operating models, and technology to modernize the enterprise.",
    services: [
      { href: "/capabilities/enterprise-transformation", label: "Digital transformation" },
      { href: "/capabilities/enterprise-transformation", label: "Operating models" },
      { href: "/capabilities/enterprise-transformation", label: "Program management" },
      { href: "/capabilities/enterprise-transformation", label: "Change management" },
    ],
  },
  {
    title: "Oracle & Enterprise Platforms",
    href: "/oracle",
    description:
      "Modernize finance, supply chain, HR, projects, planning, integration, and analytics.",
    services: [
      { href: "/oracle", label: "Oracle Fusion Cloud" },
      { href: "/oracle", label: "Financials & SCM" },
      { href: "/oracle", label: "HCM & EPM" },
      { href: "/oracle", label: "Integration & analytics" },
    ],
  },
  {
    title: "AI & Data",
    href: "/ai-data",
    description:
      "Turn enterprise data into intelligent workflows, agents, automation, and analytics.",
    services: [
      { href: "/ai-data", label: "Enterprise AI" },
      { href: "/ai-data", label: "Generative AI" },
      { href: "/ai-data", label: "Data engineering" },
      { href: "/ai-data", label: "Analytics" },
    ],
  },
  {
    title: "Digital Engineering",
    href: "/capabilities/digital-engineering",
    description:
      "Design and build digital products, applications, APIs, and integrations.",
    services: [
      { href: "/capabilities/digital-engineering", label: "Application development" },
      { href: "/capabilities/digital-engineering", label: "APIs & integration" },
      { href: "/capabilities/digital-engineering", label: "UX/UI" },
      { href: "/capabilities/digital-engineering", label: "Cloud-native delivery" },
    ],
  },
  {
    title: "Managed Delivery",
    href: "/capabilities/managed-delivery",
    description:
      "Program leadership, functional expertise, testing, and operational support.",
    services: [
      { href: "/capabilities/managed-delivery", label: "Program delivery" },
      { href: "/capabilities/managed-delivery", label: "Functional consulting" },
      { href: "/capabilities/managed-delivery", label: "Testing & QA" },
      { href: "/capabilities/managed-delivery", label: "Managed services" },
    ],
  },
];

export const deliveryPhases = [
  "Strategy",
  "Design",
  "Configure",
  "Integrate",
  "Test",
  "Deploy",
];

export const offices = [
  {
    city: "Washington, D.C.",
    detail: "Public sector and regulated enterprise delivery",
  },
  {
    city: "New York",
    detail: "Financial services and transformation programs",
  },
  {
    city: "Chicago",
    detail: "Industrial, operations, and platform work",
  },
  {
    city: "Dallas",
    detail: "Oracle Cloud and integration programs",
  },
  {
    city: "San Francisco",
    detail: "AI, data, and digital product delivery",
  },
];

export const solutionsMegaMenu = {
  links: [
    {
      href: "/capabilities/enterprise-transformation",
      label: "Enterprise Transformation",
      detail: "Strategy, operating model, and platform change",
    },
    {
      href: "/platforms/crm",
      label: "CRM & Customer Experience",
      detail: "Sales, service, and customer 360 delivery",
    },
    {
      href: "/capabilities/digital-engineering",
      label: "Cloud & Integration",
      detail: "APIs, portals, and connected systems",
    },
    {
      href: "/capabilities/managed-delivery",
      label: "Managed Delivery",
      detail: "Program leadership through go-live",
    },
  ],
  transform: [
    {
      href: "/capabilities/enterprise-transformation",
      label: "Strategy & Advisory",
      detail: "Roadmaps tied to production outcomes",
    },
    {
      href: "/capabilities/enterprise-transformation",
      label: "Process Modernization",
      detail: "Workflows that survive audit and scale",
    },
    {
      href: "/oracle",
      label: "Platform Transformation",
      detail: "Oracle Cloud across finance and operations",
    },
    {
      href: "/capabilities/managed-delivery",
      label: "Testing & Readiness",
      detail: "Cutover, regression, and release governance",
    },
  ],
  featured: {
    title: "Transform the enterprise.",
    detail: "Connect strategy, platforms, data and operations.",
    href: "/capabilities",
    image: "/innovation/data-agent-platform.png",
    cta: "Explore Solutions",
  },
};

export const oracleMegaMenuGrouped = {
  finance: [
    { href: "/oracle", label: "Financials", detail: "Close, reporting, and accounting" },
    { href: "/oracle", label: "Accounting", detail: "Multi-entity and subledger control" },
    { href: "/oracle", label: "Projects", detail: "Costing, billing, and controls" },
  ],
  operations: [
    { href: "/oracle", label: "Procurement", detail: "Source-to-pay with policy" },
    { href: "/oracle", label: "Supply Chain", detail: "Planning, inventory, fulfillment" },
    { href: "/oracle", label: "Order Management", detail: "Quote-to-cash orchestration" },
  ],
  workforce: [
    { href: "/oracle", label: "HCM", detail: "Core HR and payroll operations" },
    { href: "/oracle", label: "Talent", detail: "Recruiting and workforce programs" },
    { href: "/oracle", label: "Workforce Planning", detail: "Capacity and skills alignment" },
  ],
  platform: [
    { href: "/oracle", label: "Integration & Data", detail: "OIC and enterprise connectivity" },
    { href: "/oracle", label: "Data & Reporting", detail: "Analytics across the core" },
    { href: "/oracle", label: "Testing & Readiness", detail: "Regression and cutover planning" },
  ],
  featured: {
    title: "Modernize the digital core.",
    detail: "Transform finance, procurement, supply chain, projects and workforce through Oracle Cloud.",
    href: "/oracle",
    cta: "Explore Oracle",
    image: "/innovation/data-agent-platform.png",
  },
};

export const aiDataMegaMenuGrouped = {
  ai: [
    { href: "/ai-data", label: "AI Strategy", detail: "Prioritize governed use cases" },
    { href: "/ai-data", label: "Generative AI", detail: "Enterprise workflows with guardrails" },
    { href: "/ai-data", label: "Enterprise Agents", detail: "Operational assistants in production" },
    { href: "/work/innovation/data-agent", label: "Document Intelligence", detail: "Contracts and complex documents" },
  ],
  data: [
    { href: "/ai-data", label: "Data Engineering", detail: "Pipelines, contracts, and quality" },
    { href: "/ai-data", label: "Analytics", detail: "Dashboards leaders actually use" },
    { href: "/ai-data", label: "Enterprise Search", detail: "Find answers across systems" },
    { href: "/ai-data", label: "AI Governance", detail: "Policy, monitoring, and controls" },
  ],
  featured: {
    title: "Data Agent",
    detail: "Turn complex documents into usable intelligence.",
    href: "/work/innovation/data-agent",
    image: "/innovation/data-agent-hero.png",
    cta: "Explore AI & Data",
  },
};

export const applicationsMegaMenu = {
  build: [
    { href: "/capabilities/digital-engineering", label: "Application Engineering", detail: "Products around real workflows" },
    { href: "/capabilities/digital-engineering", label: "Application Modernization", detail: "Retire legacy with confidence" },
    { href: "/platforms", label: "Enterprise Portals", detail: "Employee and customer experiences" },
    { href: "/capabilities/digital-engineering", label: "Integration & APIs", detail: "Connect systems without sprawl" },
  ],
  products: [
    { href: "/work/innovation/data-agent", label: "Data Agent", detail: "Document and contract intelligence" },
    { href: "/work/innovation/mediguide-ai", label: "MediGuide AI", detail: "Clinical workflow assistance" },
    { href: "/work/innovation/joblens", label: "JobLens", detail: "Resume analysis and matching" },
    { href: "/ai-data", label: "Data Explorer", detail: "Governed analytics experiences" },
  ],
  workforce: [
    { href: "/careers", label: "Careers", detail: "Join delivery and engineering teams" },
    { href: "/jobs", label: "Talent & Recruiting", detail: "Open roles and candidate portal" },
    { href: "/platforms/employee", label: "Employee Experience", detail: "Self-service HR portals" },
  ],
  featured: {
    title: "Consult America Labs",
    detail: "We don't only advise. We build.",
    href: "/work/innovation",
    image: "/innovation/data-agent-hero.png",
    cta: "Explore Applications",
  },
};

export const resourcesMegaMenu = {
  links: [
    { href: "/insights", label: "Insights", detail: "Briefings on Oracle, AI, and transformation" },
    { href: "/work", label: "Featured Work", detail: "Programs and delivery highlights" },
    { href: "/work/case-studies", label: "Case Studies", detail: "Outcomes from recent programs" },
    { href: "/insights/what-stalls-fusion-programs", label: "Perspectives", detail: "Featured editorial from delivery" },
  ],
};

export const companyMegaMenu = {
  links: [
    { href: "/about", label: "About", detail: "Mission, model, and delivery philosophy" },
    { href: "/about#how-we-work", label: "How We Work", detail: "One delivery motion, five practices" },
    { href: "/careers", label: "Careers", detail: "Open roles across practices" },
    { href: "/contact", label: "Contact", detail: "Start a conversation with our team" },
  ],
  portals: [
    { href: "/jobs", label: "Candidate Portal" },
    { href: "/login", label: "Employee Portal" },
  ],
};

export const platformStripLinks = [
  { href: "/oracle", label: "Oracle" },
  { href: "/platforms/crm", label: "CRM" },
  { href: "/ai-data", label: "AI & Data" },
  { href: "/capabilities/digital-engineering", label: "Cloud" },
  { href: "/capabilities/digital-engineering", label: "Application Engineering" },
];
