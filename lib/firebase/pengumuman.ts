import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { Pengumuman } from "@/types";

const COL = "pengumuman";

export function getTodayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export function isExpired(endDate: string | null): boolean {
  if (!endDate) return false;
  return endDate < getTodayStr();
}

export function isUpcoming(startDate: string): boolean {
  return startDate > getTodayStr();
}

export function formatAgendaDate(dateStr: string): string {
  return new Date(dateStr + "T00:00:00").toLocaleDateString("id-ID", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  });
}

// PERBAIKAN: Fungsi konversi agar Timestamp Firebase tidak membuat Next.js error
function mapPengumuman(d: any): Pengumuman {
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : (data.createdAt || null),
    updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : (data.updatedAt || null),
  } as Pengumuman;
}

export async function getAktifPengumuman(): Promise<Pengumuman[]> {
  try {
    const today = getTodayStr();
    const q     = query(
      collection(db, COL),
      where("aktif", "==", true),
      orderBy("startDate", "desc")
    );
    const snap = await getDocs(q);
    const order: Record<string, number> = { darurat: 0, penting: 1, normal: 2 };
    
    return snap.docs
      .map(mapPengumuman)
      .filter((p) => {
        // PERBAIKAN: Baris (p.startDate > today) dihapus agar agenda masa depan 
        // yang bersifat "Penting/Darurat" tetap muncul di Banner Pengumuman.
        if (p.endDate && p.endDate < today) return false;
        return true;
      })
      .sort((a, b) => (order[a.priority] ?? 2) - (order[b.priority] ?? 2));
  } catch (error) {
    // PERBAIKAN: Tampilkan error jika terjadi Missing Index
    console.error("🔥 Error getAktifPengumuman (Cek Console Browser):", error);
    return [];
  }
}

export async function getUpcomingAgenda(limitCount = 3): Promise<Pengumuman[]> {
  try {
    const today = getTodayStr();
    const q     = query(
      collection(db, COL),
      where("aktif", "==", true),
      where("type", "==", "agenda"),
      orderBy("startDate", "asc")
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(mapPengumuman)
      .filter((p) => !p.endDate || p.endDate >= today)
      .slice(0, limitCount);
  } catch (error) {
    // PERBAIKAN: Tampilkan error jika terjadi Missing Index
    console.error("🔥 Error getUpcomingAgenda (Cek Terminal VS Code):", error);
    return [];
  }
}

export async function getAllPengumuman(): Promise<Pengumuman[]> {
  try {
    const q    = query(collection(db, COL), orderBy("createdAt", "desc"));
    const snap = await getDocs(q);
    return snap.docs.map(mapPengumuman);
  } catch (error) {
    console.error("🔥 Error getAllPengumuman:", error);
    return [];
  }
}

export async function getPengumumanById(id: string): Promise<Pengumuman | null> {
  try {
    const snap = await getDocs(collection(db, COL));
    const d    = snap.docs.find((x) => x.id === id);
    if (!d) return null;
    return mapPengumuman(d);
  } catch {
    return null;
  }
}

export async function createPengumuman(
  data: Omit<Pengumuman, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePengumuman(
  id:   string,
  data: Partial<Omit<Pengumuman, "id" | "createdAt" | "updatedAt">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePengumuman(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}