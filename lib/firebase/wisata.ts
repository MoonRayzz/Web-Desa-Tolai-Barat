import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Wisata } from "@/types";

const COL = "wisata";

export async function getAllWisata(): Promise<Wisata[]> {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Wisata));
  } catch {
    return [];
  }
}

export async function getWisataFeatured(): Promise<Wisata[]> {
  const all = await getAllWisata();
  return all.filter((w) => w.featured);
}

export async function createWisata(data: Omit<Wisata, "id">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateWisata(id: string, data: Partial<Wisata>): Promise<void> {
  await updateDoc(doc(db, COL, id), { ...data, updatedAt: serverTimestamp() });
}

export async function deleteWisata(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}