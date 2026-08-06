"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import { toText } from "@/lib/cms/types";
import type { BannerDoc } from "@/lib/cms/homepage";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<BannerDoc, "id">;

const EMPTY: FormState = {
  type: "image",
  src: "",
  poster: "",
  alt: "",
  order: 0,
};

export default function BannerFormPage() {
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
        const nextOrder = await getNextOrder("banners");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "banners", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...EMPTY, ...data, alt: toText(data.alt) });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "banners"), form);
        await logActivity("create", "แบนเนอร์", form.alt || "แบนเนอร์");
      } else {
        await updateDoc(doc(getFirebaseDb(), "banners", params.id), { ...form });
        await logActivity("update", "แบนเนอร์", form.alt || "แบนเนอร์");
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
    await softDeleteDoc("banners", params.id, "แบนเนอร์", form.alt || "แบนเนอร์");
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มสไลด์" : "แก้ไขสไลด์"}</h1>
      <div className={formStyles.form}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ประเภท</label>
            <select
              className={formStyles.input}
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as "image" | "video" })}
            >
              <option value="image">รูปภาพ</option>
              <option value="video">วิดีโอ</option>
            </select>
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ลำดับ</label>
            <input
              type="number"
              className={formStyles.input}
              value={form.order ?? 0}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>{form.type === "video" ? "ไฟล์วิดีโอ" : "รูปภาพ"}</label>
          <MediaUploader
            value={form.src}
            onChange={(url) => setForm({ ...form, src: url })}
            folder="banners"
            accept={form.type === "video" ? "video/*" : "image/*"}
            label={form.type === "video" ? "อัปโหลดไฟล์วิดีโอ" : "อัปโหลดรูปภาพ"}
          />
        </div>

        {form.type === "video" && (
          <div className={formStyles.field}>
            <label className={formStyles.label}>ภาพปก (แสดงก่อนวิดีโอเล่น)</label>
            <MediaUploader
              value={form.poster ?? ""}
              onChange={(url) => setForm({ ...form, poster: url })}
              folder="banners"
              accept="image/*"
              label="อัปโหลดภาพปก"
            />
          </div>
        )}

        <div className={formStyles.field}>
          <label className={formStyles.label}>คำอธิบายภาพ</label>
          <input
            className={formStyles.input}
            value={form.alt}
            onChange={(e) => setForm({ ...form, alt: e.target.value })}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบสไลด์นี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบสไลด์นี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/banners");
        }}
      />
    </div>
  );
}
