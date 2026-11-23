"use client";

import type { ReactNode } from "react";
import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { resizeImageFile } from "@/lib/media/resizeImageFile";
import { isVideoUrl, mediaUploadErrorMessage, validateMediaFile } from "@/lib/admin/mediaValidation";
import styles from "./MediaUploader.module.css";

export default function MediaUploader({
  value,
  onChange,
  folder,
  accept = "image/*,video/*",
  label = "อัปโหลดรูปภาพหรือวิดีโอ",
  renderPreview,
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
  renderPreview?: (url: string) => ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isVideo = isVideoUrl(value);
  const acceptsImage = accept.includes("image");

  const handleFile = async (file: File) => {
    setError(null);
    const validationError = validateMediaFile(file, accept);
    if (validationError) { setError(validationError); return; }
    setProgress(0);
    try {
      const isImage = file.type.startsWith("image/");
      const upload = isImage ? await resizeImageFile(file) : file;
      const path = `uploads/${folder}/${Date.now()}-${upload.name}`;
      const task = uploadBytesResumable(ref(getFirebaseStorage(), path), upload);
      task.on("state_changed",
        (snapshot) => setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)),
        (err) => { setError(mediaUploadErrorMessage(err)); setProgress(null); },
        async () => {
          try { onChange(await getDownloadURL(task.snapshot.ref)); }
          catch (error) { setError(error instanceof Error ? error.message : "อ่าน URL ไฟล์ไม่สำเร็จ กรุณาลองใหม่"); }
          finally { setProgress(null); }
        }
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : "เตรียมไฟล์ไม่สำเร็จ กรุณาลองใหม่");
      setProgress(null);
    }
  };

  return (
    <div className={styles.wrap}>
      {acceptsImage && (
        <span className={styles.ratioHint}>แนะนำอัตราส่วนรูปภาพ 16:9 (ไม่บังคับ)</span>
      )}
      {value ? (
        <div className={styles.preview}>
          {renderPreview ? (
            renderPreview(value)
          ) : isVideo ? (
            <video src={value} className={styles.previewImage} controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={styles.previewImage} />
          )}
        </div>
      ) : (
        <button type="button" className={styles.dropzone} onClick={() => inputRef.current?.click()} disabled={progress !== null}>
          <span className={styles.hint}>{label} (คลิกเพื่อเลือกไฟล์)</span>
        </button>
      )}

      {progress !== null && (
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <span className={styles.error} role="alert">{error} <button type="button" onClick={() => inputRef.current?.click()}>เลือกไฟล์ใหม่</button></span>}

      <input
        ref={inputRef}
        type="file"
        aria-label={label}
        accept={accept}
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {value && (
        <button type="button" className={styles.removeButton} onClick={() => onChange("")}>
          ลบไฟล์นี้ / อัปโหลดใหม่
        </button>
      )}
    </div>
  );
}
