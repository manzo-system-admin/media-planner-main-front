import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getServiceList } from "@/lib/cms/services";
import type { Service } from "@/lib/dictionaries/types";

export const dynamic = "force-dynamic";

const DESCRIPTION_LIMIT = 230;

const serviceIcons: Record<string, string> = {
  ipo: "/images/service-icons/deployed_code_account.png",
  pr: "/images/service-icons/support_agent.png",
  website: "/images/service-icons/language.png",
  video: "/images/service-icons/play_circle.png",
  ir: "/images/service-icons/android_cell_4_bar.png",
  portrait: "/images/service-icons/photo_camera_back.png",
  MediaPlanner: "/images/service-icons/MediaPlanner3.png",
};

const orbitPositions: Record<string, string> = {
  ir: styles.orbitTop,
  ipo: styles.orbitLeftTop,
  pr: styles.orbitRightTop,
  website: styles.orbitLeftBottom,
  video: styles.orbitRightBottom,
  portrait: styles.orbitBottom,
};

const cardDisplayOrder = ["ipo", "website", "pr", "video", "ir", "portrait"];
const serviceAccents: Record<string, string> = {
  ipo: "#16B5C1",
  ir: "#79BE28",
  pr: "#F66A00",
  video: "#EB1738",
  website: "#087BD1",
  portrait: "#823BC2",
};

function getServiceKey(service: Service): keyof typeof serviceIcons | null {
  const identity = `${service.slug} ${service.title}`.toLowerCase();
  if (identity.includes("portrait") || identity.includes("photography") || identity.includes("photo")) return "portrait";
  if (identity.includes("ipo") || identity.includes("po service")) return "ipo";
  if (identity.includes("website") || identity.includes("web service")) return "website";
  if (identity.includes("video") || identity.includes("vdo")) return "video";
  if (identity.includes("ir service") || /(^|[\s-])ir([\s-]|$)/.test(identity)) return "ir";
  if (identity.includes("pr") || identity.includes("consultant")) return "pr";
  return null;
}

function toPlainText(html: string): string {
  return DOMPurify.sanitize(html, { ALLOWED_TAGS: [] })
    .replace(/&nbsp;/gi, " ")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}

function serviceCopy(service: Service): string {
  return truncateText(toPlainText(service.description || service.summary));
}

function orderedServices(serviceList: Service[]): Service[] {
  return [...serviceList].sort((a, b) => {
    const aIndex = cardDisplayOrder.indexOf(getServiceKey(a) ?? "");
    const bIndex = cardDisplayOrder.indexOf(getServiceKey(b) ?? "");
    return (aIndex < 0 ? cardDisplayOrder.length : aIndex) - (bIndex < 0 ? cardDisplayOrder.length : bIndex);
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.services.listTitle} | Media Planner Consultant` };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { services } = dict;
  const serviceList = await getServiceList();
  const orbitServices = serviceList.slice(0, 6);
  const cardServices = orderedServices(serviceList);

  return (
    <div className={styles.page}>
      <header className={styles.pageHeading} data-reveal data-reveal-repeat>
        <p className={styles.breadcrumb}>{services.listBreadcrumb}</p>
        <h1>{services.listTitle}</h1>
      </header>

      <section className={styles.overview} aria-label={services.listTitle}>
        <div className={styles.diagram}>
          <div className={styles.orbitRing} aria-hidden="true" data-reveal data-reveal-repeat />
          <div className={styles.orbitCenter} data-reveal data-reveal-repeat>
            <Image src="/images/MediaPlanner3.png" alt="" aria-hidden="true" width={546} height={328} />
          </div>
          {/* <nav className={styles.orbitNodes} aria-label={services.listTitle}>
            {orbitServices.map((service, index) => {
              const key = getServiceKey(service);
              const position = key ? orbitPositions[key] : [styles.orbitTop, styles.orbitLeftTop, styles.orbitRightTop, styles.orbitLeftBottom, styles.orbitRightBottom, styles.orbitBottom][index];
              const icon = key ? serviceIcons[key] : serviceIcons.pr;
              return (
                <Link
                  key={service.slug}
                  href={`/${locale}/services/${service.slug}`}
                  className={`${styles.orbitNode} ${position}`}
                  data-reveal
                  data-reveal-repeat
                  style={{ "--service-accent": serviceAccents[key ?? ""] ?? "#79BE28" } as CSSProperties}
                >
                  <span
                    className={styles.orbitIcon}
                    style={{ "--service-icon-mask": `url("${icon}")` } as CSSProperties}
                  >
                    <Image src={icon} alt="" aria-hidden="true" width={30} height={30} />
                  </span>
                  <span className={styles.orbitText}><strong>{service.title}</strong><span>{serviceCopy(service)}</span></span>
                </Link>
              );
            })}
          </nav> */}
        </div>
      </section>

      <section className={styles.list} id="service-list" aria-labelledby="service-list-title">
        <div className={styles.listHeading} data-reveal data-reveal-repeat>
          <h2 id="service-list-title">{locale === "th" ? `${services.listTitle}ทั้งหมด` : "All our services"}</h2>
        </div>
        {serviceList.length > 0 ? (
          <div className={styles.serviceGrid}>
            {cardServices.map((service, index) => {
              const key = getServiceKey(service);
              const icon = key ? serviceIcons[key] : serviceIcons.pr;
              return (
                <Link
                  key={service.slug}
                  href={`/${locale}/services/${service.slug}`}
                  className={styles.serviceCard}
                  data-reveal
                  data-reveal-repeat
                  style={{
                    "--card-index": index,
                    "--service-accent": "#A2C443",
                  } as CSSProperties}
                >
                  <span className={styles.cardHeader}>
                    <span
                      className={styles.cardIcon}
                      style={{ "--service-icon-mask": `url("${icon}")` } as CSSProperties}
                    >
                      <Image src={icon} alt="" aria-hidden="true" width={30} height={30} />
                    </span>
                    <strong>{service.title}</strong>
                    <span className={styles.cardLink}>
                      {services.viewDetailLink}
                      <span className={styles.cardArrow} aria-hidden="true">
                        <svg viewBox="0 0 16 16" focusable="false"><path d="M2.5 8h10m-3.5-3.5L12.5 8 9 11.5" /></svg>
                      </span>
                    </span>
                  </span>
                  <span className={styles.cardDescription}>{serviceCopy(service)}</span>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className={styles.emptyState} data-reveal data-reveal-repeat>
            {locale === "th" ? "ขณะนี้ยังไม่มีข้อมูลบริการ" : "No services are available right now."}
          </p>
        )}
      </section>

      <section className={styles.closing} data-reveal data-reveal-repeat>
        <p>{dict.home.subtitle}</p>
      </section>
    </div>
  );
}
