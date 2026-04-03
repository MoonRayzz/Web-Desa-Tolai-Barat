// app/(public)/galeri/GaleriClient.tsx
"use client";

import { useState } from "react";
import type { GaleriItem } from "@/lib/firebase/galeri";

const KATEGORI = [
  { value: "semua",         label: "Semua"            },
  { value: "wisata",        label: "🏖️ Wisata"       },
  { value: "kegiatan",      label: "🎉 Kegiatan"      },
  { value: "infrastruktur", label: "🏗️ Infrastruktur" },
  { value: "budaya",        label: "🎭 Budaya"        },
];

const WARNA: Record<string, string> = {
  wisata: "var(--color-ocean-700)", kegiatan: "var(--color-gold-600)",
  infrastruktur: "var(--color-forest-700)", budaya: "#7C3AED",
};
const EMOJI: Record<string, string> = {
  wisata: "🏖️", kegiatan: "🎉", infrastruktur: "🏗️", budaya: "🎭",
};

export default function GaleriClient({ initialData }: { initialData: GaleriItem[] }) {
  const [aktif, setAktif]       = useState("semua");
  const [lightbox, setLightbox] = useState<GaleriItem | null>(null);

  const filtered = aktif === "semua"
    ? initialData
    : initialData.filter((g) => g.kategori === aktif);

  return (
    <>
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", marginBottom: "12px" }}>
            Galeri Desa
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1rem" }}>
            Momen dan dokumentasi kegiatan Desa Tolai Barat
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
            {KATEGORI.map((k) => (
              <button key={k.value} onClick={() => setAktif(k.value)}
                className={`filter-btn ${aktif === k.value ? "active" : ""}`}>
                {k.label}
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px" }}>
            {filtered.map((g, i) => (
              <div key={g.id} onClick={() => setLightbox(g)}
                className="card-hover img-zoom"
                style={{ borderRadius: "16px", overflow: "hidden", cursor: "pointer", position: "relative" as const, aspectRatio: i % 5 === 0 ? "1/1.2" : "1/1", background: WARNA[g.kategori] ?? "var(--color-ocean-700)", display: "flex", alignItems: "center", justifyContent: "center", animation: "fadeUp 0.4s ease-out forwards", animationDelay: `${(i % 6) * 60}ms`, opacity: 0 }}>
                {g.imageUrl && !g.imageUrl.includes("placeholder") ? (
                  <img src={g.imageUrl} alt={g.caption}
                    style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute" as const, inset: 0 }} />
                ) : (
                  <span style={{ fontSize: "3.5rem" }}>{EMOJI[g.kategori] ?? "📷"}</span>
                )}
                <div style={{ position: "absolute" as const, bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)", padding: "40px 14px 14px" }}>
                  <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 500 }}>{g.caption}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed" as const, inset: 0, zIndex: 100, background: "rgba(0,0,0,0.9)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "var(--color-ocean-900)", borderRadius: "20px", padding: "20px", maxWidth: "700px", width: "100%" }}>
            {lightbox.imageUrl && !lightbox.imageUrl.includes("placeholder") ? (
              <img src={lightbox.imageUrl} alt={lightbox.caption}
                style={{ width: "100%", borderRadius: "12px", marginBottom: "12px" }} />
            ) : (
              <div style={{ height: "300px", background: WARNA[lightbox.kategori], borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "4rem", marginBottom: "12px" }}>
                {EMOJI[lightbox.kategori] ?? "📷"}
              </div>
            )}
            <p style={{ color: "white", fontSize: "0.95rem", fontWeight: 500, textAlign: "center", marginBottom: "16px" }}>
              {lightbox.caption}
            </p>
            <button onClick={() => setLightbox(null)} className="btn-primary" style={{ display: "block", width: "100%", padding: "11px" }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}