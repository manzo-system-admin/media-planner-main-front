import type { ReactNode } from "react";
import Breadcrumb, { type BreadcrumbItem } from "./Breadcrumb";
import styles from "./PageIntro.module.css";

export default function PageIntro({
  breadcrumb,
  title,
  children,
}: {
  breadcrumb: BreadcrumbItem[];
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className={styles.wrap}>
      <div className={styles.breadcrumb}>
        <Breadcrumb items={breadcrumb} />
      </div>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
}
