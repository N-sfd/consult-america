import type { Metadata } from "next";
import { Briefcase, GraduationCap, Sparkles } from "lucide-react";

import CandidateProfileForm from "@/components/candidate/candidate-profile-form";
import {
  CandidateEducationForm,
  CandidateEducationListItem,
  CandidateExperienceForm,
  CandidateExperienceListItem,
  CandidateSkillPill,
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
          <h1 className="font-serif text-3xl font-semibold tracking-[-0.04em]">
            My Profile
          </h1>
          <p className="mt-2 text-black/55">
            {candidate.firstName} {candidate.lastName} · {candidate.email}
          </p>
        </div>
        <div className="ca-platform-card px-4 py-3 text-sm">
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">
            Profile Completion
          </p>
          <p className="mt-1 text-2xl font-semibold">{completion.percent}%</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
            {[
              { label: "Personal details", done: completion.identity },
              { label: "Contact info", done: completion.contact },
              { label: "Resume", done: completion.resume },
              { label: "Professional summary", done: completion.summary },
              { label: "Experience", done: completion.experience },
              { label: "Education", done: completion.education },
              { label: "Skills", done: completion.skills },
            ].map((item) => (
              <li
                key={item.label}
                className={item.done ? "text-black/70" : "text-black/40"}
              >
                {item.done ? "✓" : "○"} {item.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <CandidateProfileForm candidate={candidate} />

      <section className="ca-platform-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Experience
        </h2>
        {experience.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-black/50">
            <Briefcase className="h-5 w-5 shrink-0 text-black/25" />
            <p>No experience on file yet.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {experience.map((item) => (
              <CandidateExperienceListItem key={item.id} item={item} />
            ))}
          </ul>
        )}
        <CandidateExperienceForm />
      </section>

      <section className="ca-platform-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Education
        </h2>
        {education.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-black/50">
            <GraduationCap className="h-5 w-5 shrink-0 text-black/25" />
            <p>No education on file yet.</p>
          </div>
        ) : (
          <ul className="mt-4 space-y-3 text-sm">
            {education.map((item) => (
              <CandidateEducationListItem key={item.id} item={item} />
            ))}
          </ul>
        )}
        <CandidateEducationForm />
      </section>

      <section className="ca-platform-card p-6">
        <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-black/40">
          Skills
        </h2>
        {skills.length === 0 ? (
          <div className="mt-4 flex items-center gap-3 text-sm text-black/50">
            <Sparkles className="h-5 w-5 shrink-0 text-black/25" />
            <p>No skills on file yet.</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {skills.map((item) => (
              <CandidateSkillPill key={item.id} item={item} />
            ))}
          </div>
        )}
        <CandidateSkillsForm />
      </section>
    </div>
  );
}
