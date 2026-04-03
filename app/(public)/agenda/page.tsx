import type { Metadata } from "next";
import { getAllPengumuman, isExpired, isUpcoming } from "@/lib/firebase/pengumuman";
import type { Pengumuman } from "@/types";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "Agenda dan Pengumuman",
  description: "Agenda kegiatan dan pengumuman resmi Desa Tolai Barat.",
};

const PRIORITY_STYLE: Record<string, { label: string; bg: string; text: string }> = {
  darurat: { label: "Darurat", bg: "#FEE2E2", text: "#991B1B" },
  penting: { label: "Penting", bg: "#FDF3C8", text: "#854F0B" },
  normal:  { label: "Normal",  bg: "#E0F4F7", text: "#0B5E6B" },
};

function ItemCard({ item }: { item: Pengumuman }) {
  const pr      = PRIORITY_STYLE[item.priority] ?? PRIORITY_STYLE.normal;
  const expired = isExpired(item.endDate);
  const upcoming = isUpcoming(item.startDate);

  const startLabel = new Date(item.startDate + "T00:00:00").toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });

  const endLabel = item.endDate
    ? new Date(item.endDate + "T00:00:00").toLocaleDateString("id-ID", {
        day: "numeric", month: "long", year: "numeric",
      })
    : null;

  return (
    <div style={{
      background: "white",
      borderRadius: "16px",
      padding: "20px 22px",
      boxShadow: "var(--shadow-card)",
      border: "1px solid var(--color-ocean-100)",
      opacity: expired ? 0.6 : 1,
    }}>
      {/* Badges */}
      <div style={{ display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span style={{
          background: item.type === "agenda" ? "var(--color-forest-100)" : "var(--color-ocean-100)",
          color:      item.type === "agenda" ? "var(--color-forest-700)" : "var(--color-ocean-700)",
          fontSize: "0.68rem", fontWeight: 600,
          padding: "2px 9px", borderRadius: "9999px",
        }}>
          {item.type === "agenda" ? "Agenda" : "Pengumuman"}
        </span>
        <span style={{
          background: pr.bg, color: pr.text,
          fontSize: "0.68rem", fontWeight: 600,
          padding: "2px 9px", borderRadius: "9999px",
        }}>
          {pr.label}
        </span>
        {expired && (
          <span style={{ background: "#F1F5F9", color: "#64748B", fontSize: "0.68rem", fontWeight: 600, padding: "2px 9px", borderRadius: "9999px" }}>
            Selesai
          </span>
        )}
        {upcoming && !expired && (
          <span style={{ background: "#F3EEFF", color: "#5B21B6", fontSize: "0.68rem", fontWeight: 600, padding: "2px 9px", borderRadius: "9999px" }}>
            Segera
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "var(--font-display)", fontWeight: 600,
        fontSize: "1.05rem", color: "var(--color-ocean-900)",
        lineHeight: 1.45, marginBottom: "8px",
      }}>
        {item.title}
      </h3>

      {/* Content */}
      {item.content.trim() !== "" && (
        <p style={{
          fontSize: "0.875rem", color: "var(--color-ocean-700)",
          lineHeight: 1.7, marginBottom: "14px",
        }}>
          {item.content}
        </p>
      )}

      {/* Dates */}
      <div style={{
        display: "flex", gap: "16px", flexWrap: "wrap",
        fontSize: "0.78rem", color: "var(--color-ocean-500)",
        paddingTop: "12px", borderTop: "1px solid var(--color-ocean-100)",
      }}>
        <span>Mulai: {startLabel}</span>
        {endLabel && <span>Selesai: {endLabel}</span>}
      </div>
    </div>
  );
}

export default async function AgendaPage() {
  const all = await getAllPengumuman();

  const pengumumanAktif = all.filter(
    (p) => p.type === "pengumuman" && p.aktif && !isExpired(p.endDate)
  );
  const agendaAktif = all.filter(
    (p) => p.type === "agenda" && p.aktif
  );
  const arsip = all.filter(
    (p) => !p.aktif || isExpired(p.endDate)
  );

  const isEmpty = pengumumanAktif.length === 0 && agendaAktif.length === 0;

  return (
    <>
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "clamp(2rem, 5vw, 3rem)", color: "white", marginBottom: "12px",
          }}>
            Agenda dan Pengumuman
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1rem" }}>
            Informasi kegiatan dan pengumuman resmi Desa Tolai Barat
          </p>
        </div>
      </div>

      <section className="section-padding" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">

          {/* Pengumuman Aktif */}
          {pengumumanAktif.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "1.35rem", color: "var(--color-ocean-900)",
                marginBottom: "20px", display: "flex",
                alignItems: "center", gap: "10px",
              }}>
                <span style={{
                  background: "var(--color-ocean-700)", color: "white",
                  fontSize: "0.75rem", padding: "3px 10px", borderRadius: "9999px",
                }}>
                  {pengumumanAktif.length}
                </span>
                Pengumuman Aktif
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}>
                {pengumumanAktif.map((p) => (
                  <ItemCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          )}

          {/* Agenda Aktif */}
          {agendaAktif.length > 0 && (
            <div style={{ marginBottom: "48px" }}>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "1.35rem", color: "var(--color-ocean-900)",
                marginBottom: "20px", display: "flex",
                alignItems: "center", gap: "10px",
              }}>
                <span style={{
                  background: "var(--color-forest-700)", color: "white",
                  fontSize: "0.75rem", padding: "3px 10px", borderRadius: "9999px",
                }}>
                  {agendaAktif.length}
                </span>
                Agenda Kegiatan
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}>
                {agendaAktif.map((p) => (
                  <ItemCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {isEmpty && (
            <div style={{
              textAlign: "center", padding: "80px",
              background: "white", borderRadius: "20px",
              boxShadow: "var(--shadow-card)",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "16px" }}>📋</div>
              <p style={{ color: "var(--color-ocean-500)", fontSize: "1rem" }}>
                Belum ada pengumuman atau agenda aktif saat ini.
              </p>
            </div>
          )}

          {/* Arsip */}
          {arsip.length > 0 && (
            <div>
              <h2 style={{
                fontFamily: "var(--font-display)", fontWeight: 600,
                fontSize: "1rem", color: "var(--color-ocean-400)",
                marginBottom: "16px",
              }}>
                Arsip
              </h2>
              <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                gap: "16px",
              }}>
                {arsip.slice(0, 6).map((p) => (
                  <ItemCard key={p.id} item={p} />
                ))}
              </div>
            </div>
          )}

        </div>
      </section>
    </>
  );
}