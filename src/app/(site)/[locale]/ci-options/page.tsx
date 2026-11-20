import type { Metadata } from "next";
import Image from "next/image";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "แนวทาง CI เว็บไซต์ | Media Planner",                                                 
  description: "ตัวเลือก Mood & Tone เว็บไซต์ Media Planner 6 แนวทาง สำหรับพิจารณาร่วมกัน",
  robots: { index: false, follow: false },
};

const options = [
  {
    id: "a",
    number: "01",
    name: "Calm Editorial",
    thai: "เรียบ น่าเชื่อถือ อ่านสบาย",
    mood: "สุขุม · เป็นมืออาชีพ · โปร่ง",
    description: "ใช้น้ำเงินกรมจากตัวอักษรโลโก้เป็นแกน แล้วดึงฟ้าและชมพูม่วงจากริบบิ้นมาแบ่งหน้าที่: ฟ้าใช้กับปุ่มและข้อความสำคัญ ส่วนชมพูม่วงใช้แตะในกราฟิกเล็ก ๆ ภาพรวมยังโปร่งและอ่านสบาย",
    palette: [
      ["Ivory", "#F7F5F0"], ["Logo Navy", "#1C1A4B"], ["Logo Blue", "#398BC2"], ["Ribbon Mauve", "#B34F91"], ["Ribbon Green", "#579A62"],
    ],
    typography: "Kanit Medium + Noto Sans Thai",
    image: "ภาพงานจริงแบบครอปกว้าง แสงธรรมชาติ สีไม่จัด",
    note: "ตัวเลือกแนะนำ หากคำหลักคือ “ดูสบายตา”",
  },
  {
    id: "b",
    number: "02",
    name: "Clear Perspective",
    thai: "ทันสมัย ชัดเจน คล่องตัว",
    mood: "คมชัด · สดใหม่ · เชื่อมโยงข้อมูล",
    description: "น้ำเงินกรมช่วยคุมความน่าเชื่อถือ ขณะที่เขียวเป็นสีหลักของปุ่มและตัวเลขข้อมูล ฟ้าใช้กับเส้นกริดและสถานะรอง ทำให้สีจากริบบิ้นทำงานร่วมกับภาพลักษณ์ที่ปรึกษาสายวิเคราะห์",
    palette: [
      ["Mist", "#F2F7F7"], ["Logo Navy", "#1C1A4B"], ["Logo Green", "#3A9D50"], ["Logo Blue", "#398BC2"], ["Ribbon Yellow", "#D7B945"],
    ],
    typography: "Kanit Semibold + Noto Sans Thai",
    image: "ภาพทีมทำงานและข้อมูล ใช้โทนเย็นสว่าง",
    note: "เหมาะถ้าอยากให้แบรนด์ดูร่วมสมัยขึ้น",
  },
  {
    id: "c",
    number: "03",
    name: "Warm Momentum",
    thai: "เป็นกันเอง มีพลัง แต่ไม่ลายตา",
    mood: "อบอุ่น · สร้างสรรค์ · เข้าถึงง่าย",
    description: "พื้นครีมจับคู่กับส้มจากริบบิ้นเพื่อสร้างความอบอุ่น น้ำเงินกรมล็อกภาพให้เป็นมืออาชีพ ส่วนแดงปะการังใช้เฉพาะจุดเรียกสายตา เหมาะกับงาน PR, Event และ Production ที่ต้องการพลังของผู้คน",
    palette: [
      ["Cream", "#FBF4EA"], ["Logo Navy", "#1C1A4B"], ["Ribbon Orange", "#E78335"], ["Ribbon Red", "#CD3544"], ["Ribbon Gold", "#D9B64D"],
    ],
    typography: "Kanit Medium + Noto Sans Thai",
    image: "ภาพเบื้องหลังงาน ผู้คน และโมเมนต์จริง",
    note: "เหมาะถ้าอยากให้เว็บไซต์มีบุคลิกและความอบอุ่น",
  },
  {
    id: "d",
    number: "04",
    name: "Midnight Clarity",
    thai: "เข้ม สงบ สบายตา",
    mood: "ลุ่มลึก · สุขุม · มีมิติ",
    description: "พื้นมิดไนต์ลดแสงจ้า ใช้ฟ้าจากริบบิ้นเป็นสีปุ่มและลิงก์ เติมม่วงหม่นบนวงกราฟิก และใช้ส้มอุ่นเป็นจุดนำสายตา โดยมีน้ำเงินกรมจากโลโก้ช่วยเชื่อมทุกเฉด",
    palette: [
      ["Midnight", "#111922"], ["Logo White", "#F4F3F7"], ["Ribbon Blue", "#68A8D2"], ["Ribbon Mauve", "#B968A8"], ["Ribbon Orange", "#E8914D"],
    ],
    typography: "Kanit Medium + Noto Sans Thai สีขาวนวล",
    image: "ภาพมีแสงและจุดโฟกัสชัด คุมโทนให้อ่านรายละเอียดได้",
    note: "พื้นเข้มดูสบายตาได้ เมื่อมีคอนทราสต์และจังหวะพักที่พอดี",
  },
  {
    id: "e",
    number: "05",
    name: "Carbon & Amber",
    thai: "ชาร์โคล สุขุม แต้มอำพัน",
    mood: "พรีเมียม · มั่นใจ · มีน้ำหนัก",
    description: "ชาร์โคลเป็นพื้นหลัก ใช้ทองอำพันกับปุ่มและตัวเลขสำคัญ เติมส้มเป็นเส้นกราฟิก และแดงเป็นจุดเล็ก ๆ ที่ชวนมอง สีสดจึงมีจังหวะ แต่ไม่แย่งความสงบของพื้นมืด",
    palette: [
      ["Carbon", "#191A1C"], ["Logo White", "#F4F3F7"], ["Ribbon Gold", "#D8B75B"], ["Ribbon Orange", "#E78335"], ["Ribbon Red", "#CD5260"],
    ],
    typography: "Kanit Medium + Noto Sans Thai สีขาวนวล",
    image: "ภาพคอนทราสต์ชัด แสงอุ่น ใช้สีทองในรายละเอียดเล็กน้อย",
    note: "เหมาะกับภาพลักษณ์องค์กรที่ต้องการความหนักแน่นและพรีเมียม",
  },
  {
    id: "f",
    number: "06",
    name: "Deep Forest",
    thai: "เขียวป่าลึก สงบ เป็นธรรมชาติ",
    mood: "นิ่ง · สมดุล · แตกต่างอย่างนุ่มนวล",
    description: "เขียวจากริบบิ้นเป็นสีหลักของปุ่มและเส้นกราฟิก ฟ้าช่วยเปิดพื้นที่ภาพ ส่วนมิ้นต์หม่นใช้กับข้อความรองและจุดข้อมูล ทำให้ทิศทางธรรมชาติยังมีที่มาจากโลโก้ชัดเจน",
    palette: [
      ["Forest", "#14211D"], ["Logo White", "#F4F3F7"], ["Ribbon Green", "#6BAF70"], ["Ribbon Blue", "#5AA7DF"], ["Soft Mint", "#B7D4BD"],
    ],
    typography: "Kanit Medium + Noto Sans Thai สีงาช้าง",
    image: "ภาพคนและสถานที่จริง โทนธรรมชาติ แสงนุ่ม",
    note: "เหมาะถ้าอยากได้พื้นมืดที่ดูผ่อนคลายและมีบุคลิกเฉพาะตัว",
  },
] as const;

export default function CiOptionsPage() {
  return (
    <div className={styles.page} data-ci-options>
      <div className={styles.intro}>
        <div className={styles.introTop}><span>MEDIA PLANNER</span><span>WEBSITE IDENTITY EXPLORATION / 2026</span></div>
        <p className={styles.kicker}>MOOD & TONE DIRECTIONS</p>
        <h1>6 แนวทางสำหรับ<br /><em>ภาพรวมเว็บไซต์</em>ที่ดูสบายตา</h1>
        <p className={styles.introText}>ลองเทียบ 3 โทนสว่าง กับ 3 เฉดมืดที่ใช้น้ำเงิน ชาร์โคล และเขียวป่า จากเนื้อหาเดียวกัน</p>
        <nav className={styles.jump} aria-label="เลือกดูแนวทาง">
          {options.map((option) => <a key={option.id} href={`#direction-${option.id}`}><span>{option.number}</span>{option.name}<span aria-hidden="true">↗</span></a>)}
        </nav>
      </div>

      <div className={styles.directions}>
        {options.map((option) => (
          <section className={`${styles.direction} ${styles[option.id]}`} id={`direction-${option.id}`} key={option.id}>
            <div className={styles.heading}>
              <div><span className={styles.optionLabel}>DIRECTION {option.number} / 06</span><h2>{option.name}</h2><p className={styles.thaiName}>{option.thai}</p></div>
              <p className={styles.mood}>{option.mood}</p>
            </div>

            <div className={styles.mockup} aria-label={`ตัวอย่างหน้าหลักแนวทาง ${option.name}`}>
              <div className={styles.mockNav}>
                <Image src={option.id === "d" || option.id === "e" || option.id === "f" ? "/images/logo-white.svg" : "/images/ci-logo.svg"} alt="Media Planner Consultant" width={196} height={98} className={styles.mockLogo} unoptimized />
                <div className={styles.mockLinks}><span>เกี่ยวกับเรา</span><span>บริการ</span><span>ผลงาน</span><span className={styles.mockContact}>ติดต่อเรา ↗</span></div>
              </div>
              <div className={styles.hero}>
                <div className={styles.heroCopy}>
                  <p className={styles.heroEyebrow}>STRATEGY · STORY · IMPACT</p>
                  <h3>ทุกเรื่องราว<br />มีโอกาส<span>เติบโต</span></h3>
                  <p className={styles.heroDescription}>เราเชื่อมกลยุทธ์การสื่อสารกับเรื่องราวขององค์กร เพื่อสร้างความเชื่อมั่นและขับเคลื่อนธุรกิจไปข้างหน้า</p>
                  <span className={styles.heroButton}>สำรวจบริการของเรา <b aria-hidden="true">↗</b></span>
                </div>
                <div className={styles.heroArt} aria-hidden="true">
                  <div className={styles.artFrame}>
                    <div className={styles.artCircle} />
                    <div className={styles.artArc} />
                    <div className={styles.artLine} />
                    <div className={styles.artCard}><span>01 / INSIGHT</span><strong>Ideas made<br />meaningful.</strong><i>↗</i></div>
                    <div className={styles.artDot} />
                  </div>
                  <span className={styles.artCaption}>WHERE CLARITY MEETS POSSIBILITY</span>
                </div>
              </div>
              <div className={styles.mockBottom}><span>01 / OUR EXPERTISE</span><strong>ครบทุกมิติของการสื่อสาร</strong><span>IR &nbsp; / &nbsp; PR &nbsp; / &nbsp; DIGITAL &nbsp; / &nbsp; PRODUCTION</span></div>
            </div>

            <div className={styles.details}>
              <div className={styles.explanation}><span className={styles.detailLabel}>แนวคิด</span><p>{option.description}</p><strong>{option.note}</strong></div>
              <div className={styles.palette}><span className={styles.detailLabel}>COLOR PALETTE / บทบาทสี</span><div className={styles.swatches}>{option.palette.map(([name, color]) => <div key={name}><span className={styles.swatch} style={{ background: color }} /><b>{name}</b><small>{color}</small></div>)}</div></div>
              <div className={styles.usage}><span className={styles.detailLabel}>การใช้งานจริง</span><p><b>ตัวอักษร</b> {option.typography}</p><p><b>ภาพ</b> {option.image}</p></div>
            </div>
          </section>
        ))}
      </div>
      <div className={styles.outro}><span>THE NEXT STEP</span><h2>เลือกแนวที่ใช่ แล้วค่อยจูนรายละเอียด</h2><p>สีและองค์ประกอบในหน้านี้เป็นตัวอย่างทิศทางเบื้องต้น สามารถหยิบส่วนที่ชอบจากแต่ละแบบมาผสมกันได้</p></div>
    </div>
  );
}
