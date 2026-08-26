import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { cn } from "@/lib/utils";

interface CaseStudyCardProps {
  number: string;
  category: string;
  title: string;
  description?: string;
  capabilities?: string[];
  href: string;
  image?: string;
  imageAlt?: string;
  tone?: "dark" | "light";
  className?: string;
  children?: React.ReactNode;
}

export default function CaseStudyCard({
  number,
  category,
  title,
  description,
  capabilities = [],
  href,
  image,
  imageAlt = "",
  tone = "dark",
  className,
  children,
}: CaseStudyCardProps) {
  const isLight = tone === "light";

  return (
    <article
      className={cn(
        "border-t",
        isLight
          ? "border-black/10 bg-[var(--mkt-off)] text-[var(--mkt-ink)]"
          : "border-white/10 bg-[var(--mkt-ink)] text-white",
        className,
      )}
    >
      <div className="mkt-shell grid gap-10 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
        <div className="flex flex-col justify-between lg:col-span-5">
          <div>
            <p
              className={cn(
                "mkt-eyebrow",
                isLight ? "text-black/40" : "text-white/40",
              )}
            >
              {number} / {category.toUpperCase()}
            </p>
            <h3 className="mt-8 max-w-xl text-3xl font-medium leading-[1.08] tracking-[-0.04em] md:text-4xl lg:text-[2.75rem]">
              {title}
            </h3>
            {description ? (
              <p
                className={cn(
                  "mkt-body mt-6 max-w-md",
                  isLight ? "text-black/55" : "text-white/60",
                )}
              >
                {description}
              </p>
            ) : null}
            {capabilities.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
                {capabilities.map((item) => (
                  <span
                    key={item}
                    className={cn(
                      "text-sm",
                      isLight ? "text-black/45" : "text-white/45",
                    )}
                  >
                    {item}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
          <Link href={href} className="ca-link mt-12 w-fit">
            Explore the work
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="relative min-h-[320px] overflow-hidden lg:col-span-7 lg:min-h-[480px]">
          {children ? (
            children
          ) : image ? (
            <Image
              src={image}
              alt={imageAlt}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 58vw"
            />
          ) : null}
        </div>
      </div>
    </article>
  );
}
