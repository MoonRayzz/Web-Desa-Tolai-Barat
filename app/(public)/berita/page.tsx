import type { Metadata } from "next";
import Link from "next/link";
import { getBeritaPublished } from "@/lib/firebase/berita";
import { BERITA_MOCK } from "@/data/mock";
import { formatTanggal } from "@/lib/utils";
import type { Berita } from "@/types";

export const metadata: Metadata = {
  title: "Berita & Informasi",
  description: "Berita dan informasi terkini dari Desa Tolai Barat.",
};

export const revalidate = 60;

const WARNA: Record<string, { bg: string; text: string }> = {
  pengumuman:  { bg: "#E0F4F7", text: "#0B5E6B" },
  berita:      { bg: "#EBF5E0", text: "#2D5016" },
  kegiatan:    { bg: "#FDF3C8", text: "#854F0B" },
  pembangunan: { bg: "#F3EEFF", text: "#5B21B6" },
};

export default async function BeritaPage() {
  // Coba ambil dari Firestore, fallback ke mock kalau kosong/error
  let beritaList: Berita[] = await getBeritaPublished(20);
  if (beritaList.length === 0) beritaList = BERITA_MOCK;

  return (
    <>
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "white", marginBottom: "12px",
          }}>
            Berita & Informasi
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1rem" }}>
            {beritaList.length} artikel tersedia
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "24px",
          }}>
            {beritaList.map((b) => {
              const w = WARNA[b.kategori] ?? WARNA.berita;
              return (
                <Link key={b.id} href={`/berita/${b.slug}`}
                  className="card-base card-hover"
                  style={{ textDecoration: "none", display: "block" }}>
                  <div style={{
                    height: "200px",
                    background: "linear-gradient(135deg, var(--color-ocean-800), var(--color-ocean-600))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "3rem",
                  }}>
                    {b.kategori === "kegiatan"    ? "🏖️"
                    : b.kategori === "pengumuman" ? "📢"
                    : b.kategori === "pembangunan"? "🏗️"
                    : "📰"}
                  </div>
                  <div style={{ padding: "20px" }}>
                    <span style={{
                      ...w, fontSize: "0.7rem", fontWeight: 600,
                      padding: "3px 10px", borderRadius: "9999px",
                      display: "inline-block", marginBottom: "10px",
                      textTransform: "capitalize",
                    }}>
                      {b.kategori}
                    </span>
                    <h2 style={{
                      fontFamily: "var(--font-display)", fontWeight: 600,
                      fontSize: "1rem", color: "var(--color-ocean-900)",
                      lineHeight: 1.45, marginBottom: "10px",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    }}>
                      {b.title}
                    </h2>
                    <p style={{
                      fontSize: "0.85rem", color: "var(--color-ocean-600)",
                      lineHeight: 1.65, marginBottom: "16px",
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                    }}>
                      {b.excerpt}
                    </p>
                    <div style={{
                      display: "flex", justifyContent: "space-between",
                      fontSize: "0.75rem", color: "var(--color-ocean-400)",
                      borderTop: "1px solid var(--color-ocean-100)", paddingTop: "12px",
                    }}>
                      <span>{formatTanggal(b.publishedAt)}</span>
                      <span>{b.views} pembaca</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}