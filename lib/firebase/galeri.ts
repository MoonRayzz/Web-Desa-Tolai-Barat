import {
  collection, getDocs, addDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export interface GaleriItem {
  id:        string;
  imageUrl:  string;
  caption:   string;
  kategori:  string;
  createdAt: string;
}

const COL = "galeri";

export async function getAllGaleri(): Promise<GaleriItem[]> {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("createdAt", "desc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GaleriItem));
  } catch { return []; }
}

export async function createGaleri(
  data: Omit<GaleriItem, "id" | "createdAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function deleteGaleri(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}