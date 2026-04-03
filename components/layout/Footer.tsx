"use client";
import Link from "next/link";

const COL_NAVIGASI = [
  { label: "Profil Desa",    href: "/profil"        },
  { label: "Pemerintahan",   href: "/pemerintahan"  },
  { label: "Berita Desa",    href: "/berita"        },
  { label: "Wisata",         href: "/wisata"        },
  { label: "UMKM Lokal",     href: "/umkm"          },
  { label: "Galeri",         href: "/galeri"        },
  { label: "Layanan",        href: "/layanan"       },
];

const COL_LAYANAN = [
  { label: "Surat Keterangan",    href: "/layanan" },
  { label: "Keterangan Domisili", href: "/layanan" },
  { label: "Keterangan Usaha",    href: "/layanan" },
  { label: "Data Kependudukan",   href: "/layanan" },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--color-ocean-900)", color: "white" }}>

      {/* Main content */}
      <div className="container-desa" style={{ paddingTop: "64px", paddingBottom: "64px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "40px",
        }}>

          {/* Kolom 1: Info desa */}
          <div style={{ gridColumn: "span 1" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{
                width: 42, height: 42, borderRadius: "12px",
                background: "var(--color-ocean-700)",
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}>
                <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3C10 3 5 7 5 11.5C5 14.3 7.2 16.5 10 16.5C12.8 16.5 15 14.3 15 11.5C15 7 10 3 10 3Z"
                    fill="white" opacity="0.9"/>
                  <path d="M10 8C10 8 7.5 10 7.5 11.5C7.5 12.9 8.6 14 10 14C11.4 14 12.5 12.9 12.5 11.5C12.5 10 10 8 10 8Z"
                    fill="#F5C842"/>
                </svg>
              </div>
              <div>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 600,
                  fontSize: "1rem", color: "white",
                }}>
                  Desa Tolai Barat
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--color-ocean-300)", marginTop: "2px" }}>
                  Website Resmi
                </div>
              </div>
            </div>

            <p style={{
              color: "var(--color-ocean-300)", fontSize: "0.85rem",
              lineHeight: 1.75, marginBottom: "20px",
            }}>
              Desa di pesisir Teluk Tomini, Kecamatan Torue, Kabupaten Parigi Moutong, Sulawesi Tengah.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.82rem", color: "var(--color-ocean-300)" }}>
              <span>📍 Kec. Torue, Parigi Moutong 94473</span>
              <span>📞 (0451) xxx-xxxx</span>
              <span>✉️ desa@tolaibaratofc.id</span>
            </div>
          </div>

          {/* Kolom 2: Navigasi */}
          <div>
            <h4 style={{
              fontWeight: 600, fontSize: "0.85rem",
              color: "white", marginBottom: "18px",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Navigasi
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {COL_NAVIGASI.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} style={{
                    color: "var(--color-ocean-300)", fontSize: "0.875rem",
                    textDecoration: "none", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "white"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-ocean-300)"}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 3: Layanan */}
          <div>
            <h4 style={{
              fontWeight: 600, fontSize: "0.85rem",
              color: "white", marginBottom: "18px",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Layanan Desa
            </h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "10px" }}>
              {COL_LAYANAN.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} style={{
                    color: "var(--color-ocean-300)", fontSize: "0.875rem",
                    textDecoration: "none", transition: "color 0.2s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = "white"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = "var(--color-ocean-300)"}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kolom 4: Program */}
          <div>
            <h4 style={{
              fontWeight: 600, fontSize: "0.85rem",
              color: "white", marginBottom: "18px",
              textTransform: "uppercase", letterSpacing: "0.06em",
            }}>
              Program Desa
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[{ judul: "Torue Berdaya", warna: "var(--color-gold-400)",  isi: "Penguatan UMKM & pariwisata berbasis digital." },
                { judul: "Pantai Arjuna", warna: "var(--color-ocean-400)", isi: "Destinasi wisata utama di pesisir Teluk Tomini." }].map((p) => (
                <div key={p.judul} style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "12px", padding: "14px",
                }}>
                  <div style={{ color: p.warna, fontSize: "0.78rem", fontWeight: 600, marginBottom: "6px" }}>
                    {p.judul}
                  </div>
                  <div style={{ color: "var(--color-ocean-300)", fontSize: "0.78rem", lineHeight: 1.6 }}>
                    {p.isi}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}></div>
    </footer>
  );
}