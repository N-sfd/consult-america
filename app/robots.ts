import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.net";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/employee", "/manager", "/hr", "/workforce", "/login"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
