import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      { source: "/company/:path*", destination: "/about/:path*", permanent: false },
      { source: "/applications", destination: "/work/innovation", permanent: false },
      { source: "/resources", destination: "/insights", permanent: false },
    ];
  },
};

export default nextConfig;
