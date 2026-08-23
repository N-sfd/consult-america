import type { Metadata } from "next";

import ClientTrust from "@/components/marketing/client-trust";
import Hero from "@/components/marketing/hero";

export const metadata: Metadata = {
  title: "ConsultAmerica | Oracle, AI & Enterprise Transformation",
  description:
    "We help enterprises transform operations, modernize platforms, and unlock intelligent growth through Oracle, cloud, data and AI.",
};

export default function Home() {
  return (
    <main>
      <Hero />
      <ClientTrust />
    </main>
  );
}
