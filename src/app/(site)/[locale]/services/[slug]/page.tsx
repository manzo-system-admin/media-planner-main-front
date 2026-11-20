import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import NotFoundView from "@/components/NotFoundView";
import ServiceIcon from "@/components/ServiceIcon";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getServiceBySlug, getServiceList } from "@/lib/cms/services";
import type { Service } from "@/lib/dictionaries/types";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

const serviceIcons = {
  ipo: "/images/service-icons/deployed_code_account.png",
  pr: "/images/service-icons/support_agent.png",
  ir: "/images/service-icons/android_cell_4_bar.png",
  video: "/images/service-icons/play_circle.png",
  portrait: "/images/service-icons/photo_camera_back.png",
  website: "/images/service-icons/language.png",
};

const relatedOrder = ["ipo", "pr", "ir", "video", "portrait", "website"];

function serviceKey(service: Service): keyof typeof serviceIcons | null {
  const identity = `${service.slug} ${service.title}`.toLowerCase();
  if (identity.includes("portrait") || identity.includes("photography") || identity.includes("photo")) return "portrait";
  if (identity.includes("ipo") || identity.includes("po service")) return "ipo";
  if (identity.includes("website") || identity.includes("web service")) return "website";
  if (identity.includes("video") || identity.includes("vdo")) return "video";
  if (identity.includes("ir service") || /(^|[\s-])ir([\s-]|$)/.test(identity)) return "ir";
  if (identity.includes("pr consultant") || identity.includes("pr-service") || identity.includes("pr service") || identity.startsWith("pr-")) return "pr";
  return null;
}

function toPlainText(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function titleParts(title: string): { lead: string; accent: string } {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || !/(service|services|consultant|corporate|photography)/i.test(words.at(-1) ?? "")) {
    return { lead: title, accent: "" };
  }
  const accent = words.pop() ?? "";
  return { lead: words.join(" "), accent };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = await getServiceBySlug(slug);
  if (!service) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${service.title} | Media Planner Consultant`,
    description: service.summary,
    path: `/${locale}/services/${slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { services } = dict;
  const [service, serviceList] = await Promise.all([getServiceBySlug(slug), getServiceList()]);
  if (!service) {
    return <ContentSheet><NotFoundView locale={locale} dict={dict} /></ContentSheet>;
  }

  const descriptionText = toPlainText(service.description);
  const title = titleParts(service.title);
  const relatedServices = [...serviceList].sort((a, b) => {
    const aIndex = relatedOrder.indexOf(serviceKey(a) ?? "");
    const bIndex = relatedOrder.indexOf(serviceKey(b) ?? "");
    return (aIndex < 0 ? relatedOrder.length : aIndex) - (bIndex < 0 ? relatedOrder.length : bIndex);
  });
  const highlightsTitle = locale === "th" ? "สิ่งที่ได้รับจากบริการ" : services.highlightsTitle;
  const highlightItems = service.highlights.length > 0 ? service.highlights : service.summary ? [service.summary] : [];

  return (
    <ContentSheet>
      <div className={styles.page}>
        <section className={styles.detail} aria-labelledby="service-title">
          <h1 id="service-title" className={styles.serviceTitle} data-reveal data-reveal-repeat>
            <span>{title.lead}</span>{title.accent && <> <em>{title.accent}</em></>}
          </h1>
          <div className={styles.mainGrid}>
            <div className={styles.detailImage} data-reveal data-reveal-repeat>
              {service.image ? <Image src={service.image} alt={service.title} fill sizes="(max-width: 780px) 100vw, 42vw" priority /> : <div className={styles.imageFallback} aria-hidden="true" />}
            </div>
            <p className={styles.description} data-reveal data-reveal-repeat>{descriptionText}</p>
          </div>
        </section>

        <section className={styles.lowerGrid}>
          <nav className={styles.related} aria-label={services.relatedTitle}>
            <h2 className={styles.relatedTitle} data-reveal data-reveal-repeat>{services.relatedTitle}</h2>
            <div className={styles.relatedGrid}>
              {relatedServices.map((item, index) => {
                const icon = serviceKey(item);
                const active = item.slug === service.slug;
                return (
                  <Link
                    key={item.slug}
                    href={`/${locale}/services/${item.slug}`}
                    className={`${styles.relatedItem} ${active ? styles.relatedItemActive : ""}`}
                    aria-current={active ? "page" : undefined}
                    data-reveal
                    data-reveal-repeat
                    style={{ "--related-index": index } as CSSProperties}
                  >
                    <span className={styles.relatedIcon}>
                      {icon ? <Image src={serviceIcons[icon]} alt="" aria-hidden="true" width={30} height={30} /> : <ServiceIcon icon={item.icon} gradient={item.gradient} size={25} />}
                    </span>
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </nav>

          <section className={styles.benefits} aria-label={highlightsTitle}>
            <div className={styles.benefitActions}>
              <details className={styles.benefitDisclosure} data-reveal data-reveal-repeat>
                <summary className={styles.benefitsTitle}>
                  <span>{highlightsTitle}</span>
                  <svg className={styles.chevron} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
                    <circle cx="18" cy="18" r="15.5" />
                    <path d="m11 15 7 7 7-7" />
                  </svg>
                </summary>
                {highlightItems.length > 0 && (
                  <div className={styles.benefitPanel}>
                    <ul className={styles.highlights}>
                      {highlightItems.map((highlight) => <li key={highlight}>{highlight}</li>)}
                    </ul>
                  </div>
                )}
              </details>
              <Link href={`/${locale}/contact`} className={styles.ctaButton} data-reveal data-reveal-repeat>
                <span>{services.ctaButton}</span>
                <svg viewBox="0 0 36 28" aria-hidden="true" focusable="false"><path d="M2 14h29M21 3l11 11-11 11" /></svg>
              </Link>
            </div>
          </section>
        </section>
      </div>
    </ContentSheet>
  );
}
