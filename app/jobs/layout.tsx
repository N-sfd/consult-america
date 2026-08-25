import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SiteHeader />
      <main className="ca-page-pad">{children}</main>
      <SiteFooter />
    </>
  );
}
