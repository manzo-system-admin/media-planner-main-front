import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import AwardBadge from "@/components/AwardBadge";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { GRADIENTS } from "@/lib/dictionaries/types";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getAwards, getTeamMembers } from "@/lib/cms/org";
import { getAboutContent } from "@/lib/cms/about";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.about.title} | Media Planner Consultant` };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { about } = dict;
  const teamMembers = await getTeamMembers(locale);
  const awards = await getAwards(locale);
  const content = await getAboutContent(locale);
  const visionBody = content?.visionBody || about.visionBody;
  const missionBody = content?.missionBody || about.missionBody;
  const historyBody = content?.historyBody || about.historyBody;
  const historyImage = content?.historyImage || "https://picsum.photos/seed/about-office/640/480";

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[{ label: dict.common.home, href: `/${locale}` }, { label: about.title }]}
        title={about.title}
      />

      <section className={styles.visionMission}>
        <div className={styles.card}>
          <span className={styles.icon} style={{ background: GRADIENTS.purpleBlue }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
              <circle cx="12" cy="12" r="3.2" />
            </svg>
          </span>
          <div className={styles.cardTitle}>{about.visionTitle}</div>
          <p className={styles.cardDesc}>{visionBody}</p>
        </div>
        <div className={styles.card}>
          <span className={styles.icon} style={{ background: GRADIENTS.greenYellow }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 21V4" />
              <path d="M5 4h13l-3 4 3 4H5" />
            </svg>
          </span>
          <div className={styles.cardTitle}>{about.missionTitle}</div>
          <p className={styles.cardDesc}>{missionBody}</p>
        </div>
      </section>

      <section className={styles.history}>
        <div className={styles.historyImage}>
          <Image
            src={historyImage}
            alt={about.historyImageAlt}
            fill
            sizes="(max-width: 720px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.historyText}>
          <h2 className={styles.historyTitle}>{about.historyTitle}</h2>
          <p className={styles.historyBody}>{historyBody}</p>
        </div>
      </section>

      <section className={styles.team}>
        <h2 className={styles.teamTitle}>{about.teamTitle}</h2>
        <div className={styles.teamGrid}>
          {teamMembers.map((member) => (
            <div key={member.role} className={styles.teamMember}>
              <div className={styles.avatar}>
                <Image
                  src={member.avatar}
                  alt={member.name}
                  fill
                  sizes="96px"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={styles.teamName}>{member.name}</div>
              <div className={styles.teamRole}>{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.awards}>
        <h2 className={styles.awardsTitle}>{about.awardsTitle}</h2>
        <div className={styles.awardsRow}>
          {awards.map((award, index) => (
            <div key={award} className={styles.awardBadge}>
              <AwardBadge name={award} index={index} />
            </div>
          ))}
        </div>
      </section>
    </ContentSheet>
  );
}
