import type { Metadata } from "next";

import CandidateProfileForm from "@/components/candidate/candidate-profile-form";
import {
  CandidateEducationForm,
  CandidateExperienceForm,
  CandidateSkillsForm,
} from "@/components/candidate/candidate-profile-sections";
import { calculateProfileCompletion } from "@/lib/candidate/profile-completion";
import { requireCandidateActor } from "@/lib/candidate/security";
import { recruitingRepository } from "@/lib/recruiting";

export const metadata: Metadata = {
  title: "My Profile",
};

export const dynamic = "force-dynamic";

export default async function CandidateProfilePage() {
  const { session } = await requireCandidateActor();
  const profile = await recruitingRepository.getCandidateProfile(
    session.candidateId,
  );

  if (!profile) {
    return (
      <p className="text-sm text-black/55">Profile could not be loaded.</p>
    );
  }

  const { candidate, experience, education, skills, documents } = profile;
  const hasActiveResume = documents.some(
    (doc) =>
      doc.documentType === "RESUME" &&
      (doc.isPrimaryResume || doc.status === "ACTIVE" || !doc.status),
  );
  const completion = calculateProfileCompletion({
    candidate,
    experience,
    education,
    skills,
    hasActiveResume,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.04em]">
            My Profile
          </h1>
          <p className="mt-2 text-black/55">
            {candidate.firstName} {candidate.lastName} · {candidate.email}
          </p>
        </div>
        <div className="rounded-lg border border-black/10 bg-white px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Profile Completion
          </p>
          <p className="mt-1 text-2xl font-semibold">{completion.percent}%</p>
        </div>
      </div>

      <CandidateProfileForm candidate={candidate} />

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Experience
        </h2>
        {experience.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No experience on file yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {experience.map((item) => (
              <li key={item.id}>
                <p className="font-medium">
                  {item.title} · {item.company}
                </p>
                <p className="text-black/55">
                  {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
                </p>
                {item.description ? (
                  <p className="mt-1 text-black/65">{item.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
        <CandidateExperienceForm />
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Education
        </h2>
        {education.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No education on file yet.</p>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {education.map((item) => (
              <li key={item.id}>
                <p className="font-medium">{item.institution}</p>
                <p className="text-black/55">
                  {[item.degree, item.fieldOfStudy].filter(Boolean).join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
        <CandidateEducationForm />
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Skills
        </h2>
        {skills.length === 0 ? (
          <p className="mt-4 text-sm text-black/50">No skills on file yet.</p>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((item) => (
              <span
                key={item.id}
                className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-medium text-black/70"
              >
                {item.skill}
              </span>
            ))}
          </div>
        )}
        <CandidateSkillsForm />
      </section>
    </div>
  );
}
