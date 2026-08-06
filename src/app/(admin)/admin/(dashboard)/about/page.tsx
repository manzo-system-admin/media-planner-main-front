"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import MediaUploader from "@/components/admin/MediaUploader";
import { logActivity } from "@/lib/admin/adminData";
import { toText } from "@/lib/cms/types";
import type { AboutContentDoc } from "@/lib/cms/about";
import formStyles from "../news/[id]/page.module.css";

const DOC_ID = "config";

type FormState = AboutContentDoc;

const EMPTY: FormState = {
  visionBody: "",
  missionBody: "",
  historyBody: "",
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
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({
          visionBody: toText(data.visionBody),
          missionBody: toText(data.missionBody),
          historyBody: toText(data.historyBody),
          historyImage: data.historyImage ?? "",
        });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(getFirebaseDb(), "aboutContent", DOC_ID), form);
      await logActivity("update", "หน้าเกี่ยวกับเรา", "ข้อมูลหน้าเกี่ยวกับเรา");
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
        เนื้อหาวิสัยทัศน์ พันธกิจ และประวัติบริษัท ในหน้า &quot;เกี่ยวกับเรา&quot; (ทีมงานตั้งค่าแยกในเมนู
        &quot;ทีมงาน&quot;)
      </p>

      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>วิสัยทัศน์</label>
          <textarea
            className={formStyles.input}
            rows={4}
            value={form.visionBody}
            onChange={(e) => setForm({ ...form, visionBody: e.target.value })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>พันธกิจ</label>
          <textarea
            className={formStyles.input}
            rows={4}
            value={form.missionBody}
            onChange={(e) => setForm({ ...form, missionBody: e.target.value })}
          />
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

        <div className={formStyles.field}>
          <label className={formStyles.label}>ประวัติบริษัท</label>
          <textarea
            className={formStyles.input}
            rows={6}
            value={form.historyBody}
            onChange={(e) => setForm({ ...form, historyBody: e.target.value })}
          />
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
