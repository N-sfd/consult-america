import type { JobMatchResult } from "@/lib/candidate/job-match";

function scoreTier(score: number) {
  if (score >= 70) {
    return {
      ring: "#059669",
      track: "rgba(5,150,105,0.15)",
      text: "text-emerald-700",
      label: "Strong match",
    };
  }
  if (score >= 40) {
    return {
      ring: "#d97706",
      track: "rgba(217,119,6,0.15)",
      text: "text-amber-700",
      label: "Partial match",
    };
  }
  return {
    ring: "var(--ca-platform-red)",
    track: "rgba(184,58,58,0.15)",
    text: "text-red-700",
    label: "Limited match",
  };
}

function ScoreGauge({ score }: { score: number }) {
  const tier = scoreTier(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, score)) / 100);

  return (
    <div className="relative flex h-28 w-28 shrink-0 items-center justify-center">
      <svg viewBox="0 0 100 100" className="h-28 w-28 -rotate-90">
        <circle cx="50" cy="50" r={radius} fill="none" stroke={tier.track} strokeWidth="10" />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={tier.ring}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 500ms ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-bold text-black">{score}%</span>
      </div>
    </div>
  );
}

export default function JobMatchResultCard({ result }: { result: JobMatchResult }) {
  const tier = scoreTier(result.overallMatch);

  return (
    <section className="ca-platform-card p-6">
      <div className="flex flex-wrap items-center gap-6">
        <ScoreGauge score={result.overallMatch} />
        <div>
          <p className="text-xs uppercase tracking-[0.12em] text-black/40">Match</p>
          <p className={`mt-1 text-lg font-semibold ${tier.text}`}>{tier.label}</p>
          <p className="mt-1 text-sm text-black/60">{result.experienceAlignment}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-emerald-50/60 p-4">
          <h3 className="text-sm font-semibold text-emerald-800">Strong alignment</h3>
          <ul className="mt-2 space-y-1 text-sm text-emerald-900/80">
            {result.skillsFound.length === 0 ? (
              <li>No clear overlapping keywords found.</li>
            ) : (
              result.skillsFound.map((skill) => <li key={skill}>{skill}</li>)
            )}
          </ul>
        </div>
        <div className="rounded-lg bg-amber-50/70 p-4">
          <h3 className="text-sm font-semibold text-amber-800">Potential gaps</h3>
          <ul className="mt-2 space-y-1 text-sm text-amber-900/80">
            {result.skillsMissing.length === 0 ? (
              <li>No obvious gaps from this comparison.</li>
            ) : (
              result.skillsMissing.map((skill) => <li key={skill}>{skill}</li>)
            )}
          </ul>
        </div>
      </div>

      {result.keywordsToConsider.length > 0 ? (
        <div className="mt-6">
          <h3 className="text-sm font-semibold">Keywords to consider</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {result.keywordsToConsider.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full bg-black/[0.04] px-3 py-1 text-xs font-medium text-black/70"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-6">
        <h3 className="text-sm font-semibold">Suggestions</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-black/70">
          {result.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
