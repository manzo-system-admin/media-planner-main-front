"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.css";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

export default function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 32);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [pathname]);

  useEffect(() => {
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setMenuOpen(false); };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, []);

  const localePrefix = `/${locale}`;
  const unprefixedPath = pathname.startsWith(localePrefix)
    ? pathname.slice(localePrefix.length) || "/"
    : pathname;
  return (
    <header className={`${styles.header} ${!scrolled && !menuOpen ? styles.overHero : styles.light}`}>
      <Link href={localePrefix} className={styles.logoLink} onClick={() => setMenuOpen(false)}>
        <Image
          src="/images/site-wordmark-white.png"
          alt="Media"
          width={142}
          height={98}
          className={styles.logo}
          priority
        />
        <span className={styles.wordmark}>PLANNER</span>
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
        {dict.nav.links.filter((link) => link.href !== "/contact").map((link) => {
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
        <Link href={`${localePrefix}/contact`} onClick={() => setMenuOpen(false)} className={styles.navCta}>{dict.nav.contactCta}</Link>
      </nav>
    </header>
  );
}

