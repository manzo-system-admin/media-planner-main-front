import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import TeamGallery from "@/components/TeamGallery";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getTeamGallery } from "@/lib/cms/org";
import { getAboutContent } from "@/lib/cms/about";

export const dynamic = "force-dynamic";

const principles = [
  { number: "01", image: "/images/about/value-stars.png", title: "สร้างภาพลักษณ์ที่น่าเชื่อถือ", titleEn: "Build a trusted reputation", description: "สื่อสารตัวตนขององค์กรให้ชัดเจน และสร้างความเชื่อมั่นในทุกจุดสัมผัส", descriptionEn: "Clarify your identity and build confidence at every touchpoint." },
  { number: "02", image: "/images/about/value-partner.png", title: "เชื่อมโยงทุกความสัมพันธ์", titleEn: "Connect every relationship", description: "ประสานองค์กร สื่อมวลชน นักลงทุน และคู่ค้า ให้เข้าใจตรงกัน", descriptionEn: "Bring organizations, media, investors, and partners together." },
  { number: "03", image: "/images/about/value-growth.png", title: "เติบโตไปด้วยกัน", titleEn: "Grow together", description: "วางกลยุทธ์การสื่อสารที่ต่อยอดได้และเติบโตอย่างยั่งยืน", descriptionEn: "Create communication strategies that evolve with your business." },
];

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
  const visionImage = teamGallery[0]?.image || content?.historyImage;
  const missionImage = teamGallery[1]?.image || teamGallery[0]?.image;

  return (
    <ContentSheet>
      <header className={styles.intro} data-reveal data-reveal-repeat>
        <div className={styles.breadcrumb}>{about.breadcrumb}</div>
        <h1 className={styles.pageTitle}>{about.title}</h1>
        <Image className={styles.brandMark} src="/images/about/brand-mark-hq.png" alt="Media Planner" width={3284} height={1769} priority />
        <p className={styles.wordmark}>MEDIA PLANNER</p>
        <p className={styles.companyLine}>CONSULTANT CO., LTD.</p>
        <p className={styles.historyBody}>{historyBody}</p>
        <Link className={styles.moreLink} href="#vision">อ่านเพิ่มเติม <span aria-hidden="true">↓</span></Link>
      </header>

      <section className={styles.values} id="vision" aria-label={`${about.visionTitle} และ ${about.missionTitle}`}>
        <article className={styles.valueRow} data-reveal data-reveal-repeat>
          <div className={styles.valueCopy}>
            <h2>{about.visionTitle}</h2>
            <p>{visionBody}</p>
          </div>
          {missionImage && <div className={styles.valueImage}><Image src={missionImage} alt={about.visionTitle} fill sizes="(max-width: 700px) 88vw, 40vw" /></div>}
        </article>
        <article className={`${styles.valueRow} ${styles.reverse}`} data-reveal data-reveal-repeat>
          {visionImage && <div className={styles.valueImage}><Image src={visionImage} alt={about.missionTitle} fill sizes="(max-width: 700px) 88vw, 40vw" /></div>}
          <div className={styles.valueCopy}>
            <h2>{about.missionTitle}</h2>
            <p>{missionBody}</p>
          </div>
        </article>
      </section>

      <section className={styles.principles} aria-labelledby="principles-title">
        <div className={styles.principleHeading} data-reveal data-reveal-repeat>
          <h2 id="principles-title">{locale === "th" ? <><em>“เปลี่ยน”</em> ความเงียบให้เป็น<br />ความน่าเชื่อถือที่ยั่งยืน</> : <>Turn silence into<br />lasting credibility</>}</h2>
        </div>
        <div className={styles.principleGrid}>
          {principles.map((item) => (
            <article className={styles.principleCard} key={item.number} data-reveal data-reveal-repeat>
              <div className={styles.principleTop}><span>{item.number}</span><Image src={item.image} alt="" width={56} height={48} /></div>
              <h3>{locale === "th" ? item.title : item.titleEn}</h3>
              <p>{locale === "th" ? item.description : item.descriptionEn}</p>
            </article>
          ))}
        </div>
        <p className={styles.promiseCopy} data-reveal data-reveal-repeat>{dict.home.subtitle}</p>
      </section>

      <section className={styles.team} aria-label={about.teamTitle}>
        <TeamGallery photos={teamGallery} altFallback={about.teamTitle} revealOnScroll />
      </section>
    </ContentSheet>
  );
}
