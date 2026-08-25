import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import InsightToc from "@/components/insights/insight-toc";
import {
  insightCategoryHeadings,
  insightCategoryLabels,
  type Insight,
  type InsightCta,
} from "@/data/insights";
import { formatInsightDate } from "@/lib/insights";

type InsightArticleProps = {
  insight: Insight;
  related: Insight[];
};

function tocItems(insight: Insight) {
  const items: { id: string; label: string }[] = [];
  if (insight.introduction?.length) {
    items.push({ id: "introduction", label: "Introduction" });
  }
  for (const section of insight.sections ?? []) {
    items.push({ id: section.id, label: section.title });
  }
  if (insight.faqs?.length) {
    items.push({ id: "faqs", label: "FAQs" });
  }
  return items;
}

function ArticleCta({ cta }: { cta: InsightCta }) {
  return (
    <aside className="ca-insight-cta" aria-label="How ConsultAmerica can help">
      <p className="ca-eyebrow text-[var(--ca-blue)]">
        How ConsultAmerica can help
      </p>
      <h2 className="mt-6 max-w-xl text-[clamp(1.65rem,2.4vw,2.35rem)] font-medium leading-[1.2] tracking-[-0.03em] text-white">
        {cta.headline}
      </h2>
      <p className="mt-5 max-w-xl text-[1.05rem] leading-[1.75] text-white/60">
        {cta.body}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href={cta.primaryHref} className="ca-button-primary">
          {cta.primaryLabel}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
        {cta.secondaryHref && cta.secondaryLabel ? (
          <Link href={cta.secondaryHref} className="ca-button-dark">
            {cta.secondaryLabel}
          </Link>
        ) : null}
      </div>
    </aside>
  );
}

export default function InsightArticle({
  insight,
  related,
}: InsightArticleProps) {
  const sections = insight.sections ?? [];
  const introduction = insight.introduction ?? insight.body.slice(0, 2);
  const toc = tocItems(insight);
  const cta = insight.cta;
  const insertAfter =
    insight.insertCtaAfterSectionId ??
    sections[Math.min(1, Math.max(sections.length - 1, 0))]?.id;
  const updated = insight.updatedAt ?? insight.publishedAt;
  const ctaAttached = Boolean(
    cta &&
      insertAfter &&
      sections.some((section) => section.id === insertAfter),
  );

  return (
    <div className="bg-[var(--ca-navy)] text-white">
      <header className="ca-shell border-b border-white/10 pb-16 pt-10 md:pb-20 md:pt-14">
        <Link
          href="/insights"
          className="ca-link text-sm text-white/55 hover:text-[#93c5fd]"
        >
          All Insights
        </Link>

        <p className="ca-eyebrow mt-10 text-[var(--ca-blue)]">
          {insightCategoryHeadings[insight.category]}
        </p>

        <h1 className="ca-insight-title mt-6 max-w-[18ch]">{insight.title}</h1>

        <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-2 text-sm text-white/50">
          <p>
            <span className="ca-eyebrow mr-3 text-white/35">Last updated</span>
            {formatInsightDate(updated)}
          </p>
          <p>{insight.readingTime} read</p>
        </div>

        <a
          href="#article-body"
          className="ca-scroll-cue mt-14 inline-flex items-center gap-3 text-sm text-white/45 transition-colors hover:text-white"
        >
          <span className="ca-scroll-cue-icon flex h-9 w-9 items-center justify-center border border-white/20">
            <ArrowDown className="h-4 w-4" />
          </span>
          Scroll
        </a>
      </header>

      <div
        id="article-body"
        className="ca-shell scroll-mt-28 py-16 md:py-24 lg:py-28"
      >
        <div className="ca-insight-layout">
          <article className="ca-insight-reading min-w-0">
            {toc.length > 0 ? (
              <InsightToc items={toc} variant="mobile" />
            ) : null}

            {introduction.length > 0 ? (
              <section
                id="introduction"
                className="ca-insight-block scroll-mt-28"
              >
                <h2 className="ca-insight-section-title">Introduction</h2>
                <div className="ca-insight-prose mt-8 space-y-6">
                  {introduction.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ) : null}

            {sections.map((section, index) => (
              <div key={section.id}>
                <section
                  id={section.id}
                  className="ca-insight-block scroll-mt-28"
                >
                  <div className="ca-insight-divider" aria-hidden />
                  <p className="ca-eyebrow text-white/35">
                    Section {String(index + 1).padStart(2, "0")}
                  </p>
                  <h2 className="ca-insight-section-title mt-4">
                    {section.title}
                  </h2>
                  <div className="ca-insight-prose mt-8 space-y-6">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>

                  {section.pullQuote ? (
                    <blockquote className="ca-insight-pullquote">
                      {section.pullQuote}
                    </blockquote>
                  ) : null}

                  {section.diagram ? (
                    <figure className="ca-insight-diagram">
                      <figcaption className="ca-eyebrow text-[var(--ca-blue)]">
                        {section.diagram.title}
                      </figcaption>
                      <p className="mt-4 text-lg tracking-[-0.02em] text-white/85">
                        {section.diagram.caption}
                      </p>
                      {section.diagram.bullets?.length ? (
                        <ul className="mt-8 grid gap-3 border-t border-white/10 pt-8 sm:grid-cols-2">
                          {section.diagram.bullets.map((bullet) => (
                            <li
                              key={bullet}
                              className="border-l border-[var(--ca-blue)] pl-4 text-[0.95rem] leading-relaxed text-white/65"
                            >
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </figure>
                  ) : null}
                </section>

                {cta && section.id === insertAfter ? (
                  <div className="ca-insight-block">
                    <div className="ca-insight-divider" aria-hidden />
                    <ArticleCta cta={cta} />
                  </div>
                ) : null}
              </div>
            ))}

            {cta && !ctaAttached ? (
              <div className="ca-insight-block">
                <div className="ca-insight-divider" aria-hidden />
                <ArticleCta cta={cta} />
              </div>
            ) : null}

            {insight.faqs && insight.faqs.length > 0 ? (
              <section id="faqs" className="ca-insight-block scroll-mt-28">
                <div className="ca-insight-divider" aria-hidden />
                <h2 className="ca-insight-section-title">FAQs</h2>
                <div className="mt-10 space-y-0">
                  {insight.faqs.map((faq) => (
                    <div
                      key={faq.question}
                      className="border-t border-white/10 py-8 first:border-t-0 first:pt-0"
                    >
                      <h3 className="text-lg font-medium tracking-[-0.02em] text-white">
                        {faq.question}
                      </h3>
                      <p className="ca-insight-prose mt-4">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}
          </article>

          {toc.length > 0 ? (
            <div className="hidden lg:block">
              <InsightToc items={toc} variant="desktop" />
            </div>
          ) : null}
        </div>

        {related.length > 0 ? (
          <section className="mt-24 border-t border-white/10 pt-16 md:mt-32 md:pt-20">
            <p className="ca-eyebrow text-white/40">Related Insights</p>
            <div className="mt-10 grid gap-10 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/insights/${item.slug}`}
                  className="group border-t border-white/15 pt-6 transition-colors"
                >
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--ca-blue)]">
                    {insightCategoryLabels[item.category]}
                  </p>
                  <h2 className="mt-3 text-xl font-medium leading-snug tracking-[-0.03em] transition-colors duration-200 group-hover:text-[#93c5fd]">
                    {item.title}
                  </h2>
                  <p className="mt-3 text-sm leading-relaxed text-white/45">
                    {formatInsightDate(item.updatedAt ?? item.publishedAt)}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-1 text-sm text-white/40 transition-all duration-200 group-hover:gap-2 group-hover:text-[var(--ca-blue)]">
                    Read
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
