import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import TeamGallery from "@/components/TeamGallery";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getTeamGallery } from "@/lib/cms/org";
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
  const teamGallery = await getTeamGallery();
  const content = await getAboutContent();
  const visionBody = content?.visionBody || about.visionBody;
  const missionBody = content?.missionBody || about.missionBody;
  const historyBody = content?.historyBody || about.historyBody;
  const historyImage =
    content?.historyImage || "https://picsum.photos/seed/about-office/640/480";

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: about.title },
        ]}
        title={about.title}
      />

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
          <h3 className={styles.subheading}>{about.visionTitle}</h3>
          <p className={styles.historyBody}>{visionBody}</p>

          <h3 className={styles.subheading}>{about.missionTitle}</h3>
          <p className={styles.historyBody}>{missionBody}</p>
        </div>
      </section>

      <section className={styles.team}>
        <h2 className={styles.teamTitle}>{about.teamTitle}</h2>
        <TeamGallery photos={teamGallery} altFallback={about.teamTitle} />
      </section>
    </ContentSheet>
  );
}
