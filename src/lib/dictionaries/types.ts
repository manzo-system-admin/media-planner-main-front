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

export type PortfolioCategory = string;

export type PortfolioFilter = { key: PortfolioCategory | "ALL"; label: string };

export type PortfolioStat = { label: string; value: string };

export type PortfolioItem = {
  slug: string;
  category: PortfolioCategory;
  title: string;
  image: string;
  client: string;
  challenge: string;
  approach: string;
  result: string;
  stats: PortfolioStat[];
};

export type TeamMember = { name: string; role: string; avatar: string };

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
    langSwitchLabel: string;
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
    awardsTitle: string;
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
    categoryLabels: Record<PortfolioCategory, string>;
    empty: string;
    clientLabel: string;
    challengeLabel: string;
    approachLabel: string;
    resultLabel: string;
    relatedTitle: string;
    clientsLabel: string;
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
  chat: {
    openLabel: string;
    closeLabel: string;
    title: string;
    status: string;
    welcome: string;
    autoReply: string;
    placeholder: string;
    sendLabel: string;
    preChatTitle: string;
    preChatDescription: string;
    nameLabel: string;
    namePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    startButton: string;
    editContactLabel: string;
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
    teamMembers: TeamMember[];
    awards: string[];
    contactInfo: { address: string; phone: string; email: string };
    companyName: string;
    copyrightYear: string;
  };
};

export const GRADIENTS: Record<GradientKey, string> = {
  purpleBlue: "linear-gradient(135deg, var(--grad-purple), var(--grad-blue))",
  blueCyan: "linear-gradient(135deg, var(--grad-blue), var(--grad-cyan))",
  greenYellow: "linear-gradient(135deg, var(--grad-green), var(--grad-yellow))",
  orangeRed: "linear-gradient(135deg, var(--grad-orange), var(--grad-red))",
};
