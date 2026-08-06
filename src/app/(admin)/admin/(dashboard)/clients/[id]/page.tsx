"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import type { ClientDoc } from "@/lib/cms/org";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<ClientDoc, "id">;

const EMPTY: FormState = { name: "", logoUrl: "", order: 0 };

export default function ClientFormPage() {
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
        const nextOrder = await getNextOrder("clients");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "clients", params.id));
      if (snapshot.exists()) setForm({ ...EMPTY, ...(snapshot.data() as FormState) });
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "clients"), form);
        await logActivity("create", "ลูกค้า/พันธมิตร", form.name);
      } else {
        await updateDoc(doc(getFirebaseDb(), "clients", params.id), { ...form });
        await logActivity("update", "ลูกค้า/พันธมิตร", form.name);
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
    await softDeleteDoc("clients", params.id, "ลูกค้า/พันธมิตร", form.name);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มลูกค้า/พันธมิตร" : "แก้ไขลูกค้า/พันธมิตร"}</h1>
      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>ชื่อลูกค้า/พันธมิตร</label>
          <input
            className={formStyles.input}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>โลโก้ (ถ้าไม่อัปโหลด ระบบจะสร้างไอคอนให้อัตโนมัติ)</label>
          <MediaUploader
            value={form.logoUrl ?? ""}
            onChange={(url) => setForm({ ...form, logoUrl: url })}
            folder="clients"
            accept="image/*"
            label="อัปโหลดโลโก้"
          />
        </div>

        <p style={{ color: "var(--text-muted)", font: "400 13px var(--font-admin)", margin: "-8px 0 0" }}>
          ผลงาน/เคสสตัดดี้ที่เชื่อมโยงกับลูกค้ารายนี้ ให้ไปตั้งค่าจากหน้า &quot;ผลงาน/เคส&quot; ของแต่ละชิ้นงานแทน
          (เลือกลูกค้าที่ช่องลูกค้าในฟอร์มผลงาน)
        </p>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบลูกค้ารายนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบลูกค้ารายนี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/clients");
        }}
      />
    </div>
  );
}
