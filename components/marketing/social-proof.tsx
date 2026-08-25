import { Grid, Shell } from "@/components/layout/grid";
import { glanceStats, trustMarks } from "@/lib/site-data";

export default function SocialProof() {
  return (
    <section className="border-y border-white/10 bg-[#05070d]">
      <Shell className="py-8 lg:py-10">
        <Grid className="items-center">
          <div className="col-span-12 lg:col-span-7">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {glanceStats.map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-semibold tracking-tight text-white lg:text-4xl">
                    {stat.value}
                    <span className="text-[0.55em] text-[#3b82f6]">
                      {stat.suffix}
                    </span>
                  </p>
                  <p className="mt-2 text-xs leading-5 text-white/55">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-white/45">
              Delivery across
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {trustMarks.map((mark) => (
                <span
                  key={mark}
                  className="rounded-md border border-white/12 bg-white/5 px-3 py-1.5 text-sm text-white/75"
                >
                  {mark}
                </span>
              ))}
            </div>
          </div>
        </Grid>
      </Shell>
    </section>
  );
}
