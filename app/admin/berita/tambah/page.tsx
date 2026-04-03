"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBerita } from "@/lib/firebase/berita";
import type { BeritaKategori } from "@/types";

function generateSlug(title: string) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-").trim();
}

export default function TambahBeritaPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title:      "",
    slug:       "",
    excerpt:    "",
    content:    "",
    kategori:   "berita" as BeritaKategori,
    author:     "Admin Desa",
    published:  true,
    coverImage: "",
  });

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      ...(key === "title" ? { slug: generateSlug(value as string) } : {}),
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.content) {
      alert("Judul, ringkasan, dan isi berita wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      await createBerita({
        ...form,
        publishedAt: new Date().toISOString(),
      });
      router.push("/admin/berita");
    } catch {
      alert("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: "32px", maxWidth: "820px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--color-ocean-500)", fontSize: "1.1rem",
        }}>
          ←
        </button>
        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "1.5rem", color: "var(--color-ocean-900)",
        }}>
          Tambah Berita
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "28px",
          boxShadow: "var(--shadow-card)", display: "flex",
          flexDirection: "column", gap: "20px",
        }}>

          {/* Judul */}
          <div>
            <label style={labelStyle}>Judul Berita *</label>
            <input type="text" value={form.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Masukkan judul berita..."
              className="input-base" required />
          </div>

          {/* Slug */}
          <div>
            <label style={labelStyle}>Slug URL</label>
            <input type="text" value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
              className="input-base"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem" }} />
            <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
              URL: /berita/{form.slug || "slug-otomatis"}
            </div>
          </div>

          {/* Kategori + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Kategori</label>
              <select value={form.kategori}
                onChange={(e) => set("kategori", e.target.value)}
                className="input-base">
                <option value="berita">Berita</option>
                <option value="pengumuman">Pengumuman</option>
                <option value="kegiatan">Kegiatan</option>
                <option value="pembangunan">Pembangunan</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Status</label>
              <select value={form.published ? "true" : "false"}
                onChange={(e) => set("published", e.target.value === "true")}
                className="input-base">
                <option value="true">Publik</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>

          {/* Author */}
          <div>
            <label style={labelStyle}>Penulis</label>
            <input type="text" value={form.author}
              onChange={(e) => set("author", e.target.value)}
              className="input-base" />
          </div>

          {/* Ringkasan */}
          <div>
            <label style={labelStyle}>Ringkasan / Excerpt *</label>
            <textarea value={form.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3} placeholder="Ringkasan singkat berita (tampil di list berita)..."
              className="input-base" style={{ resize: "vertical" }} required />
          </div>

          {/* Isi */}
          <div>
            <label style={labelStyle}>Isi Berita * (HTML diperbolehkan)</label>
            <textarea value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={12}
              placeholder={"<p>Tulis isi berita di sini...</p>\n<p>Paragraf kedua...</p>"}
              className="input-base"
              style={{ resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}
              required />
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button type="button" onClick={() => router.back()}
              className="btn-secondary" style={{ padding: "11px 24px" }}>
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="btn-primary" style={{ padding: "11px 28px" }}>
              {saving ? "Menyimpan..." : "Simpan Berita"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};