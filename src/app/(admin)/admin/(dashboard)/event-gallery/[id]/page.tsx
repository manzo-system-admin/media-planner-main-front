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
import type { EventGalleryDoc } from "@/lib/cms/media";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<EventGalleryDoc, "id">;

const EMPTY: FormState = { image: "", caption: "", order: 0 };

export default function EventGalleryFormPage() {
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
        const nextOrder = await getNextOrder("eventGallery");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "eventGallery", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...EMPTY, ...data, caption: toText(data.caption) });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "eventGallery"), form);
        await logActivity("create", "คลังภาพกิจกรรม", form.caption || "รูปกิจกรรม");
      } else {
        await updateDoc(doc(getFirebaseDb(), "eventGallery", params.id), { ...form });
        await logActivity("update", "คลังภาพกิจกรรม", form.caption || "รูปกิจกรรม");
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
    await softDeleteDoc("eventGallery", params.id, "คลังภาพกิจกรรม", form.caption || "รูปกิจกรรม");
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มภาพกิจกรรม" : "แก้ไขภาพกิจกรรม"}</h1>
      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>ลำดับ</label>
          <input
            type="number"
            className={formStyles.input}
            value={form.order ?? 0}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>รูปภาพ</label>
          <MediaUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="event-gallery"
            accept="image/*"
            label="อัปโหลดรูปภาพ"
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>คำอธิบาย (ไม่บังคับ)</label>
          <input
            className={formStyles.input}
            value={form.caption ?? ""}
            onChange={(e) => setForm({ ...form, caption: e.target.value })}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบภาพนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบภาพนี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/event-gallery");
        }}
      />
    </div>
  );
}
