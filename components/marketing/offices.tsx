import { offices } from "@/lib/site-data";

export default function Offices() {
  return (
    <section className="border-t border-white/10 bg-black ca-gutter py-20 lg:py-28">
      <div className="mx-auto max-w-[94.5em]">
        <h2 className="ca-h2 max-w-3xl">National reach for enterprise impact</h2>
        <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {offices.map((office) => (
            <div key={office.city}>
              <h3 className="text-xl">{office.city}</h3>
              <p className="mt-3 text-sm text-white/50">{office.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
