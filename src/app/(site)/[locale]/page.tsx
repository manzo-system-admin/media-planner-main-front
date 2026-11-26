import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ClientsSection from "@/components/ClientsSection";
import TeamGallery from "@/components/TeamGallery";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getServiceList } from "@/lib/cms/services";
import { getClients, getTeamGallery } from "@/lib/cms/org";
import ServiceIcon from "@/components/ServiceIcon";
import HeroCarousel from "@/components/HeroCarousel";
import HomeScrollTransition from "@/components/HomeScrollTransition";
import { getHeroSlides } from "@/lib/cms/homepage";
import type { CSSProperties } from "react";

export const dynamic = "force-dynamic";

const HOME_SERVICE_ICONS: Record<string, string> = {
  "ipo-service": "/images/service-icons/deployed_code_account.png",
  "pr-consultant": "/images/service-icons/support_agent.png",
  "website-service": "/images/service-icons/language.png",
  "vdo-corporate": "/images/service-icons/play_circle.png",
  "ir-services": "/images/service-icons/android_cell_4_bar.png",
  "portrait-photography": "/images/service-icons/photo_camera_back.png",
};

const HOME_SERVICE_POSITIONS: Record<string, string> = {
  "ipo-service": styles.serviceNodeIpo,
  "ir-services": styles.serviceNodeIr,
  "vdo-corporate": styles.serviceNodeVideo,
  "website-service": styles.serviceNodeWebsite,
  "portrait-photography": styles.serviceNodePortrait,
  "pr-consultant": styles.serviceNodePr,
};

const HOME_SERVICE_ACCENTS: Record<string, string> = {
  "ipo-service": "#16B5C1",
  "ir-services": "#79BE28",
  "vdo-corporate": "#EB1738",
  "website-service": "#087BD1",
  "portrait-photography": "#A855F7",
  "pr-consultant": "#F66A00",
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { home } = dict;
  const portfolioIntroCopy =
    "สร้างภาพลักษณ์ความน่าเชื่อถือ เสริมแบรนด์ ให้กับบริษัทจดทะเบียนที่ก้าวสู่การเป็นบริษัทมหาชน ในสายผู้สื่อข่าว และนักลงทุน";
  const [services, clients, heroSlides, teamGallery] = await Promise.all([
    getServiceList(),
    getClients(),
    getHeroSlides(),
    getTeamGallery(),
  ]);

  return (
    <div className={styles.home} data-home-page data-home-scroll-root>
      {heroSlides.length > 0 && (
        <HeroCarousel slides={heroSlides} labels={home.carousel} />
      )}
      <HomeScrollTransition />
      <section
        className={styles.hero}
        id="top"
        data-page-hero
        data-home-snap-section
      >
        <div className={styles.heroCollapse} data-home-collapse>
          <div className={styles.heroContent}>
            <Image
              src="/images/brand-mark.png"
              alt="Media Planner"
              width={546}
              height={328}
              className={styles.heroLogo}
              priority
            />
            <h1 className={styles.heroTitle}>
              <span>
                <strong>เรา</strong> เป็นส่วนหนึ่ง
              </span>
              <span>ของเบื้องหลังความสำเร็จ</span>
            </h1>
            <p className={styles.heroSummary}>{home.subtitle}</p>
            <Link
              className={styles.portfolioIntroCta}
              href={`/${locale}/services`}
            >
              การบริการ
            </Link>
          </div>
        </div>
      </section>
      <section
        className={styles.portfolioIntro}
        aria-labelledby="home-portfolio-title"
        data-home-next-section
        data-home-snap-section
      >
        <div className={styles.portfolioIntroContent} data-home-next>
          <p className={styles.portfolioIntroEyebrow}>{dict.portfolio.title}</p>
          <h2 id="home-portfolio-title" className={styles.portfolioIntroTitle}>
            Media Planner PR Agency
          </h2>
          <p className={styles.portfolioIntroCopy}>{portfolioIntroCopy}</p>
          <Link
            className={styles.portfolioIntroCta}
            href={`/${locale}/portfolio`}
          >
            {locale === "th" ? "ไปพร้อมกับคุณ" : "Let’s grow together"}
          </Link>
        </div>
        {clients.length > 0 && (
          <div className={styles.portfolioClients} data-home-next-clients>
            <div className={styles.clientBand}>
              <ClientsSection
                label={home.clientsLabel}
                clients={clients}
                styles={styles}
                locale={locale}
                linkToPortfolio
              />
            </div>
          </div>
        )}
      </section>
      <section
        className={styles.serviceOverview}
        aria-labelledby="home-services-title"
        data-home-third-section
        data-home-snap-section
      >
        <div className={styles.serviceOverviewContent} data-home-third-content>
          <div className={styles.serviceOrbitCenter}>
            <Image
              src="/images/brand-mark.png"
              alt=""
              aria-hidden="true"
              width={546}
              height={328}
              className={styles.serviceOrbitLogo}
            />
            <h2
              id="home-services-title"
              className={styles.serviceOverviewTitle}
            >
              {home.servicesTitle}
            </h2>
          </div>
          <nav
            className={styles.serviceOrbitNodes}
            aria-label={home.servicesTitle}
          >
            {services.slice(0, 6).map((service) => {
              const slug = service.slug.toLowerCase();
              const iconSrc = HOME_SERVICE_ICONS[slug];
              return (
                <Link
                  key={service.slug}
                  className={`${styles.serviceOrbitNode} ${HOME_SERVICE_POSITIONS[slug] ?? ""}`}
                  href={`/${locale}/services/${service.slug}`}
                  style={{ "--service-accent": HOME_SERVICE_ACCENTS[slug] ?? "#79BE28" } as CSSProperties}
                >
                  <span
                    className={styles.serviceOrbitIcon}
                    style={iconSrc ? { "--service-icon-mask": `url("${iconSrc}")` } as CSSProperties : undefined}
                  >
                    {iconSrc ? (
                      <Image
                        src={iconSrc}
                        alt=""
                        aria-hidden="true"
                        width={30}
                        height={30}
                      />
                    ) : (
                      <ServiceIcon
                        icon={service.icon}
                        gradient={service.gradient}
                        size={30}
                      />
                    )}
                  </span>
                  <span className={styles.serviceOrbitText}>
                    <strong>{service.title}</strong>
                    <span className={styles.serviceOrbitDescription}>{service.summary}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </section>
      {teamGallery.length > 0 && (
        <section
          className={styles.finalGallery}
          aria-label={dict.about.teamTitle}
          data-home-snap-section
        >
          <TeamGallery
            photos={teamGallery.slice(0, 12)}
            altFallback={dict.about.teamTitle}
            variant="showcase"
            revealOnScroll
          />
        </section>
      )}
    </div>
  );
}
