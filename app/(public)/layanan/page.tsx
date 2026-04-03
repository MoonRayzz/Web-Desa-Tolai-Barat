
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Layanan Desa",
  description: "Informasi layanan administrasi Desa Tolai Barat.",
};

const LAYANAN = [
  {
    icon: "📄",
    judul: "Surat Keterangan Domisili",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Surat pengantar RT/RW"],
    waktu: "1 hari kerja",
    warna: "var(--color-ocean-100)",
    border: "var(--color-ocean-400)",
  },
  {
    icon: "🏠",
    judul: "Surat Keterangan Tidak Mampu",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Surat pengantar RT/RW", "Foto rumah"],
    waktu: "2 hari kerja",
    warna: "var(--color-gold-100)",
    border: "var(--color-gold-400)",
  },
  {
    icon: "🏪",
    judul: "Surat Keterangan Usaha",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Foto usaha", "Deskripsi usaha"],
    waktu: "1 hari kerja",
    warna: "var(--color-forest-100)",
    border: "var(--color-forest-400)",
  },
  {
    icon: "📋",
    judul: "Surat Pengantar SKCK",
    syarat: ["KTP asli dan fotokopi", "Kartu Keluarga", "Pas foto 4x6 (2 lembar)"],
    waktu: "1 hari kerja",
    warna: "var(--color-ocean-100)",
    border: "var(--color-ocean-400)",
  },
  {
    icon: "👶",
    judul: "Surat Keterangan Kelahiran",
    syarat: ["Surat keterangan lahir dari bidan/dokter", "KTP orang tua", "Kartu Keluarga", "Buku nikah orang tua"],
    waktu: "1 hari kerja",
    warna: "var(--color-gold-100)",
    border: "var(--color-gold-400)",
  },
  {
    icon: "🏛️",
    judul: "Surat Keterangan Ahli Waris",
    syarat: ["KTP semua ahli waris", "Kartu Keluarga", "Surat kematian", "Akta kelahiran (jika ada)"],
    waktu: "3 hari kerja",
    warna: "var(--color-forest-100)",
    border: "var(--color-forest-400)",
  },
];

export default function LayananPage() {
  return (
    <>
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "white", marginBottom: "12px",
          }}>
            Layanan Administrasi Desa
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1rem", maxWidth: "520px", margin: "0 auto" }}>
            Informasi persyaratan dan prosedur layanan Desa Tolai Barat
          </p>
        </div>
      </div>

      {/* Info jam */}
      <div style={{ background: "var(--color-gold-500)", padding: "14px 0" }}>
        <div className="container-desa" style={{
          display: "flex", flexWrap: "wrap", gap: "24px",
          justifyContent: "center", fontSize: "0.875rem",
          color: "var(--color-gold-900)", fontWeight: 500,
        }}>
          <span>🕐 Jam Pelayanan: Senin–Jumat, 08.00–15.00 WITA</span>
          <span>📍 Kantor Desa Tolai Barat, Kec. Torue</span>
          <span>📞 (0451) xxx-xxxx</span>
        </div>
      </div>

      <section className="section-padding" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "24px",
          }}>
            {LAYANAN.map((l) => (
              <div key={l.judul} style={{
                background: "white", borderRadius: "20px",
                border: `1px solid ${l.border}`,
                overflow: "hidden", boxShadow: "var(--shadow-card)",
              }}>
                <div style={{
                  background: l.warna, padding: "20px 24px",
                  display: "flex", alignItems: "center", gap: "14px",
                  borderBottom: `1px solid ${l.border}`,
                }}>
                  <span style={{ fontSize: "2rem" }}>{l.icon}</span>
                  <div>
                    <h2 style={{
                      fontFamily: "var(--font-display)", fontWeight: 600,
                      fontSize: "1rem", color: "var(--color-ocean-900)",
                    }}>
                      {l.judul}
                    </h2>
                    <span style={{
                      fontSize: "0.72rem", color: "var(--color-ocean-600)",
                      background: "white", padding: "2px 8px",
                      borderRadius: "9999px", marginTop: "4px", display: "inline-block",
                    }}>
                      ⏱️ {l.waktu}
                    </span>
                  </div>
                </div>
                <div style={{ padding: "20px 24px" }}>
                  <div style={{ fontSize: "0.78rem", color: "var(--color-ocean-500)", fontWeight: 600, marginBottom: "10px", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Persyaratan
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px" }}>
                    {l.syarat.map((s, i) => (
                      <li key={i} style={{ display: "flex", gap: "10px", alignItems: "flex-start", fontSize: "0.875rem", color: "var(--color-ocean-800)" }}>
                        <span style={{ color: "var(--color-ocean-400)", flexShrink: 0 }}>✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Kontak CTA */}
          <div style={{
            marginTop: "48px", background: "var(--color-ocean-900)",
            borderRadius: "24px", padding: "40px",
            display: "flex", flexWrap: "wrap", gap: "24px",
            alignItems: "center", justifyContent: "space-between",
          }}>
            <div>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "1.35rem", color: "white", marginBottom: "8px",
              }}>
                Ada pertanyaan tentang layanan?
              </h2>
              <p style={{ color: "var(--color-ocean-300)", fontSize: "0.9rem" }}>
                Hubungi kami langsung atau kunjungi kantor desa pada jam pelayanan.
              </p>
            </div>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="tel:+62451xxxxxx" className="btn-primary"
                style={{ padding: "12px 24px" }}>
                📞 Telepon Desa
              </a>
              <a href="https://wa.me/62xxxxxxxxxx" target="_blank" rel="noreferrer"
                className="btn-gold" style={{ padding: "12px 24px" }}>
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}