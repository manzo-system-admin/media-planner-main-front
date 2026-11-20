const { loadEnvConfig } = require("@next/env");
const { cert, initializeApp } = require("firebase-admin/app");
const { FieldValue, getFirestore } = require("firebase-admin/firestore");

const batchName = "doc-import-20261102";
const items = [
  { videoId: "yhjxthe3Ivk", date: "2026-10-19", title: '"เควิน วอร์ช" สัญญาณต่อทิศทางทอง ? I TNN รู้ทันลงทุน 19-10-69' },
  { videoId: "4V3rGqNWcZo", date: "2026-10-12", title: '"WHA" ชูโอกาสไทยในเวที IMF–World Bank | TNN ชั่วโมงทำเงิน | 12-10-2026' },
  { videoId: "zXakt0Nf01E", date: "2026-10-07", title: "MGC งบ Q3 กำไรพุ่ง 30% ราคาเป้าหมาย 20.20 บาท" },
  { videoId: "6Jp9JuWVA8I", date: "2026-10-07", title: "WHA เด่นนำกลุ่ม อานิสงส์เขตเศรษฐกิจพิเศษ I TNN รู้ทันลงทุน 07-10-69" },
  { videoId: "hx_ifsxT57g", date: "2026-10-01", title: "ไทยต้องเตรียมความพร้อมรับคลื่นการลงทุนใหม่ | #นาทีลงทุน 1 ต.ค.69" },
  { videoId: "qlEEsocTFic", date: "2026-08-18", title: "MGC รายได้ปีนี้ 25,000 ล้านบาท เปิดตัว XPENG L03 วันนี้" },
  { videoId: "gV-ZSWhfNPY", date: "2026-09-18", title: "นับหนึ่งกับ REIT ลงทุนอสังหาฯ ยังไง ให้เงินไหลเข้าพอร์ตสม่ำเสมอ? | New Gen Investor EP.121" },
  { videoId: "oMBPZtofmGU", date: "2026-09-17", title: "WHART เพิ่มทุนรอบใหม่ พอร์ตโต 56,000 ล้าน แต่ผู้ถือหน่วยได้อะไร?" },
  { videoId: "YdKhK16AHVI", date: "2026-09-15", title: '"WHART" เพิ่มทุน เติมศักยภาพพอร์ตครั้งใหญ่ | TNN ชั่วโมงทำเงิน | 15-09-2026' },
  { videoId: "O48utFhhcoM", date: "2026-09-11", title: "WHART ขยายพอร์ตลงทุน WGCL สัญญาเช่า 30 ปีดันสินทรัพย์ทะลุ 5.6 หมื่นล้านบาท| 11 ก.ย. 69 | Money Daily" },
  { videoId: "B6AyRXmUIWE", date: "2026-08-14", title: "MGC กำไร 352 ล้านบาท ยอดโอน EV แรง-Alpha X เติบโตกระโดด.!" },
  { videoId: "635pDv_2yTs", date: "2026-08-11", title: '("GGC" ฟื้นแกร่ง พลิกกำไร – ตุนเงินสดแน่น – นาทีที่ 6.20)' },
  { videoId: "k9StB3KhiWM", date: "2026-08-11", title: "(WHA กำไรครึ่งปี 2,167 ล้าน เงินลงทุนหนุน)" },
  { videoId: "bkrB6NqbwtA", date: "2026-08-10", title: "เปิดสูตรสำเร็จ MGC สู่ผู้นำ Mobility Ecosystem แสนล้าน" },
];

function requiredEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

async function main() {
  loadEnvConfig(process.cwd());
  const app = initializeApp({
    credential: cert({
      projectId: requiredEnv("FIREBASE_PROJECT_ID"),
      clientEmail: requiredEnv("FIREBASE_CLIENT_EMAIL"),
      privateKey: requiredEnv("FIREBASE_PRIVATE_KEY").replace(/\\n/g, "\n"),
    }),
    storageBucket: requiredEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  });
  const db = getFirestore(app);
  const collection = db.collection("videoLibrary");
  const snapshot = await collection.get();
  const all = snapshot.docs.map((doc) => ({ ref: doc.ref, data: doc.data() }));
  let nextOrder = all.reduce((max, item) => Math.max(max, Number(item.data.order) || 0), -1) + 1;

  for (const [index, item] of items.entries()) {
    const matches = all.filter((record) => record.data.videoSource?.videoId === item.videoId);
    const activeMatch = matches.find((record) => !record.data.deleted);
    const record = activeMatch ?? matches[0];
    const data = {
      title: item.title,
      date: item.date,
      thumbnail: `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
      videoSource: { kind: "youtube", videoId: item.videoId },
      order: record ? (record.data.order ?? nextOrder) : nextOrder++,
      deleted: false,
    };

    if (activeMatch) {
      console.log(`Already present: ${item.videoId} | ${item.title}`);
      continue;
    }

    if (record) {
      await db.runTransaction(async (tx) => {
        const current = await tx.get(record.ref);
        if (current.data()?.videoSource?.videoId !== item.videoId) {
          throw new Error(`Record changed during import: ${record.ref.id}`);
        }
        tx.update(record.ref, { ...data, deletedAt: FieldValue.delete() });
      });
      console.log(`Restored: ${record.ref.id} | ${item.title}`);
    } else {
      const ref = collection.doc(`${batchName}-${String(index + 1).padStart(3, "0")}`);
      await db.runTransaction(async (tx) => {
        const current = await tx.get(ref);
        if (current.exists) {
          if (current.data()?.videoSource?.videoId !== item.videoId) {
            throw new Error(`Import ID already belongs to another video: ${ref.id}`);
          }
          if (!current.data()?.deleted) return;
          tx.update(ref, { ...data, deletedAt: FieldValue.delete() });
          return;
        }
        tx.create(ref, data);
      });
      all.push({ ref, data });
      console.log(`Imported: ${ref.id} | ${item.title}`);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
