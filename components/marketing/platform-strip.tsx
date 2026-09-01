import Link from "next/link";

import SectionBackdrop from "@/components/marketing/section-backdrop";
import { platformStripLinks } from "@/lib/site-data";

export default function PlatformStrip() {
  return (
    <section className="ca-platform-strip relative overflow-hidden border-b border-[#E1ECE8] py-8 sm:py-9">
      <SectionBackdrop variant="soft" />

      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 lg:px-8 xl:px-10">
        {platformStripLinks.map((link, index) => (
          <span key={link.label} className="flex items-center gap-8">
            <Link
              href={link.href}
              className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[#176A63] transition-colors hover:text-[#B83A3A]"
            >
              {link.label}
            </Link>
            {index < platformStripLinks.length - 1 ? (
              <span className="hidden text-[#C9DDD7] sm:inline" aria-hidden="true">
                ·
              </span>
            ) : null}
          </span>
        ))}
      </div>
    </section>
  );
}
