export { default as PageHero } from "./page-hero";
export type {
  HeroBackgroundVariant,
  HeroImageShape,
  HeroLayout,
  HeroPhotoScale,
  PageHeroCta,
  PageHeroProps,
  ProductScreen,
} from "./page-hero";
export { default as ParallaxShape } from "./parallax-shape";
export { default as Reveal } from "./reveal";
export { default as BackgroundAccent } from "./background-accent";
export type { AccentPreset } from "./background-accent";
export { default as PageSection } from "./page-section";
export type { SectionTone } from "./page-section";
export { default as FeatureCard } from "./feature-card";
export { default as ImageReveal } from "./image-reveal";
export { default as StaggerGroup, StaggerItem } from "./stagger-group";

export function industryHeroShape(slug: string): import("./page-hero").HeroImageShape {
  switch (slug) {
    case "financial-services":
      return "offset";
    case "healthcare":
    case "government-public-sector":
      return "arch";
    case "technology":
      return "asymmetric";
    case "retail-consumer":
      return "wide";
    default:
      return "arch";
  }
}
