"use client";

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import { getAllBeritaAdmin, updateBerita } from "@/lib/firebase/berita";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Berita } from "@/types";

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};

export default function EditBeritaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm]     = useState<Partial<Berita> | null>(null);

  useEffect(() => {
    getAllBeritaAdmin().then((list) => {
      const found = list.find((b) => b.id === id);
      if (found) setForm(found);
    });
  }, [id]);

  function set(key: string, value: string | boolean) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updateBerita(id, form);
      router.push("/admin/berita");
    } catch {
      alert("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  if (!form) return (
    <div style={{ padding: "32px", color: "var(--color-ocean-500)" }}>
      Memuat data berita...
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "820px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <button onClick={() => router.back()} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--color-ocean-500)", fontSize: "1.2rem", lineHeight: 1,
        }}>
          ←
        </button>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.5rem", color: "var(--color-ocean-900)",
          }}>
            Edit Berita
          </h1>
          <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-400)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
            ID: {id}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "28px",
          boxShadow: "var(--shadow-card)", display: "flex",
          flexDirection: "column", gap: "20px",
        }}>

          {/* Judul */}
          <div>
            <label style={ls}>Judul Berita *</label>
            <input
              type="text"
              value={form.title ?? ""}
              onChange={(e) => set("title", e.target.value)}
              className="input-base"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label style={ls}>Slug URL</label>
            <input
              type="text"
              value={form.slug ?? ""}
              onChange={(e) => set("slug", e.target.value)}
              className="input-base"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.82rem" }}
            />
            <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
              URL: /berita/{form.slug}
            </div>
          </div>

          {/* Kategori + Status */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={ls}>Kategori</label>
              <select
                value={form.kategori ?? "berita"}
                onChange={(e) => set("kategori", e.target.value)}
                className="input-base"
              >
                <option value="berita">Berita</option>
                <option value="pengumuman">Pengumuman</option>
                <option value="kegiatan">Kegiatan</option>
                <option value="pembangunan">Pembangunan</option>
              </select>
            </div>
            <div>
              <label style={ls}>Status Publikasi</label>
              <select
                value={form.published ? "true" : "false"}
                onChange={(e) => set("published", e.target.value === "true")}
                className="input-base"
              >
                <option value="true">Publik</option>
                <option value="false">Draft</option>
              </select>
            </div>
          </div>

          {/* Author */}
          <div>
            <label style={ls}>Penulis</label>
            <input
              type="text"
              value={form.author ?? ""}
              onChange={(e) => set("author", e.target.value)}
              className="input-base"
            />
          </div>

          {/* Cover Image via Cloudinary */}
          <ImageUpload
            value={form.coverImage ?? ""}
            onChange={(url) => set("coverImage", url)}
            label="Cover Foto"
          />

          {/* Ringkasan */}
          <div>
            <label style={ls}>Ringkasan / Excerpt *</label>
            <textarea
              value={form.excerpt ?? ""}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              className="input-base"
              style={{ resize: "vertical" }}
              required
            />
          </div>

          {/* Isi */}
          <div>
            <label style={ls}>Isi Berita * (HTML)</label>
            <textarea
              value={form.content ?? ""}
              onChange={(e) => set("content", e.target.value)}
              rows={14}
              className="input-base"
              style={{
                resize: "vertical",
                fontFamily: "var(--font-mono)",
                fontSize: "0.82rem",
                lineHeight: 1.7,
              }}
              required
            />
          </div>

          {/* Actions */}
          <div style={{
            display: "flex", gap: "12px", justifyContent: "flex-end",
            paddingTop: "8px", borderTop: "1px solid var(--color-ocean-100)",
          }}>
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-secondary"
              style={{ padding: "11px 24px" }}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-primary"
              style={{ padding: "11px 28px" }}
            >
              {saving ? "Menyimpan..." : "Update Berita"}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
}