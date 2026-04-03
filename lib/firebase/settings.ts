import {
  doc, getDoc, setDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "./config";

export interface DesaSettings {
  // Statistik
  jumlahPenduduk: string;
  jumlahKK:       string;
  luasWilayah:    string;
  jumlahDusun:    string;
  rtRw:           string;
  kodePos:        string;
  // Profil
  sejarah:        string;
  visi:           string;
  misi:           string[];
  // Kontak
  telepon:        string;
  email:          string;
  alamat:         string;
  jamLayanan:     string;
  // Sosmed
  whatsapp:       string;
  facebook:       string;
  instagram:      string;
  youtube:        string;
  // Lokasi
  koordinatLat:   string;
  koordinatLng:   string;
  googleMapsUrl:  string;
}

export const SETTINGS_DEFAULT: DesaSettings = {
  jumlahPenduduk: "2.412",
  jumlahKK:       "687",
  luasWilayah:    "1.240",
  jumlahDusun:    "3",
  rtRw:           "12 / 4",
  kodePos:        "94473",
  sejarah:
    "Desa Tolai Barat merupakan bagian dari wilayah yang berkembang seiring " +
    "program transmigrasi di Kabupaten Parigi Moutong sejak era 1967–1968. " +
    "Seiring berjalannya waktu, komunitas yang awalnya merupakan kawasan " +
    "transmigrasi berkembang menjadi desa yang mandiri dengan identitas budaya " +
    "yang kuat — perpaduan antara kearifan lokal Sulawesi dengan budaya para transmigran.",
  visi:
    "Terwujudnya Desa Tolai Barat yang Maju, Mandiri, Sejahtera, dan " +
    "Berdaya Saing Berbasis Potensi Lokal.",
  misi: [
    "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel",
    "Mengembangkan potensi wisata bahari dan agrowisata secara berkelanjutan",
    "Memperkuat UMKM lokal melalui digitalisasi dan akses permodalan",
    "Membangun infrastruktur desa yang merata dan berkualitas",
    "Melestarikan kearifan lokal dan budaya masyarakat",
  ],
  telepon:    "(0451) xxx-xxxx",
  email:      "desa@tolaibaratofc.id",
  alamat:     "Jl. Desa Tolai Barat, Kec. Torue, Parigi Moutong 94473",
  jamLayanan: "Senin–Jumat, 08.00–15.00 WITA",
  whatsapp:   "",
  facebook:   "",
  instagram:  "",
  youtube:    "",
  koordinatLat:  "-0.988611",
  koordinatLng:  "120.330833",
  googleMapsUrl:
    "https://maps.google.com/?q=Tolai+Barat,+Torue,+Parigi+Moutong",
};

const REF = () => doc(db, "settings", "desa");

export async function getDesaSettings(): Promise<DesaSettings> {
  try {
    const snap = await getDoc(REF());
    if (!snap.exists()) return SETTINGS_DEFAULT;
    return { ...SETTINGS_DEFAULT, ...snap.data() } as DesaSettings;
  } catch {
    return SETTINGS_DEFAULT;
  }
}

export async function saveDesaSettings(data: DesaSettings): Promise<void> {
  await setDoc(
    REF(),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true }
  );
}