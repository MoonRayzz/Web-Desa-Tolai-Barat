"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllBeritaAdmin, deleteBerita } from "@/lib/firebase/berita";
import { formatTanggal } from "@/lib/utils";
import type { Berita } from "@/types";

export default function AdminBeritaPage() {
  const [list, setList]       = useState<Berita[]>([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    const data = await getAllBeritaAdmin();
    setList(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Hapus berita "${title}"?`)) return;
    await deleteBerita(id);
    setList((prev) => prev.filter((b) => b.id !== id));
  }

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.5rem", color: "var(--color-ocean-900)",
          }}>
            Kelola Berita
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ocean-500)", marginTop: "2px" }}>
            {list.length} artikel
          </p>
        </div>
        <Link href="/admin/berita/tambah" className="btn-primary"
          style={{ padding: "10px 22px" }}>
          + Tambah Berita
        </Link>
      </div>

      <div style={{
        background: "white", borderRadius: "16px",
        boxShadow: "var(--shadow-card)", overflow: "hidden",
      }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-ocean-400)" }}>
            Memuat...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--color-ocean-400)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📰</div>
            Belum ada berita. Tambah berita pertama!
          </div>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--color-ocean-50)" }}>
                {["Judul", "Kategori", "Status", "Tanggal", "Aksi"].map((h) => (
                  <th key={h} style={{
                    padding: "12px 16px", textAlign: "left",
                    fontSize: "0.75rem", fontWeight: 600,
                    color: "var(--color-ocean-600)",
                    textTransform: "uppercase", letterSpacing: "0.05em",
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {list.map((b, i) => (
                <tr key={b.id} style={{
                  borderTop: "1px solid var(--color-ocean-100)",
                  background: i % 2 === 0 ? "white" : "var(--color-ocean-50)",
                }}>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{
                      fontSize: "0.875rem", fontWeight: 500,
                      color: "var(--color-ocean-900)",
                      maxWidth: "320px",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {b.title}
                    </div>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                      fontSize: "0.7rem", fontWeight: 600, padding: "3px 10px",
                      borderRadius: "9999px", textTransform: "capitalize",
                    }}>
                      {b.kategori}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 600, padding: "3px 10px",
                      borderRadius: "9999px",
                      background: b.published ? "#DCFCE7" : "#FEE2E2",
                      color: b.published ? "#15803D" : "#991B1B",
                    }}>
                      {b.published ? "Publik" : "Draft"}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px", fontSize: "0.8rem", color: "var(--color-ocean-500)" }}>
                    {/* Menggunakan ternary operator untuk mencegah error jika publishedAt kosong */}
                    {b.publishedAt ? formatTanggal(b.publishedAt) : "-"}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Link href={`/admin/berita/${b.id}/edit`} style={{
                        padding: "5px 12px", borderRadius: "7px",
                        background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                        fontSize: "0.78rem", fontWeight: 500, textDecoration: "none",
                      }}>
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(b.id, b.title)}
                        style={{
                          padding: "5px 12px", borderRadius: "7px",
                          background: "#FEE2E2", color: "#991B1B",
                          fontSize: "0.78rem", fontWeight: 500,
                          border: "none", cursor: "pointer",
                        }}
                      >
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}