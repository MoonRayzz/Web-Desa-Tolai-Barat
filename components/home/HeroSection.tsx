"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
// Import fungsi ambil pengaturan dari Firebase
import { getDesaSettings } from "@/lib/firebase/settings";

// Nilai cadangan saat data sedang di-load dari database
const STAT_FALLBACK = [
  { label: "Jumlah Penduduk", value: "...", unit: "jiwa",  icon: "👥" },
  { label: "Kepala Keluarga", value: "...", unit: "KK",    icon: "🏠" },
  { label: "Luas Wilayah",    value: "...", unit: "Ha",    icon: "🗺️" },
  { label: "Jumlah Dusun",    value: "...", unit: "dusun", icon: "🌿" },
  { label: "RT / RW",         value: "...", unit: "",      icon: "📍" },
  { label: "Kode Pos",        value: "...", unit: "",      icon: "📮" },
];

export default function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [stats, setStats] = useState(STAT_FALLBACK);

  useEffect(() => {
    // 1. Jalankan animasi fade in
    const el = ref.current;
    if (el) {
      requestAnimationFrame(() => {
        el.style.opacity   = "1";
        el.style.transform = "translateY(0)";
      });
    }

    // 2. Ambil data statistik dari Firebase secara asinkron
    getDesaSettings().then((s) => {
      setStats([
        { label: "Jumlah Penduduk", value: s.jumlahPenduduk, unit: "jiwa",  icon: "👥" },
        { label: "Kepala Keluarga", value: s.jumlahKK,       unit: "KK",    icon: "🏠" },
        { label: "Luas Wilayah",    value: s.luasWilayah,    unit: "Ha",    icon: "🗺️" },
        { label: "Jumlah Dusun",    value: s.jumlahDusun,    unit: "dusun", icon: "🌿" },
        { label: "RT / RW",         value: s.rtRw,           unit: "",      icon: "📍" },
        { label: "Kode Pos",        value: s.kodePos,        unit: "",      icon: "📮" },
      ]);
    });
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-hero-gradient" />

      {/* Decorative blobs */}
      <div
        className="absolute top-1/3 -right-40 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "rgb(26 138 156 / 0.2)", filter: "blur(80px)" }}
      />
      <div
        className="absolute -bottom-10 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: "rgb(212 160 23 / 0.1)", filter: "blur(80px)" }}
      />

      {/* Wave */}
      <div className="absolute bottom-0 left-0 right-0 z-10 pointer-events-none">
        <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none" style={{ width: "100%", height: "60px", display: "block" }}>
          <path
            d="M0 55 C360 25 720 75 1080 45 C1260 30 1360 60 1440 55 L1440 80 L0 80 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 container-desa pb-24 pt-32 md:pt-36">
        <div
          ref={ref}
          style={{
            maxWidth: "48rem",
            opacity: 0,
            transform: "translateY(28px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
          }}
        >
          {/* Badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgb(212 160 23 / 0.15)",
            border: "1px solid rgb(245 200 66 / 0.3)",
            color: "#FAD970", fontSize: "0.75rem", fontWeight: 500,
            padding: "6px 16px", borderRadius: "9999px", marginBottom: "24px",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#F5C842", display: "inline-block",
              animation: "pulse 4s cubic-bezier(0.4,0,0.6,1) infinite",
            }} />
            Desa Wisata Teluk Tomini · Program Torue Berdaya
          </div>

          {/* Heading */}
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.5rem, 7vw, 5rem)",
            fontWeight: 700, color: "white",
            lineHeight: 1.1, marginBottom: "16px",
          }}>
            Desa{" "}
            <span style={{ color: "#F5C842" }}>Tolai</span>
            {" "}Barat
          </h1>

          {/* Sub */}
          <p style={{ color: "#94DFE9", fontSize: "1.125rem", marginBottom: "20px" }}>
            Kecamatan Torue · Kabupaten Parigi Moutong · Sulawesi Tengah
          </p>

          {/* Desc */}
          <p style={{
            color: "rgb(148 223 233 / 0.85)",
            fontSize: "1rem", lineHeight: 1.75,
            maxWidth: "36rem", marginBottom: "40px",
          }}>
            Pesisir Teluk Tomini yang indah, kearifan lokal yang terjaga, dan
            semangat masyarakat yang berdaya.
          </p>

          {/* CTA */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginBottom: "56px" }}>
            <Link href="/profil" className="btn-primary"
              style={{ padding: "14px 28px", fontSize: "1rem" }}>
              Jelajahi Desa
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8H13M9 4L13 8L9 12" stroke="currentColor"
                  strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/wisata" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: "rgb(255 255 255 / 0.1)",
              border: "1px solid rgb(255 255 255 / 0.2)",
              color: "white", fontWeight: 500, fontSize: "1rem",
              padding: "14px 28px", borderRadius: "12px",
              transition: "background 0.2s", textDecoration: "none",
            }}>
              Wisata Lokal
            </Link>
          </div>

          {/* Stats Grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: "12px",
          }}>
            {/* Loop menggunakan variabel "stats" yang berisi data dari database */}
            {stats.map((s, i) => (
              <div key={s.label} style={{
                background: "rgb(255 255 255 / 0.08)",
                border: "1px solid rgb(255 255 255 / 0.12)",
                borderRadius: "16px", padding: "16px", textAlign: "center",
                animation: "fadeUp 0.6s ease-out forwards",
                animationDelay: `${i * 80 + 500}ms`,
                opacity: 0,
              }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{s.icon}</div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700, fontSize: "1.25rem",
                  color: "#F5C842", lineHeight: 1,
                }}>
                  {s.value}
                </div>
                {s.unit && (
                  <div style={{ color: "rgb(245 200 66 / 0.6)", fontSize: "0.7rem", marginTop: "2px" }}>
                    {s.unit}
                  </div>
                )}
                <div style={{ color: "#94DFE9", fontSize: "0.7rem", marginTop: "6px", fontWeight: 500 }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}