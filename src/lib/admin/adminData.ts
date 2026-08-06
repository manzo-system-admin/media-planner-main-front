"use client";

import { addDoc, collection, doc, getDocs, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { getFirebaseAuth, getFirebaseDb } from "@/lib/firebase/client";

export type ActivityAction = "create" | "update" | "delete";

/** Records one entry in the "activityLogs" collection, shown on /admin/logs. */
export async function logActivity(action: ActivityAction, section: string, label: string): Promise<void> {
  try {
    const auth = getFirebaseAuth();
    // Right after a page load/navigation, currentUser can briefly be null
    // while Firebase Auth restores the persisted session — wait for that to
    // settle so the actor's email isn't logged as blank.
    await auth.authStateReady();
    await addDoc(collection(getFirebaseDb(), "activityLogs"), {
      action,
      section,
      label,
      actorEmail: auth.currentUser?.email ?? "",
      createdAt: serverTimestamp(),
    });
  } catch {
    // Logging must never block the actual save/delete action.
  }
}

export async function getNextOrder(collectionName: string): Promise<number> {
  const snapshot = await getDocs(collection(getFirebaseDb(), collectionName));
  let max = -1;
  snapshot.forEach((docSnap) => {
    const order = (docSnap.data() as { order?: number }).order;
    if (typeof order === "number" && order > max) max = order;
  });
  return max + 1;
}

export async function softDeleteDoc(
  collectionName: string,
  id: string,
  section?: string,
  label?: string
): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), collectionName, id), {
    deleted: true,
    deletedAt: serverTimestamp(),
  });
  await logActivity("delete", section ?? collectionName, label ?? id);
}

export function excludeDeleted<T extends { deleted?: boolean }>(items: T[]): T[] {
  return items.filter((item) => !item.deleted);
}

/** Persists a new display order for an existing set of docs as sequential integers. */
export async function reorderCollection(collectionName: string, orderedIds: string[]): Promise<void> {
  const batch = writeBatch(getFirebaseDb());
  orderedIds.forEach((id, index) => {
    batch.update(doc(getFirebaseDb(), collectionName, id), { order: index });
  });
  await batch.commit();
}
