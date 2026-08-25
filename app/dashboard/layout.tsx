import SiteHeader from "@/components/navigation/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return (
    <>
      <SiteHeader />
      <main className="ca-page-pad min-h-screen bg-black">{children}</main>
      <SiteFooter />
    </>
  );
}
