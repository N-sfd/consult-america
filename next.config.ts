import type { NextConfig } from "next";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Next 16 blocks the dev client bundle from 127.0.0.1 unless this origin is listed.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    root: projectRoot,
  },
  experimental: {
    serverActions: {
      // File uploads go through Server Actions (Candidate Match JD extraction
      // caps at 8MB, employee/candidate documents at 10MB — see
      // lib/recruiting/jd-extraction.ts, lib/storage/*-documents.ts). Next's
      // 1MB default silently rejects the request with an unhandled body-size
      // error before those checks ever run, so oversized uploads crash
      // instead of showing the app's friendly "too large" message.
      bodySizeLimit: "12mb",
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/solutions", destination: "/capabilities", permanent: false },
      { source: "/solutions/:path*", destination: "/capabilities/:path*", permanent: false },
      { source: "/company", destination: "/about", permanent: false },
      // Keep /company/*.png and other public files. Only extensionless paths are old marketing URLs.
      { source: "/company/:path((?!.*\\.).*)", destination: "/about/:path", permanent: false },
      { source: "/applications", destination: "/work/innovation", permanent: false },
      { source: "/resources", destination: "/insights", permanent: false },
    ];
  },
};

export default nextConfig;
