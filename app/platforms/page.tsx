import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Users, UserCheck, FolderGit2, Briefcase, CreditCard } from "lucide-react";

import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";
import SectionLabel from "@/components/marketing/SectionLabel";

export const metadata: Metadata = {
  title: "Enterprise Platforms | ConsultAmerica",
  description:
    "Explore ConsultAmerica's unified software platform suite: CRM, ATS, Core HR, Employee Self-Service, Workforce Time & Leave, and Payroll.",
};

const PLATFORMS = [
  {
    slug: "crm",
    name: "CRM Workspace",
    tagline: "Customer 360 & Pipeline Intelligence",
    description: "Account intelligence, opportunity tracking, deal staging, and customer service governance.",
    icon: Users,
  },
  {
    slug: "ats",
    name: "ATS & Talent Platform",
    tagline: "From Requisition to Hire",
    description: "Job requisitions, candidate pipeline management, interview scoring, and automated offer letters.",
    icon: UserCheck,
  },
  {
    slug: "hr",
    name: "Core HR Portal",
    tagline: "Employee Lifecycle & Compliance",
    description: "Verified employee records, digital onboarding checklists, role-based access control, and document vault.",
    icon: FolderGit2,
  },
  {
    slug: "employee",
    name: "Employee Self-Service",
    tagline: "Profile, Documents & Requests",
    description: "Personal profile management, direct deposit updates, document signature, and service requests.",
    icon: FolderGit2,
  },
  {
    slug: "workforce",
    name: "Time & Leave System",
    tagline: "Timesheets & PTO Accruals",
    description: "Weekly timesheet submission, manager approval workflows, PTO balance calculation, and audit trails.",
    icon: Briefcase,
  },
  {
    slug: "payroll",
    name: "Enterprise Payroll",
    tagline: "Runs, Earnings & Tax Reporting",
    description: "Automated payroll calculation, deductions, general ledger export, and tax statement generation.",
    icon: CreditCard,
  },
];

export default function PlatformsPage() {
  return (
    <>
      <SiteHeader />
      <main className="experience-marketing">
        <section className="mkt-hero-bg pt-20 pb-16">
          <div className="mkt-shell">
            <SectionLabel tone="burgundy">Software Platform Suite</SectionLabel>
            <h1 className="mkt-hero-heading mt-4 text-[#261F1B]">
              Software built around how enterprise organizations operate.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-[#695F57]">
              ConsultAmerica delivers a cohesive suite of production-ready enterprise
              applications spanning customer intelligence, hiring, human resources,
              and payroll operations.
            </p>
          </div>
        </section>

        <section className="mkt-section bg-[#FFFAF2]">
          <div className="mkt-shell">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {PLATFORMS.map((platform) => {
                const Icon = platform.icon;
                return (
                  <Link
                    key={platform.slug}
                    href={`/platforms/${platform.slug}`}
                    className="ca-app-window group flex flex-col justify-between border border-[#D7CCBD] bg-[#FFFDF8] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-[#7D2639]/50 hover:shadow-lg"
                  >
                    <div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EFE6] text-[#7D2639] group-hover:bg-[#7D2639] group-hover:text-white transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-xl font-bold text-[#261F1B] group-hover:text-[#7D2639] transition-colors">
                        {platform.name}
                      </h3>
                      <p className="mt-1 text-xs font-semibold text-[#657766]">
                        {platform.tagline}
                      </p>
                      <p className="mt-2 text-xs leading-relaxed text-[#695F57]">
                        {platform.description}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[#D7CCBD] pt-4 flex items-center justify-between text-xs font-semibold text-[#7D2639]">
                      <span>Explore Platform</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
