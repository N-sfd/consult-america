export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Titles come from app/login/page.tsx generateMetadata (absolute)
  // so we do not nest an extra "Sign In | Consult America" segment.
  return <>{children}</>;
}
