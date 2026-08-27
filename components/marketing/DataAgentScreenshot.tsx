import Image from "next/image";

import AppBrowserFrame from "@/components/marketing/AppBrowserFrame";

export default function DataAgentScreenshot({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div className={className}>
      <AppBrowserFrame title="Data Agent">
        <div className="relative aspect-[16/10] bg-[var(--mkt-ice)]">
          <Image
            src="/innovation/data-agent-hero.png"
            alt="Data Agent contract intelligence platform"
            fill
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority={false}
          />
        </div>
      </AppBrowserFrame>
    </div>
  );
}
