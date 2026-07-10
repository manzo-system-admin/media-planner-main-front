import Image from "next/image";
import styles from "./Footer.module.css";
import SocialIcon from "./SocialIcon";
import type { Dictionary, SocialLink } from "@/lib/dictionaries/types";

export default function Footer({
  dict,
  socialLinks,
}: {
  dict: Dictionary;
  socialLinks?: SocialLink[];
}) {
  const links = socialLinks?.length ? socialLinks : dict.data.socialLinks;
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
          {links.map((social) => (
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
