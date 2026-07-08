"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import styles from "./RichTextEditor.module.css";

export default function RichTextEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (html: string) => void;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image,
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: { class: styles.content },
    },
  });

  if (!editor) return null;

  const addLink = () => {
    const url = window.prompt("ลิงก์ (URL):");
    if (!url) return;
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("ลิงก์รูปภาพ (URL):");
    if (!url) return;
    editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("bold") ? styles.toolButtonActive : ""}`}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          B
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("italic") ? styles.toolButtonActive : ""}`}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          I
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("heading", { level: 2 }) ? styles.toolButtonActive : ""}`}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("bulletList") ? styles.toolButtonActive : ""}`}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          •
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("orderedList") ? styles.toolButtonActive : ""}`}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </button>
        <button
          type="button"
          className={`${styles.toolButton} ${editor.isActive("link") ? styles.toolButtonActive : ""}`}
          onClick={addLink}
        >
          🔗
        </button>
        <button type="button" className={styles.toolButton} onClick={addImage}>
          🖼
        </button>
        <button type="button" className={styles.toolButton} onClick={() => editor.chain().focus().undo().run()}>
          ↺
        </button>
        <button type="button" className={styles.toolButton} onClick={() => editor.chain().focus().redo().run()}>
          ↻
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
