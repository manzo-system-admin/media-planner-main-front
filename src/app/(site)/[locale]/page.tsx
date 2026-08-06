import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import ServiceIcon from "@/components/ServiceIcon";
import VideoPopupCard from "@/components/VideoPopupCard";
import HeroCarousel from "@/components/HeroCarousel";
import ClientsSection from "@/components/ClientsSection";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { GRADIENTS } from "@/lib/dictionaries/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getNewsList } from "@/lib/cms/news";
import { getServiceList } from "@/lib/cms/services";
import { getClients } from "@/lib/cms/org";
import { getHeroSlides, getVideoPopup } from "@/lib/cms/homepage";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { home, common } = dict;
  const newsItems = await getNewsList(locale, 3);
  const services = await getServiceList();
  const clients = await getClients();
  const fetchedSlides = await getHeroSlides();
  const heroSlides = fetchedSlides.length > 0 ? fetchedSlides : dict.data.heroSlides;
  const videoPopup = await getVideoPopup();

  return (
    <>
      <section className={styles.hero}>
        <HeroCarousel slides={heroSlides} labels={home.carousel} />
        <div className={styles.heroInner}>
          <span className={styles.badge}>{home.badge}</span>
          <h1 className={styles.heroTitle}>{home.title}</h1>
          <p className={styles.heroSubtitle}>{home.subtitle}</p>
          <div className={styles.heroActions}>
            <Link href={`/${locale}/portfolio`} className={styles.heroButtonPrimary}>
              {home.ctaPrimary}
            </Link>
            <Link href={`/${locale}/contact`} className={styles.heroButtonSecondary}>
              {home.ctaSecondary}
            </Link>
          </div>
        </div>

        <VideoPopupCard
          className={styles.videoCard}
          thumbnail={videoPopup?.thumbnail || "https://picsum.photos/seed/hero-company-video/680/380"}
          caption={videoPopup?.caption || home.videoCaption}
          videoAlt={home.videoAlt}
          videoSource={videoPopup?.videoSource ?? null}
          orientation={videoPopup?.orientation}
        />
      </section>

      <ContentSheet>
        <section className={styles.services}>
          <div className={styles.sectionHeadCenter}>
            <h2 className={styles.sectionTitle}>{home.servicesTitle}</h2>
            <p className={styles.sectionSubtitle}>{home.servicesSubtitle}</p>
          </div>
          <div className={styles.serviceGrid}>
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${locale}/services/${service.slug}`}
                className={styles.serviceCard}
              >
                <span
                  className={styles.serviceCardGlow}
                  style={{ background: GRADIENTS[service.gradient] }}
                />
                <ServiceIcon
                  icon={service.icon}
                  gradient={service.gradient}
                  size={26}
                  className={styles.serviceIcon}
                />
                <div className={styles.serviceTitle}>{service.title}</div>
                <div className={styles.serviceDesc}>{service.summary}</div>
                <span className={styles.serviceMore}>{dict.services.viewDetailLink}</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.news}>
          <div className={styles.sectionHeadRow}>
            <h2 className={styles.sectionTitle}>{home.newsTitle}</h2>
            <Link href={`/${locale}/news`} className={styles.viewAllLink}>
              {common.viewAll}
            </Link>
          </div>
          <div className={styles.newsGrid}>
            {newsItems.map((item) => (
              <Link key={item.id} href={`/${locale}/news/${item.id}`} className={styles.newsCard}>
                <div className={styles.newsThumb}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 620px) 100vw, (max-width: 900px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.newsBody}>
                  <span className={styles.newsDate}>{item.date}</span>
                  <span className={styles.newsTitle}>{item.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <ClientsSection
          label={home.clientsLabel}
          clients={clients}
          styles={styles}
          locale={locale}
          linkToPortfolio
        />
      </ContentSheet>
    </>
  );
}
