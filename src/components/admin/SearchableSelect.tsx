"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./SearchableSelect.module.css";

export default function SearchableSelect({
  options,
  value,
  onChange,
  placeholder = "ค้นหา...",
  emptyLabel = "— ไม่ระบุ —",
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <input
        type="text"
        className={styles.input}
        placeholder={placeholder}
        value={open ? query : (selected?.label ?? "")}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && (
        <div className={styles.dropdown}>
          <button
            type="button"
            className={styles.option}
            onMouseDown={() => {
              onChange("");
              setOpen(false);
              setQuery("");
            }}
          >
            {emptyLabel}
          </button>
          {filtered.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`${styles.option} ${option.value === value ? styles.optionActive : ""}`}
              onMouseDown={() => {
                onChange(option.value);
                setOpen(false);
                setQuery("");
              }}
            >
              {option.label}
            </button>
          ))}
          {filtered.length === 0 && <div className={styles.empty}>ไม่พบรายการ</div>}
        </div>
      )}
    </div>
  );
}
