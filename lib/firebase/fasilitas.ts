// File: lib/firebase/fasilitas.ts

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";

export interface FasilitasData {
  pendidikan: { tk: number; sd: number; smp: number; sma: number };
  kesehatan:  { pustu: number; posyandu: number; polindes: number; apotek: number };
  ibadah:     { pura: number; masjid: number; gereja: number; vihara: number };
  olahraga:   { voli: number; sepakbola: number; bulutangkis: number; gor: number };
}

export const DEFAULT_FASILITAS: FasilitasData = {
  pendidikan: { tk: 3, sd: 1, smp: 0, sma: 1 },
  kesehatan:  { pustu: 1, posyandu: 5, polindes: 0, apotek: 0 },
  ibadah:     { pura: 5, masjid: 2, gereja: 1, vihara: 0 },
  olahraga:   { voli: 4, sepakbola: 1, bulutangkis: 0, gor: 0 },
};

const REF = () => doc(db, "settings", "fasilitas");

export async function getFasilitas(): Promise<FasilitasData> {
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return DEFAULT_FASILITAS;
    return { ...DEFAULT_FASILITAS, ...snap.data() } as FasilitasData;
  } catch {
    return DEFAULT_FASILITAS;
  }
}

export async function saveFasilitas(data: FasilitasData): Promise<void> {
  await setDoc(REF(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}