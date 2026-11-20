import type { ReactNode } from "react";
import type { BreadcrumbItem } from "./Breadcrumb";
import PageHero from "./PageHero";

export default function PageIntro({
  breadcrumb,
  title,
  image,
  children,
}: {
  breadcrumb: BreadcrumbItem[];
  title: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <PageHero title={title} image={image} breadcrumb={breadcrumb} compact dense={title.length > 55}>
      {children}
    </PageHero>
  );
}
