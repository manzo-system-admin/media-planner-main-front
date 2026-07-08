import Image from "next/image";
import styles from "./Footer.module.css";
import SocialIcon from "./SocialIcon";
import type { Dictionary } from "@/lib/dictionaries/types";

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <Image
          src="/images/logo.jpg"
          alt="logo"
          width={597}
          height={582}
          className={styles.logo}
        />
        <div className={styles.socials}>
          {dict.data.socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              className={styles.socialIcon}
              aria-label={social.name}
            >
              <SocialIcon name={social.name} />
            </a>
          ))}
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.bottom}>
        <div className={styles.links}>
          <a href="#">{dict.footer.privacyPolicy}</a>
          <a href="#">{dict.footer.sitemap}</a>
        </div>
        <div>
          © {dict.data.copyrightYear} {dict.data.companyName}
        </div>
      </div>
    </footer>
  );
}
