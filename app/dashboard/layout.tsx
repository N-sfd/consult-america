export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <main className="ca-page-pad min-h-screen bg-black">{children}</main>;
}
