"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import MediaUploader from "@/components/admin/MediaUploader";
import type { AboutContentDoc } from "@/lib/cms/about";
import formStyles from "../news/[id]/page.module.css";

const DOC_ID = "config";

type FormState = AboutContentDoc;

const EMPTY: FormState = {
  visionBody: { th: "", en: "" },
  missionBody: { th: "", en: "" },
  historyBody: { th: "", en: "" },
  historyImage: "",
};

export default function AboutContentAdminPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone } | null>(null);

  useEffect(() => {
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "aboutContent", DOC_ID));
      if (snapshot.exists()) setForm({ ...EMPTY, ...(snapshot.data() as FormState) });
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(getFirebaseDb(), "aboutContent", DOC_ID), form);
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
      <h1 className={formStyles.title}>หน้าเกี่ยวกับเรา</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        เนื้อหาวิสัยทัศน์ พันธกิจ และประวัติบริษัท ในหน้า &quot;เกี่ยวกับเรา&quot; (ทีมงานและรางวัลตั้งค่าแยกในเมนู
        &quot;ทีมงาน&quot; และ &quot;รางวัล&quot;)
      </p>

      <div className={formStyles.form}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>วิสัยทัศน์ (ไทย)</span>
            <textarea
              className={formStyles.input}
              rows={4}
              value={form.visionBody.th}
              onChange={(e) => setForm({ ...form, visionBody: { ...form.visionBody, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>วิสัยทัศน์ (English)</span>
            <textarea
              className={formStyles.input}
              rows={4}
              value={form.visionBody.en}
              onChange={(e) => setForm({ ...form, visionBody: { ...form.visionBody, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>พันธกิจ (ไทย)</span>
            <textarea
              className={formStyles.input}
              rows={4}
              value={form.missionBody.th}
              onChange={(e) => setForm({ ...form, missionBody: { ...form.missionBody, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>พันธกิจ (English)</span>
            <textarea
              className={formStyles.input}
              rows={4}
              value={form.missionBody.en}
              onChange={(e) => setForm({ ...form, missionBody: { ...form.missionBody, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>รูปภาพประวัติบริษัท</label>
          <MediaUploader
            value={form.historyImage}
            onChange={(url) => setForm({ ...form, historyImage: url })}
            folder="about"
            accept="image/*"
            label="อัปโหลดรูปภาพ"
          />
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ประวัติบริษัท (ไทย)</span>
            <textarea
              className={formStyles.input}
              rows={6}
              value={form.historyBody.th}
              onChange={(e) => setForm({ ...form, historyBody: { ...form.historyBody, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ประวัติบริษัท (English)</span>
            <textarea
              className={formStyles.input}
              rows={6}
              value={form.historyBody.en}
              onChange={(e) => setForm({ ...form, historyBody: { ...form.historyBody, en: e.target.value } })}
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
