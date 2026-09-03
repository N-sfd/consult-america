import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Consult America Workforce",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
