import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { PerangkatDesa } from "@/types";

const COL = "perangkat";

export async function getAllPerangkat(): Promise<PerangkatDesa[]> {
  try {
    const snap = await getDocs(
      query(collection(db, COL), orderBy("urutan", "asc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PerangkatDesa));
  } catch {
    return [];
  }
}

export async function createPerangkat(
  data: Omit<PerangkatDesa, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePerangkat(
  id: string,
  data: Partial<Omit<PerangkatDesa, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePerangkat(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}