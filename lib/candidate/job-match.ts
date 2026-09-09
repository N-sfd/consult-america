/**
 * Candidate Job Match — assistance only.
 * Results must never auto-reject, advance, or rank candidates for hiring.
 */

export type JobMatchResult = {
  overallMatch: number;
  skillsFound: string[];
  skillsMissing: string[];
  experienceAlignment: string;
  keywordsToConsider: string[];
  suggestions: string[];
};

const STOP = new Set([
  "a", "an", "the", "and", "or", "of", "to", "in", "for", "on", "with", "by",
  "at", "from", "as", "is", "are", "be", "this", "that", "will", "you", "your",
  "we", "our", "their", "they", "it", "its", "into", "over", "under", "about",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\s-]/g, " ")
    .split(/[\s,/|;]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 2 && !STOP.has(t));
}

function unique(values: string[]) {
  return [...new Set(values)];
}

/** Lightweight, deterministic match for portal assistance — not a hiring score. */
export function analyzeJobMatch(input: {
  resumeText: string;
  candidateSkills: string[];
  jobTitle?: string;
  jobDescription: string;
}): JobMatchResult {
  const resumeTokens = new Set(tokenize(input.resumeText));
  for (const skill of input.candidateSkills) {
    for (const part of tokenize(skill)) resumeTokens.add(part);
  }

  const jdTokens = unique(tokenize(input.jobDescription));
  const skillLike = jdTokens.filter(
    (token) =>
      token.length >= 3 &&
      (/[+#]/.test(token) ||
        /^(python|java|sql|oracle|react|node|azure|aws|gcp|etl|api|data|cloud|fusion|plsql|typescript|javascript|kubernetes|docker|spark|tableau|powerbi)$/i.test(
          token,
        ) ||
        token.includes(".")),
  );

  const focus = skillLike.length > 0 ? skillLike : jdTokens.slice(0, 40);
  const skillsFound = focus.filter((token) => resumeTokens.has(token)).slice(0, 12);
  const skillsMissing = focus.filter((token) => !resumeTokens.has(token)).slice(0, 12);

  const coverage =
    focus.length === 0 ? 0 : Math.round((skillsFound.length / focus.length) * 100);
  const overallMatch = Math.max(12, Math.min(96, coverage));

  const experienceAlignment =
    overallMatch >= 70
      ? "Strong alignment between your background and this role's emphasis."
      : overallMatch >= 45
        ? "Partial alignment — highlight overlapping tools and measurable outcomes."
        : "Limited keyword overlap — tailor your summary to the role language.";

  const keywordsToConsider = skillsMissing.slice(0, 8);
  const suggestions: string[] = [];
  if (skillsMissing.length > 0) {
    suggestions.push(
      `Clarify experience with ${skillsMissing.slice(0, 3).join(", ")} where applicable.`,
    );
  }
  if (!tokenize(input.resumeText).some((t) => t.includes("produc") || t.includes("deliver"))) {
    suggestions.push("Add measurable production or delivery outcomes to recent roles.");
  }
  if (input.jobTitle && !tokenize(input.resumeText).includes(tokenize(input.jobTitle)[0] ?? "")) {
    suggestions.push("Mirror key role language from the job title in your professional summary.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Keep quantifying impact and keep your primary resume current.");
  }

  return {
    overallMatch,
    skillsFound: unique(skillsFound),
    skillsMissing: unique(skillsMissing),
    experienceAlignment,
    keywordsToConsider,
    suggestions,
  };
}
