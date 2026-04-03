// File: desa-tolai-barat\app\(public)\page.tsx

import type { Metadata } from "next";
import HeroSection    from "@/components/home/HeroSection";
import StatsSection   from "@/components/home/StatsSection";
import BeritaSection  from "@/components/home/BeritaSection";
import LayananSection from "@/components/home/LayananSection";
// Import seksi baru
import WisataSection  from "@/components/home/WisataSection";
import MapSection     from "@/components/home/MapSection";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website resmi Desa Tolai Barat — informasi desa, berita terkini, " +
    "wisata Pantai Arjuna, dan layanan warga.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <WisataSection /> {/* Ditambahkan di sini */}
      <BeritaSection />
      <LayananSection />
      <MapSection />    {/* Ditambahkan di sini sebagai penutup sebelum footer */}
    </>
  );
}