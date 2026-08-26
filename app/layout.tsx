import type { Metadata } from "next";

import ContactPanel from "@/components/contact-panel";
import { ContactProvider } from "@/components/providers/contact-provider";

import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "ConsultAmerica | The Enterprise Transformation Partner",
    template: "%s | ConsultAmerica",
  },
  description:
    "ConsultAmerica is the enterprise transformation partner for Oracle, cloud, AI, data, and digital engineering.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "ConsultAmerica",
    title: "ConsultAmerica | The Enterprise Transformation Partner",
    description:
      "Oracle, AI, data, and enterprise transformation from strategy through production.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "ConsultAmerica",
  url: siteUrl,
  logo: `${siteUrl}/brand/logo.jpg`,
  description:
    "ConsultAmerica is the enterprise transformation partner for Oracle, cloud, AI, data, and digital engineering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[var(--ca-ice)] text-[var(--ca-text-primary)] antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <ContactProvider>
          {children}
          <ContactPanel />
        </ContactProvider>
      </body>
    </html>
  );
}
