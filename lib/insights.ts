import {
  insightCategoryLabels,
  insights,
  type Insight,
  type InsightCategory,
} from "@/data/insights";

export function getPublishedInsights(): Insight[] {
  return [...insights].sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getFeaturedInsights(limit = 3): Insight[] {
  const featured = getPublishedInsights().filter((item) => item.featured);
  if (featured.length >= limit) return featured.slice(0, limit);
  return getPublishedInsights().slice(0, limit);
}

export function getInsightBySlug(slug: string): Insight | undefined {
  return insights.find((item) => item.slug === slug);
}

export function getAllInsightSlugs(): string[] {
  return insights.map((item) => item.slug);
}

export function getInsightsByCategory(category: InsightCategory): Insight[] {
  return getPublishedInsights().filter((item) => item.category === category);
}

export function getRelatedInsights(slug: string, limit = 3): Insight[] {
  const current = getInsightBySlug(slug);
  if (!current) return getPublishedInsights().slice(0, limit);

  const sameCategory = getPublishedInsights().filter(
    (item) => item.slug !== slug && item.category === current.category,
  );

  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);

  const others = getPublishedInsights().filter(
    (item) =>
      item.slug !== slug &&
      !sameCategory.some((match) => match.slug === item.slug),
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export function formatInsightDate(date: string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getInsightCategories() {
  return (Object.keys(insightCategoryLabels) as InsightCategory[]).map(
    (value) => ({
      value,
      label: insightCategoryLabels[value],
      count: insights.filter((item) => item.category === value).length,
    }),
  );
}
