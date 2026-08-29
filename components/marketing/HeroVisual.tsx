"use client";

const CHIPS = [
  {
    label: "Oracle Cloud",
    detail: "Fusion · Finance · SCM",
    pos: "top-[10%] left-[6%] sm:top-[12%] sm:left-[8%]",
  },
  {
    label: "AI & Data",
    detail: "Agents · Intelligence",
    pos: "top-[40%] right-[6%] sm:top-[38%] sm:left-[52%]",
  },
  {
    label: "Enterprise Ops",
    detail: "Strategy · Delivery",
    pos: "bottom-[18%] left-[12%] sm:bottom-[16%] sm:left-[16%]",
  },
];

export default function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative flex min-h-[300px] sm:min-h-[340px] lg:min-h-[360px] flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1c32] via-[var(--mkt-navy)] to-[#081628] p-5 sm:p-6 ${
        className ?? ""
      }`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--mkt-bright)]/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-[var(--mkt-blue)]/15 blur-[70px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Background connecting lines on sm+ */}
      <svg
        className="pointer-events-none absolute inset-0 hidden h-full w-full sm:block"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="hero-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.45)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
        </defs>
        <line x1="20%" y1="22%" x2="58%" y2="44%" stroke="url(#hero-line)" strokeWidth="1.5" />
        <line x1="58%" y1="44%" x2="30%" y2="74%" stroke="url(#hero-line)" strokeWidth="1.5" />
        <line x1="20%" y1="22%" x2="30%" y2="74%" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
        <circle cx="58%" cy="44%" r="4" fill="var(--mkt-bright)" opacity="0.85" />
        <circle cx="20%" cy="22%" r="3" fill="white" opacity="0.5" />
        <circle cx="30%" cy="74%" r="3" fill="white" opacity="0.5" />
      </svg>

      {/* Floating node cards — single unified DOM tree */}
      <div className="relative flex-1">
        {CHIPS.map((chip) => (
          <div
            key={chip.label}
            className={`absolute ${chip.pos} w-[10.5rem] sm:w-[11.75rem] rounded-xl border border-white/12 bg-white/[0.08] px-3.5 py-2.5 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02]`}
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-bright)]" />
              <p className="text-xs font-semibold tracking-[-0.01em] text-white sm:text-sm">
                {chip.label}
              </p>
            </div>
            <p className="mt-0.5 text-[0.68rem] text-white/55 sm:text-xs">
              {chip.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="relative z-10 mt-auto border-t border-white/10 pt-3">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/45">
          Enterprise transformation · Oracle · AI · Data
        </p>
      </div>
    </div>
  );
}
