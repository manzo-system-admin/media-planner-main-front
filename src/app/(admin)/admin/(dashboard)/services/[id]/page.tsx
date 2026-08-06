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
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import ServiceIcon, { SERVICE_ICON_KEYS } from "@/components/ServiceIcon";
import { toText, toStringArray } from "@/lib/cms/types";
import type { ServiceDoc } from "@/lib/cms/services";
import type { GradientKey } from "@/lib/dictionaries/types";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<ServiceDoc, "id"> & { icon: string };

const GRADIENT_OPTIONS: { value: GradientKey; label: string }[] = [
  { value: "purpleBlue", label: "ม่วง-น้ำเงิน" },
  { value: "blueCyan", label: "น้ำเงิน-ฟ้า" },
  { value: "greenYellow", label: "เขียว-เหลือง" },
  { value: "orangeRed", label: "ส้ม-แดง" },
];

const EMPTY: FormState = {
  slug: "",
  gradient: "purpleBlue",
  icon: "target",
  image: "",
  order: 0,
  title: "",
  summary: "",
  description: "",
  highlights: [],
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
        const data = snapshot.data();
        setForm({
          ...EMPTY,
          ...data,
          title: toText(data.title),
          summary: toText(data.summary),
          description: toText(data.description),
          highlights: toStringArray(data.highlights),
        });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "services"), form);
        await logActivity("create", "บริการ", form.title);
      } else {
        await updateDoc(doc(getFirebaseDb(), "services", params.id), { ...form });
        await logActivity("update", "บริการ", form.title);
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
    await softDeleteDoc("services", params.id, "บริการ", form.title);
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
          <label className={formStyles.label}>ไอคอน</label>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {SERVICE_ICON_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setForm({ ...form, icon: key })}
                style={{
                  padding: 0,
                  border: form.icon === key ? "2px solid var(--grad-blue)" : "2px solid transparent",
                  borderRadius: 12,
                  background: "none",
                  cursor: "pointer",
                  lineHeight: 0,
                }}
              >
                <span style={{ display: "flex", padding: 6, borderRadius: 8 }}>
                  <ServiceIcon icon={key} gradient={form.gradient} size={20} />
                </span>
              </button>
            ))}
          </div>
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

        <div className={formStyles.field}>
          <label className={formStyles.label}>ชื่อบริการ</label>
          <input
            className={formStyles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>สรุปสั้น</label>
          <input
            className={formStyles.input}
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>รายละเอียด</label>
          <RichTextEditor value={form.description} onChange={(html) => setForm({ ...form, description: html })} />
        </div>

        <HighlightsEditor
          label="สิ่งที่ลูกค้าจะได้รับ"
          items={form.highlights}
          onChange={(items) => setForm({ ...form, highlights: items })}
        />

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
