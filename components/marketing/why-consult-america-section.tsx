"use client";

const principles = [
  { title: "Business context first", detail: "Programs start with how the enterprise actually operates." },
  { title: "Technology depth", detail: "Oracle, data, AI, and engineering expertise in one delivery team." },
  { title: "Production discipline", detail: "Testing, cutover, and adoption built into every engagement." },
  { title: "Product mindset", detail: "We build applications when the market needs more than advice." },
];

export default function WhyConsultAmericaSection() {
  return (
    <section className="border-b border-[#E1ECE8] bg-white py-14 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-[1440px] px-6 lg:px-8 xl:px-10">
        <div className="max-w-2xl">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[#176A63]">
            Why Consult America
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.75rem,3vw,2.5rem)] font-semibold tracking-[-0.03em] text-[#073B3A]">
            Built for execution, not just advice.
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {principles.map((item) => (
            <div key={item.title} className="border-t border-[#DDE6E3] pt-4">
              <h3 className="text-sm font-semibold text-[#073B3A]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5B6D6B]">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
