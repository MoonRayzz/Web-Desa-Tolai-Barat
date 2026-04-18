// File: components/ui/BaganPerangkat.tsx
"use client";

import { useRef, useEffect, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Perangkat {
  id: string;
  name: string;
  jabatan: string;
  photo?: string | null;
  urutan?: number;
}

interface OrgNode {
  person: Perangkat;
  color: "gold" | "ocean" | "forest" | "sand";
  isTop?: boolean;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function classify(list: Perangkat[]) {
  const kades: Perangkat[] = [];
  const bpd: Perangkat[] = [];
  const sekretariat: Perangkat[] = [];
  const teknis: Perangkat[] = [];
  const wilayah: Perangkat[] = [];
  const lainnya: Perangkat[] = [];

  list.forEach((p) => {
    const j = (p.jabatan || "").toLowerCase();
    if (j.includes("kepala desa")) kades.push(p);
    else if (j.includes("bpd") || j.includes("badan permusyawaratan")) bpd.push(p);
    else if (j.includes("sekretaris") || j.includes("bendahara") || j.includes("sekdes")) sekretariat.push(p);
    else if (j.includes("kaur") || j.includes("kasi")) teknis.push(p);
    else if (j.includes("dusun") || j.includes("kadus") || j.includes("lingkungan")) wilayah.push(p);
    else lainnya.push(p);
  });

  return { kades, bpd, sekretariat, teknis, wilayah, lainnya };
}

// ─── Avatar Component ─────────────────────────────────────────────────────────
const Avatar = ({ photo, name, size = 64 }: { photo?: string | null; name: string; size?: number }) => {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{
          width: size, height: size,
          borderRadius: "50%",
          objectFit: "cover",
          display: "block",
        }}
      />
    );
  }

  return (
    <div style={{
      width: size, height: size,
      borderRadius: "50%",
      background: "linear-gradient(135deg, var(--c-mid), var(--c-dark))",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 700,
      fontSize: size * 0.28,
      letterSpacing: "0.05em",
      fontFamily: "Georgia, serif",
    }}>
      {initials || "?"}
    </div>
  );
};

// ─── Card Component ───────────────────────────────────────────────────────────
const THEME = {
  gold:   { bg: "#FEFBEB", border: "#F5C842", accent: "#B8860B", light: "#FEF3C7", mid: "#F5C842", dark: "#92400E" },
  ocean:  { bg: "#F0F7FF", border: "#60A5FA", accent: "#1D4ED8", light: "#DBEAFE", mid: "#3B82F6", dark: "#1E3A8A" },
  forest: { bg: "#F0FDF4", border: "#4ADE80", accent: "#166534", light: "#DCFCE7", mid: "#22C55E", dark: "#14532D" },
  sand:   { bg: "#FEFDF8", border: "#D4A853", accent: "#92400E", light: "#FEF9EC", mid: "#D4A853", dark: "#78350F" },
};

const PersonCard = ({
  person,
  color = "ocean",
  isTop = false,
  size = "md",
  id,
}: {
  person: Perangkat;
  color?: "gold" | "ocean" | "forest" | "sand";
  isTop?: boolean;
  size?: "sm" | "md" | "lg";
  id?: string;
}) => {
  const t = THEME[color];
  const avatarSize = size === "lg" ? 80 : size === "sm" ? 48 : 64;
  const cardW = size === "lg" ? 200 : size === "sm" ? 160 : 180;

  return (
    <div
      id={id}
      style={{
        width: cardW,
        background: t.bg,
        border: `2px solid ${isTop ? t.mid : t.border}`,
        borderRadius: 20,
        padding: size === "sm" ? "14px 12px" : "20px 16px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        boxShadow: isTop
          ? `0 8px 32px ${t.mid}40, 0 2px 8px ${t.mid}20`
          : `0 2px 12px ${t.border}30`,
        position: "relative",
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "default",
        // CSS custom props for avatar gradient
        ["--c-mid" as any]: t.mid,
        ["--c-dark" as any]: t.dark,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLElement).style.boxShadow = isTop
          ? `0 16px 40px ${t.mid}50, 0 4px 16px ${t.mid}30`
          : `0 8px 24px ${t.border}40`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = isTop
          ? `0 8px 32px ${t.mid}40, 0 2px 8px ${t.mid}20`
          : `0 2px 12px ${t.border}30`;
      }}
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%",
        height: 3, borderRadius: "0 0 4px 4px",
        background: `linear-gradient(90deg, ${t.mid}, ${t.accent})`,
      }} />

      {/* Avatar ring */}
      <div style={{
        padding: 3,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${t.mid}, ${t.accent})`,
        boxShadow: `0 0 0 2px ${t.bg}`,
      }}>
        <Avatar photo={person.photo} name={person.name} size={avatarSize} />
      </div>

      {/* Name */}
      <div style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        fontWeight: 700,
        fontSize: size === "sm" ? "0.72rem" : "0.85rem",
        color: "#1a2035",
        textAlign: "center",
        lineHeight: 1.3,
        maxWidth: "100%",
        wordBreak: "break-word",
      }}>
        {person.name || "Belum Diisi"}
      </div>

      {/* Badge */}
      <div style={{
        background: t.light,
        color: t.accent,
        fontSize: "0.62rem",
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        padding: "4px 10px",
        borderRadius: 99,
        border: `1px solid ${t.border}`,
        textAlign: "center",
        lineHeight: 1.4,
        maxWidth: "100%",
        wordBreak: "break-word",
      }}>
        {person.jabatan}
      </div>
    </div>
  );
};

// ─── Section Label ─────────────────────────────────────────────────────────────
const SectionLabel = ({ label, color }: { label: string; color: string }) => (
  <div style={{
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "5px 16px",
    borderRadius: 99,
    background: color + "15",
    border: `1px solid ${color}40`,
    marginBottom: 20,
  }}>
    <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
    <span style={{
      fontSize: "0.68rem",
      fontWeight: 800,
      textTransform: "uppercase",
      letterSpacing: "0.12em",
      color: color,
      fontFamily: "system-ui, sans-serif",
    }}>
      {label}
    </span>
  </div>
);

// ─── Connector SVG Lines (horizontal between siblings) ────────────────────────
const HorizontalConnector = ({ count, color }: { count: number; color: string }) => {
  if (count <= 1) return null;
  return (
    <div style={{ position: "relative", width: "100%", height: 20 }}>
      <svg width="100%" height="20" style={{ position: "absolute", top: 0, left: 0 }}>
        <line x1="50%" y1="0" x2="50%" y2="20"
          stroke={color} strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
      </svg>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BaganPerangkat({ list }: { list: Perangkat[] }) {
  if (!list || list.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "60px 20px",
        background: "#F8FAFC", borderRadius: 24,
        border: "2px dashed #CBD5E1",
        maxWidth: 500, margin: "0 auto",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.5 }}>🏛️</div>
        <h3 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.2rem", color: "#334155", marginBottom: 8 }}>
          Struktur Belum Tersedia
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#64748B" }}>
          Data perangkat desa akan segera diperbarui.
        </p>
      </div>
    );
  }

  const { kades, bpd, sekretariat, teknis, wilayah, lainnya } = classify(list);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 0,
      width: "100%",
      maxWidth: 1100,
      margin: "0 auto",
      padding: "0 16px",
      // Subtle grid background
      backgroundImage: `
        radial-gradient(circle, #CBD5E130 1px, transparent 1px)
      `,
      backgroundSize: "28px 28px",
      borderRadius: 32,
    }}>

      {/* ── LEVEL 0: BPD + Kepala Desa ── */}
      <div style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 40,
        width: "100%",
        padding: "48px 0 0",
        position: "relative",
      }}>
        {/* BPD - Mitra Sejajar */}
        {bpd.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SectionLabel label="Badan Permusyawaratan Desa" color="#166534" />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              {bpd.map((p) => (
                <PersonCard key={p.id} person={p} color="forest" size="md" />
              ))}
            </div>
          </div>
        )}

        {/* Pemisah vertikal antara BPD dan Kades */}
        {bpd.length > 0 && kades.length > 0 && (
          <div style={{
            alignSelf: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            opacity: 0.3,
          }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: 2, height: 8, background: "#94A3B8", borderRadius: 1 }} />
            ))}
            <div style={{ fontSize: "0.6rem", color: "#94A3B8", fontWeight: 700, letterSpacing: "0.1em", writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
              KOORDINASI
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ width: 2, height: 8, background: "#94A3B8", borderRadius: 1 }} />
            ))}
          </div>
        )}

        {/* Kepala Desa */}
        {kades.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <SectionLabel label="Pimpinan Eksekutif" color="#B8860B" />
            {kades.map((p) => (
              <PersonCard key={p.id} person={p} color="gold" isTop size="lg" />
            ))}
          </div>
        )}
      </div>

      {/* Connector: Kades → Sekretariat */}
      {(kades.length > 0 || bpd.length > 0) && sekretariat.length > 0 && (
        <ConnectorDown color="#3B82F6" label="membawahi" />
      )}

      {/* ── LEVEL 1: Sekretariat ── */}
      {sekretariat.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <SectionLabel label="Sekretariat Desa" color="#1D4ED8" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {sekretariat.map((p) => (
              <PersonCard key={p.id} person={p} color="ocean" />
            ))}
          </div>
        </div>
      )}

      {/* Connector: Sekretariat → Teknis */}
      {sekretariat.length > 0 && teknis.length > 0 && (
        <ConnectorDown color="#3B82F6" label="koordinasi teknis" />
      )}

      {/* ── LEVEL 2: Kaur & Kasi ── */}
      {teknis.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <SectionLabel label="Pelaksana Teknis · Kaur & Kasi" color="#1D4ED8" />

          {/* Grid dengan garis koneksi horizontal */}
          <div style={{ position: "relative", width: "100%" }}>
            {/* Garis horizontal connector */}
            {teknis.length > 1 && (
              <div style={{
                position: "absolute",
                top: 0,
                left: "50%",
                transform: "translateX(-50%)",
                width: `${Math.min(teknis.length, 4) * 196}px`,
                maxWidth: "90%",
                height: 2,
                background: "linear-gradient(90deg, transparent, #3B82F640, #3B82F680, #3B82F640, transparent)",
                zIndex: 0,
              }} />
            )}
            <div style={{
              display: "flex", flexWrap: "wrap", gap: 16,
              justifyContent: "center", position: "relative", zIndex: 1,
            }}>
              {teknis.map((p) => (
                <PersonCard key={p.id} person={p} color="ocean" size="sm" />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Connector: → Wilayah */}
      {(teknis.length > 0 || sekretariat.length > 0) && wilayah.length > 0 && (
        <ConnectorDown color="#166534" label="kewilayahan" />
      )}

      {/* ── LEVEL 3: Wilayah / Kadus ── */}
      {wilayah.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }}>
          <SectionLabel label="Pelaksana Kewilayahan · Kadus" color="#166534" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {wilayah.map((p) => (
              <PersonCard key={p.id} person={p} color="forest" size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* ── LAINNYA ── */}
      {lainnya.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", marginTop: 32 }}>
          <SectionLabel label="Perangkat Lainnya" color="#92400E" />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16, justifyContent: "center" }}>
            {lainnya.map((p) => (
              <PersonCard key={p.id} person={p} color="sand" size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Bottom padding */}
      <div style={{ height: 48 }} />
    </div>
  );
}

// ─── Connector Vertical dengan Label ──────────────────────────────────────────
const ConnectorDown = ({ color, label }: { color: string; label: string }) => (
  <div style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "8px 0",
    gap: 0,
  }}>
    <div style={{ width: 2, height: 16, background: color, opacity: 0.3 }} />
    <div style={{
      padding: "3px 12px",
      background: color + "12",
      border: `1px solid ${color}30`,
      borderRadius: 99,
      fontSize: "0.58rem",
      fontWeight: 700,
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      color: color,
      opacity: 0.8,
    }}>
      {label}
    </div>
    <div style={{ width: 2, height: 16, background: color, opacity: 0.3 }} />
    {/* Arrow */}
    <div style={{
      width: 0, height: 0,
      borderLeft: "5px solid transparent",
      borderRight: "5px solid transparent",
      borderTop: `7px solid ${color}50`,
    }} />
  </div>
);