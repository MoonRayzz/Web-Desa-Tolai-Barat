import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { BERITA_MOCK } from "@/data/mock";
import { formatTanggal } from "@/lib/utils";

const WARNA_KATEGORI: Record<string, { bg: string; text: string }> = {
  pengumuman:   { bg: "#E0F4F7", text: "#0B5E6B" },
  berita:       { bg: "#EBF5E0", text: "#2D5016" },
  kegiatan:     { bg: "#FDF3C8", text: "#854F0B" },
  pembangunan:  { bg: "#F3EEFF", text: "#5B21B6" },
};

export default function BeritaSection() {
  return (
    <section className="section-padding" style={{ background: "white" }}>
      <div className="container-desa">

        {/* Header + link */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px" }}>
          <SectionHeader
            badge="Terkini"
            title="Berita & Informasi"
            subtitle="Kabar terbaru dari Desa Tolai Barat."
          />
          <Link href="/berita" className="btn-ghost"
            style={{ flexShrink: 0, marginLeft: "16px" }}>
            Lihat semua
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7H12M8 3L12 7L8 11" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

        {/* Grid 3 kartu */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "24px",
        }}>
          {BERITA_MOCK.map((b, i) => {
            const warna = WARNA_KATEGORI[b.kategori] ?? WARNA_KATEGORI.berita;
            return (
              <Link
                key={b.id}
                href={`/berita/${b.slug}`}
                className="card-base"
                style={{
                  textDecoration: "none",
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: `${i * 100}ms`,
                  opacity: 0,
                }}
              >
                {/* Placeholder gambar */}
                <div style={{
                  height: "180px",
                  background: `linear-gradient(135deg, var(--color-ocean-800), var(--color-ocean-600))`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2.5rem",
                }}>
                  {b.kategori === "kegiatan"    ? "🏖️"
                  : b.kategori === "pengumuman" ? "📢"
                  : b.kategori === "pembangunan"? "🏗️"
                  : "📰"}
                </div>

                {/* Body */}
                <div style={{ padding: "20px" }}>
                  <span style={{
                    ...warna, fontSize: "0.7rem", fontWeight: 600,
                    padding: "3px 10px", borderRadius: "9999px",
                    display: "inline-block", marginBottom: "10px",
                    textTransform: "capitalize",
                  }}>
                    {b.kategori}
                  </span>

                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1rem", fontWeight: 600,
                    color: "var(--color-ocean-900)",
                    lineHeight: 1.4, marginBottom: "8px",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>
                    {b.title}
                  </h3>

                  <p style={{
                    fontSize: "0.85rem", color: "var(--color-ocean-700)",
                    lineHeight: 1.6, marginBottom: "16px",
                    display: "-webkit-box", WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                  }}>
                    {b.excerpt}
                  </p>

                  <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", fontSize: "0.75rem",
                    color: "var(--color-ocean-500)",
                    borderTop: "1px solid var(--color-ocean-100)",
                    paddingTop: "12px",
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
  );
}