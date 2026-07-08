import Link from "next/link";
import styles from "./Breadcrumb.module.css";

export type BreadcrumbItem = { label: string; href?: string };

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <>
      {items.map((item, index) => (
        <span key={index}>
          {item.href ? (
            <Link href={item.href} className={styles.link}>
              {item.label}
            </Link>
          ) : (
            item.label
          )}
          {index < items.length - 1 ? " / " : ""}
        </span>
      ))}
    </>
  );
}
