// File: lib/firebase/settings.ts

import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./config";
import { DusunData } from "@/types";

export interface DesaSettings {
  jumlahPenduduk: string;
  jumlahKK:       string;
  luasWilayah:    string;
  jumlahDusun:    string;
  rtRw:           string;
  kodePos:        string;
  dusunList:      DusunData[];
  sejarah:        string;
  visi:           string;
  misi:           string[];
  telepon:        string;
  email:          string;
  alamat:         string;
  jamLayanan:     string;
  whatsapp:       string;
  facebook:       string;
  instagram:      string;
  youtube:        string;
  koordinatLat:   string;
  koordinatLng:   string;
  googleMapsUrl:  string;
  batasUtara:     string;
  batasTimur:     string;
  batasSelatan:   string;
  batasBarat:     string;
  programUnggulan: { judul: string; isi: string }[];
  // --- DITAMBAHKAN: Logo Desa ---
  logoDesa:       string;
}

export const SETTINGS_DEFAULT: DesaSettings = {
  jumlahPenduduk: "1.666", jumlahKK: "550", luasWilayah: "1.240", jumlahDusun: "5", rtRw: "12 / 4", kodePos: "94473",
  dusunList: [
    { id: "d1", nama: "Dusun I Matampondo", kk: 123, lakiLaki: 189, perempuan: 194, total: 383 },
    { id: "d2", nama: "Dusun II Linggasari", kk: 78, lakiLaki: 107, perempuan: 109, total: 216 },
    { id: "d3", nama: "Dusun III Pantai Sari", kk: 96, lakiLaki: 155, perempuan: 129, total: 284 },
    { id: "d4", nama: "Dusun IV Mertasari", kk: 110, lakiLaki: 158, perempuan: 175, total: 333 },
    { id: "d5", nama: "Dusun V Gunung Sari", kk: 143, lakiLaki: 242, perempuan: 208, total: 450 },
  ],
  sejarah: "Desa Tolai Barat merupakan bagian dari wilayah yang berkembang...",
  visi: "Terwujudnya Desa Tolai Barat yang Maju, Mandiri, Sejahtera...",
  misi: ["Meningkatkan kualitas pelayanan publik..."],
  telepon: "(0451) xxx-xxxx", email: "desa@tolaibaratofc.id", alamat: "Jl. Desa Tolai Barat, Kec. Torue, Parigi Moutong 94473",
  jamLayanan: "Senin–Jumat, 08.00–15.00 WITA", whatsapp: "", facebook: "", instagram: "", youtube: "",
  koordinatLat: "-0.988611", koordinatLng: "120.330833", googleMapsUrl: "https://maps.google.com/?q=Tolai+Barat,+Torue,+Parigi+Moutong",
  batasUtara: "Desa Teluk Tomini", batasTimur: "Desa Tolai", batasSelatan: "Kabupaten Sigi", batasBarat: "Desa Purwosari & Torue",
  programUnggulan: [
    { judul: "Torue Berdaya", isi: "Penguatan UMKM & pariwisata berbasis digital." },
    { judul: "Pantai Arjuna", isi: "Destinasi wisata utama di pesisir Teluk Tomini." }
  ],
  // --- DEFAULT LOGO (Kosong) ---
  logoDesa: "",
};

const REF = () => doc(db, "settings", "desa");

export async function getDesaSettings(): Promise<DesaSettings> {
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return SETTINGS_DEFAULT;
    return { ...SETTINGS_DEFAULT, ...snap.data() } as DesaSettings;
  } catch { return SETTINGS_DEFAULT; }
}

export async function saveDesaSettings(data: DesaSettings): Promise<void> {
  await setDoc(REF(), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}