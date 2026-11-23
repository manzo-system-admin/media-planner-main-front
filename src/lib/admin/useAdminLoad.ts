"use client";

import { useEffect, useRef, useState } from "react";

/** Shared loading/error/retry state for client-side Backoffice reads. */
export function useAdminLoad(load: () => Promise<void>) {
  const loadRef = useRef(load);
  const [attempt, setAttempt] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    loadRef.current = load;
  }, [load]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(async () => {
      if (!active) return;
      setLoading(true);
      setLoadError(null);
      try {
        await loadRef.current();
      } catch (error) {
        if (active) setLoadError(error instanceof Error ? error.message : "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (active) setLoading(false);
      }
    });
    return () => { active = false; };
  }, [attempt]);

  return { loading, loadError, retry: () => setAttempt((value) => value + 1) };
}
