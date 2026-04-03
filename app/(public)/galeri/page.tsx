"use client";

import { useState } from "react";
import { GALERI_MOCK } from "@/data/mock";

const KATEGORI = [
  { value: "semua",         label: "Semua"           },
  { value: "wisata",        label: "🏖️ Wisata"      },
  { value: "kegiatan",      label: "🎉 Kegiatan"     },
  { value: "infrastruktur", label: "🏗️ Infrastruktur"},
  { value: "budaya",        label: "🎭 Budaya"       },
];

export default function GaleriPage() {
  const [aktif, setAktif]     = useState("semua");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const filtered = aktif === "semua"
    ? GALERI_MOCK
    : GALERI_MOCK.filter((g) => g.kategori === aktif);

  const EMOJI_MAP: Record<string, string> = {
    wisata: "🏖️", kegiatan: "🎉", infrastruktur: "🏗️", budaya: "🎭",
  };

  const WARNA_MAP: Record<string, string> = {
    wisata: "var(--color-ocean-700)",
    kegiatan: "var(--color-gold-600)",
    infrastruktur: "var(--color-forest-700)",
    budaya: "#7C3AED",
  };

  return (
    <>
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "white", marginBottom: "12px",
          }}>
            Galeri Desa
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1rem" }}>
            Momen dan dokumentasi kegiatan Desa Tolai Barat
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">

          {/* Filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "36px" }}>
            {KATEGORI.map((k) => (
              <button
                key={k.value}
                onClick={() => setAktif(k.value)}
                className={`filter-btn ${aktif === k.value ? "active" : ""}`}
              >
                {k.label}
              </button>
            ))}
          </div>

          {/* Masonry-style grid */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
            gap: "16px",
          }}>
            {filtered.map((g, i) => (
              <div
                key={g.id}
                className="card-hover img-zoom"
                onClick={() => setLightbox(g.caption)}
                style={{
                  borderRadius: "16px", overflow: "hidden",
                  cursor: "pointer", position: "relative",
                  aspectRatio: i % 5 === 0 ? "1/1.2" : "1/1",
                  background: WARNA_MAP[g.kategori] ?? "var(--color-ocean-700)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "3.5rem",
                  animation: "fadeUp 0.4s ease-out forwards",
                  animationDelay: `${(i % 6) * 60}ms`,
                  opacity: 0,
                }}
              >
                <span>{EMOJI_MAP[g.kategori] ?? "📷"}</span>
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
                  padding: "40px 14px 14px",
                }}>
                  <div style={{ color: "white", fontSize: "0.82rem", fontWeight: 500 }}>
                    {g.caption}
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", marginTop: "2px" }}>
                    {g.kategori}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "20px",
          }}
        >
          <div style={{
            background: "var(--color-ocean-900)", borderRadius: "20px",
            padding: "40px", textAlign: "center", maxWidth: "480px", width: "100%",
          }}
          onClick={(e) => e.stopPropagation()}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>🖼️</div>
            <p style={{ color: "white", fontSize: "1rem", fontWeight: 500, marginBottom: "8px" }}>
              {lightbox}
            </p>
            <p style={{ color: "var(--color-ocean-400)", fontSize: "0.82rem", marginBottom: "24px" }}>
              Foto akan tampil setelah gambar diunggah admin
            </p>
            <button
              onClick={() => setLightbox(null)}
              className="btn-primary"
              style={{ padding: "10px 24px" }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}