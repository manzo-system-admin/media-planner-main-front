"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import MediaUploader from "@/components/admin/MediaUploader";
import VideoLinkInput from "@/components/admin/VideoLinkInput";
import type { VideoPopupDoc } from "@/lib/cms/homepage";
import type { VideoSource } from "@/lib/cms/types";
import formStyles from "../news/[id]/page.module.css";

const DOC_ID = "config";

type FormState = VideoPopupDoc;

const EMPTY: FormState = {
  videoSource: null,
  thumbnail: "",
  caption: { th: "", en: "" },
  orientation: "landscape",
};

export default function VideoPopupAdminPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone } | null>(null);

  useEffect(() => {
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "videoPopup", DOC_ID));
      if (snapshot.exists()) setForm({ ...EMPTY, ...(snapshot.data() as FormState) });
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(getFirebaseDb(), "videoPopup", DOC_ID), form);
      setAlert({ message: "บันทึกสำเร็จ", tone: "success" });
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "บันทึกไม่สำเร็จ", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>วิดีโอป๊อปอัป</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        การ์ดวิดีโอลากได้บนหน้าแรก — คลิกเพื่อเปิดวิดีโอแบบป๊อปอัป
      </p>

      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>ภาพปกการ์ด</label>
          <MediaUploader
            value={form.thumbnail}
            onChange={(url) => setForm({ ...form, thumbnail: url })}
            folder="video-popup"
            accept="image/*"
            label="อัปโหลดภาพปก"
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>แนววิดีโอ</label>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              onClick={() => setForm({ ...form, orientation: "landscape" })}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${form.orientation !== "portrait" ? "var(--grad-blue)" : "var(--border)"}`,
                background: form.orientation !== "portrait" ? "var(--grad-blue)" : "var(--surface)",
                color: form.orientation !== "portrait" ? "#fff" : "var(--text-body)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              แนวนอน (16:9)
            </button>
            <button
              type="button"
              onClick={() => setForm({ ...form, orientation: "portrait" })}
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: 8,
                border: `1px solid ${form.orientation === "portrait" ? "var(--grad-blue)" : "var(--border)"}`,
                background: form.orientation === "portrait" ? "var(--grad-blue)" : "var(--surface)",
                color: form.orientation === "portrait" ? "#fff" : "var(--text-body)",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              แนวตั้ง (9:16)
            </button>
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>วิดีโอ</label>
          <VideoLinkInput
            value={form.videoSource}
            onChange={(source: VideoSource | null) => setForm({ ...form, videoSource: source })}
            folder="video-popup"
          />
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>คำอธิบาย (ไทย)</span>
            <input
              className={formStyles.input}
              value={form.caption.th}
              onChange={(e) => setForm({ ...form, caption: { ...form.caption, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>คำอธิบาย (English)</span>
            <input
              className={formStyles.input}
              value={form.caption.en}
              onChange={(e) => setForm({ ...form, caption: { ...form.caption, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
        </div>
      </div>

      <AdminAlertModal
        open={!!alert}
        message={alert?.message ?? ""}
        tone={alert?.tone}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}
