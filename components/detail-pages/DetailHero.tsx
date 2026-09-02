"use client";

import { PageHero, industryHeroShape } from "@/components/marketing/inner-page";
import { useContactPanel } from "@/components/providers/contact-provider";

const industryOverlays: Record<string, { src: string; alt: string } | undefined> = {
  healthcare: {
    src: "/innovation/mediguide-hero.png",
    alt: "MediGuide clinical document interface",
  },
  technology: {
    src: "/innovation/joblens-hero.png",
    alt: "JobLens application interface",
  },
};

export default function DetailHero({
  kicker,
  title,
  description,
  focusAreas,
  image,
  imageAlt,
  slug,
  layout = "split-left",
}: {
  kicker: string;
  title: string;
  description: string;
  focusAreas: string[];
  image: string;
  imageAlt: string;
  slug?: string;
  layout?: "split-left" | "split-right";
}) {
  const { setOpen } = useContactPanel();
  const shape = slug ? industryHeroShape(slug) : "arch";
  const overlay = slug ? industryOverlays[slug] : undefined;

  return (
    <PageHero
      variant={slug === "healthcare" ? "industries" : "detail"}
      layout={layout}
      imageShape={shape}
      photoScale="editorial"
      eyebrow={kicker}
      title={title}
      description={description}
      image={image}
      imageAlt={imageAlt}
      overlayImage={overlay}
      focusAreas={focusAreas}
      className={slug === "healthcare" ? "ca-practice-healthcare-bg" : undefined}
      primaryCta={{
        label: "Talk to us",
        onClick: () => setOpen(true),
      }}
    />
  );
}
