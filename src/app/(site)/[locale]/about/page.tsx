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
            src="/images/logo.jpg"
            alt={about.historyImageAlt}
            fill
            sizes="(max-width: 720px) 100vw, 27vw"
            style={{ objectFit: "contain" }}
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

      <section className={styles.promise} aria-labelledby="about-promise-title">
        <div className={styles.promiseHeading}>
          <h2 id="about-promise-title" className={styles.promiseTitle}>
            “เปลี่ยน” ความเงียบให้เป็น ความน่าเชื่อถือ ที่ยั่งยืน
          </h2>
        </div>
        <ul className={styles.promiseList}>
          <li>
            <span className={styles.promiseNumber} aria-hidden="true">01</span>
            <p><strong>จะดีกว่าไหม...</strong> ถ้าแบรนด์ของคุณยังคง <strong>“โดดเด่น”</strong> ในหน้าสื่อโดยไม่มีวันถูกกลืนหายไป</p>
          </li>
          <li>
            <span className={styles.promiseNumber} aria-hidden="true">02</span>
            <p><strong>จะดีกว่าไหม...</strong> ถ้ามี <strong>“ผู้ช่วยมืออาชีพ”</strong> เป็นตัวกลางคอยรันกระแสข่าวให้อย่างต่อเนื่อง</p>
          </li>
          <li>
            <span className={styles.promiseNumber} aria-hidden="true">03</span>
            <p><strong>จะดีกว่าไหม...</strong> ถ้าธุรกิจของคุณ <strong>“ติดเทรนด์”</strong> และอยู่ในสายตากลุ่มเป้าหมายตลอดเวลา</p>
          </li>
        </ul>
        <div className={styles.promiseClosing}>
          <p>ให้เรา <strong>“Media Planner PR Agency”</strong> เป็นสะพานเชื่อมทุกมิติธุรกิจของคุณ สู่สื่อมวลชน นักลงทุน และคู่ค้า</p>
          <p>เราพร้อมเป็นพาร์ทเนอร์ร่วมวางแผนและขับเคลื่อนกลยุทธ์ด้านการประชาสัมพันธ์ไปพร้อมกับคุณ</p>
        </div>
      </section>

      <section className={styles.team}>
        <h2 className={styles.teamTitle}>{about.teamTitle}</h2>
        <TeamGallery photos={teamGallery} altFallback={about.teamTitle} />
      </section>
    </ContentSheet>
  );
}
