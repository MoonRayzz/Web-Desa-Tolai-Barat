"use client";
import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { LAYANAN_DESA } from "@/data/mock";

const ICON_LAYANAN = ["📄", "🏠", "🏪", "💼", "🗺️", "🖼️"];

const WARNA: Record<string, { bg: string; border: string; icon: string }> = {
  ocean:  { bg: "#E0F4F7", border: "#5ECFDE", icon: "#0B5E6B" },
  gold:   { bg: "#FDF3C8", border: "#F5C842", icon: "#854F0B" },
  forest: { bg: "#EBF5E0", border: "#6FAB44", icon: "#2D5016" },
};

export default function LayananSection() {
  return (
    <section className="section-padding bg-ocean-gradient">
      <div className="container-desa">
        <SectionHeader
          badge="Layanan Desa"
          title="Apa yang Bisa Kami Bantu?"
          subtitle="Akses layanan administrasi dan informasi desa secara online."
          center
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "16px",
          marginTop: "48px",
        }}>
          {LAYANAN_DESA.map((l, i) => {
            const w = WARNA[l.warna] ?? WARNA.ocean;
            return (
              <Link
                key={l.label}
                href={l.href}
                style={{
                  display: "flex", flexDirection: "column",
                  alignItems: "center", textAlign: "center",
                  padding: "28px 16px",
                  background: "white",
                  border: `1px solid ${w.border}`,
                  borderRadius: "16px",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                  animation: "fadeUp 0.5s ease-out forwards",
                  animationDelay: `${i * 80}ms`,
                  opacity: 0,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = w.bg;
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = "white";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "52px", height: "52px",
                  background: w.bg,
                  borderRadius: "14px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "1.5rem", marginBottom: "14px",
                }}>
                  {ICON_LAYANAN[i]}
                </div>
                <span style={{
                  fontSize: "0.85rem", fontWeight: 500,
                  color: w.icon, lineHeight: 1.4,
                }}>
                  {l.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA banner */}
        <div style={{
          marginTop: "40px",
          background: "var(--color-ocean-700)",
          borderRadius: "20px",
          padding: "32px",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "20px",
        }}>
          <div>
            <h3 style={{
              fontFamily: "var(--font-display)", fontWeight: 600,
              fontSize: "1.25rem", color: "white", marginBottom: "8px",
            }}>
              Butuh bantuan layanan desa?
            </h3>
            <p style={{ color: "#94DFE9", fontSize: "0.9rem" }}>
              Hubungi kantor desa atau datang langsung pada jam kerja.
            </p>
          </div>
          <Link href="/kontak" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#F5C842", color: "#412402",
            fontWeight: 600, fontSize: "0.875rem",
            padding: "12px 24px", borderRadius: "12px",
            textDecoration: "none", flexShrink: 0,
          }}>
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  );
}