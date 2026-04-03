import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit, serverTimestamp, Timestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Berita } from "@/types";

const COL = "berita";

// Fungsi pembantu untuk mengonversi data Firebase (Timestamp) menjadi format Berita (String)
function mapBerita(d: any): Berita {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    // Jika data berupa Timestamp Firebase, ubah jadi string ISO. Jika null, jadikan string kosong.
    publishedAt: data.publishedAt?.toDate ? data.publishedAt.toDate().toISOString() : (data.publishedAt || ""),
  } as Berita;
}

export async function getBeritaPublished(limitCount = 10): Promise<Berita[]> {
  try {
    const q = query(
      collection(db, COL),
      where("published", "==", true),
      orderBy("publishedAt", "desc"),
      limit(limitCount)
    );
    const snap = await getDocs(q);
    return snap.docs.map(mapBerita);
  } catch {
    return [];
  }
}

export async function getBeritaTerbaru(): Promise<Berita[]> {
  return getBeritaPublished(3);
}

export async function getBeritaBySlug(slug: string): Promise<Berita | null> {
  try {
    const q    = query(collection(db, COL), where("slug", "==", slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return mapBerita(snap.docs[0]);
  } catch {
    return null;
  }
}

export async function getAllBeritaAdmin(): Promise<Berita[]> {
  try {
    const q    = query(collection(db, COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(mapBerita);
  } catch {
    return [];
  }
}

export async function createBerita(data: Omit<Berita, "id" | "views">): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    views:     0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    publishedAt: data.published ? serverTimestamp() : null,
  });
  return ref.id;
}

export async function updateBerita(id: string, data: Partial<Berita>): Promise<void> {
  const updatePayload: any = {
    ...data,
    updatedAt: serverTimestamp(),
  };

  // Jika status 'published' ikut di-edit, perbarui juga nilai tanggalnya
  if (data.published !== undefined) {
    updatePayload.publishedAt = data.published ? serverTimestamp() : null;
  }

  await updateDoc(doc(db, COL, id), updatePayload);
}

export async function deleteBerita(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}

export async function incrementViews(id: string): Promise<void> {
  try {
    const ref  = doc(db, COL, id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    await updateDoc(ref, { views: ((snap.data().views as number) || 0) + 1 });
  } catch { /* silent fail */ }
}