"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import { logActivity } from "@/lib/admin/adminData";
import { toText } from "@/lib/cms/types";
import SocialIcon from "@/components/SocialIcon";
import type { SiteSettingsDoc } from "@/lib/cms/siteSettings";
import formStyles from "../news/[id]/page.module.css";

const DOC_ID = "config";

const SOCIAL_NAME_OPTIONS = ["Facebook", "YouTube", "TikTok", "Line", "X"];

type FormState = SiteSettingsDoc;

const EMPTY: FormState = {
  address: "",
  phone: "",
  email: "",
  socialLinks: [],
};

export default function ContactSettingsPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone } | null>(null);

  useEffect(() => {
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "siteSettings", DOC_ID));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...EMPTY, ...data, address: toText(data.address) });
      }
      setLoading(false);
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(getFirebaseDb(), "siteSettings", DOC_ID), form);
      await logActivity("update", "ข้อมูลติดต่อ", "ข้อมูลติดต่อ/ช่องทางโซเชียล");
      setAlert({ message: "บันทึกสำเร็จ", tone: "success" });
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "บันทึกไม่สำเร็จ", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const updateSocial = (index: number, patch: Partial<{ name: string; href: string }>) => {
    const next = [...form.socialLinks];
    next[index] = { ...next[index], ...patch, label: next[index].label ?? next[index].name };
    setForm({ ...form, socialLinks: next });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>ข้อมูลติดต่อ</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        ข้อมูลนี้จะแสดงในหน้า &quot;ติดต่อเรา&quot; และในส่วนท้ายเว็บไซต์ (Footer)
      </p>

      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>ที่อยู่</label>
          <textarea
            className={formStyles.input}
            rows={3}
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ละติจูด (Latitude)</label>
            <input
              type="number"
              step="any"
              className={formStyles.input}
              placeholder="เช่น 13.736717"
              value={form.mapLat ?? ""}
              onChange={(e) =>
                setForm({ ...form, mapLat: e.target.value === "" ? undefined : Number(e.target.value) })
              }
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ลองจิจูด (Longitude)</label>
            <input
              type="number"
              step="any"
              className={formStyles.input}
              placeholder="เช่น 100.523186"
              value={form.mapLng ?? ""}
              onChange={(e) =>
                setForm({ ...form, mapLng: e.target.value === "" ? undefined : Number(e.target.value) })
              }
            />
          </div>
        </div>
        <p style={{ margin: "-8px 0 0", color: "var(--text-muted)", font: "400 12px var(--font-admin)" }}>
          ใส่พิกัดเพื่อให้แผนที่ชี้ตำแหน่งแม่นยำ (เปิดตำแหน่งใน Google Maps แล้วคัดลอกตัวเลขจาก URL) — ถ้าไม่ใส่
          ระบบจะค้นหาแผนที่จากที่อยู่ด้านบนแทน
        </p>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>เบอร์โทร</label>
            <input
              className={formStyles.input}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>อีเมล</label>
            <input
              className={formStyles.input}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <span className={formStyles.langLabel}>ช่องทางโซเชียล</span>
          {form.socialLinks.map((social, index) => (
            <div key={index} style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ display: "flex", flex: "none" }}>
                <SocialIcon name={social.name} size={18} />
              </span>
              <select
                className={formStyles.input}
                style={{ flex: "none", width: 140 }}
                value={social.name}
                onChange={(e) => updateSocial(index, { name: e.target.value })}
              >
                {SOCIAL_NAME_OPTIONS.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <input
                className={formStyles.input}
                placeholder="ลิงก์ URL"
                value={social.href}
                onChange={(e) => updateSocial(index, { href: e.target.value })}
              />
              <button
                type="button"
                onClick={() =>
                  setForm({ ...form, socialLinks: form.socialLinks.filter((_, i) => i !== index) })
                }
                style={{ color: "var(--grad-red)", background: "none", border: "none", cursor: "pointer" }}
              >
                ลบ
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              setForm({
                ...form,
                socialLinks: [...form.socialLinks, { label: "Facebook", name: "Facebook", href: "" }],
              })
            }
            style={{
              alignSelf: "flex-start",
              font: "600 12.5px var(--font-admin)",
              color: "var(--grad-blue)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            + เพิ่มช่องทาง
          </button>
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
