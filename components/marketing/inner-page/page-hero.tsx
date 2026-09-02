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

export type HeroLayout = "split-left" | "split-right" | "stacked" | "product" | "editorial-wide";
export type HeroImageShape =
  | "arch"
  | "oracle-tall"
  | "healthcare-soft"
  | "offset"
  | "careers"
  | "asymmetric"
  | "rect"
  | "wide"
  | "cut";
export type HeroPhotoScale = "default" | "careers" | "editorial";

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
  "oracle-tall": "ca-hero-shape-oracle-tall",
  "healthcare-soft": "ca-hero-shape-healthcare-soft",
  offset: "ca-hero-shape-offset",
  careers: "ca-hero-shape-careers",
  asymmetric: "ca-hero-shape-asymmetric",
  rect: "rounded-xl",
  wide: "rounded-2xl",
  cut: "ca-hero-shape-cut",
};

const photoScaleClass: Record<HeroPhotoScale, string> = {
  default: "",
  careers: "ca-hero-photo--careers",
  editorial: "ca-hero-photo--editorial",
};

const heroAccent: Record<HeroBackgroundVariant, AccentPreset> = {
  default: "hero",
  oracle: "hero-oracle",
  ai: "hero-ai",
  "ai-dark": "hero-ai-dark",
  applications: "hero-product",
  industries: "hero-industries",
  careers: "hero-careers",
  company: "hero-company",
  solutions: "hero",
  resources: "hero-resources",
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
  imageMode?: "photo" | "product";
  photoScale?: HeroPhotoScale;
  overlayImage?: { src: string; alt: string };
  secondaryImage?: { src: string; alt: string; shape?: HeroImageShape };
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

function ProductScreenshot({
  src,
  alt,
  priority = true,
}: {
  src: string;
  alt: string;
  priority?: boolean;
}) {
  return (
    <Reveal variant="image" className="relative mx-auto w-full max-w-[520px] lg:max-w-[92%]">
      <div className="ca-hero-glow" aria-hidden="true" />
      <div className="ca-product-frame relative z-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          width={1440}
          height={900}
          loading={priority ? "eager" : "lazy"}
          className="ca-product-screenshot"
        />
      </div>
    </Reveal>
  );
}

function HeroImage({
  image,
  imageAlt,
  imageShape,
  photoScale = "default",
  overlayImage,
  secondaryImage,
  priority = true,
}: {
  image: string;
  imageAlt: string;
  imageShape: HeroImageShape;
  photoScale?: HeroPhotoScale;
  overlayImage?: { src: string; alt: string };
  secondaryImage?: { src: string; alt: string; shape?: HeroImageShape };
  priority?: boolean;
}) {
  return (
    <div className={cn("relative mx-auto w-full max-w-[580px] lg:max-w-none", photoScaleClass[photoScale])}>
      {imageShape === "oracle-tall" ? (
        <div aria-hidden="true" className="ca-practice-oracle-panel hidden lg:block" />
      ) : null}
      {imageShape === "healthcare-soft" ? (
        <div
          aria-hidden="true"
          className="ca-practice-healthcare-oval -right-[8%] top-[6%] hidden h-[240px] w-[240px] lg:block"
        />
      ) : null}
      <div className="ca-hero-glow" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="ca-hero-ring right-[4%] top-[4%] hidden h-[min(200px,28vw)] w-[min(200px,28vw)] lg:block"
      />
      <ParallaxShape
        variant="arch"
        speed="slower"
        className={cn(
          "right-[6%] top-[8%] h-[min(220px,34vw)] w-[min(300px,40vw)] bg-[#E1ECE8]/70",
          imageShape === "offset" && "left-[2%] right-auto",
          imageShape === "cut" && "left-[4%] right-auto top-[12%]",
        )}
      />
      <Reveal variant="image" className="ca-hero-img-frame relative">
        <div
          className={cn(
            "relative aspect-[5/4] w-full overflow-hidden shadow-[0_20px_48px_rgba(7,59,58,0.1)] ring-1 ring-[#DDE6E3]/80",
            shapeClass[imageShape],
          )}
        >
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority={priority}
            className={cn(
              "ca-hero-img object-cover",
              imageShape !== "rect" && imageShape !== "wide" && "ca-home-photo",
            )}
            sizes="(max-width: 1024px) 100vw, 46vw"
          />
        </div>
        {secondaryImage ? (
          <div className="ca-practice-workflow-panel -bottom-4 -right-3 z-20 hidden sm:block">
            <div className="relative aspect-[4/3] w-full min-w-[180px] max-w-[220px]">
              <Image
                src={secondaryImage.src}
                alt={secondaryImage.alt}
                fill
                className="ca-home-photo object-cover"
                sizes="220px"
              />
            </div>
          </div>
        ) : null}
        {overlayImage ? (
          <div className="ca-product-frame absolute -bottom-4 -left-4 hidden w-[38%] max-w-[190px] sm:block">
            <div className="relative aspect-[4/3]">
              <Image
                src={overlayImage.src}
                alt={overlayImage.alt}
                fill
                className="object-cover object-top"
                sizes="190px"
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
    <Reveal variant="image" className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
      <div className="ca-hero-glow" aria-hidden="true" />
      <ParallaxShape
        variant="arch"
        speed="slow"
        className="-left-[6%] bottom-[8%] h-[min(200px,32vw)] w-[min(280px,48vw)] bg-[#E1ECE8]/70"
      />
      <div className="relative min-h-[240px]">
        <div className="ca-product-frame relative z-20 mx-auto w-[90%] max-w-[440px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={primary.src}
            alt={primary.alt}
            width={1440}
            height={900}
            className="ca-product-screenshot"
          />
        </div>
        {secondary[0] ? (
          <div className="ca-product-frame absolute right-0 top-[16%] z-30 w-[40%] max-w-[200px] shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondary[0].src}
              alt={secondary[0].alt}
              width={800}
              height={600}
              className="ca-product-screenshot !max-h-[180px]"
            />
          </div>
        ) : null}
        {secondary[1] ? (
          <div className="ca-product-frame absolute bottom-0 left-[4%] z-10 w-[34%] max-w-[160px] opacity-95">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={secondary[1].src}
              alt={secondary[1].alt}
              width={800}
              height={600}
              className="ca-product-screenshot !max-h-[150px]"
            />
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
  imageMode = "photo",
  photoScale = "default",
  overlayImage,
  secondaryImage,
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
    ) : image && imageMode === "product" ? (
      <ProductScreenshot src={image} alt={imageAlt} />
    ) : image ? (
      <HeroImage
        image={image}
        imageAlt={imageAlt}
        imageShape={imageShape}
        photoScale={photoScale}
        overlayImage={overlayImage}
        secondaryImage={secondaryImage}
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
        intensity="normal"
      />
      {variant === "careers" ? (
        <ParallaxShape
          variant="arch"
          speed="slower"
          className="right-[6%] top-[10%] h-[min(280px,38vw)] w-[min(360px,46vw)] bg-[#E1ECE8]/50"
        />
      ) : null}

      <div className="mkt-shell relative z-10">
        {layout === "stacked" ? (
          <div className="max-w-3xl">{content}</div>
        ) : layout === "editorial-wide" ? (
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-7">{content}</div>
            {visual ? (
              <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:self-end">
                {visual}
              </div>
            ) : null}
          </div>
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
