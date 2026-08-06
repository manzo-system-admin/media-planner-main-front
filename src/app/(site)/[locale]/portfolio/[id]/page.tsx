import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import NotFoundView from "@/components/NotFoundView";
import PortfolioGallery from "@/components/PortfolioGallery";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPortfolioById, getPortfolioList } from "@/lib/cms/portfolio";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const item = await getPortfolioById(id);
  if (!item) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${item.title} | Media Planner Consultant`,
    description: item.client ? `${item.title} — ${item.client}` : item.title,
    path: `/${locale}/portfolio/${id}`,
    image: item.image,
  });
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { portfolio } = dict;
  const item = await getPortfolioById(id);
  if (!item) {
    return (
      <ContentSheet>
        <NotFoundView locale={locale} dict={dict} />
      </ContentSheet>
    );
  }

  const allItems = await getPortfolioList();

  const related = allItems
    .filter((entry) => entry.id !== id && entry.clientId === item.clientId)
    .concat(allItems.filter((entry) => entry.id !== id && entry.clientId !== item.clientId))
    .slice(0, 3);

  const safeDescription = item.description ? DOMPurify.sanitize(item.description) : "";

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: portfolio.title, href: `/${locale}/portfolio` },
          { label: item.title },
        ]}
        title={item.title}
      >
        {item.client && (
          <div className={styles.metaRow}>
            <span className={styles.clientBadge}>{item.client}</span>
          </div>
        )}
      </PageIntro>

      <section className={styles.heroSection}>
        <PortfolioGallery images={item.images.length > 0 ? item.images : [item.image]} alt={item.title} />
      </section>

      {item.stats.length > 0 && (
        <section className={styles.statsSection}>
          {item.stats.map((stat) => (
            <div key={stat.label} className={styles.statCard}>
              <div className={styles.statValue}>{stat.value}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </section>
      )}

      {safeDescription && (
        <section
          className={styles.body}
          // Sanitized above with isomorphic-dompurify; content is admin-authored,
          // not raw visitor input, but still passes through DOMPurify defensively.
          dangerouslySetInnerHTML={{ __html: safeDescription }}
        />
      )}

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>{portfolio.relatedTitle}</h2>
          <div className={styles.relatedGrid}>
            {related.map((entry) => (
              <Link
                key={entry.id}
                href={`/${locale}/portfolio/${entry.id}`}
                className={styles.relatedCard}
              >
                <div className={styles.relatedImage}>
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 780px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.relatedBody}>
                  {entry.client && <div className={styles.relatedClient}>{entry.client}</div>}
                  <div className={styles.relatedCardTitle}>{entry.title}</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </ContentSheet>
  );
}
