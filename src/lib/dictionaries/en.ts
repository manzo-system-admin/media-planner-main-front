import type { Dictionary } from "./types";

const en: Dictionary = {
  meta: {
    htmlLang: "en",
    title: "Media Planner Consultant Co., Ltd.",
    description:
      "Your media and creative partner for business growth — full-service media planning, creative production, and content management.",
  },
  nav: {
    links: [
      { key: "home", label: "Home", href: "/" },
      { key: "about", label: "About Us", href: "/about" },
      { key: "services", label: "Our Services", href: "/services" },
      { key: "portfolio", label: "Work / Clients", href: "/portfolio" },
      { key: "news", label: "News / Events", href: "/news" },
      { key: "contact", label: "Contact Us", href: "/contact" },
    ],
    contactCta: "Contact Us",
    menuOpenLabel: "Open menu",
    langSwitchLabel: "ไทย",
  },
  footer: {
    privacyPolicy: "Privacy Policy",
    sitemap: "Sitemap",
  },
  common: {
    home: "Home",
    viewAll: "View all →",
    all: "All",
  },
  home: {
    badge: "MEDIA PLANNING & CREATIVE CONSULTANT",
    title: "Your Media & Creative Partner for Business Growth",
    subtitle:
      "Full-service media planning, creative production, and content management — from a team that understands your brand and Thai consumers.",
    ctaPrimary: "View Our Work",
    ctaSecondary: "Talk to Our Team",
    videoAlt: "Company introduction video",
    videoCaption: "Company introduction video",
    servicesTitle: "Our Services",
    servicesSubtitle: "Full-service solutions built for your brand",
    newsTitle: "Latest News & Events",
    clientsLabel: "Our Clients & Partners",
    carousel: {
      prevLabel: "Previous slide",
      nextLabel: "Next slide",
      goToLabel: "Go to slide",
    },
  },
  about: {
    breadcrumb: "Home / About Us",
    title: "About Us",
    visionTitle: "Vision",
    visionBody:
      "To be Thailand's leading media and creative partner, trusted by businesses at every stage of growth.",
    missionTitle: "Mission",
    missionBody:
      "To plan media and produce content with precision and measurable results, while staying closely attuned to every client's needs.",
    historyTitle: "Our History",
    historyBody:
      "Media Planner Consultant was founded to bring professional-grade media planning and creative work within reach of Thai businesses. Over the years we've grown alongside clients across many industries, backed by a team of specialists in every discipline.",
    historyImageAlt: "Media Planner Consultant office",
    teamTitle: "Leadership Team",
    awardsTitle: "Awards & Certifications",
  },
  services: {
    listBreadcrumb: "Home / Our Services",
    listTitle: "Our Services",
    viewDetailLink: "View service details →",
    detailBreadcrumbPrefix: "Home / Our Services",
    highlightsTitle: "What You'll Get",
    ctaButton: "Talk to Our Team",
    relatedTitle: "Other Services You May Like",
  },
  portfolio: {
    breadcrumb: "Home / Work & Clients",
    title: "Work / Clients",
    filters: [
      { key: "ALL", label: "All" },
      { key: "MEDIA_PLANNING", label: "Media Planning" },
      { key: "DIGITAL", label: "Digital" },
      { key: "CREATIVE", label: "Creative" },
      { key: "PR_EVENT", label: "PR & Event" },
    ],
    categoryLabels: {
      MEDIA_PLANNING: "MEDIA PLANNING",
      DIGITAL: "DIGITAL",
      CREATIVE: "CREATIVE",
      PR_EVENT: "PR & EVENT",
    },
    empty: "No work in this category yet.",
    clientLabel: "Client",
    challengeLabel: "The Challenge",
    approachLabel: "Our Approach",
    resultLabel: "The Result",
    relatedTitle: "Other Work You May Like",
    clientsLabel: "Our Clients & Partners",
  },
  news: {
    breadcrumb: "Home / News & Events",
    title: "News / Events",
    tabs: [
      { key: "articles", label: "Articles / News" },
      { key: "videos", label: "Video Library" },
      { key: "gallery", label: "Event Gallery" },
    ],
    articlesLabel: "Articles / News",
    videosLabel: "Video Library",
    galleryLabel: "Event Gallery",
    galleryImageAlt: "Event photo",
    relatedTitle: "Other News You May Like",
  },
  contact: {
    breadcrumb: "Home / Contact Us",
    title: "Contact Us",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    socialLabel: "Social",
    mapLabel: "Google Map",
  },
  notFound: {
    title: "Page Not Found",
    description: "The page you're looking for may have been moved, deleted, or never existed.",
    homeButton: "Back to Home",
    contactButton: "Contact Us",
  },
  chat: {
    openLabel: "Open chat window",
    closeLabel: "Close chat window",
    title: "Media Planner Consultant",
    status: "Online — replies within minutes",
    welcome: "Hi there 👋 Welcome to Media Planner Consultant. How can we help you today?",
    autoReply: "Thanks for your message! Our team has received it and will get back to you as soon as possible.",
    placeholder: "Type a message...",
    sendLabel: "Send message",
    preChatTitle: "Start a chat with us",
    preChatDescription: "Please enter your name and email so our team can follow up with you.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    startButton: "Start chat",
  },
  data: {
    socialLinks: [
      { label: "FB", name: "Facebook", href: "#" },
      { label: "YT", name: "YouTube", href: "#" },
      { label: "TT", name: "TikTok", href: "#" },
      { label: "LN", name: "Line", href: "#" },
    ],
    heroSlides: [
      {
        type: "image",
        src: "https://picsum.photos/seed/hero-slide-agency/1600/900",
        alt: "Media planning and creative team at work",
      },
      {
        type: "video",
        src: "/videos/hero-intro.mp4",
        poster: "https://picsum.photos/seed/hero-slide-video/1600/900",
        alt: "Company introduction video",
      },
      {
        type: "image",
        src: "https://picsum.photos/seed/hero-slide-studio/1600/900",
        alt: "Behind the scenes at the studio",
      },
      {
        type: "image",
        src: "https://picsum.photos/seed/hero-slide-event/1600/900",
        alt: "Client event atmosphere",
      },
    ],
    services: [
      {
        slug: "media-planning-buying",
        title: "Media Planning & Buying",
        summary: "Effective media planning and buying",
        description:
          "Strategic media planning and buying across TV, digital, and out-of-home, backed by reporting you can actually measure.",
        gradient: "purpleBlue",
        image: "https://picsum.photos/seed/service-media-planning/640/480",
        highlights: [
          "In-depth audience and consumer behavior analysis",
          "Full-channel media planning across TV, digital, and out-of-home",
          "Effective media rate negotiation",
          "Real-time campaign reporting and performance measurement",
        ],
      },
      {
        slug: "digital-social-media",
        title: "Digital / Social Media",
        summary: "Managing digital and social channels",
        description:
          "End-to-end management of social channels and digital campaigns, from strategy through measurement.",
        gradient: "blueCyan",
        image: "https://picsum.photos/seed/service-digital-social/640/480",
        highlights: [
          "Content strategy tailored to each platform",
          "Social media and search engine ad management",
          "Community building and follower engagement",
          "Data-driven campaign analysis and optimization",
        ],
      },
      {
        slug: "creative-content-production",
        title: "Creative & Content Production",
        summary: "Quality creative and content production",
        description:
          "High-quality creative work, video, and content production that speaks directly to your audience.",
        gradient: "greenYellow",
        image: "https://picsum.photos/seed/service-creative-content/640/480",
        highlights: [
          "High-quality video ad and content production",
          "On-brand graphic design and creative work",
          "End-to-end scriptwriting and production direction",
          "Content adapted for every platform",
        ],
      },
      {
        slug: "pr-event",
        title: "PR & Event",
        summary: "Public relations and event management",
        description:
          "Strategic PR planning and event management that builds brand awareness effectively.",
        gradient: "orangeRed",
        image: "https://picsum.photos/seed/service-pr-event/640/480",
        highlights: [
          "PR strategy and media relationship management",
          "Product launches and corporate event management",
          "Crisis and reputation management",
          "Post-event brand awareness measurement",
        ],
      },
    ],
    newsItems: [
      {
        slug: "new-client-campaign-launch",
        date: "Jun 12, 2026",
        title: "New Client Campaign Launch Event",
        image: "https://picsum.photos/seed/news-campaign-launch/640/400",
        excerpt:
          "Media Planner Consultant hosted a campaign launch event for a new client, with a full-service team covering everything from media planning to creative production.",
        body: [
          "On June 12, Media Planner Consultant hosted a campaign launch event for a new client in the retail sector. The team planned everything from media strategy and creative production to the launch event itself.",
          "The event drew significant attention from press and influencers, reflecting the success of the fully integrated media plan the team designed specifically for this brand.",
          "Media Planner Consultant remains committed to blending creativity with data-driven insight to deliver measurable results for every client.",
        ],
      },
      {
        slug: "agency-of-the-year",
        date: "Jun 2, 2026",
        title: "Media Planner Wins Agency of the Year",
        image: "https://picsum.photos/seed/news-agency-award/640/400",
        excerpt:
          "Media Planner Consultant has been named Agency of the Year, reaffirming its leadership in media planning and creative work.",
        body: [
          "Media Planner Consultant has been named Agency of the Year, recognizing an outstanding year of media planning and creative work.",
          "This award reflects the dedication of the whole team to producing quality work and staying closely attuned to every client at every step.",
          "The company thanks all clients and partners for their continued trust, and remains committed to raising the bar on quality going forward.",
        ],
      },
      {
        slug: "digital-media-trends-2026",
        date: "May 21, 2026",
        title: "2026 Digital Media Trends Update",
        image: "https://picsum.photos/seed/news-digital-trends/640/400",
        excerpt:
          "A roundup of the digital media trends brands should watch in 2026 to keep their marketing plans ahead of the curve.",
        body: [
          "Digital media trends continue to evolve rapidly in 2026, as consumer behavior and new technologies play an ever-larger role in media planning.",
          "Short-form video remains the most popular content format, while using real-time data to adjust campaigns has become a new industry standard.",
          "Brands that adapt quickly and are willing to test new channels will have the edge in reaching their audience as competition for digital media attention intensifies year after year.",
        ],
      },
    ],
    videoLibrary: [
      { slug: "video-1", title: "Company introduction video", image: "https://picsum.photos/seed/video-company-intro/640/360" },
      { slug: "video-2", title: "Behind the scenes: campaign shoot", image: "https://picsum.photos/seed/video-bts-campaign/640/360" },
      { slug: "video-3", title: "Client interview", image: "https://picsum.photos/seed/video-client-interview/640/360" },
    ],
    eventGallery: [
      "https://picsum.photos/seed/gallery-event-1/400/400",
      "https://picsum.photos/seed/gallery-event-2/400/400",
      "https://picsum.photos/seed/gallery-event-3/400/400",
      "https://picsum.photos/seed/gallery-event-4/400/400",
    ],
    portfolioItems: [
      {
        slug: "retail-product-launch",
        category: "MEDIA_PLANNING",
        title: "New Product Launch Campaign — Retail",
        image: "https://picsum.photos/seed/portfolio-retail-launch/500/375",
        client: "Major Retail Business",
        challenge:
          "The client needed to launch a new product in a crowded market and build awareness quickly on a limited budget.",
        approach:
          "We planned a blended media mix across TV, digital, and out-of-home, timed to the audience's peak media consumption, and negotiated media rates for maximum value.",
        result:
          "The campaign significantly increased brand awareness, and new product sales grew beyond target within the first quarter.",
        stats: [
          { label: "Reach", value: "2.4M+" },
          { label: "Sales Growth", value: "+32%" },
          { label: "Campaign Duration", value: "6 weeks" },
        ],
      },
      {
        slug: "food-social-campaign",
        category: "DIGITAL",
        title: "Social Media Campaign — Food & Beverage",
        image: "https://picsum.photos/seed/portfolio-food-social/500/375",
        client: "Food & Beverage Business",
        challenge:
          "The food brand wanted to reach younger audiences through social media but lacked compelling content and a clear strategy.",
        approach:
          "We designed an influencer-led content series alongside precisely targeted social media ad campaigns.",
        result:
          "Followers grew steadily, engagement rate exceeded the industry average, and online orders increased.",
        stats: [
          { label: "Engagement Rate", value: "+58%" },
          { label: "New Followers", value: "45K+" },
          { label: "Online Orders", value: "+21%" },
        ],
      },
      {
        slug: "finance-ad-video",
        category: "CREATIVE",
        title: "Ad Video Production — Financial Services",
        image: "https://picsum.photos/seed/portfolio-finance-video/500/375",
        client: "Finance & Insurance Business",
        challenge:
          "A complex financial product needed to be explained clearly and credibly in a short amount of time.",
        approach:
          "We developed a script and produced an ad video telling the story through real-life situations, using accessible language and high-quality post-production.",
        result:
          "The video ran across TV and online, improving product understanding and increasing sign-ups.",
        stats: [
          { label: "Views", value: "1.8M+" },
          { label: "Completion Rate", value: "71%" },
          { label: "Sign-ups", value: "+19%" },
        ],
      },
      {
        slug: "real-estate-brand-launch",
        category: "PR_EVENT",
        title: "Brand Launch Event — Real Estate",
        image: "https://picsum.photos/seed/portfolio-realestate-launch/500/375",
        client: "Real Estate Business",
        challenge:
          "A new real estate project needed to build awareness and credibility with an upmarket audience from day one.",
        approach:
          "We organized a brand launch event with press and real-estate influencers, paired with an ongoing PR plan after the event.",
        result:
          "The launch drew strong media coverage and generated unit bookings starting from the pre-sale period.",
        stats: [
          { label: "Press Attendance", value: "40+ outlets" },
          { label: "Published Coverage", value: "60+ pieces" },
          { label: "Pre-sale Bookings", value: "+25%" },
        ],
      },
      {
        slug: "automotive-annual-plan",
        category: "MEDIA_PLANNING",
        title: "Annual Media Plan — Automotive",
        image: "https://picsum.photos/seed/portfolio-automotive-plan/500/375",
        client: "Automotive Business",
        challenge:
          "The car brand needed an annual media plan covering every quarter and supporting multiple new model launches throughout the year.",
        approach:
          "We planned quarterly media budgets, allocated media weight around each launch window, and tracked performance continuously to adjust the plan.",
        result:
          "The brand maintained a consistent share of voice all year and managed its media budget efficiently.",
        stats: [
          { label: "Budget Managed", value: "฿120M+" },
          { label: "Models Launched", value: "5 models" },
          { label: "Share of Voice", value: "#2 in category" },
        ],
      },
      {
        slug: "beauty-content-series",
        category: "DIGITAL",
        title: "Content Series — Beauty",
        image: "https://picsum.photos/seed/portfolio-beauty-series/500/375",
        client: "Beauty & Cosmetics Business",
        challenge:
          "The beauty brand needed ongoing content to drive engagement and online sales.",
        approach:
          "We produced a weekly content series combining beauty education with product features, paired with seasonal promotional campaigns.",
        result:
          "The content series built a loyal follower base and drove sustained online sales growth throughout the campaign.",
        stats: [
          { label: "Episodes Published", value: "24 episodes" },
          { label: "Total Views", value: "3.1M+" },
          { label: "Online Sales", value: "+40%" },
        ],
      },
    ],
    clientLogos: ["Aurora Retail", "Sabai Foods", "NextGen Finance", "Bluewave Auto", "Glow Beauty Co.", "Metro Living"],
    teamMembers: [
      { name: "Full Name", role: "Chief Executive Officer", avatar: "https://i.pravatar.cc/300?img=12" },
      { name: "Full Name", role: "Director of Media Planning", avatar: "https://i.pravatar.cc/300?img=45" },
      { name: "Full Name", role: "Creative Director", avatar: "https://i.pravatar.cc/300?img=32" },
      { name: "Full Name", role: "Client Relations Manager", avatar: "https://i.pravatar.cc/300?img=68" },
    ],
    awards: ["Agency of the Year 2025", "Best Digital Campaign", "Creative Excellence Award", "ISO 9001 Certified"],
    contactInfo: {
      address: "123 Media Building, 8th Floor, Sukhumvit Road, Khlong Tan, Khlong Toei, Bangkok 10110",
      phone: "02-123-4567",
      email: "contact@mediaplanner.co.th",
    },
    companyName: "Media Planner Consultant Co., Ltd.",
    copyrightYear: `${new Date().getFullYear()}`,
  },
};

export default en;
