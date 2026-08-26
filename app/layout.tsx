import type { Metadata } from "next";

import ContactPanel from "@/components/contact-panel";
import { ContactProvider } from "@/components/providers/contact-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "ConsultAmerica | The Enterprise Transformation Partner",
  description:
    "ConsultAmerica is the enterprise transformation partner for Oracle, cloud, AI, data, and digital engineering.",
  icons: {
    icon: "/brand/logo.jpg",
    apple: "/brand/logo.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-[var(--ca-ice)] text-[var(--ca-text-primary)] antialiased">
        <ContactProvider>
          {children}
          <ContactPanel />
        </ContactProvider>
      </body>
    </html>
  );
}
