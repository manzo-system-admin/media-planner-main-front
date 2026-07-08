import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getAdminDb } from "@/lib/firebase/admin";
import { getFaqList } from "@/lib/cms/faq";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { FieldValue } from "firebase-admin/firestore";

const SYSTEM_PREAMBLE_TH = `คุณเป็นผู้ช่วยตอบคำถามของ Media Planner Consultant Co., Ltd. บริษัทที่ปรึกษาด้านวางแผนสื่อและครีเอทีฟ
ตอบโดยอ้างอิงจากคำถาม-คำตอบที่พบบ่อย (FAQ) ด้านล่างนี้เท่านั้น ตอบสั้น กระชับ เป็นกันเอง
ถ้าคำถามของผู้ใช้ไม่มีข้อมูลอยู่ใน FAQ ให้ตอบว่าทีมงานจะติดต่อกลับโดยเร็ว อย่าเดาคำตอบเอง`;

const SYSTEM_PREAMBLE_EN = `You are a support assistant for Media Planner Consultant Co., Ltd., a media planning and creative consultancy.
Answer using ONLY the FAQ context below. Keep answers short and friendly.
If the user's question isn't covered by the FAQ, say a team member will follow up shortly — do not guess.`;

function buildPrompt(
  locale: "th" | "en",
  faqs: { question: string; answer: string }[],
  history: { from: string; text: string }[],
  message: string
): string {
  const preamble = locale === "en" ? SYSTEM_PREAMBLE_EN : SYSTEM_PREAMBLE_TH;
  const faqBlock = faqs.map((f, i) => `${i + 1}. Q: ${f.question}\n   A: ${f.answer}`).join("\n");
  const historyBlock = history.slice(-6).map((m) => `${m.from}: ${m.text}`).join("\n");
  return `${preamble}\n\nFAQ:\n${faqBlock || "(no FAQ entries yet)"}\n\nConversation so far:\n${historyBlock}\n\nuser: ${message}\nassistant:`;
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    conversationId,
    visitorUid,
    message,
    locale: rawLocale,
    visitorName,
    visitorEmail,
  } = body ?? {};

  if (!conversationId || !visitorUid || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;

  const conversationRef = getAdminDb().collection("chatConversations").doc(conversationId);
  const conversationSnap = await conversationRef.get();

  if (!conversationSnap.exists) {
    await conversationRef.set({
      visitorUid,
      visitorName: typeof visitorName === "string" ? visitorName : "",
      visitorEmail: typeof visitorEmail === "string" ? visitorEmail : "",
      locale,
      botEnabled: true,
      createdAt: FieldValue.serverTimestamp(),
      lastMessageAt: FieldValue.serverTimestamp(),
    });
  }

  const messagesRef = conversationRef.collection("messages");
  await messagesRef.add({
    from: "user",
    text: message.trim(),
    createdAt: FieldValue.serverTimestamp(),
  });
  await conversationRef.update({ lastMessageAt: FieldValue.serverTimestamp() });

  const botEnabled = conversationSnap.exists ? conversationSnap.data()?.botEnabled !== false : true;
  if (!botEnabled) {
    return NextResponse.json({ ok: true, botReplied: false });
  }

  try {
    const [faqs, historySnap] = await Promise.all([
      getFaqList(locale),
      messagesRef.orderBy("createdAt", "desc").limit(6).get(),
    ]);
    const history = historySnap.docs.reverse().map((d) => d.data() as { from: string; text: string });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("GEMINI_API_KEY not configured");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = buildPrompt(locale, faqs, history, message.trim());
    const result = await model.generateContent(prompt);
    const replyText = result.response.text().trim();

    await messagesRef.add({
      from: "bot",
      text: replyText,
      createdAt: FieldValue.serverTimestamp(),
    });
    await conversationRef.update({ lastMessageAt: FieldValue.serverTimestamp() });

    return NextResponse.json({ ok: true, botReplied: true, reply: replyText });
  } catch (err) {
    // Don't fail the visitor's message just because the bot couldn't reply —
    // a human can still see it in the Backoffice inbox.
    console.error("Chat bot reply failed:", err);
    return NextResponse.json({ ok: true, botReplied: false });
  }
}
