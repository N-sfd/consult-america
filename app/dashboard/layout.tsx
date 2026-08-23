export default function DashboardLayout({
  children,
}: LayoutProps<"/dashboard">) {
  return <main className="pt-20">{children}</main>;
}
