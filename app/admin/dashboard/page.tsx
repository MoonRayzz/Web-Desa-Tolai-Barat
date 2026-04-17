// File: app/admin/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBeritaAdmin } from "@/lib/firebase/berita";
import { getAllWisata } from "@/lib/firebase/wisata";
import { getAllPotensi } from "@/lib/firebase/potensi"; // <-- PENGGANTI UMKM

export default function DashboardPage() {
  const [stats, setStats] = useState({ berita: 0, wisata: 0, potensi: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [b, w, p] = await Promise.all([
        getAllBeritaAdmin(),
        getAllWisata(),
        getAllPotensi(), // <-- Load Potensi
      ]);
      setStats({ berita: b.length, wisata: w.length, potensi: p.length });
      setLoading(false);
    }
    load();
  }, []);

  const CARDS = [
    { label: "Total Berita",     value: stats.berita,  href: "/admin/berita",  emoji: "📰", bg: "var(--color-ocean-100)",  color: "var(--color-ocean-700)"  },
    { label: "Destinasi Wisata", value: stats.wisata,  href: "/admin/wisata",  emoji: "🏖️", bg: "var(--color-gold-100)",   color: "var(--color-gold-700)"   },
    { label: "Potensi & UMKM",   value: stats.potensi, href: "/admin/potensi", emoji: "🌾", bg: "var(--color-forest-100)", color: "var(--color-forest-700)" },
  ];

  const SHORTCUTS = [
    { label: "Tambah Berita",    href: "/admin/berita/tambah",  emoji: "✏️"  },
    { label: "Edit Info Desa",   href: "/admin/settings",       emoji: "⚙️"  },
    { label: "Kelola Wisata",    href: "/admin/wisata",         emoji: "🏖️"  },
    { label: "Kelola Potensi",   href: "/admin/potensi",        emoji: "🌾"  }, // <-- Shortcut baru
    { label: "Kelola Perangkat", href: "/admin/perangkat",      emoji: "👥"  },
    { label: "Lihat Website",    href: "/",                     emoji: "🌐"  },
  ];

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{
        fontFamily: "var(--font-display)", fontWeight: 700,
        fontSize: "1.5rem", color: "var(--color-ocean-900)", marginBottom: "6px",
      }}>
        Dashboard
      </h1>
      <p style={{ fontSize: "0.875rem", color: "var(--color-ocean-500)", marginBottom: "32px" }}>
        Selamat datang di panel admin Desa Tolai Barat
      </p>

      {/* Stat cards */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "16px", marginBottom: "32px",
      }}>
        {CARDS.map((c) => (
          <Link key={c.label} href={c.href} style={{
            background: "white", borderRadius: "16px", padding: "22px",
            boxShadow: "var(--shadow-card)", textDecoration: "none",
            border: `1px solid ${c.bg}`, display: "block",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: "1.75rem", marginBottom: "12px" }}>{c.emoji}</div>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 700,
              fontSize: "2rem", color: c.color,
              lineHeight: 1,
            }}>
              {loading ? "..." : c.value}
            </div>
            <div style={{ fontSize: "0.82rem", color: "var(--color-ocean-600)", marginTop: "6px" }}>
              {c.label}
            </div>
          </Link>
        ))}
      </div>

      {/* Shortcuts */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "24px",
        boxShadow: "var(--shadow-card)",
      }}>
        <h2 style={{
          fontSize: "0.9rem", fontWeight: 600,
          color: "var(--color-ocean-700)", marginBottom: "16px",
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          Akses Cepat
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: "12px",
        }}>
          {SHORTCUTS.map((s) => (
            <Link key={s.label} href={s.href} style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px", borderRadius: "12px",
              border: "1px solid var(--color-ocean-100)",
              textDecoration: "none", fontSize: "0.85rem",
              color: "var(--color-ocean-800)", fontWeight: 500,
              transition: "all 0.15s",
              background: "var(--color-ocean-50)",
            }}>
              <span>{s.emoji}</span>
              {s.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}