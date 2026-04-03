"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  getAllUmkm, createUmkm, updateUmkm, deleteUmkm,
} from "@/lib/firebase/umkm";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Umkm } from "@/types";

const EMPTY: Omit<Umkm, "id"> = {
  name: "", owner: "", description: "",
  image: "", kategori: "kuliner", whatsapp: "",
};

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};

export default function AdminUmkmPage() {
  const [list, setList]       = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<Omit<Umkm, "id"> | null>(null);
  const [editId, setEditId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() {
    const data = await getAllUmkm();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() { setForm({ ...EMPTY }); setEditId(null); }
  function openEdit(u: Umkm) {
    setForm({
      name: u.name, owner: u.owner, description: u.description,
      image: u.image, kategori: u.kategori, whatsapp: u.whatsapp,
    });
    setEditId(u.id);
  }
  function closeForm() { setForm(null); setEditId(null); }

  function setF(key: string, value: string) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editId) await updateUmkm(editId, form);
      else        await createUmkm(form);
      closeForm();
      await load();
    } catch {
      alert("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus UMKM "${name}"?`)) return;
    await deleteUmkm(id);
    setList((p) => p.filter((u) => u.id !== id));
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
            Kelola UMKM
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ocean-500)", marginTop: "2px" }}>
            {list.length} UMKM terdaftar
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: "10px 22px" }}>
          + Tambah UMKM
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
            {editId ? "Edit UMKM" : "Tambah UMKM Baru"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px", marginBottom: "16px",
            }}>
              {/* Nama usaha */}
              <div>
                <label style={ls}>Nama Usaha *</label>
                <input
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  placeholder="contoh: Warung Seafood Pantai"
                  className="input-base"
                  required
                />
              </div>

              {/* Nama pemilik */}
              <div>
                <label style={ls}>Nama Pemilik *</label>
                <input
                  value={form.owner}
                  onChange={(e) => setF("owner", e.target.value)}
                  placeholder="contoh: Ibu Sari"
                  className="input-base"
                  required
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label style={ls}>No. WhatsApp</label>
                <input
                  value={form.whatsapp ?? ""}
                  onChange={(e) => setF("whatsapp", e.target.value)}
                  placeholder="628xxxxxxxxxx (tanpa + atau 0)"
                  className="input-base"
                />
                <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
                  Kosongkan jika tidak ada WhatsApp
                </div>
              </div>

              {/* Kategori */}
              <div>
                <label style={ls}>Kategori</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setF("kategori", e.target.value)}
                  className="input-base"
                >
                  <option value="kuliner">🍴 Kuliner</option>
                  <option value="kerajinan">🎨 Kerajinan</option>
                  <option value="pertanian">🌾 Pertanian</option>
                  <option value="perikanan">🐟 Perikanan</option>
                  <option value="jasa">🛎️ Jasa</option>
                </select>
              </div>
            </div>

            {/* Deskripsi */}
            <div style={{ marginBottom: "16px" }}>
              <label style={ls}>Deskripsi Usaha *</label>
              <textarea
                value={form.description}
                onChange={(e) => setF("description", e.target.value)}
                rows={3}
                placeholder="Deskripsikan produk atau jasa yang ditawarkan..."
                className="input-base"
                style={{ resize: "vertical" }}
                required
              />
            </div>

            {/* Upload Foto */}
            <div style={{ marginBottom: "20px" }}>
              <ImageUpload
                value={form.image}
                onChange={(url) => setF("image", url)}
                label="Foto UMKM (opsional)"
              />
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
          <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🏪</div>
          Belum ada UMKM terdaftar.
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "16px",
        }}>
          {list.map((u) => (
            <div key={u.id} style={{
              background: "white", borderRadius: "14px",
              boxShadow: "var(--shadow-card)",
              border: "1px solid var(--color-ocean-100)",
              overflow: "hidden",
            }}>
              {/* Thumbnail */}
              <div style={{ height: "130px", overflow: "hidden" }}>
                {u.image && !u.image.includes("placeholder") ? (
                  <img src={u.image} alt={u.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div style={{
                    width: "100%", height: "100%",
                    background: "linear-gradient(135deg, var(--color-forest-700), var(--color-forest-500))",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "2.5rem",
                  }}>
                    {u.kategori === "kuliner"   ? "🍴"
                    : u.kategori === "kerajinan"? "🎨"
                    : u.kategori === "pertanian"? "🌾"
                    : u.kategori === "perikanan"? "🐟"
                    : "🛎️"}
                  </div>
                )}
              </div>

              <div style={{ padding: "16px" }}>
                <span style={{
                  background: "var(--color-forest-100)", color: "var(--color-forest-700)",
                  fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px",
                  borderRadius: "9999px", display: "inline-block",
                  marginBottom: "8px", textTransform: "capitalize" as const,
                }}>
                  {u.kategori}
                </span>

                <div style={{
                  fontWeight: 600, fontSize: "0.9rem",
                  color: "var(--color-ocean-900)", marginBottom: "2px",
                }}>
                  {u.name}
                </div>

                <div style={{
                  fontSize: "0.75rem", color: "var(--color-ocean-500)", marginBottom: "8px",
                }}>
                  👤 {u.owner}
                </div>

                <p style={{
                  fontSize: "0.8rem", color: "var(--color-ocean-600)",
                  lineHeight: 1.6, marginBottom: "8px",
                  display: "-webkit-box", WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical" as const, overflow: "hidden",
                }}>
                  {u.description}
                </p>

                {u.whatsapp && (
                  <div style={{
                    fontSize: "0.72rem", color: "var(--color-forest-600)",
                    marginBottom: "12px",
                  }}>
                    📱 {u.whatsapp}
                  </div>
                )}

                <div style={{
                  display: "flex", gap: "8px",
                  paddingTop: "12px", borderTop: "1px solid var(--color-ocean-100)",
                }}>
                  <button
                    onClick={() => openEdit(u)}
                    style={{
                      flex: 1, padding: "7px", borderRadius: "8px",
                      background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                      border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500,
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(u.id, u.name)}
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