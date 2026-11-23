"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import styles from "./AdminShell.module.css";

const NAV_GROUPS: {
  label: string;
  links: { href: string; label: string }[];
}[] = [
  {
    label: "หน้าแรก",
    links: [{ href: "/admin", label: "แดชบอร์ด" }],
  },
  {
    label: "หน้าเว็บไซต์",
    links: [
      { href: "/admin/banners", label: "แบนเนอร์" },
      { href: "/admin/about", label: "หน้าเกี่ยวกับเรา" },
      { href: "/admin/contact", label: "ข้อมูลติดต่อ" },
    ],
  },
  {
    label: "เนื้อหา",
    links: [
      { href: "/admin/services", label: "บริการ" },
      { href: "/admin/portfolio", label: "ผลงาน/เคส" },
      { href: "/admin/news", label: "ข่าวสาร/บทความ" },
      { href: "/admin/news-categories", label: "หมวดหมู่ข่าว" },
      { href: "/admin/video-library", label: "คลังวิดีโอ" },
      { href: "/admin/event-gallery", label: "คลังภาพกิจกรรม" },
    ],
  },
  {
    label: "องค์กร",
    links: [
      { href: "/admin/team", label: "แกลเลอรีภาพทีมงาน" },
      { href: "/admin/clients", label: "ลูกค้า/พันธมิตร" },
    ],
  },
  {
    label: "ระบบ",
    links: [
      { href: "/admin/logs", label: "บันทึกกิจกรรม" },
      { href: "/admin/users", label: "ผู้ใช้งาน" },
    ],
  },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const links = sidebarRef.current?.querySelectorAll<HTMLElement>("a[href]");
    links?.[0]?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !links?.length) return;
      const first = links[0];
      const last = links[links.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getFirebaseAuth()).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className={styles.layout}>
      {menuOpen && <button type="button" className={styles.menuBackdrop} aria-label="ปิดเมนู" onClick={() => setMenuOpen(false)} />}
      <aside ref={sidebarRef} className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ""}`} id="admin-navigation">
        <div className={styles.brand}>
          <span className={styles.logoBadge}>
            <Image src="/images/site-wordmark-white.png" alt="Media" width={142} height={98} className={styles.logoImg} />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>PLANNER</span>
            <span className={styles.brandSub}>Backoffice</span>
          </span>
        </div>
        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className={styles.navGroupLabel}>{group.label}</div>
              {group.links.map((link) => {
                const active =
                  link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          <button ref={menuToggleRef} type="button" className={styles.menuToggle} aria-label={menuOpen ? "ปิดเมนู" : "เปิดเมนู"} aria-expanded={menuOpen} aria-controls="admin-navigation" onClick={() => setMenuOpen((value) => !value)}>☰</button>
          {email && <span className={styles.email}>{email}</span>}
          <button type="button" className={styles.logout} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
