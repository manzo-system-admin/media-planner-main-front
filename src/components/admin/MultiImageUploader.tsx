"use client";

import { useEffect, useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { resizeImageFile } from "@/lib/media/resizeImageFile";
import { mediaUploadErrorMessage, validateMediaFile } from "@/lib/admin/mediaValidation";
import styles from "./MultiImageUploader.module.css";

type UploadingFile = { id: string; name: string; progress: number; error?: string };

export default function MultiImageUploader({
  values,
  onChange,
  folder,
  accept = "image/*",
  label = "อัปโหลดรูปภาพ (เลือกได้หลายไฟล์)",
}: {
  values: string[];
  onChange: (urls: string[]) => void;
  folder: string;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState<UploadingFile[]>([]);

  // Uploading several files fires several independent async completions.
  // Each one must append onto the *latest* list, not the `values` prop it
  // closed over when the upload started — otherwise two uploads finishing
  // around the same time each overwrite the other's result. A ref kept
  // synchronously current sidesteps that render-timing race entirely.
  const valuesRef = useRef(values);
  useEffect(() => {
    valuesRef.current = values;
  }, [values]);

  const uploadFile = async (file: File) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`;
    setUploading((list) => [...list, { id, name: file.name, progress: 0 }]);
    const validationError = validateMediaFile(file, accept);
    if (validationError) {
      setUploading((list) => list.map((u) => u.id === id ? { ...u, error: validationError } : u));
      return;
    }
    try {
      const upload = file.type.startsWith("image/") ? await resizeImageFile(file) : file;
      const path = `uploads/${folder}/${id}`;
      const task = uploadBytesResumable(ref(getFirebaseStorage(), path), upload);
      task.on("state_changed",
        (snapshot) => {
          const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setUploading((list) => list.map((u) => (u.id === id ? { ...u, progress } : u)));
        },
        (err) => setUploading((list) => list.map((u) => u.id === id ? { ...u, error: mediaUploadErrorMessage(err) } : u)),
        async () => {
          try {
            const url = await getDownloadURL(task.snapshot.ref);
            const next = [...valuesRef.current, url];
            valuesRef.current = next;
            onChange(next);
            setUploading((list) => list.filter((u) => u.id !== id));
          } catch (error) {
            setUploading((list) => list.map((u) => u.id === id ? { ...u, error: error instanceof Error ? error.message : "อ่าน URL ไฟล์ไม่สำเร็จ" } : u));
          }
        }
      );
    } catch (error) {
      setUploading((list) => list.map((u) => u.id === id ? { ...u, error: error instanceof Error ? error.message : "เตรียมไฟล์ไม่สำเร็จ" } : u));
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach(uploadFile);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const moveTo = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return;
    const next = [...values];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  return (
    <div className={styles.wrap}>
      <span className={styles.ratioHint}>แนะนำอัตราส่วนรูปภาพ 16:9 (ไม่บังคับ)</span>
      <div className={styles.grid}>
        {values.map((url, index) => (
          <div key={url} className={styles.tile}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className={styles.tileImage} />
            {index === 0 && <span className={styles.coverBadge}>ภาพปก</span>}
            <div className={styles.tileActions}>
              {index > 0 && (
                <button type="button" onClick={() => moveTo(index, index - 1)} title="เลื่อนไปก่อนหน้า">
                  ‹
                </button>
              )}
              <button type="button" onClick={() => removeAt(index)} title="ลบรูปนี้">
                ✕
              </button>
              {index < values.length - 1 && (
                <button type="button" onClick={() => moveTo(index, index + 1)} title="เลื่อนไปถัดไป">
                  ›
                </button>
              )}
            </div>
          </div>
        ))}

        {uploading.map((u) => (
          <div key={u.id} className={`${styles.tile} ${styles.tileUploading}`}>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${u.progress}%` }} />
            </div>
            {u.error && (
              <span className={styles.error} role="alert">
                {u.name}: {u.error}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setUploading((list) => list.filter((item) => item.id !== u.id));
                    inputRef.current?.click();
                  }}
                >
                  ลองเลือกใหม่
                </button>
              </span>
            )}
          </div>
        ))}

        <button type="button" className={styles.addTile} onClick={() => inputRef.current?.click()}>
          <span>+</span>
          <span className={styles.hint}>{label}</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        aria-label={label}
        accept={accept}
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />
    </div>
  );
}
