import type { JobMatchResult } from "@/lib/candidate/job-match";

export default function JobMatchResultCard({ result }: { result: JobMatchResult }) {
  return (
    <section className="rounded-lg border border-black/10 bg-white p-6">
      <p className="text-xs uppercase tracking-[0.12em] text-black/40">Match</p>
      <p className="mt-2 text-4xl font-semibold">{result.overallMatch}%</p>
      <p className="mt-2 text-sm text-black/60">{result.experienceAlignment}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold">Strong alignment</h3>
          <ul className="mt-2 space-y-1 text-sm text-black/70">
            {result.skillsFound.length === 0 ? (
              <li>No clear overlapping keywords found.</li>
            ) : (
              result.skillsFound.map((skill) => <li key={skill}>{skill}</li>)
            )}
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold">Potential gaps</h3>
          <ul className="mt-2 space-y-1 text-sm text-black/70">
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
