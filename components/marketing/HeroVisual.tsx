const CHIPS = [
  { label: "Oracle Cloud", detail: "Fusion · Finance · SCM", top: "12%", left: "6%" },
  { label: "AI & Data", detail: "Agents · Intelligence", top: "38%", left: "52%" },
  { label: "Enterprise Ops", detail: "Strategy · Delivery", top: "66%", left: "14%" },
];

export default function HeroVisual({ className }: { className?: string }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a1c32] via-[var(--mkt-navy)] to-[#081628] ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-[var(--mkt-bright)]/20 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-16 left-1/4 h-56 w-56 rounded-full bg-[var(--mkt-blue)]/15 blur-[70px]" />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
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
        <line x1="18%" y1="20%" x2="58%" y2="44%" stroke="url(#hero-line)" strokeWidth="1.5" />
        <line x1="58%" y1="44%" x2="28%" y2="72%" stroke="url(#hero-line)" strokeWidth="1.5" />
        <line x1="18%" y1="20%" x2="28%" y2="72%" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <circle cx="58%" cy="44%" r="4" fill="var(--mkt-bright)" opacity="0.8" />
        <circle cx="18%" cy="20%" r="3" fill="white" opacity="0.5" />
        <circle cx="28%" cy="72%" r="3" fill="white" opacity="0.5" />
      </svg>

      {CHIPS.map((chip) => (
        <div
          key={chip.label}
          className="absolute w-[12.5rem] rounded-xl border border-white/12 bg-white/[0.07] px-4 py-3 backdrop-blur-md"
          style={{ top: chip.top, left: chip.left }}
        >
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--mkt-bright)]" />
            <p className="text-sm font-medium text-white">{chip.label}</p>
          </div>
          <p className="mt-1 text-xs text-white/50">{chip.detail}</p>
        </div>
      ))}

      <div className="absolute bottom-0 left-0 right-0 border-t border-white/8 bg-black/10 px-5 py-3 backdrop-blur-sm">
        <p className="text-[0.65rem] font-medium uppercase tracking-[0.14em] text-white/45">
          Enterprise transformation · Oracle · AI · Data
        </p>
      </div>
    </div>
  );
}
