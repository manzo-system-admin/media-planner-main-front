"use client";

import { collection, doc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";

export async function getNextOrder(collectionName: string): Promise<number> {
  const snapshot = await getDocs(collection(getFirebaseDb(), collectionName));
  let max = -1;
  snapshot.forEach((docSnap) => {
    const order = (docSnap.data() as { order?: number }).order;
    if (typeof order === "number" && order > max) max = order;
  });
  return max + 1;
}

export async function softDeleteDoc(collectionName: string, id: string): Promise<void> {
  await updateDoc(doc(getFirebaseDb(), collectionName, id), {
    deleted: true,
    deletedAt: serverTimestamp(),
  });
}

export function excludeDeleted<T extends { deleted?: boolean }>(items: T[]): T[] {
  return items.filter((item) => !item.deleted);
}
