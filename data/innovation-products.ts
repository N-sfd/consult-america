export type InnovationFeature = {
  title: string;
  description: string;
};

export type InnovationScreenshot = {
  src: string;
  alt: string;
  caption: string;
};

export type InnovationProduct = {
  slug: string;
  category: string;
  name: string;
  tagline: string;
  headline: string;
  summary: string;
  heroImage: string;
  heroImageAlt: string;
  liveUrl: string;
  theProduct: string[];
  businessProblem: string;
  experience: InnovationScreenshot[];
  capabilities: string[];
  technology: string[];
  metaDescription: string;
};

export const innovationProducts: Record<string, InnovationProduct> = {
  "data-agent": {
    slug: "data-agent",
    category: "AI & Data",
    name: "Data Agent",
    tagline: "Enterprise Document Intelligence",
    headline: "Turn complex enterprise documents into structured intelligence.",
    summary:
      "A contract intelligence platform that extracts, verifies, and indexes agreements at scale — every field traceable back to its source page, not a black-box guess.",
    heroImage: "/innovation/data-agent-hero.png",
    heroImageAlt: "Data Agent contract intelligence platform interface",
    liveUrl: "https://data-agent-ca.vercel.app",
    theProduct: [
      "Document classification",
      "Universal field & clause extraction",
      "Searchable contract repository",
      "Cross-document field comparison",
      "FAR / DFARS clause lookup",
      "Human-in-the-loop review queue",
    ],
    businessProblem:
      "Contract terms — effective dates, CLINs, pricing, obligations — exist only inside unstructured PDFs, DOCX files, and scans spread across a repository nobody can search. Manual review doesn't scale past a handful of agreements, and generic extraction tools produce answers nobody trusts enough to act on without re-opening the source document.",
    experience: [
      {
        src: "/innovation/data-agent-platform.png",
        alt: "Data Agent platform feature grid — extraction, repository, field explorer",
        caption:
          "Contract intelligence across extraction, discovery, compliance, and review.",
      },
    ],
    capabilities: [
      "Document Intelligence",
      "Generative AI",
      "Enterprise Search",
      "Data Extraction",
      "Workflow Automation",
    ],
    technology: ["Next.js", "Python", "AI APIs", "Cloud"],
    metaDescription:
      "Data Agent — an enterprise document and contract intelligence platform built by ConsultAmerica's Innovation Lab.",
  },

  "mediguide-ai": {
    slug: "mediguide-ai",
    category: "Healthcare AI",
    name: "MediGuide AI",
    tagline: "Healthcare AI Assistant",
    headline: "Help people understand their health information with evidence alongside them.",
    summary:
      "A private, evidence-supported assistant that explains medical documents and medication labels, and helps patients prepare sharper questions before an appointment.",
    heroImage: "/innovation/mediguide-hero.png",
    heroImageAlt: "MediGuide AI health information assistant interface",
    liveUrl: "https://mediguide-ai-woad.vercel.app",
    theProduct: [
      "Medication label explanation",
      "Lab result review",
      "Visit preparation workspace",
      "Evidence citations on every answer",
      "Voice playback",
      "Local, private-by-default processing",
    ],
    businessProblem:
      "Patients leave appointments with documents and medication labels full of terms they don't fully understand, and no easy way to prepare the right questions beforehand. Generic AI chat tools answer confidently without citing sources — the wrong trade-off for health information.",
    experience: [
      {
        src: "/innovation/mediguide-secondary.png",
        alt: "MediGuide AI visit preparation panel",
        caption: "Visit preparation turns a vague concern into specific questions for a clinician.",
      },
    ],
    capabilities: [
      "Healthcare AI",
      "Document Understanding",
      "Evidence-Grounded Generation",
      "Voice Interfaces",
      "Privacy-First Architecture",
    ],
    technology: ["Next.js", "Python", "AI APIs", "Local Processing"],
    metaDescription:
      "MediGuide AI — a private, evidence-supported healthcare assistant built by ConsultAmerica's Innovation Lab.",
  },

  joblens: {
    slug: "joblens",
    category: "AI Recruiting / Talent Intelligence",
    name: "JobLens",
    tagline: "Talent Intelligence & Recruiting AI",
    headline: "A job search toolkit that explains every score it gives you.",
    summary:
      "Resume analysis, ATS matching, application tracking, and tailored cover letters in one toolkit — with transparent scoring instead of an opaque black box.",
    heroImage: "/innovation/joblens-hero.png",
    heroImageAlt: "JobLens resume analyzer and job matcher interface",
    liveUrl: "https://joblens-seven.vercel.app",
    theProduct: [
      "Resume analyzer with ATS scoring",
      "Job matcher with keyword & skills gap detection",
      "Application tracker by status",
      "Tailored cover letter generation",
      "Application reminders",
      "Dashboard insights across the search",
    ],
    businessProblem:
      "Job seekers submit into ATS systems with no visibility into how they're actually scored, and track applications across scattered spreadsheets and email threads. Recruiting teams see the same opacity from the other side — matching signal buried in unstructured resumes.",
    experience: [
      {
        src: "/innovation/joblens-secondary.png",
        alt: "JobLens application tracking dashboard",
        caption: "Every application, score, and follow-up in one dashboard.",
      },
    ],
    capabilities: [
      "AI Recruiting",
      "Resume Parsing",
      "ATS Matching",
      "Natural Language Generation",
      "Application Tracking",
    ],
    technology: ["Next.js", "Python", "AI APIs", "Cloud"],
    metaDescription:
      "JobLens — an AI-powered job search and talent intelligence toolkit built by ConsultAmerica's Innovation Lab.",
  },
};

export function getInnovationProductSlugs(): string[] {
  return Object.keys(innovationProducts);
}

export function getInnovationProductBySlug(
  slug: string,
): InnovationProduct | undefined {
  return innovationProducts[slug];
}

export function listInnovationProducts(): InnovationProduct[] {
  return Object.values(innovationProducts);
}
