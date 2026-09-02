"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import SectionLabel from "@/components/marketing/SectionLabel";
import BackgroundAccent from "@/components/marketing/inner-page/background-accent";
import ParallaxShape from "@/components/marketing/inner-page/parallax-shape";
import Reveal from "@/components/marketing/inner-page/reveal";
import { cn } from "@/lib/utils";
import type { AccentPreset } from "@/components/marketing/inner-page/background-accent";

export type HeroBackgroundVariant =
  | "default"
  | "oracle"
  | "ai"
  | "ai-dark"
  | "applications"
  | "industries"
  | "careers"
  | "company"
  | "solutions"
  | "resources"
  | "detail";

export type HeroLayout = "split-left" | "split-right" | "stacked" | "product";
export type HeroImageShape = "arch" | "offset" | "careers" | "rect" | "wide";

const bgClass: Record<HeroBackgroundVariant, string> = {
  default: "mkt-hero-bg",
  oracle: "mkt-hero-bg--oracle",
  ai: "mkt-hero-bg--ai",
  "ai-dark": "mkt-hero-bg--ai-dark",
  applications: "mkt-hero-bg--applications",
  industries: "mkt-hero-bg--industries",
  careers: "mkt-hero-bg--careers",
  company: "mkt-hero-bg--company",
  solutions: "mkt-hero-bg--solutions",
  resources: "mkt-hero-bg--resources",
  detail: "mkt-hero-bg",
};

const shapeClass: Record<HeroImageShape, string> = {
  arch: "ca-hero-shape-arch",
  offset: "ca-hero-shape-offset",
  careers: "ca-hero-shape-careers",
  rect: "rounded-xl",
  wide: "rounded-2xl",
};

const heroAccent: Record<HeroBackgroundVariant, AccentPreset> = {
  default: "hero",
  oracle: "hero-oracle",
  ai: "hero-ai",
  "ai-dark": "hero-ai-dark",
  applications: "hero-product",
  industries: "hero",
  careers: "hero",
  company: "hero",
  solutions: "hero",
  resources: "hero",
  detail: "hero",
};

export type PageHeroCta = {
  label: string;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export type ProductScreen = {
  src: string;
  alt: string;
  className?: string;
};

export type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  variant?: HeroBackgroundVariant;
  layout?: HeroLayout;
  imageShape?: HeroImageShape;
  image?: string;
  imageAlt?: string;
  overlayImage?: { src: string; alt: string };
  productScreens?: ProductScreen[];
  primaryCta?: PageHeroCta;
  secondaryCta?: PageHeroCta;
  focusAreas?: string[];
  eyebrowTone?: "burgundy" | "dark" | "light" | "blue";
  className?: string;
};

function CtaButton({ cta, isDark }: { cta: PageHeroCta; isDark: boolean }) {
  const classes =
    cta.variant === "secondary"
      ? cn(
          "inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-semibold transition-colors",
          isDark
            ? "border-white/25 text-white hover:bg-white/10"
            : "border-[#C9DDD7] bg-white text-[#122D2E] hover:border-[#176A63]/40",
        )
      : "ca-button-primary inline-flex items-center gap-2 font-semibold";

  const content = (
    <>
      {cta.label}
      <ArrowUpRight className="h-4 w-4" />
    </>
  );

  if (cta.href?.startsWith("http")) {
    return (
      <a href={cta.href} target="_blank" rel="noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  if (cta.onClick) {
    return (
      <button type="button" onClick={cta.onClick} className={classes}>
        {content}
      </button>
    );
  }

  return (
    <Link href={cta.href ?? "#"} className={classes}>
      {content}
    </Link>
  );
}

function HeroImage({
  image,
  imageAlt,
  imageShape,
  overlayImage,
  priority = true,
}: {
  image: string;
  imageAlt: string;
  imageShape: HeroImageShape;
  overlayImage?: { src: string; alt: string };
  priority?: boolean;
}) {
  return (
    <div className="relative mx-auto w-full max-w-[680px] lg:max-w-none">
      <div className="ca-hero-glow" aria-hidden="true" />
      <ParallaxShape
        variant="circle"
        speed="slower"
        className={cn(
          "right-[8%] top-[6%] h-[min(280px,42vw)] w-[min(280px,42vw)] bg-[#E1ECE8]/80",
          imageShape === "offset" && "left-[4%] right-auto",
        )}
      />
      <Reveal variant="image" className="ca-hero-img-frame relative">
        <div className={cn("relative aspect-[4/3] max-h-[500px] w-full overflow-hidden shadow-[0_24px_56px_rgba(7,59,58,0.12)] ring-1 ring-[#C9DDD7]/60", shapeClass[imageShape])}>
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            className="ca-hero-img mkt-img-graded object-cover"
            sizes="(max-width: 1024px) 100vw, 46vw"
          />
        </div>
        {overlayImage ? (
          <div className="ca-product-frame absolute -bottom-4 -left-4 hidden w-[38%] max-w-[200px] sm:block">
            <div className="relative aspect-[4/3]">
              <Image
                src={overlayImage.src}
                alt={overlayImage.alt}
                fill
                className="object-cover object-top"
                sizes="200px"
              />
            </div>
          </div>
        ) : null}
      </Reveal>
    </div>
  );
}

function ProductComposition({ screens }: { screens: ProductScreen[] }) {
  const [primary, ...secondary] = screens;

  return (
    <Reveal variant="image" className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
      <div className="ca-hero-glow" aria-hidden="true" />
      <ParallaxShape
        variant="arch"
        speed="slow"
        className="-left-[6%] bottom-[8%] h-[min(220px,35vw)] w-[min(320px,55vw)] bg-[#E1ECE8]/70"
      />
      <div className="relative min-h-[280px]">
        <div className="ca-product-frame relative z-20 mx-auto w-[88%] max-w-[480px]">
          <div className="relative aspect-[16/10]">
            <Image
              src={primary.src}
              alt={primary.alt}
              fill
              className="object-cover object-top"
              sizes="(max-width: 1024px) 88vw, 480px"
              priority
            />
          </div>
        </div>
        {secondary[0] ? (
          <div className="ca-product-frame absolute right-0 top-[18%] z-30 w-[42%] max-w-[220px] shadow-lg">
            <div className="relative aspect-[4/3]">
              <Image
                src={secondary[0].src}
                alt={secondary[0].alt}
                fill
                className="object-cover object-top"
                sizes="220px"
              />
            </div>
          </div>
        ) : null}
        {secondary[1] ? (
          <div className="ca-product-frame absolute bottom-0 left-[4%] z-10 w-[36%] max-w-[180px] opacity-95">
            <div className="relative aspect-[4/3]">
              <Image
                src={secondary[1].src}
                alt={secondary[1].alt}
                fill
                className="object-cover object-top"
                sizes="180px"
              />
            </div>
          </div>
        ) : null}
      </div>
    </Reveal>
  );
}

export default function PageHero({
  eyebrow,
  title,
  description,
  variant = "default",
  layout = "split-left",
  imageShape = "arch",
  image,
  imageAlt = "",
  overlayImage,
  productScreens,
  primaryCta,
  secondaryCta,
  focusAreas,
  eyebrowTone,
  className,
}: PageHeroProps) {
  const isDark = variant === "ai-dark";
  const labelTone =
    eyebrowTone ?? (isDark ? "light" : variant === "oracle" ? "burgundy" : "dark");

  const content = (
    <div className="max-w-[720px]">
      <Reveal delay={0}>
        <SectionLabel tone={labelTone}>{eyebrow}</SectionLabel>
      </Reveal>
      <Reveal delay={0.08}>
        <h1
          className={cn(
            "mkt-inner-hero-heading mt-6",
            isDark && "mkt-inner-hero-heading--light",
          )}
        >
          {title}
        </h1>
      </Reveal>
      <Reveal delay={0.16}>
        <p
          className={cn(
            "mkt-inner-hero-body mt-6",
            isDark && "mkt-inner-hero-body--light",
          )}
        >
          {description}
        </p>
      </Reveal>
      {(primaryCta || secondaryCta) && (
        <Reveal delay={0.24} className="mt-8 flex flex-wrap items-center gap-4">
          {primaryCta ? <CtaButton cta={primaryCta} isDark={isDark} /> : null}
          {secondaryCta ? <CtaButton cta={secondaryCta} isDark={isDark} /> : null}
        </Reveal>
      )}
    </div>
  );

  const visual =
    layout === "product" && productScreens?.length ? (
      <ProductComposition screens={productScreens} />
    ) : image ? (
      <HeroImage
        image={image}
        imageAlt={imageAlt}
        imageShape={imageShape}
        overlayImage={overlayImage}
      />
    ) : null;

  const reverse = layout === "split-right";

  return (
    <section
      className={cn(
        "mkt-inner-hero mkt-editorial-texture relative",
        bgClass[variant],
        className,
      )}
    >
      <BackgroundAccent
        preset={layout === "product" ? "hero-product" : heroAccent[variant]}
        intensity="rich"
      />
      {variant === "careers" && (
        <ParallaxShape
          variant="arch"
          speed="slower"
          className="right-[6%] top-[10%] h-[min(320px,42vw)] w-[min(420px,50vw)] bg-[#E1ECE8]/60"
        />
      )}

      <div className="mkt-shell relative z-10">
        {layout === "stacked" ? (
          <div className="max-w-3xl">{content}</div>
        ) : (
          <div
            className={cn(
              "grid items-center gap-10 lg:grid-cols-12 lg:gap-14",
              reverse && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1",
            )}
          >
            <div className="lg:col-span-6">{content}</div>
            {visual ? <div className="lg:col-span-6">{visual}</div> : null}
          </div>
        )}

        {focusAreas && focusAreas.length > 0 && (
          <Reveal delay={0.3} className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-[#C9DDD7]/60 pt-8">
            {focusAreas.map((area) => (
              <span
                key={area}
                className={cn(
                  "text-sm font-medium",
                  isDark ? "text-white/65" : "text-[#5B6D6B]",
                )}
              >
                {area}
              </span>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  );
}
