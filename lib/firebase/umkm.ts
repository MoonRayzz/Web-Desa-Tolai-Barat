import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Umkm } from "@/types";

const COL = "umkm";

export async function getAllUmkm(): Promise<Umkm[]> {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Umkm));
  } catch {
    return [];
  }
}

export async function createUmkm(data: Omit<Umkm, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateUmkm(id: string, data: Partial<Umkm>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteUmkm(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}