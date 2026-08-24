import type { Metadata } from "next";

import ContactPanel from "@/components/contact-panel";
import SiteHeader from "@/components/navigation/site-header";
import { ContactProvider } from "@/components/providers/contact-provider";
import { SiteFooter } from "@/components/site-footer";

import "./globals.css";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
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
      <body className="bg-black text-white antialiased">
        <ContactProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <ContactPanel />
        </ContactProvider>
      </body>
    </html>
  );
}
