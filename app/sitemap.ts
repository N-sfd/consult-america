import type { MetadataRoute } from "next";

import { getCaseStudySlugs } from "@/data/case-studies";
import { getInnovationProductSlugs } from "@/data/innovation-products";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.net";

const routes = [
  "",
  "/about",
  "/capabilities",
  "/capabilities/enterprise-transformation",
  "/capabilities/digital-engineering",
  "/capabilities/managed-delivery",
  "/oracle",
  "/ai-data",
  "/industries",
  "/work",
  "/work/case-studies",
  ...getCaseStudySlugs().map((slug) => `/work/case-studies/${slug}`),
  "/work/innovation",
  ...getInnovationProductSlugs().map((slug) => `/work/innovation/${slug}`),
  "/insights",
  "/careers",
  "/jobs",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));
}
