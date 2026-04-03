import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { getUpcomingAgenda } from "@/lib/firebase/pengumuman";
import type { Pengumuman } from "@/types";

const BULAN_COLOR = [
  "#0B5E6B","#1A8A9C","#2D5016","#4A7C2F",
  "#D4A017","#854F0B","#5B21B6","#7C3AED",
  "#DC2626","#991B1B","#0B5E6B","#2D5016",
];

export default async function AgendaSection() {
  const agenda: Pengumuman[] = await getUpcomingAgenda(3);

  if (agenda.length === 0) return null;

  return (
    <section className="section-padding-sm" style={{ background: "var(--color-ocean-50)" }}>
      <div className="container-desa">
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <SectionHeader
            badge="Agenda Desa"
            title="Kegiatan Mendatang"
            subtitle="Jadwal kegiatan dan acara Desa Tolai Barat."
          />
          <Link href="/agenda" className="btn-ghost" style={{ flexShrink: 0 }}>
            Lihat semua
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M2 7H12M8 3L12 7L8 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {agenda.map((item) => {
            const d         = new Date(item.startDate + "T00:00:00");
            const day       = d.getDate();
            const month     = d.getMonth();
            const monthName = d.toLocaleDateString("id-ID", { month: "short" });
            const dotColor  = BULAN_COLOR[month] ?? "#0B5E6B";

            return (
              <div
                key={item.id}
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "18px",
                  boxShadow: "var(--shadow-card)",
                  display: "flex",
                  gap: "16px",
                  alignItems: "flex-start",
                  border: "1px solid var(--color-ocean-100)",
                }}
              >
                {/* Tanggal badge */}
                <div style={{
                  width: 52,
                  height: 56,
                  borderRadius: "12px",
                  background: dotColor,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  color: "white",
                }}>
                  <span style={{ fontSize: "1.35rem", fontWeight: 700, lineHeight: 1 }}>
                    {day}
                  </span>
                  <span style={{ fontSize: "0.65rem", fontWeight: 500, marginTop: "2px", opacity: 0.85 }}>
                    {monthName.toUpperCase()}
                  </span>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", gap: "6px", marginBottom: "6px", flexWrap: "wrap" }}>
                    <span style={{
                      background: "var(--color-ocean-100)",
                      color: "var(--color-ocean-700)",
                      fontSize: "0.65rem",
                      fontWeight: 600,
                      padding: "2px 8px",
                      borderRadius: "9999px",
                    }}>
                      Agenda
                    </span>
                    {item.priority !== "normal" && (
                      <span style={{
                        background: item.priority === "darurat" ? "#FEE2E2" : "#FDF3C8",
                        color:      item.priority === "darurat" ? "#991B1B" : "#854F0B",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        padding: "2px 8px",
                        borderRadius: "9999px",
                      }}>
                        {item.priority === "darurat" ? "Darurat" : "Penting"}
                      </span>
                    )}
                  </div>

                  <h3 style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 600,
                    fontSize: "0.9rem",
                    color: "var(--color-ocean-900)",
                    lineHeight: 1.4,
                    marginBottom: "4px",
                  }}>
                    {item.title}
                  </h3>

                  {item.content.trim() !== "" && (
                    <p style={{
                      fontSize: "0.78rem",
                      color: "var(--color-ocean-600)",
                      lineHeight: 1.5,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                      overflow: "hidden",
                    }}>
                      {item.content}
                    </p>
                  )}

                  {item.endDate && item.endDate !== item.startDate && (
                    <div style={{
                      fontSize: "0.72rem",
                      color: "var(--color-ocean-500)",
                      marginTop: "6px",
                    }}>
                      Sampai {new Date(item.endDate + "T00:00:00").toLocaleDateString("id-ID", {
                        day: "numeric", month: "long",
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}