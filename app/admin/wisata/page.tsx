"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  getAllWisata, createWisata, updateWisata, deleteWisata,
} from "@/lib/firebase/wisata";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Wisata } from "@/types";

const EMPTY: Omit<Wisata, "id"> = {
  name: "", description: "", image: "",
  kategori: "bahari", featured: false,
};

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};

export default function AdminWisataPage() {
  const [list, setList]       = useState<Wisata[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<Omit<Wisata, "id"> | null>(null);
  const [editId, setEditId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    const data = await getAllWisata();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm({ ...EMPTY }); setEditId(null); }
  function openEdit(w: Wisata) {
    setForm({
      name: w.name, description: w.description,
      image: w.image, kategori: w.kategori, featured: w.featured,
    });
    setEditId(w.id);
  }
  function closeForm() { setForm(null); setEditId(null); }

  function setF(key: string, value: string | boolean) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editId) await updateWisata(editId, form);
      else        await createWisata(form);
      closeForm();
      await load();
    } catch {
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus wisata "${name}"?`)) return;
    await deleteWisata(id);
    setList((p) => p.filter((w) => w.id !== id));
  }

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: "24px",
        flexWrap: "wrap", gap: "12px",
      }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.5rem", color: "var(--color-ocean-900)",
          }}>
            Kelola Wisata
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ocean-500)", marginTop: "2px" }}>
            {list.length} destinasi wisata
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: "10px 22px" }}>
          + Tambah Wisata
        </button>
      </div>

      {/* Form */}
      {form && (
        <div style={{
          background: "white", borderRadius: "16px", padding: "24px",
          boxShadow: "var(--shadow-card)", marginBottom: "24px",
          border: "2px solid var(--color-ocean-200)",
        }}>
          <h2 style={{
            fontSize: "1rem", fontWeight: 600,
            color: "var(--color-ocean-900)", marginBottom: "20px",
          }}>
            {editId ? "Edit Wisata" : "Tambah Wisata Baru"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "16px", marginBottom: "16px",
            }}>
              {/* Nama */}
              <div>
                <label style={ls}>Nama Wisata *</label>
                <input
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  placeholder="contoh: Pantai Arjuna"
                  className="input-base"
                  required
                />
              </div>

              {/* Kategori */}
              <div>
                <label style={ls}>Kategori</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setF("kategori", e.target.value)}
                  className="input-base"
                >
                  <option value="bahari">🌊 Bahari</option>
                  <option value="alam">🌿 Alam</option>
                  <option value="religi">🕌 Religi</option>
                  <option value="budaya">🎭 Budaya</option>
                </select>
              </div>
            </div>

            {/* Deskripsi */}
            <div style={{ marginBottom: "16px" }}>
              <label style={ls}>Deskripsi *</label>
              <textarea
                value={form.description}
                onChange={(e) => setF("description", e.target.value)}
                rows={3}
                placeholder="Deskripsikan destinasi wisata ini..."
                className="input-base"
                style={{ resize: "vertical" }}
                required
              />
            </div>

            {/* Upload Foto */}
            <div style={{ marginBottom: "16px" }}>
              <ImageUpload
                value={form.image}
                onChange={(url) => setF("image", url)}
                label="Foto Wisata (opsional)"
              />
            </div>

            {/* Featured */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
              <input
                type="checkbox"
                id="featured-wisata"
                checked={form.featured}
                onChange={(e) => setF("featured", e.target.checked)}
                style={{ width: 16, height: 16, cursor: "pointer" }}
              />
              <label htmlFor="featured-wisata" style={{
                fontSize: "0.875rem", color: "var(--color-ocean-700)", cursor: "pointer",
              }}>
                ⭐ Tampilkan sebagai wisata unggulan di homepage
              </label>
            </div>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary"
                style={{ padding: "10px 22px" }}
              >
                {saving ? "Menyimpan..." : editId ? "Update" : "Simpan"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="btn-secondary"
                style={{ padding: "10px 22px" }}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grid List */}
      {loading ? (
        <div style={{ color: "var(--color-ocean-400)", padding: "20px" }}>Memuat...</div>
      ) : list.length === 0 ? (
        <div style={{
          textAlign: "center", padding: "60px",
          background: "white", borderRadius: "16px",
          boxShadow: "var(--shadow-card)", color: "var(--color-ocean-400)",
        }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🏖️</div>
          Belum ada wisata. Tambah destinasi pertama!
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {list.map((w) => (
            <div key={w.id} style={{
              background: "white", borderRadius: "14px",
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-ocean-100)",
              overflow: "hidden",
            }}>
              {/* Thumbnail */}
              <div style={{ height: "140px", overflow: "hidden" }}>
                {w.image && !w.image.includes("placeholder") ? (
                  <img src={w.image} alt={w.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, var(--color-ocean-800), var(--color-ocean-600))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2.5rem",
                  }}>
                    {w.kategori === "bahari" ? "🏖️"
                    : w.kategori === "alam"  ? "🌿"
                    : w.kategori === "religi"? "🕌"
                    : "🎭"}
                  </div>
                )}
              </div>

              <div style={{ padding: "16px" }}>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <span style={{
                    background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                    fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px",
                    borderRadius: "9999px", textTransform: "capitalize" as const,
                  }}>
                    {w.kategori}
                  </span>
                  {w.featured && (
                    <span style={{
                      background: "var(--color-gold-100)", color: "var(--color-gold-700)",
                      fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px",
                      borderRadius: "9999px",
                    }}>
                      ⭐ Unggulan
                    </span>
                  )}
                </div>

                <div style={{
                  fontWeight: 600, fontSize: "0.9rem",
                  color: "var(--color-ocean-900)", marginBottom: "6px",
                }}>
                  {w.name}
                </div>

                <p style={{
                  fontSize: "0.8rem", color: "var(--color-ocean-600)",
                  lineHeight: 1.6, marginBottom: "14px",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>
                  {w.description}
                </p>

                <div style={{
                  display: "flex", gap: "8px",
                  paddingTop: "12px", borderTop: "1px solid var(--color-ocean-100)",
                }}>
                  <button
                    onClick={() => openEdit(w)}
                    style={{
                      flex: 1, padding: "7px", borderRadius: "8px",
                      background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                      border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(w.id, w.name)}
                    style={{
                      flex: 1, padding: "7px", borderRadius: "8px",
                      background: "#FEE2E2", color: "#991B1B",
                      border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500,
                    }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}