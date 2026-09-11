import type { Metadata } from "next";
import { Inter, Source_Serif_4 } from "next/font/google";

import ContactPanel from "@/components/contact-panel";
import { ContactProvider } from "@/components/providers/contact-provider";

import "./globals.css";
import "../styles/marketing.css";

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const displayFont = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-source-serif",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://consultamerica.net";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default:
      "Enterprise Transformation, Oracle, AI & Application Engineering | Consult America",
    template: "%s | Consult America",
  },
  description:
    "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [{ url: "/favicon.png", sizes: "32x32", type: "image/png" }],
    apple: "/favicon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Consult America",
    title:
      "Enterprise Transformation, Oracle, AI & Application Engineering | Consult America",
    description:
      "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
    images: [
      {
        url: "/brand/ca-logo-horizontal.png",
        width: 1600,
        height: 380,
        alt: "Consult America — Strategy, Technology, Results",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Enterprise Transformation, Oracle, AI & Application Engineering | Consult America",
    description:
      "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Consult America",
  url: siteUrl,
  logo: `${siteUrl}/brand/ca-logo-horizontal.png`,
  email: "Info@consultamerica.com",
  telephone: "+1-703-496-7858",
  description:
    "Consult America helps organizations modernize enterprise platforms, operationalize AI and data, transform Oracle environments, and build enterprise applications from strategy through production.",
  address: [
    {
      "@type": "PostalAddress",
      name: "Headquarters",
      streetAddress: "20130 Lakeview Center Plaza, Suite 400",
      addressLocality: "Ashburn",
      addressRegion: "VA",
      postalCode: "20147",
      addressCountry: "US",
    },
    {
      "@type": "PostalAddress",
      name: "Branch Office",
      streetAddress: "1101 Opal Court Suite 211",
      addressLocality: "Hagerstown",
      addressRegion: "MD",
      postalCode: "21740",
      addressCountry: "US",
    },
  ],
  sameAs: [
    "https://www.linkedin.com/company/consultamerica",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="bg-[#F4EFE6] text-[#261F1B] antialiased">
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
