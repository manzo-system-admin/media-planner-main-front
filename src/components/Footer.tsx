import Image from "next/image";
import Link from "next/link";
import styles from "./Footer.module.css";
import SocialIcon from "./SocialIcon";
import type { Dictionary, SocialLink } from "@/lib/dictionaries/types";

export default function Footer({ dict, socialLinks }: { dict: Dictionary; socialLinks?: SocialLink[] }) {
  const links = socialLinks?.length ? socialLinks : dict.data.socialLinks;
  return <footer className={styles.footer}>
    <div className={styles.topRow}>
      <Link href="/th" className={styles.brand} aria-label="Media Planner หน้าหลัก">
        <Image src="/images/site-wordmark-white.png" alt="Media" width={142} height={98} />
        <span>PLANNER</span>
      </Link>
      <div className={styles.socials}>{links.map((social) => <a key={social.name} href={social.href} className={styles.socialIcon} aria-label={social.label || social.name}><SocialIcon name={social.name} /></a>)}</div>
    </div>
    <div className={styles.bottom}>
      <div className={styles.links}><a href="#">{dict.footer.privacyPolicy}</a><a href="#">{dict.footer.sitemap}</a></div>
      <div className={styles.companyMeta}>
        <span className={styles.copyright}>© {dict.data.copyrightYear} {dict.data.companyName}</span>
        <span className={styles.location}>BANGKOK, THAILAND</span>
      </div>
    </div>
  </footer>;
}
