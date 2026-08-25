export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <main className="ca-page-pad">{children}</main>;
}
