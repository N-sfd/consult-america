import type { Job } from "@/lib/jobs";
import type { CareerArea } from "@/types/recruiting";

type PracticeRole = {
  title: string;
  department: string;
  careerArea: CareerArea;
  location: string;
  workplaceType: Job["workplaceType"];
  employmentType: Job["employmentType"];
  summary: string;
};

const roles: PracticeRole[] = [
  ["Senior Oracle Financials Consultant", "Oracle Consulting", "technology-oracle", "Remote, United States", "Remote", "Full Time", "Lead Fusion Financials design, configuration, and testing for multi-entity programs."],
  ["Oracle SCM Consultant", "Oracle Consulting", "technology-oracle", "Hagerstown, MD", "Hybrid", "Full Time", "Configure procurement, inventory, and supply-chain processes on Oracle Cloud."],
  ["Oracle HCM Consultant", "Oracle Consulting", "technology-oracle", "Ashburn, VA", "Hybrid", "Full Time", "Support core HR, payroll, and talent configuration through go-live."],
  ["Oracle Integration Developer", "Oracle Consulting", "technology-oracle", "Remote, United States", "Remote", "Full Time", "Build OIC integrations between Fusion, finance, and operational systems."],
  ["Fusion Technical Analyst", "Oracle Consulting", "technology-oracle", "McLean, VA", "On-site", "Contract", "Extend reports, OTBI, and Fast Formulas for finance and HR teams."],
  ["Oracle EPM Consultant", "Oracle Consulting", "technology-oracle", "Remote, United States", "Remote", "Full Time", "Design planning and close models for enterprise finance teams."],
  ["Cloud Infrastructure Engineer", "Cloud Engineering", "consulting", "Ashburn, VA", "Hybrid", "Full Time", "Design cloud landing zones, networking, and deployment pipelines."],
  ["Platform Engineer", "Cloud Engineering", "consulting", "Remote, United States", "Remote", "Full Time", "Automate environments, observability, and release paths for enterprise apps."],
  ["Systems Integration Consultant", "Digital Engineering", "consulting", "Washington, DC", "Hybrid", "Full Time", "Connect ERP, CRM, and operational systems with reliable interfaces."],
  ["API Developer", "Digital Engineering", "consulting", "Remote, United States", "Remote", "Contract", "Design and deliver versioned APIs for internal and partner systems."],
  ["Application Engineer", "Digital Engineering", "consulting", "Hagerstown, MD", "Hybrid", "Full Time", "Build production applications around finance, HR, and operations workflows."],
  ["Full Stack Engineer", "Digital Engineering", "consulting", "Remote, United States", "Remote", "Full Time", "Ship web applications from data model through the user interface."],
  ["Data Engineer", "AI & Data", "ai-data", "Ashburn, VA", "Hybrid", "Full Time", "Prepare trusted datasets for reporting, analytics, and operational use."],
  ["Analytics Consultant", "AI & Data", "ai-data", "Remote, United States", "Remote", "Full Time", "Turn operational data into reporting that finance and delivery teams can use."],
  ["Data Agent Product Engineer", "AI & Data", "ai-data", "Remote, United States", "Remote", "Full Time", "Build document extraction, verification, and review workflows."],
  ["Applied AI Consultant", "AI & Data", "ai-data", "McLean, VA", "Hybrid", "Full Time", "Put governed AI into existing enterprise work, not a side experiment."],
  ["Machine Learning Engineer", "AI & Data", "ai-data", "Remote, United States", "Remote", "Contract", "Implement models that stay traceable to source documents and records."],
  ["CRM Functional Consultant", "Customer Operations", "consulting", "Ashburn, VA", "On-site", "Full Time", "Configure accounts, opportunities, and service workflows for client teams."],
  ["CRM Developer", "Customer Operations", "consulting", "Remote, United States", "Remote", "Full Time", "Extend CRM processes, integrations, and activity tracking."],
  ["Enterprise Transformation Consultant", "Consulting", "consulting", "Washington, DC", "Hybrid", "Full Time", "Map operating processes and guide platform change through production."],
  ["Program Manager", "Consulting", "experienced-professionals", "Ashburn, VA", "Hybrid", "Full Time", "Run Oracle and cloud programs from design through cutover."],
  ["Business Analyst", "Consulting", "experienced-professionals", "Hagerstown, MD", "Hybrid", "Full Time", "Write requirements, test scenarios, and process maps with delivery teams."],
  ["Change Manager", "Consulting", "consulting", "Remote, United States", "Remote", "Full Time", "Prepare business teams for new finance, HR, and supply-chain processes."],
  ["QA Lead", "Delivery", "experienced-professionals", "Ashburn, VA", "On-site", "Full Time", "Plan regression, integration, and cutover testing for enterprise releases."],
  ["Test Analyst", "Delivery", "experienced-professionals", "Remote, United States", "Remote", "Contract", "Execute functional test cycles and document defects clearly."],
  ["Technical Writer", "Delivery", "consulting", "Remote, United States", "Remote", "Part Time", "Document configuration, runbooks, and training material for go-live."],
  ["Security Analyst", "Delivery", "experienced-professionals", "Ashburn, VA", "Hybrid", "Full Time", "Review access, logging, and control requirements for client programs."],
  ["Public Sector ERP Consultant", "Oracle Consulting", "technology-oracle", "Washington, DC", "Hybrid", "Full Time", "Support finance and procurement modernization for public-sector programs."],
  ["Healthcare Workflow Consultant", "Consulting", "consulting", "Remote, United States", "Remote", "Full Time", "Translate clinical and operations workflows into application requirements."],
  ["Financial Services Consultant", "Consulting", "consulting", "New York, NY", "Hybrid", "Full Time", "Support multi-entity finance controls and reporting for regulated programs."],
  ["Junior Oracle Analyst", "Oracle Consulting", "early-careers", "Hagerstown, MD", "On-site", "Full Time", "Assist configuration, testing, and documentation on Oracle Cloud projects."],
  ["Associate Data Analyst", "AI & Data", "early-careers", "Ashburn, VA", "Hybrid", "Full Time", "Prepare extracts, reconcile reports, and support data quality reviews."],
].map(([title, department, careerArea, location, workplaceType, employmentType, summary]) => ({
  title,
  department,
  careerArea: careerArea as CareerArea,
  location,
  workplaceType: workplaceType as Job["workplaceType"],
  employmentType: employmentType as Job["employmentType"],
  summary,
}));

export function candidatePracticeJobs(): Job[] {
  return roles.map((role, index) => {
    const number = String(index + 1).padStart(2, "0");
    const slug = role.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    return {
      id: `practice-job-${number}`,
      requisitionId: `practice-req-${number}`,
      slug: `practice-${slug}`,
      title: role.title,
      department: role.department,
      careerArea: role.careerArea,
      location: role.location,
      workplaceType: role.workplaceType,
      employmentType: role.employmentType,
      summary: role.summary,
      description: `${role.summary} This practice opening is listed on the candidate portal so search, filters, and job review can be exercised at production volume.`,
      responsibilities: [
        "Work with Consult America delivery teams from design through production.",
        "Document decisions so the next phase can pick up the work.",
        "Collaborate with functional and technical colleagues on the same record.",
      ],
      qualifications: [
        "Relevant experience for the title above.",
        "Clear written communication with business and technical audiences.",
      ],
      preferredQualifications: ["Prior enterprise program experience."],
      postedAt: "2026-09-20",
      status: "open",
      acceptingApplications: true,
      isNew: index < 8,
      isDemo: true,
    };
  });
}

export function isPracticeJob(job: Pick<Job, "id">): boolean {
  return job.id.startsWith("practice-job-");
}
