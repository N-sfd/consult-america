export default function PracticeAiPaths({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 400 320"
      preserveAspectRatio="xMidYMid slice"
    >
      <path d="M20 260 C 80 180, 140 120, 220 100" />
      <path d="M60 280 C 120 200, 200 160, 320 140" />
      <circle cx="220" cy="100" r="3" fill="rgba(155,196,184,0.2)" stroke="rgba(155,196,184,0.12)" />
      <circle cx="320" cy="140" r="2.5" fill="rgba(155,196,184,0.15)" stroke="rgba(155,196,184,0.12)" />
      <circle cx="140" cy="180" r="2" fill="rgba(155,196,184,0.12)" stroke="rgba(155,196,184,0.1)" />
    </svg>
  );
}
