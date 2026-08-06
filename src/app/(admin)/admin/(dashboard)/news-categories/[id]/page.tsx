"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import { toText, type NewsCategoryDoc } from "@/lib/cms/types";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<NewsCategoryDoc, "id">;

const EMPTY: FormState = { key: "", label: "", order: 0 };

function slugifyKey(text: string): string {
  const slug = text
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "_")
    .replace(/^_+|_+$/g, "");
  return slug || "CATEGORY";
}

export default function NewsCategoryFormPage() {
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
        const nextOrder = await getNextOrder("newsCategories");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "newsCategories", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...EMPTY, ...data, label: toText(data.label) });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form, key: form.key.trim() || slugifyKey(form.label) };
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "newsCategories"), payload);
        await logActivity("create", "หมวดหมู่ข่าว", payload.label);
      } else {
        await updateDoc(doc(getFirebaseDb(), "newsCategories", params.id), payload);
        await logActivity("update", "หมวดหมู่ข่าว", payload.label);
      }
      setForm(payload);
      setAlert({ message: "บันทึกสำเร็จ", tone: "success", redirect: true });
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "บันทึกไม่สำเร็จ", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await softDeleteDoc("newsCategories", params.id, "หมวดหมู่ข่าว", form.label);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มหมวดหมู่ข่าว" : "แก้ไขหมวดหมู่ข่าว"}</h1>
      <div className={formStyles.form}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>Key (รหัสอ้างอิงภายใน ไม่ต้องกรอกก็ได้ ระบบจะสร้างให้จากชื่อ)</label>
            <input
              className={formStyles.input}
              value={form.key}
              placeholder="เว้นว่างไว้เพื่อให้ระบบสร้างให้อัตโนมัติ"
              onChange={(e) => setForm({ ...form, key: e.target.value })}
            />
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
          <label className={formStyles.label}>ชื่อที่แสดง</label>
          <input
            className={formStyles.input}
            value={form.label}
            placeholder="เช่น ข่าวไอพีโอ"
            onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบหมวดหมู่นี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบหมวดหมู่นี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/news-categories");
        }}
      />
    </div>
  );
}
