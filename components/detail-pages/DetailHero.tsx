"use client";

import { PageHero, industryHeroShape } from "@/components/marketing/inner-page";
import { useContactPanel } from "@/components/providers/contact-provider";

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

  return (
    <PageHero
      variant="detail"
      layout={layout}
      imageShape={shape}
      eyebrow={kicker}
      title={title}
      description={description}
      image={image}
      imageAlt={imageAlt}
      focusAreas={focusAreas}
      primaryCta={{
        label: "Talk to us",
        onClick: () => setOpen(true),
      }}
    />
  );
}
