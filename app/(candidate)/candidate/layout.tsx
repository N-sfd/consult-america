import CandidateShell from "@/components/candidate/candidate-shell";
import { requireCandidateActor } from "@/lib/candidate/security";

export default async function CandidateLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { session } = await requireCandidateActor();

  return <CandidateShell session={session}>{children}</CandidateShell>;
}
