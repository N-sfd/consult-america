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
      <main className="experience-careers bg-[var(--cr-bg)] pt-4 md:pt-6">{children}</main>
      <SiteFooter />
    </>
  );
}
