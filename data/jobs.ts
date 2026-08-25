export type CareerArea =
  | "experienced-professionals"
  | "technology-oracle"
  | "ai-data"
  | "consulting"
  | "early-careers";

export type Job = {
  id: string;
  slug: string;
  title: string;
  department: string;
  careerArea: CareerArea;
  location: string;
  workplaceType: "Remote" | "Hybrid" | "On-site";
  employmentType: "Full Time" | "Part Time" | "Contract";
  summary: string;
  description: string;
  responsibilities: string[];
  qualifications: string[];
  preferredQualifications?: string[];
  postedAt: string;
  status: "open" | "closed";
  isDemo: boolean;
};

export const careerAreaLabels: Record<CareerArea, string> = {
  "experienced-professionals": "Experienced Professionals",
  "technology-oracle": "Technology & Oracle Careers",
  "ai-data": "AI & Data Careers",
  consulting: "Consulting Opportunities",
  "early-careers": "Early Careers",
};

/** Demo positions for development — not real open requisitions. */
export const jobs: Job[] = [
  {
    id: "demo-001",
    slug: "senior-oracle-financials-consultant",
    title: "Senior Oracle Financials Consultant (Demo)",
    department: "Oracle & Enterprise Platforms",
    careerArea: "technology-oracle",
    location: "United States",
    workplaceType: "Remote",
    employmentType: "Full Time",
    summary:
      "Lead Oracle Fusion Financials implementations across complex enterprise environments.",
    description:
      "This is a sample position for development and design review. ConsultAmerica helps organizations modernize finance, procurement, and reporting through connected Oracle Cloud programs. In this role, you would support transformation from design through go-live alongside experienced delivery teams.",
    responsibilities: [
      "Support Oracle Fusion Financials design, configuration, and testing activities.",
      "Work with finance and IT stakeholders to translate business requirements into solution design.",
      "Contribute to integration, reporting, and cutover planning across enterprise programs.",
      "Collaborate with functional, technical, and testing teams through implementation phases.",
    ],
    qualifications: [
      "Experience with Oracle ERP or Oracle Fusion Cloud Financials.",
      "Strong understanding of enterprise finance processes and controls.",
      "Ability to work across business and technology teams in complex programs.",
      "Clear communication and structured problem-solving skills.",
    ],
    preferredQualifications: [
      "Oracle Cloud certification or equivalent implementation experience.",
      "Experience with public-sector or multi-entity finance environments.",
    ],
    postedAt: "2026-08-01",
    status: "open",
    isDemo: true,
  },
  {
    id: "demo-002",
    slug: "oracle-scm-consultant",
    title: "Oracle SCM Consultant (Demo)",
    department: "Oracle & Enterprise Platforms",
    careerArea: "technology-oracle",
    location: "Maryland",
    workplaceType: "Hybrid",
    employmentType: "Full Time",
    summary:
      "Support procurement, supply chain, and inventory modernization on Oracle Cloud.",
    description:
      "This is a sample position for development and design review. You would help clients modernize procurement and supply chain operations through Oracle Cloud SCM, working across design, configuration, integration, and adoption.",
    responsibilities: [
      "Support Oracle SCM configuration and process design workshops.",
      "Assist with procurement, inventory, and order management workflows.",
      "Collaborate on integration and testing activities with cross-functional teams.",
      "Help document requirements, decisions, and implementation outcomes.",
    ],
    qualifications: [
      "Experience with Oracle SCM, EBS SCM, or related enterprise supply chain platforms.",
      "Understanding of procurement and inventory management processes.",
      "Comfort working in hybrid delivery models with client and partner teams.",
    ],
    postedAt: "2026-08-05",
    status: "open",
    isDemo: true,
  },
  {
    id: "demo-003",
    slug: "ai-engineer",
    title: "AI Engineer (Demo)",
    department: "AI & Data",
    careerArea: "ai-data",
    location: "United States",
    workplaceType: "Remote",
    employmentType: "Full Time",
    summary:
      "Build enterprise AI workflows, agents, and intelligent automation for production use.",
    description:
      "This is a sample position for development and design review. ConsultAmerica focuses on practical enterprise AI — connecting data, models, workflows, and governance so intelligent systems can operate securely in production.",
    responsibilities: [
      "Design and implement AI-assisted workflows for enterprise use cases.",
      "Integrate language models, retrieval, and business systems into secure solutions.",
      "Collaborate with data, engineering, and business teams on production readiness.",
      "Support evaluation, monitoring, and iteration of deployed AI capabilities.",
    ],
    qualifications: [
      "Experience building AI or machine learning solutions in enterprise contexts.",
      "Strong software engineering skills and API integration experience.",
      "Understanding of data access, security, and human oversight in AI systems.",
    ],
    preferredQualifications: [
      "Experience with document intelligence, enterprise search, or AI agents.",
    ],
    postedAt: "2026-08-10",
    status: "open",
    isDemo: true,
  },
  {
    id: "demo-004",
    slug: "data-engineer",
    title: "Data Engineer (Demo)",
    department: "AI & Data",
    careerArea: "ai-data",
    location: "Virginia",
    workplaceType: "Hybrid",
    employmentType: "Full Time",
    summary:
      "Build reliable data pipelines, integrations, and platforms for enterprise analytics and AI.",
    description:
      "This is a sample position for development and design review. You would help organizations make enterprise data usable, trustworthy, and ready for analytics and intelligent workflows.",
    responsibilities: [
      "Design and implement data pipelines, integrations, and transformation workflows.",
      "Support data modeling and quality practices across enterprise platforms.",
      "Collaborate with analytics, AI, and application teams on shared data needs.",
      "Document data flows, contracts, and operational support considerations.",
    ],
    qualifications: [
      "Experience with data engineering, ETL/ELT, or enterprise integration patterns.",
      "Familiarity with cloud data platforms and SQL-based transformation.",
      "Ability to work across technical and business stakeholders.",
    ],
    postedAt: "2026-08-12",
    status: "open",
    isDemo: true,
  },
  {
    id: "demo-005",
    slug: "enterprise-transformation-consultant",
    title: "Enterprise Transformation Consultant (Demo)",
    department: "Enterprise Transformation",
    careerArea: "consulting",
    location: "United States",
    workplaceType: "Hybrid",
    employmentType: "Full Time",
    summary:
      "Help organizations connect strategy, operating models, and technology to deliver transformation.",
    description:
      "This is a sample position for development and design review. You would support enterprise transformation programs that combine business process change, platform modernization, and disciplined delivery.",
    responsibilities: [
      "Support transformation planning, workshop facilitation, and roadmap development.",
      "Work with client teams to align business objectives with technology decisions.",
      "Contribute to program governance, change management, and delivery planning.",
      "Collaborate across functional, technical, and leadership stakeholders.",
    ],
    qualifications: [
      "Experience in enterprise consulting, program delivery, or transformation roles.",
      "Strong business analysis and communication skills.",
      "Comfort operating in complex, multi-stakeholder environments.",
    ],
    postedAt: "2026-08-15",
    status: "open",
    isDemo: true,
  },
  {
    id: "demo-006",
    slug: "junior-technology-analyst",
    title: "Junior Technology Analyst (Demo)",
    department: "Digital Engineering",
    careerArea: "early-careers",
    location: "Maryland",
    workplaceType: "Hybrid",
    employmentType: "Full Time",
    summary:
      "Start your career supporting enterprise technology, integration, and delivery programs.",
    description:
      "This is a sample position for development and design review. Early-career professionals at ConsultAmerica work alongside experienced teams on meaningful business and technology challenges across enterprise platforms, data, and digital engineering.",
    responsibilities: [
      "Support requirements gathering, documentation, and testing activities.",
      "Assist with integration, configuration, and quality assurance tasks.",
      "Learn enterprise delivery practices through structured project involvement.",
      "Collaborate with consultants, engineers, and client teams.",
    ],
    qualifications: [
      "Bachelor's degree in information systems, computer science, business, or related field.",
      "Interest in enterprise technology, consulting, or digital transformation.",
      "Strong written communication and eagerness to learn.",
    ],
    postedAt: "2026-08-18",
    status: "open",
    isDemo: true,
  },
];
