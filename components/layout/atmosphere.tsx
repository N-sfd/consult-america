export default function Atmosphere({
  variant = "section",
}: {
  variant?: "hero" | "section";
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={`absolute inset-0 ${
          variant === "hero" ? "opacity-[0.11]" : "opacity-[0.055]"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 70% at 70% 40%, black 20%, transparent 75%)",
        }}
      />
      <div className="absolute -right-24 top-16 h-[28rem] w-[28rem] rounded-full border border-white/8" />
      <div className="absolute -right-8 top-36 h-[20rem] w-[20rem] rounded-full border border-white/8" />
      <div className="absolute right-16 top-56 h-[12rem] w-[12rem] rounded-full border border-white/10" />
      <div className="absolute right-[12%] top-[30%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(59,108,255,0.18),transparent_68%)] blur-2xl" />
    </div>
  );
}
