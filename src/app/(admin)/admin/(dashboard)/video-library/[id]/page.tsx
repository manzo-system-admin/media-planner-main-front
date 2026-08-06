"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import VideoLinkInput from "@/components/admin/VideoLinkInput";
import type { VideoLibraryDoc } from "@/lib/cms/media";
import { toText, type VideoSource } from "@/lib/cms/types";
import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<VideoLibraryDoc, "id">;

const EMPTY: FormState = {
  title: "",
  thumbnail: "",
  videoSource: { kind: "upload", url: "" },
  order: 0,
};

export default function VideoLibraryFormPage() {
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
        const nextOrder = await getNextOrder("videoLibrary");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "videoLibrary", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({ ...EMPTY, ...data, title: toText(data.title) });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "videoLibrary"), form);
        await logActivity("create", "คลังวิดีโอ", form.title);
      } else {
        await updateDoc(doc(getFirebaseDb(), "videoLibrary", params.id), { ...form });
        await logActivity("update", "คลังวิดีโอ", form.title);
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
    await softDeleteDoc("videoLibrary", params.id, "คลังวิดีโอ", form.title);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มวิดีโอ" : "แก้ไขวิดีโอ"}</h1>
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
          <label className={formStyles.label}>ภาพปก</label>
          <MediaUploader
            value={form.thumbnail}
            onChange={(url) => setForm({ ...form, thumbnail: url })}
            folder="video-library"
            accept="image/*"
            label="อัปโหลดภาพปก"
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>วิดีโอ</label>
          <VideoLinkInput
            value={form.videoSource}
            onChange={(source: VideoSource | null) =>
              setForm({ ...form, videoSource: source ?? { kind: "upload", url: "" } })
            }
            folder="video-library"
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>ชื่อวิดีโอ</label>
          <input
            className={formStyles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบวิดีโอนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบวิดีโอนี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/video-library");
        }}
      />
    </div>
  );
}
