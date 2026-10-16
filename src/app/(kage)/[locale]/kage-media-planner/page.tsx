import { getAboutContent } from "@/lib/cms/about";
import { getServiceList } from "@/lib/cms/services";
import { getPortfolioList } from "@/lib/cms/portfolio";
import { getDictionary } from "@/lib/dictionaries";
import KageExperience, { type MediaPlannerContent } from "../../KageExperience";

export const dynamic = "force-dynamic";

export default async function KageMediaPlannerPage() {
  const locale = "th";
  const [services, portfolio, about] = await Promise.all([
    getServiceList(),
    getPortfolioList(),
    getAboutContent(),
  ]);
  const dict = getDictionary(locale);
  const content: MediaPlannerContent = {
    locale,
    heroTitle: dict.home.title,
    heroSubtitle: dict.home.subtitle,
    about: about?.historyBody || dict.about.historyBody,
    mission: about?.missionBody || dict.about.missionBody,
    services: services.slice(0, 5).map((service) => ({
      title: service.title,
      summary: service.summary,
      href: `/${locale}/services/${service.slug}`,
    })),
    projects: portfolio.filter((item) => item.image).slice(0, 3).map((item) => ({
      title: item.title,
      client: item.client || "MEDIA PLANNER",
      href: `/${locale}/portfolio/${item.id}`,
    })),
  };

  return <KageExperience content={content} />;
}
