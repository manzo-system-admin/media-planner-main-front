"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const localePrefix = `/${locale}`;
  const unprefixedPath = pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length) || "/"
    : pathname;

  return (
    <header className={`${styles.header} ${styles.light}`}>
      <Link href={localePrefix} className={styles.logoLink} onClick={() => setMenuOpen(false)}>
        <Image
          src="/images/logo.jpg"
          alt="Media Planner Consultant logo"
          width={597}
          height={582}
          className={styles.logo}
          priority
        />
      </Link>

      <button
        type="button"
        className={styles.menuToggle}
        aria-label={dict.nav.menuOpenLabel}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((v) => !v)}
      >
        <span />
        <span />
        <span />
      </button>

      {menuOpen && <div className={styles.backdrop} onClick={() => setMenuOpen(false)} />}

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        {dict.nav.links.map((link) => {
          const href = `${localePrefix}${link.href === "/" ? "" : link.href}`;
          const active = link.href === "/" ? unprefixedPath === "/" : unprefixedPath.startsWith(link.href);
          return (
            <Link
              key={link.key}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
