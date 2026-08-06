import type { Dictionary } from "./types";

const th: Dictionary = {
  meta: {
    htmlLang: "th",
    title: "Media Planner Consultant Co., Ltd.",
    description:
      "พันธมิตรด้านสื่อและครีเอทีฟ ที่ช่วยธุรกิจคุณเติบโต — วางแผนสื่อ ผลิตครีเอทีฟ และดูแลคอนเทนต์ครบวงจร",
  },
  nav: {
    links: [
      { key: "home", label: "หน้าหลัก", href: "/" },
      { key: "about", label: "เกี่ยวกับเรา", href: "/about" },
      { key: "services", label: "บริการของเรา", href: "/services" },
      { key: "portfolio", label: "ผลงาน/ลูกค้า", href: "/portfolio" },
      { key: "news", label: "ข่าวสาร/กิจกรรม", href: "/news" },
      { key: "contact", label: "ติดต่อเรา", href: "/contact" },
    ],
    contactCta: "ติดต่อเรา",
    menuOpenLabel: "เปิดเมนู",
  },
  footer: {
    privacyPolicy: "Privacy Policy",
    sitemap: "Sitemap",
  },
  common: {
    home: "หน้าหลัก",
    viewAll: "ดูทั้งหมด →",
    all: "ทั้งหมด",
  },
  home: {
    badge: "MEDIA PLANNING & CREATIVE CONSULTANT",
    title: "พันธมิตรด้านสื่อและครีเอทีฟ ที่ช่วยธุรกิจคุณเติบโต",
    subtitle:
      "วางแผนสื่อ ผลิตครีเอทีฟ และดูแลคอนเทนต์ครบวงจร โดยทีมที่เข้าใจแบรนด์และผู้บริโภคไทย",
    ctaPrimary: "ดูผลงานของเรา",
    ctaSecondary: "ติดต่อทีมงาน",
    videoAlt: "วิดีโอแนะนำบริษัท",
    videoCaption: "วิดีโอแนะนำบริษัท",
    servicesTitle: "บริการของเรา",
    servicesSubtitle: "บริการหลักครบวงจรสำหรับแบรนด์ของคุณ",
    newsTitle: "ข่าวสาร/กิจกรรมล่าสุด",
    clientsLabel: "ลูกค้า/พันธมิตรของเรา",
    carousel: {
      prevLabel: "สไลด์ก่อนหน้า",
      nextLabel: "สไลด์ถัดไป",
      goToLabel: "ไปยังสไลด์ที่",
    },
  },
  about: {
    breadcrumb: "หน้าหลัก / เกี่ยวกับเรา",
    title: "เกี่ยวกับเรา",
    visionTitle: "วิสัยทัศน์",
    visionBody:
      "เป็นพันธมิตรด้านสื่อและครีเอทีฟอันดับต้นของประเทศไทย ที่ธุรกิจไว้วางใจในทุกการเติบโต",
    missionTitle: "พันธกิจ",
    missionBody:
      "วางแผนสื่อและผลิตคอนเทนต์ที่แม่นยำ วัดผลได้ ควบคู่ไปกับการดูแลลูกค้าอย่างใกล้ชิด",
    historyTitle: "ประวัติบริษัท",
    historyBody:
      "Media Planner Consultant ก่อตั้งขึ้นจากความตั้งใจให้ธุรกิจไทยเข้าถึงงานวางแผนสื่อและครีเอทีฟระดับมืออาชีพ ตลอดหลายปีที่ผ่านมาเราเติบโตพร้อมลูกค้าในหลากหลายอุตสาหกรรม ด้วยทีมงานที่เชี่ยวชาญเฉพาะด้าน",
    historyImageAlt: "บรรยากาศออฟฟิศ Media Planner Consultant",
    teamTitle: "แกลเลอรีภาพทีมงาน/บรรยากาศการทำงาน",
  },
  services: {
    listBreadcrumb: "หน้าหลัก / บริการของเรา",
    listTitle: "บริการของเรา",
    viewDetailLink: "ดูรายละเอียดบริการ →",
    detailBreadcrumbPrefix: "หน้าหลัก / บริการของเรา",
    highlightsTitle: "สิ่งที่คุณจะได้รับ",
    ctaButton: "ปรึกษาทีมงาน",
    relatedTitle: "บริการอื่นๆ ที่คุณอาจสนใจ",
  },
  portfolio: {
    breadcrumb: "หน้าหลัก / ผลงาน-ลูกค้า",
    title: "ผลงาน/ลูกค้า",
    filters: [{ key: "ALL", label: "ทั้งหมด" }],
    empty: "ยังไม่มีผลงานในหมวดนี้",
    relatedTitle: "ผลงานอื่นๆ ที่คุณอาจสนใจ",
    clientsLabel: "ลูกค้า/พันธมิตรของเรา",
    viewCaseStudy: "ดูรายละเอียดผลงาน →",
    clientDrawerEmpty: "ยังไม่มีผลงานที่เชื่อมโยงกับลูกค้ารายนี้",
    closeLabel: "ปิด",
  },
  news: {
    breadcrumb: "หน้าหลัก / ข่าวสาร-กิจกรรม",
    title: "ข่าวสาร/กิจกรรม",
    tabs: [
      { key: "articles", label: "บทความ/ข่าวสาร" },
      { key: "videos", label: "คลังวิดีโอ" },
      { key: "gallery", label: "คลังภาพกิจกรรม" },
    ],
    articlesLabel: "บทความ/ข่าวสาร",
    videosLabel: "คลังวิดีโอ",
    galleryLabel: "คลังภาพกิจกรรม",
    galleryImageAlt: "ภาพกิจกรรม",
    relatedTitle: "ข่าวสารอื่นๆ ที่คุณอาจสนใจ",
    searchPlaceholder: "ค้นหาข่าวสาร...",
    searchEmpty: "ไม่พบข่าวที่ค้นหา",
  },
  contact: {
    breadcrumb: "หน้าหลัก / ติดต่อเรา",
    title: "ติดต่อเรา",
    addressLabel: "ที่อยู่",
    phoneLabel: "โทรศัพท์",
    emailLabel: "อีเมล",
    socialLabel: "โซเชียล",
    mapLabel: "Google Map",
  },
  notFound: {
    title: "ไม่พบหน้าที่คุณต้องการ",
    description: "หน้าที่คุณกำลังค้นหาอาจถูกย้าย ลบไปแล้ว หรือไม่เคยมีอยู่จริง",
    homeButton: "กลับหน้าหลัก",
    contactButton: "ติดต่อเรา",
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
        alt: "ทีมงานวางแผนสื่อและครีเอทีฟ",
      },
      {
        type: "video",
        src: "/videos/hero-intro.mp4",
        poster: "https://picsum.photos/seed/hero-slide-video/1600/900",
        alt: "วิดีโอแนะนำบริษัท",
      },
      {
        type: "image",
        src: "https://picsum.photos/seed/hero-slide-studio/1600/900",
        alt: "เบื้องหลังงานถ่ายทำสตูดิโอ",
      },
      {
        type: "image",
        src: "https://picsum.photos/seed/hero-slide-event/1600/900",
        alt: "บรรยากาศงานอีเวนต์ของลูกค้า",
      },
    ],
    services: [
      {
        slug: "media-planning-buying",
        title: "Media Planning & Buying",
        summary: "วางแผนและซื้อสื่ออย่างมีประสิทธิภาพ",
        description:
          "วางแผนสื่อและซื้อสื่ออย่างมีกลยุทธ์ ครอบคลุมทีวี ดิจิทัล และสื่อนอกบ้าน พร้อมรายงานผลที่วัดผลได้จริง",
        gradient: "purpleBlue",
        icon: "target",
        image: "https://picsum.photos/seed/service-media-planning/640/480",
        highlights: [
          "วิเคราะห์กลุ่มเป้าหมายและพฤติกรรมผู้บริโภคเชิงลึก",
          "วางแผนสื่อครบทุกช่องทาง ทีวี ดิจิทัล และสื่อนอกบ้าน",
          "เจรจาต่อรองอัตราสื่ออย่างมีประสิทธิภาพ",
          "รายงานผลและวัดประสิทธิภาพแคมเปญแบบเรียลไทม์",
        ],
      },
      {
        slug: "digital-social-media",
        title: "Digital / Social Media",
        summary: "บริหารช่องทางดิจิทัลและโซเชียล",
        description:
          "บริหารช่องทางโซเชียลและแคมเปญดิจิทัลแบบครบวงจร ตั้งแต่กลยุทธ์ไปจนถึงการวัดผล",
        gradient: "blueCyan",
        icon: "network",
        image: "https://picsum.photos/seed/service-digital-social/640/480",
        highlights: [
          "วางกลยุทธ์คอนเทนต์ให้เหมาะกับแต่ละแพลตฟอร์ม",
          "บริหารโฆษณาบนโซเชียลมีเดียและเสิร์ชเอนจิน",
          "สร้างชุมชนและมีส่วนร่วมกับผู้ติดตาม",
          "วิเคราะห์และปรับแคมเปญตามผลลัพธ์จริง",
        ],
      },
      {
        slug: "creative-content-production",
        title: "Creative & Content Production",
        summary: "ผลิตครีเอทีฟและคอนเทนต์คุณภาพ",
        description:
          "ผลิตงานครีเอทีฟ วิดีโอ และคอนเทนต์คุณภาพสูง ที่สื่อสารตรงใจกลุ่มเป้าหมาย",
        gradient: "greenYellow",
        icon: "play",
        image: "https://picsum.photos/seed/service-creative-content/640/480",
        highlights: [
          "ผลิตวิดีโอโฆษณาและคอนเทนต์คุณภาพสูง",
          "ออกแบบกราฟิกและงานครีเอทีฟที่ตรงแบรนด์",
          "เขียนบทและกำกับการถ่ายทำครบวงจร",
          "ปรับคอนเทนต์ให้เหมาะกับแต่ละแพลตฟอร์ม",
        ],
      },
      {
        slug: "pr-event",
        title: "PR & Event",
        summary: "ประชาสัมพันธ์และจัดกิจกรรม",
        description:
          "วางแผนประชาสัมพันธ์และจัดกิจกรรมที่สร้างการรับรู้แบรนด์อย่างมีประสิทธิภาพ",
        gradient: "orangeRed",
        icon: "megaphone",
        image: "https://picsum.photos/seed/service-pr-event/640/480",
        highlights: [
          "วางแผนประชาสัมพันธ์และบริหารความสัมพันธ์สื่อ",
          "จัดกิจกรรมเปิดตัวสินค้าและงานอีเวนต์องค์กร",
          "บริหารจัดการภาวะวิกฤตด้านภาพลักษณ์",
          "วัดผลการรับรู้แบรนด์หลังกิจกรรม",
        ],
      },
    ],
    newsItems: [
      {
        slug: "new-client-campaign-launch",
        date: "12 มิ.ย. 2569",
        title: "งานเปิดตัวแคมเปญลูกค้าใหม่",
        image: "https://picsum.photos/seed/news-campaign-launch/640/400",
        excerpt:
          "Media Planner Consultant จัดงานเปิดตัวแคมเปญให้กับลูกค้ารายใหม่ พร้อมทีมงานครบวงจรตั้งแต่วางแผนสื่อจนถึงการผลิตครีเอทีฟ",
        body: [
          "เมื่อวันที่ 12 มิถุนายนที่ผ่านมา Media Planner Consultant ได้จัดงานเปิดตัวแคมเปญให้กับลูกค้ารายใหม่ในธุรกิจค้าปลีก โดยทีมงานได้ร่วมวางแผนตั้งแต่กลยุทธ์สื่อ การผลิตครีเอทีฟ ไปจนถึงการจัดงานอีเวนต์เปิดตัว",
          "งานนี้ได้รับความสนใจจากสื่อมวลชนและอินฟลูเอนเซอร์จำนวนมาก สะท้อนถึงความสำเร็จของการวางแผนสื่อแบบครบวงจรที่ทีมงานได้ออกแบบมาโดยเฉพาะสำหรับแบรนด์นี้",
          "Media Planner Consultant ยังคงมุ่งมั่นพัฒนาแนวทางการทำงานที่ผสานความคิดสร้างสรรค์เข้ากับข้อมูลเชิงลึก เพื่อสร้างผลลัพธ์ที่วัดผลได้จริงให้กับลูกค้าทุกราย",
        ],
      },
      {
        slug: "agency-of-the-year",
        date: "02 มิ.ย. 2569",
        title: "Media Planner คว้ารางวัลเอเจนซี่ยอดเยี่ยม",
        image: "https://picsum.photos/seed/news-agency-award/640/400",
        excerpt:
          "Media Planner Consultant ได้รับรางวัลเอเจนซี่ยอดเยี่ยมประจำปี ตอกย้ำความเป็นผู้นำด้านการวางแผนสื่อและครีเอทีฟ",
        body: [
          "Media Planner Consultant ได้รับการประกาศให้เป็นเอเจนซี่ยอดเยี่ยมประจำปี จากผลงานการวางแผนสื่อและครีเอทีฟที่โดดเด่นตลอดปีที่ผ่านมา",
          "รางวัลนี้สะท้อนถึงความมุ่งมั่นของทีมงานทุกคนในการสร้างสรรค์ผลงานที่มีคุณภาพ และการดูแลลูกค้าอย่างใกล้ชิดในทุกขั้นตอน",
          "บริษัทขอขอบคุณลูกค้าและพันธมิตรทุกท่านที่ให้ความไว้วางใจ และจะยังคงพัฒนาคุณภาพงานอย่างต่อเนื่องต่อไป",
        ],
      },
      {
        slug: "digital-media-trends-2026",
        date: "21 พ.ค. 2569",
        title: "อัปเดตเทรนด์สื่อดิจิทัลปี 2569",
        image: "https://picsum.photos/seed/news-digital-trends/640/400",
        excerpt:
          "รวมเทรนด์สื่อดิจิทัลที่น่าจับตามองในปี 2569 ที่แบรนด์ควรรู้เพื่อวางแผนการตลาดให้ทันยุค",
        body: [
          "ปี 2569 เทรนด์สื่อดิจิทัลยังคงเปลี่ยนแปลงอย่างรวดเร็ว ทั้งพฤติกรรมผู้บริโภคและเทคโนโลยีใหม่ๆ ที่เข้ามามีบทบาทต่อการวางแผนสื่อมากขึ้น",
          "คอนเทนต์วิดีโอสั้นยังคงเป็นรูปแบบที่ได้รับความนิยมสูงสุด ขณะที่การใช้ข้อมูลเชิงลึกเพื่อปรับแคมเปญแบบเรียลไทม์กลายเป็นมาตรฐานใหม่ของอุตสาหกรรม",
          "แบรนด์ที่ปรับตัวได้เร็วและกล้าทดลองช่องทางใหม่ๆ จะมีความได้เปรียบในการเข้าถึงกลุ่มเป้าหมายในยุคที่การแข่งขันด้านสื่อดิจิทัลเข้มข้นขึ้นทุกปี",
        ],
      },
    ],
    videoLibrary: [
      {
        slug: "video-1",
        title: "วิดีโอแนะนำบริษัท",
        image: "https://picsum.photos/seed/video-company-intro/640/360",
      },
      {
        slug: "video-2",
        title: "เบื้องหลังงานถ่ายทำแคมเปญ",
        image: "https://picsum.photos/seed/video-bts-campaign/640/360",
      },
      {
        slug: "video-3",
        title: "สัมภาษณ์ลูกค้า",
        image: "https://picsum.photos/seed/video-client-interview/640/360",
      },
    ],
    eventGallery: [
      "https://picsum.photos/seed/gallery-event-1/400/400",
      "https://picsum.photos/seed/gallery-event-2/400/400",
      "https://picsum.photos/seed/gallery-event-3/400/400",
      "https://picsum.photos/seed/gallery-event-4/400/400",
    ],
    portfolioItems: [
      {
        id: "retail-product-launch",
        clientId: "",
        title: "แคมเปญเปิดตัวสินค้าใหม่ — ธุรกิจค้าปลีก",
        image: "https://picsum.photos/seed/portfolio-retail-launch/500/375",
        images: ["https://picsum.photos/seed/portfolio-retail-launch/500/375"],
        client: "ธุรกิจค้าปลีกรายใหญ่",
        stats: [
          { label: "Reach", value: "2.4M+" },
          { label: "การเติบโตยอดขาย", value: "+32%" },
          { label: "ระยะเวลาแคมเปญ", value: "6 สัปดาห์" },
        ],
      },
      {
        id: "food-social-campaign",
        clientId: "",
        title: "แคมเปญโซเชียลมีเดีย — ธุรกิจอาหาร",
        image: "https://picsum.photos/seed/portfolio-food-social/500/375",
        images: ["https://picsum.photos/seed/portfolio-food-social/500/375"],
        client: "ธุรกิจอาหารและเครื่องดื่ม",
        stats: [
          { label: "Engagement Rate", value: "+58%" },
          { label: "ผู้ติดตามใหม่", value: "45K+" },
          { label: "ยอดสั่งซื้อออนไลน์", value: "+21%" },
        ],
      },
      {
        id: "finance-ad-video",
        clientId: "",
        title: "ผลิตวิดีโอโฆษณา — ธุรกิจการเงิน",
        image: "https://picsum.photos/seed/portfolio-finance-video/500/375",
        images: ["https://picsum.photos/seed/portfolio-finance-video/500/375"],
        client: "ธุรกิจการเงินและประกันภัย",
        stats: [
          { label: "ยอดรับชม", value: "1.8M+" },
          { label: "อัตราการดูจบ", value: "71%" },
          { label: "ยอดสมัครใช้บริการ", value: "+19%" },
        ],
      },
      {
        id: "real-estate-brand-launch",
        clientId: "",
        title: "งานเปิดตัวแบรนด์ — ธุรกิจอสังหาริมทรัพย์",
        image: "https://picsum.photos/seed/portfolio-realestate-launch/500/375",
        images: ["https://picsum.photos/seed/portfolio-realestate-launch/500/375"],
        client: "ธุรกิจอสังหาริมทรัพย์",
        stats: [
          { label: "สื่อมวลชนเข้าร่วม", value: "40+ ราย" },
          { label: "ยอดข่าวที่เผยแพร่", value: "60+ ชิ้น" },
          { label: "ยอดจองพรีเซล", value: "+25%" },
        ],
      },
      {
        id: "automotive-annual-plan",
        clientId: "",
        title: "แผนสื่อประจำปี — ธุรกิจยานยนต์",
        image: "https://picsum.photos/seed/portfolio-automotive-plan/500/375",
        images: ["https://picsum.photos/seed/portfolio-automotive-plan/500/375"],
        client: "ธุรกิจยานยนต์",
        stats: [
          { label: "งบประมาณที่บริหาร", value: "120M+ บาท" },
          { label: "จำนวนรุ่นที่เปิดตัว", value: "5 รุ่น" },
          { label: "Share of Voice", value: "อันดับ 2 ในกลุ่ม" },
        ],
      },
      {
        id: "beauty-content-series",
        clientId: "",
        title: "Content Series — ธุรกิจความงาม",
        image: "https://picsum.photos/seed/portfolio-beauty-series/500/375",
        images: ["https://picsum.photos/seed/portfolio-beauty-series/500/375"],
        client: "ธุรกิจความงามและเครื่องสำอาง",
        stats: [
          { label: "ตอนที่เผยแพร่", value: "24 ตอน" },
          { label: "ยอดชมรวม", value: "3.1M+" },
          { label: "ยอดขายออนไลน์", value: "+40%" },
        ],
      },
    ],
    clientLogos: [
      "Aurora Retail",
      "Sabai Foods",
      "NextGen Finance",
      "Bluewave Auto",
      "Glow Beauty Co.",
      "Metro Living",
    ],
    teamGallery: [
      { id: "team-1", image: "https://picsum.photos/seed/team-office-1/480/480", caption: "" },
      { id: "team-2", image: "https://picsum.photos/seed/team-office-2/480/480", caption: "" },
      { id: "team-3", image: "https://picsum.photos/seed/team-office-3/480/480", caption: "" },
      { id: "team-4", image: "https://picsum.photos/seed/team-office-4/480/480", caption: "" },
    ],
    contactInfo: {
      address:
        "123 อาคารมีเดีย ชั้น 8 ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110",
      phone: "02-123-4567",
      email: "contact@mediaplanner.co.th",
    },
    companyName: "Media Planner Consultant Co., Ltd.",
    copyrightYear: `${new Date().getFullYear()}`,
  },
};

export default th;
