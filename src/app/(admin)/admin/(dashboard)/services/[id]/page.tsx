"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { ServiceDoc } from "@/lib/cms/services";
import type { GradientKey } from "@/lib/dictionaries/types";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<ServiceDoc, "id">;

const GRADIENT_OPTIONS: { value: GradientKey; label: string }[] = [
  { value: "purpleBlue", label: "ม่วง-น้ำเงิน" },
  { value: "blueCyan", label: "น้ำเงิน-ฟ้า" },
  { value: "greenYellow", label: "เขียว-เหลือง" },
  { value: "orangeRed", label: "ส้ม-แดง" },
];

const EMPTY: FormState = {
  slug: "",
  gradient: "purpleBlue",
  image: "",
  order: 0,
  title: { th: "", en: "" },
  summary: { th: "", en: "" },
  description: { th: "", en: "" },
  highlights: { th: [], en: [] },
};

function HighlightsEditor({
  label,
  items,
  onChange,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  return (
    <div className={formStyles.field}>
      <span className={formStyles.langLabel}>{label}</span>
      {items.map((item, index) => (
        <div key={index} style={{ display: "flex", gap: 8 }}>
          <input
            className={formStyles.input}
            value={item}
            onChange={(e) => {
              const next = [...items];
              next[index] = e.target.value;
              onChange(next);
            }}
          />
          <button
            type="button"
            onClick={() => onChange(items.filter((_, i) => i !== index))}
            style={{ color: "var(--grad-red)", background: "none", border: "none", cursor: "pointer" }}
          >
            ลบ
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, ""])}
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
        + เพิ่มรายการ
      </button>
    </div>
  );
}

export default function ServiceFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone; redirect?: boolean } | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (isNew) {
      (async () => {
        const nextOrder = await getNextOrder("services");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "services", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data() as FormState;
        setForm({ ...EMPTY, ...data });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "services"), form);
      } else {
        await updateDoc(doc(getFirebaseDb(), "services", params.id), { ...form });
      }
      setAlert({ message: "บันทึกสำเร็จ", tone: "success", redirect: true });
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "บันทึกไม่สำเร็จ", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await softDeleteDoc("services", params.id);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มบริการใหม่" : "แก้ไขบริการ"}</h1>

      <div className={formStyles.form}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>Slug (ใช้ใน URL, ต้องไม่ซ้ำ)</label>
            <input
              className={formStyles.input}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ลำดับการแสดงผล</label>
            <input
              type="number"
              className={formStyles.input}
              value={form.order ?? 0}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>สีไอคอน</label>
          <select
            className={formStyles.input}
            value={form.gradient}
            onChange={(e) => setForm({ ...form, gradient: e.target.value as GradientKey })}
          >
            {GRADIENT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>รูปภาพ</label>
          <MediaUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="services"
            accept="image/*"
            label="อัปโหลดรูปภาพ"
          />
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ชื่อบริการ (ไทย)</span>
            <input
              className={formStyles.input}
              value={form.title.th}
              onChange={(e) => setForm({ ...form, title: { ...form.title, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ชื่อบริการ (English)</span>
            <input
              className={formStyles.input}
              value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>สรุปสั้น (ไทย)</span>
            <input
              className={formStyles.input}
              value={form.summary.th}
              onChange={(e) => setForm({ ...form, summary: { ...form.summary, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>สรุปสั้น (English)</span>
            <input
              className={formStyles.input}
              value={form.summary.en}
              onChange={(e) => setForm({ ...form, summary: { ...form.summary, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <span className={formStyles.langLabel}>รายละเอียด (ไทย)</span>
          <RichTextEditor
            value={form.description.th}
            onChange={(html) => setForm({ ...form, description: { ...form.description, th: html } })}
          />
        </div>
        <div className={formStyles.field}>
          <span className={formStyles.langLabel}>รายละเอียด (English)</span>
          <RichTextEditor
            value={form.description.en}
            onChange={(html) => setForm({ ...form, description: { ...form.description, en: html } })}
          />
        </div>

        <div className={formStyles.row}>
          <HighlightsEditor
            label="สิ่งที่ลูกค้าจะได้รับ (ไทย)"
            items={form.highlights.th}
            onChange={(items) => setForm({ ...form, highlights: { ...form.highlights, th: items } })}
          />
          <HighlightsEditor
            label="สิ่งที่ลูกค้าจะได้รับ (English)"
            items={form.highlights.en}
            onChange={(items) => setForm({ ...form, highlights: { ...form.highlights, en: items } })}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบบริการนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบบริการนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <AdminAlertModal
        open={!!alert}
        message={alert?.message ?? ""}
        tone={alert?.tone}
        onClose={() => {
          const shouldRedirect = alert?.redirect;
          setAlert(null);
          if (shouldRedirect) router.push("/admin/services");
        }}
      />
    </div>
  );
}
