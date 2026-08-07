"use client";

import { useRef, useState } from "react";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFirebaseStorage } from "@/lib/firebase/client";
import { resizeImageFile } from "@/lib/media/resizeImageFile";
import styles from "./MediaUploader.module.css";

export default function MediaUploader({
  value,
  onChange,
  folder,
  accept = "image/*,video/*",
  label = "อัปโหลดรูปภาพหรือวิดีโอ",
}: {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  accept?: string;
  label?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isVideo = /\.(mp4|webm|mov)$/i.test(value);
  const acceptsImage = accept.includes("image");

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);
    const isImage = accept.includes("image") && file.type.startsWith("image/");
    const upload = isImage ? await resizeImageFile(file) : file;
    const path = `uploads/${folder}/${Date.now()}-${upload.name}`;
    const task = uploadBytesResumable(ref(getFirebaseStorage(), path), upload);

    task.on(
      "state_changed",
      (snapshot) => {
        setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (err) => {
        setError(err.message);
        setProgress(null);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onChange(url);
        setProgress(null);
      }
    );
  };

  return (
    <div className={styles.wrap}>
      {acceptsImage && (
        <span className={styles.ratioHint}>แนะนำอัตราส่วนรูปภาพ 16:9 (ไม่บังคับ)</span>
      )}
      {value ? (
        <div className={styles.preview}>
          {isVideo ? (
            <video src={value} className={styles.previewImage} controls />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className={styles.previewImage} />
          )}
        </div>
      ) : (
        <div className={styles.dropzone} onClick={() => inputRef.current?.click()}>
          <span className={styles.hint}>{label} (คลิกเพื่อเลือกไฟล์)</span>
        </div>
      )}

      {progress !== null && (
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
      )}

      {error && <span className={styles.error}>{error}</span>}

      <input
        ref={inputRef}
        type="file"
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
