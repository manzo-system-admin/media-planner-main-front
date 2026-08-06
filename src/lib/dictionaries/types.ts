export type GradientKey = "purpleBlue" | "blueCyan" | "greenYellow" | "orangeRed";

export type NavLink = { key: string; label: string; href: string };
export type SocialLink = { label: string; name: string; href: string };

export type Service = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  gradient: GradientKey;
  icon: string;
  image: string;
  highlights: string[];
};

export type NewsItem = {
  slug: string;
  date: string;
  title: string;
  image: string;
  excerpt: string;
  body: string[];
};

export type VideoItem = { slug: string; title: string; image: string };

export type HeroSlide =
  | { type: "image"; src: string; alt: string }
  | { type: "video"; src: string; poster: string; alt: string };

export type PortfolioFilter = { key: string; label: string };

export type PortfolioStat = { label: string; value: string };

export type PortfolioItem = {
  id: string;
  clientId: string;
  title: string;
  image: string;
  images: string[];
  client: string;
  /** Thai-only rich-text HTML; no English counterpart by design. */
  description?: string;
  stats: PortfolioStat[];
};

export type TeamGalleryPhoto = { id: string; image: string; caption: string };

export type Dictionary = {
  meta: {
    htmlLang: string;
    title: string;
    description: string;
  };
  nav: {
    links: NavLink[];
    contactCta: string;
    menuOpenLabel: string;
  };
  footer: {
    privacyPolicy: string;
    sitemap: string;
  };
  common: {
    home: string;
    viewAll: string;
    all: string;
  };
  home: {
    badge: string;
    title: string;
    subtitle: string;
    ctaPrimary: string;
    ctaSecondary: string;
    videoAlt: string;
    videoCaption: string;
    servicesTitle: string;
    servicesSubtitle: string;
    newsTitle: string;
    clientsLabel: string;
    carousel: {
      prevLabel: string;
      nextLabel: string;
      goToLabel: string;
    };
  };
  about: {
    breadcrumb: string;
    title: string;
    visionTitle: string;
    visionBody: string;
    missionTitle: string;
    missionBody: string;
    historyTitle: string;
    historyBody: string;
    historyImageAlt: string;
    teamTitle: string;
  };
  services: {
    listBreadcrumb: string;
    listTitle: string;
    viewDetailLink: string;
    detailBreadcrumbPrefix: string;
    highlightsTitle: string;
    ctaButton: string;
    relatedTitle: string;
  };
  portfolio: {
    breadcrumb: string;
    title: string;
    filters: PortfolioFilter[];
    empty: string;
    relatedTitle: string;
    clientsLabel: string;
    viewCaseStudy: string;
    clientDrawerEmpty: string;
    closeLabel: string;
  };
  news: {
    breadcrumb: string;
    title: string;
    tabs: { key: "articles" | "videos" | "gallery"; label: string }[];
    articlesLabel: string;
    videosLabel: string;
    galleryLabel: string;
    galleryImageAlt: string;
    relatedTitle: string;
    searchPlaceholder: string;
    searchEmpty: string;
  };
  contact: {
    breadcrumb: string;
    title: string;
    addressLabel: string;
    phoneLabel: string;
    emailLabel: string;
    socialLabel: string;
    mapLabel: string;
  };
  notFound: {
    title: string;
    description: string;
    homeButton: string;
    contactButton: string;
  };
  data: {
    socialLinks: SocialLink[];
    heroSlides: HeroSlide[];
    services: Service[];
    newsItems: NewsItem[];
    videoLibrary: VideoItem[];
    eventGallery: string[];
    portfolioItems: PortfolioItem[];
    clientLogos: string[];
    teamGallery: TeamGalleryPhoto[];
    contactInfo: { address: string; phone: string; email: string };
    companyName: string;
    copyrightYear: string;
  };
};

export const GRADIENTS: Record<GradientKey, string> = {
  purpleBlue: "linear-gradient(135deg, var(--icon-purple), var(--icon-blue))",
  blueCyan: "linear-gradient(135deg, var(--icon-blue), var(--icon-cyan))",
  greenYellow: "linear-gradient(135deg, var(--icon-green), var(--icon-yellow))",
  orangeRed: "linear-gradient(135deg, var(--icon-orange), var(--icon-red))",
};
