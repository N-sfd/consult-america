import JobsChrome from "@/components/jobs/jobs-chrome";

export default function JobsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <JobsChrome>{children}</JobsChrome>;
}
