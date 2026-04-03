// Jalankan sekali saja via tombol di halaman /admin/seed
// Setelah data masuk Firestore, file ini tidak perlu dijalankan lagi

import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { BERITA_MOCK, WISATA_MOCK, UMKM_MOCK } from "@/data/mock";

async function isCollectionEmpty(col: string): Promise<boolean> {
  const snap = await getDocs(collection(db, col));
  return snap.empty;
}

export async function seedBerita(): Promise<number> {
  if (!(await isCollectionEmpty("berita"))) return 0;
  let count = 0;
  for (const b of BERITA_MOCK) {
    const { id, ...data } = b;
    await addDoc(collection(db, "berita"), {
      ...data,
      published:   true,
      publishedAt: serverTimestamp(),
      createdAt:   serverTimestamp(),
      updatedAt:   serverTimestamp(),
    });
    count++;
  }
  return count;
}

export async function seedWisata(): Promise<number> {
  if (!(await isCollectionEmpty("wisata"))) return 0;
  let count = 0;
  for (const w of WISATA_MOCK) {
    const { id, ...data } = w;
    await addDoc(collection(db, "wisata"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}

export async function seedUmkm(): Promise<number> {
  if (!(await isCollectionEmpty("umkm"))) return 0;
  let count = 0;
  for (const u of UMKM_MOCK) {
    const { id, ...data } = u;
    await addDoc(collection(db, "umkm"), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    count++;
  }
  return count;
}

export async function seedAll(): Promise<{ berita: number; wisata: number; umkm: number }> {
  const [berita, wisata, umkm] = await Promise.all([
    seedBerita(),
    seedWisata(),
    seedUmkm(),
  ]);
  return { berita, wisata, umkm };
}