import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";
import type { LayananDesa } from "@/types";

const COL = "layanan";

export const TEMA_COLORS = {
  ocean:  { bg: "var(--color-ocean-100)",  border: "var(--color-ocean-400)",  text: "var(--color-ocean-700)"  },
  gold:   { bg: "var(--color-gold-100)",   border: "var(--color-gold-400)",   text: "var(--color-gold-700)"   },
  forest: { bg: "var(--color-forest-100)", border: "var(--color-forest-400)", text: "var(--color-forest-700)" },
};

export const LAYANAN_DEFAULT: Omit<LayananDesa, "id">[] = [
  {
    icon: "📄", judul: "Surat Keterangan Domisili",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Surat pengantar RT/RW"],
    waktu: "1 hari kerja", tema: "ocean", aktif: true, urutan: 1,
  },
  {
    icon: "🏠", judul: "Surat Keterangan Tidak Mampu",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Surat pengantar RT/RW", "Foto rumah"],
    waktu: "2 hari kerja", tema: "gold", aktif: true, urutan: 2,
  },
  {
    icon: "🏪", judul: "Surat Keterangan Usaha",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Foto usaha", "Deskripsi usaha"],
    waktu: "1 hari kerja", tema: "forest", aktif: true, urutan: 3,
  },
  {
    icon: "📋", judul: "Surat Pengantar SKCK",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Pas foto 4x6 (2 lembar)"],
    waktu: "1 hari kerja", tema: "ocean", aktif: true, urutan: 4,
  },
  {
    icon: "👶", judul: "Surat Keterangan Kelahiran",
    syarat: ["Surat keterangan dari bidan/dokter", "KTP orang tua", "Kartu Keluarga", "Buku nikah"],
    waktu: "1 hari kerja", tema: "gold", aktif: true, urutan: 5,
  },
  {
    icon: "🏛️", judul: "Surat Keterangan Ahli Waris",
    syarat: ["KTP semua ahli waris", "Kartu Keluarga", "Surat kematian", "Akta kelahiran"],
    waktu: "3 hari kerja", tema: "forest", aktif: true, urutan: 6,
  },
];

export async function getAllLayanan(): Promise<LayananDesa[]> {
  try {
    const q    = query(collection(db, COL), orderBy("urutan", "asc"));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as LayananDesa));
  } catch {
    return [];
  }
}

export async function getAktifLayanan(): Promise<LayananDesa[]> {
  const all = await getAllLayanan();
  return all.filter((l) => l.aktif);
}

export async function seedLayanan(): Promise<number> {
  const existing = await getAllLayanan();
  if (existing.length > 0) return 0;
  for (const item of LAYANAN_DEFAULT) {
    await addDoc(collection(db, COL), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return LAYANAN_DEFAULT.length;
}

export async function createLayanan(
  data: Omit<LayananDesa, "id">
): Promise<string> {
  const ref = await addDoc(collection(db, COL), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateLayanan(
  id:   string,
  data: Partial<Omit<LayananDesa, "id">>
): Promise<void> {
  await updateDoc(doc(db, COL, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteLayanan(id: string): Promise<void> {
  await deleteDoc(doc(db, COL, id));
}