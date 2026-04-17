// File: lib/firebase/perangkat.ts

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
    
    // PERBAIKAN: Mengonversi data dari Firebase agar "aman" dilempar ke Client Component
    return snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        name: data.name || "",
        jabatan: data.jabatan || "",
        photo: data.photo || null,
        urutan: data.urutan || 99,
        // Ubah Timestamp Firebase menjadi String biasa (ISO)
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
      } as PerangkatDesa & { createdAt?: string | null, updatedAt?: string | null };
    });
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