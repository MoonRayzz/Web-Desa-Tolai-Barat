// Tipe data utama — dipakai di seluruh project

export type BeritaKategori =
  | "pengumuman" | "berita" | "kegiatan" | "pembangunan";

export interface Berita {
  id:          string;
  title:       string;
  slug:        string;
  excerpt:     string;
  coverImage:  string;
  kategori:    BeritaKategori;
  author:      string;
  publishedAt: string;   // ISO date string
  views:       number;
  content: string;
}

export type WisataKategori = "bahari" | "alam" | "budaya" | "religi";

export interface Wisata {
  id:          string;
  name:        string;
  description: string;
  image:       string;
  kategori:    WisataKategori;
  featured:    boolean;
}

export type UmkmKategori =
  | "kuliner" | "kerajinan" | "pertanian" | "perikanan" | "jasa";

export interface Umkm {
  id:          string;
  name:        string;
  owner:       string;
  description: string;
  image:       string;
  kategori:    UmkmKategori;
  whatsapp:    string | null;
}

export interface PerangkatDesa {
  id:           string;
  name:         string;
  jabatan:      string;
  photo:        string | null;
  urutan:       number;
}

export interface StatDesa {
  label: string;
  value: string;
  unit:  string;
  icon:  string;
}