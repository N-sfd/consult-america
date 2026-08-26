import type { MetadataRoute } from "next";

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
  "/projects",
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
