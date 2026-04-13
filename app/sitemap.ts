import type { MetadataRoute } from "next";
import { getBeritaPublished } from "@/lib/firebase/berita";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Mengambil URL dari env atau menggunakan domain yang terdaftar di Google Search Console
  const rawBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://desa-tolai-barat.vercel.app";
  
  // Membuang garis miring (/) di akhir URL jika ada, untuk mencegah double slash (//)
  const baseUrl = rawBaseUrl.replace(/\/$/, "");

  // Daftar halaman statis utama
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/profil`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/berita`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/wisata`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/umkm`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/galeri`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/layanan`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  ];

  // Daftar halaman dinamis dari Firebase (Berita)
  let beritaPages: MetadataRoute.Sitemap = [];
  
  try {
    const beritaList = await getBeritaPublished(100);
    
    beritaPages = beritaList.map((b) => ({
      url: `${baseUrl}/berita/${b.slug}`,
      lastModified: b.publishedAt ? new Date(b.publishedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Gagal memuat sitemap berita:", error);
  }
  
  // Menggabungkan halaman statis dan halaman dinamis
  return [...staticPages, ...beritaPages];
}