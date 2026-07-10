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
    langSwitchLabel: "English",
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
    teamTitle: "โครงสร้าง/ทีมผู้บริหาร",
    awardsTitle: "รางวัล/การรับรอง",
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
    filters: [
      { key: "ALL", label: "ทั้งหมด" },
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
    empty: "ยังไม่มีผลงานในหมวดนี้",
    clientLabel: "ลูกค้า",
    challengeLabel: "โจทย์",
    approachLabel: "แนวทางการทำงาน",
    resultLabel: "ผลลัพธ์",
    relatedTitle: "ผลงานอื่นๆ ที่คุณอาจสนใจ",
    clientsLabel: "ลูกค้า/พันธมิตรของเรา",
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
  chat: {
    openLabel: "เปิดหน้าต่างแชท",
    closeLabel: "ปิดหน้าต่างแชท",
    title: "Media Planner Consultant",
    status: "ออนไลน์ — ตอบกลับภายในไม่กี่นาที",
    welcome: "สวัสดีค่ะ 👋 ยินดีต้อนรับสู่ Media Planner Consultant มีอะไรให้เราช่วยไหมคะ?",
    autoReply: "ขอบคุณสำหรับข้อความค่ะ ทีมงานได้รับเรื่องแล้ว และจะติดต่อกลับโดยเร็วที่สุดค่ะ",
    placeholder: "พิมพ์ข้อความ...",
    sendLabel: "ส่งข้อความ",
    preChatTitle: "เริ่มแชทกับเรา",
    preChatDescription: "กรอกชื่อและอีเมลก่อนเริ่มแชท เพื่อให้ทีมงานติดต่อกลับได้",
    nameLabel: "ชื่อ",
    namePlaceholder: "ชื่อของคุณ",
    emailLabel: "อีเมล",
    emailPlaceholder: "you@example.com",
    startButton: "เริ่มแชท",
    editContactLabel: "เปลี่ยนชื่อ/อีเมล",
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
        slug: "retail-product-launch",
        category: "MEDIA_PLANNING",
        title: "แคมเปญเปิดตัวสินค้าใหม่ — ธุรกิจค้าปลีก",
        image: "https://picsum.photos/seed/portfolio-retail-launch/500/375",
        client: "ธุรกิจค้าปลีกรายใหญ่",
        challenge:
          "ลูกค้าต้องการเปิดตัวสินค้าใหม่ในตลาดที่มีคู่แข่งหนาแน่น และต้องการสร้างการรับรู้อย่างรวดเร็วในงบประมาณที่จำกัด",
        approach:
          "วางแผนสื่อแบบผสมผสานระหว่างทีวี ดิจิทัล และสื่อนอกบ้าน โดยเน้นช่วงเวลาที่กลุ่มเป้าหมายมีการรับสื่อสูงสุด พร้อมเจรจาต่อรองอัตราสื่อให้คุ้มค่าที่สุด",
        result:
          "แคมเปญสร้างการรับรู้แบรนด์เพิ่มขึ้นอย่างมีนัยสำคัญ และยอดขายสินค้าใหม่เติบโตเกินเป้าหมายภายในไตรมาสแรก",
        stats: [
          { label: "Reach", value: "2.4M+" },
          { label: "การเติบโตยอดขาย", value: "+32%" },
          { label: "ระยะเวลาแคมเปญ", value: "6 สัปดาห์" },
        ],
      },
      {
        slug: "food-social-campaign",
        category: "DIGITAL",
        title: "แคมเปญโซเชียลมีเดีย — ธุรกิจอาหาร",
        image: "https://picsum.photos/seed/portfolio-food-social/500/375",
        client: "ธุรกิจอาหารและเครื่องดื่ม",
        challenge:
          "แบรนด์อาหารต้องการเข้าถึงกลุ่มคนรุ่นใหม่ผ่านช่องทางโซเชียลมีเดีย แต่ขาดคอนเทนต์ที่โดนใจและกลยุทธ์ที่ชัดเจน",
        approach:
          "ออกแบบคอนเทนต์ซีรีส์ที่เล่าเรื่องผ่านอินฟลูเอนเซอร์ ควบคู่กับแคมเปญโฆษณาบนโซเชียลมีเดียที่เจาะกลุ่มเป้าหมายอย่างแม่นยำ",
        result:
          "ยอดผู้ติดตามเพิ่มขึ้นต่อเนื่อง อัตราการมีส่วนร่วมสูงกว่าค่าเฉลี่ยอุตสาหกรรม และมียอดสั่งซื้อผ่านช่องทางออนไลน์เพิ่มขึ้น",
        stats: [
          { label: "Engagement Rate", value: "+58%" },
          { label: "ผู้ติดตามใหม่", value: "45K+" },
          { label: "ยอดสั่งซื้อออนไลน์", value: "+21%" },
        ],
      },
      {
        slug: "finance-ad-video",
        category: "CREATIVE",
        title: "ผลิตวิดีโอโฆษณา — ธุรกิจการเงิน",
        image: "https://picsum.photos/seed/portfolio-finance-video/500/375",
        client: "ธุรกิจการเงินและประกันภัย",
        challenge:
          "ผลิตภัณฑ์ทางการเงินมีความซับซ้อน ลูกค้าต้องการสื่อสารให้เข้าใจง่ายและน่าเชื่อถือในเวลาอันสั้น",
        approach:
          "พัฒนาบทและผลิตวิดีโอโฆษณาที่เล่าเรื่องผ่านสถานการณ์ในชีวิตจริง ใช้ภาษาที่เข้าใจง่าย พร้อมงานโพสต์โปรดักชันคุณภาพสูง",
        result:
          "วิดีโอได้รับการเผยแพร่ทั้งบนทีวีและออนไลน์ ช่วยเพิ่มความเข้าใจในผลิตภัณฑ์และยอดสมัครใช้บริการ",
        stats: [
          { label: "ยอดรับชม", value: "1.8M+" },
          { label: "อัตราการดูจบ", value: "71%" },
          { label: "ยอดสมัครใช้บริการ", value: "+19%" },
        ],
      },
      {
        slug: "real-estate-brand-launch",
        category: "PR_EVENT",
        title: "งานเปิดตัวแบรนด์ — ธุรกิจอสังหาริมทรัพย์",
        image: "https://picsum.photos/seed/portfolio-realestate-launch/500/375",
        client: "ธุรกิจอสังหาริมทรัพย์",
        challenge:
          "โครงการอสังหาริมทรัพย์ใหม่ต้องการสร้างการรับรู้และความน่าเชื่อถือให้กับกลุ่มลูกค้าระดับบนตั้งแต่วันเปิดตัว",
        approach:
          "จัดงานเปิดตัวแบรนด์ร่วมกับสื่อมวลชนและอินฟลูเอนเซอร์สายอสังหาริมทรัพย์ ควบคู่กับแผนประชาสัมพันธ์ต่อเนื่องหลังงาน",
        result:
          "งานเปิดตัวได้รับความสนใจจากสื่อจำนวนมาก และสร้างยอดจองห้องชุดตั้งแต่ช่วงพรีเซล",
        stats: [
          { label: "สื่อมวลชนเข้าร่วม", value: "40+ ราย" },
          { label: "ยอดข่าวที่เผยแพร่", value: "60+ ชิ้น" },
          { label: "ยอดจองพรีเซล", value: "+25%" },
        ],
      },
      {
        slug: "automotive-annual-plan",
        category: "MEDIA_PLANNING",
        title: "แผนสื่อประจำปี — ธุรกิจยานยนต์",
        image: "https://picsum.photos/seed/portfolio-automotive-plan/500/375",
        client: "ธุรกิจยานยนต์",
        challenge:
          "แบรนด์รถยนต์ต้องการแผนสื่อประจำปีที่ครอบคลุมทุกไตรมาส และรองรับการเปิดตัวรุ่นใหม่หลายรุ่นตลอดปี",
        approach:
          "วางแผนงบประมาณสื่อรายไตรมาส จัดสรรสัดส่วนสื่อตามช่วงเวลาเปิดตัวสินค้า และติดตามผลอย่างต่อเนื่องเพื่อปรับแผนให้เหมาะสม",
        result:
          "แบรนด์รักษาส่วนแบ่งการรับรู้ในตลาดได้อย่างสม่ำเสมอตลอดทั้งปี และควบคุมงบประมาณสื่อได้อย่างมีประสิทธิภาพ",
        stats: [
          { label: "งบประมาณที่บริหาร", value: "120M+ บาท" },
          { label: "จำนวนรุ่นที่เปิดตัว", value: "5 รุ่น" },
          { label: "Share of Voice", value: "อันดับ 2 ในกลุ่ม" },
        ],
      },
      {
        slug: "beauty-content-series",
        category: "DIGITAL",
        title: "Content Series — ธุรกิจความงาม",
        image: "https://picsum.photos/seed/portfolio-beauty-series/500/375",
        client: "ธุรกิจความงามและเครื่องสำอาง",
        challenge:
          "แบรนด์ความงามต้องการคอนเทนต์ต่อเนื่องที่สร้างการมีส่วนร่วมและกระตุ้นยอดขายในช่องทางออนไลน์",
        approach:
          "ผลิตคอนเทนต์ซีรีส์รายสัปดาห์ที่ให้ความรู้ด้านความงามควบคู่กับการแนะนำสินค้า ผสานกับแคมเปญโปรโมชันตามเทศกาล",
        result:
          "คอนเทนต์ซีรีส์สร้างฐานผู้ติดตามที่เหนียวแน่น และมียอดขายผ่านช่องทางออนไลน์เพิ่มขึ้นต่อเนื่องตลอดแคมเปญ",
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
    teamMembers: [
      {
        name: "ชื่อ-นามสกุล",
        role: "ประธานเจ้าหน้าที่บริหาร",
        avatar: "https://i.pravatar.cc/300?img=12",
      },
      {
        name: "ชื่อ-นามสกุล",
        role: "ผู้อำนวยการฝ่ายวางแผนสื่อ",
        avatar: "https://i.pravatar.cc/300?img=45",
      },
      {
        name: "ชื่อ-นามสกุล",
        role: "ผู้อำนวยการฝ่ายครีเอทีฟ",
        avatar: "https://i.pravatar.cc/300?img=32",
      },
      {
        name: "ชื่อ-นามสกุล",
        role: "ผู้จัดการฝ่ายลูกค้าสัมพันธ์",
        avatar: "https://i.pravatar.cc/300?img=68",
      },
    ],
    awards: [
      "Agency of the Year 2568",
      "Best Digital Campaign",
      "Creative Excellence Award",
      "ISO 9001 Certified",
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
