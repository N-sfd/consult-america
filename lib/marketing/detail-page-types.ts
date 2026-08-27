import type { InsightCategory } from "@/data/insights";

export type DetailPageOverviewItem = {
  title: string;
  description: string;
};

export type DetailPageOutcome = {
  title: string;
  description: string;
};

export type DetailPageWorkItem = {
  number: string;
  category: string;
  title: string;
  description: string;
  href: string;
  image: string;
  imageAlt: string;
};

export type DetailPageContent = {
  slug: string;
  kicker: string;
  title: string;
  headline: string;
  description: string;
  heroImage: string;
  heroImageAlt: string;
  focusAreas: string[];
  overviewHeading?: string;
  overview: DetailPageOverviewItem[];
  outcomes: DetailPageOutcome[];
  relatedWork?: DetailPageWorkItem[];
  insightCategory?: InsightCategory;
  metaDescription: string;
};
