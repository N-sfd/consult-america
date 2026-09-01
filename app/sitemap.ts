import type { MetadataRoute } from "next";

import { getCaseStudySlugs } from "@/data/case-studies";
import { getInnovationProductSlugs } from "@/data/innovation-products";
import { getAllJobSlugs } from "@/lib/jobs";
import { industryLinks } from "@/lib/site-data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.net";

const platformRoutes = [
  "/platforms",
  "/platforms/crm",
  "/platforms/hr",
  "/platforms/employee",
  "/platforms/workforce",
  "/platforms/payroll",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const jobSlugs = await getAllJobSlugs();

  const routes = [
    "",
    "/about",
    "/capabilities",
    "/capabilities/enterprise-transformation",
    "/capabilities/digital-engineering",
    "/capabilities/managed-delivery",
    "/oracle",
    "/ai-data",
    ...platformRoutes,
    "/industries",
    ...industryLinks.map((item) => item.href),
    "/work",
    "/work/case-studies",
    ...getCaseStudySlugs().map((slug) => `/work/case-studies/${slug}`),
    "/work/innovation",
    ...getInnovationProductSlugs().map((slug) => `/work/innovation/${slug}`),
    "/insights",
    "/careers",
    "/jobs",
    ...jobSlugs.map((slug) => `/jobs/${slug}`),
    "/contact",
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
