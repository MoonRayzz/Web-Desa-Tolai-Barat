"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  getAllPerangkat, createPerangkat,
  updatePerangkat, deletePerangkat,
} from "@/lib/firebase/perangkat";
import ImageUpload from "@/components/admin/ImageUpload";
import type { PerangkatDesa } from "@/types";

const EMPTY: Omit<PerangkatDesa, "id"> = {
  name: "", jabatan: "", photo: null, urutan: 99,
};

const JABATAN_LIST = [
  "Kepala Desa",
  "Sekretaris Desa",
  "Bendahara Desa",
  "Kaur Pemerintahan",
  "Kaur Kesejahteraan",
  "Kaur Pembangunan",
  "Kasi Pelayanan",
  "Kasi Ketentraman",
  "Kadus Dusun I",
  "Kadus Dusun II",
  "Kadus Dusun III",
  "Ketua BPD",
  "Anggota BPD",
  "Lainnya",
];

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};

export default function AdminPerangkatPage() {
  const [list, setList]       = useState<PerangkatDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<Omit<PerangkatDesa, "id"> | null>(null);
  const [editId, setEditId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);
  const [jabatanCustom, setJabatanCustom] = useState(false);

  async function load() {
    const data = await getAllPerangkat();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function openAdd() {
    setForm({ ...EMPTY });
    setEditId(null);
    setJabatanCustom(false);
  }

  function openEdit(p: PerangkatDesa) {
    const isCustom = !JABATAN_LIST.includes(p.jabatan);
    setForm({
      name:    p.name,
      jabatan: p.jabatan,
      photo:   p.photo,
      urutan:  p.urutan,
    });
    setEditId(p.id);
    setJabatanCustom(isCustom);
  }

  function closeForm() {
    setForm(null);
    setEditId(null);
    setJabatanCustom(false);
  }

  function setF(key: string, value: string | number | null) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.name.trim() || !form.jabatan.trim()) {
      alert("Nama dan jabatan wajib diisi.");
      return;
    }
    setSaving(true);
    try {
      if (editId) await updatePerangkat(editId, form);
      else        await createPerangkat(form);
      closeForm();
      await load();
    } catch {
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus perangkat "${name}"?`)) return;
    await deletePerangkat(id);
    setList((p) => p.filter((x) => x.id !== id));
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
            Kelola Perangkat Desa
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ocean-500)", marginTop: "2px" }}>
            Data tampil di halaman Profil Desa · {list.length} perangkat
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: "10px 22px" }}>
          + Tambah Perangkat
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
            {editId ? "Edit Perangkat" : "Tambah Perangkat Baru"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "16px", marginBottom: "20px",
            }}>
              {/* Nama */}
              <div>
                <label style={ls}>Nama Lengkap *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  placeholder="contoh: Ahmad Fauzi S.Sos"
                  className="input-base"
                  required
                />
              </div>

              {/* Jabatan */}
              <div>
                <label style={ls}>Jabatan *</label>
                {jabatanCustom ? (
                  <div style={{ display: "flex", gap: "8px" }}>
                    <input
                      type="text"
                      value={form.jabatan}
                      onChange={(e) => setF("jabatan", e.target.value)}
                      placeholder="Tulis jabatan..."
                      className="input-base"
                      required
                      style={{ flex: 1 }}
                    />
                    <button
                      type="button"
                      onClick={() => { setJabatanCustom(false); setF("jabatan", ""); }}
                      style={{
                        padding: "0 12px", borderRadius: "10px",
                        background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                        border: "none", cursor: "pointer", fontSize: "0.8rem", flexShrink: 0,
                      }}
                    >
                      ↩ Pilih
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.jabatan}
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") {
                        setJabatanCustom(true);
                        setF("jabatan", "");
                      } else {
                        setF("jabatan", e.target.value);
                      }
                    }}
                    className="input-base"
                    required
                  >
                    <option value="">-- Pilih Jabatan --</option>
                    {JABATAN_LIST.map((j) => (
                      <option key={j} value={j}>{j}</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Urutan */}
              <div>
                <label style={ls}>Urutan Tampil</label>
                <input
                  type="number"
                  value={form.urutan}
                  onChange={(e) => setF("urutan", parseInt(e.target.value) || 99)}
                  className="input-base"
                  min={1}
                />
                <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
                  Angka kecil = tampil lebih awal
                </div>
              </div>
            </div>

            {/* Upload Foto */}
            <div style={{ marginBottom: "20px" }}>
              <ImageUpload
                value={form.photo ?? ""}
                onChange={(url) => setF("photo", url)}
                label="Foto Perangkat (opsional)"
              />
              {form.photo && (
                <button
                  type="button"
                  onClick={() => setF("photo", null)}
                  style={{
                    marginTop: "8px", padding: "5px 12px",
                    borderRadius: "7px", background: "#FEE2E2",
                    color: "#991B1B", border: "none",
                    cursor: "pointer", fontSize: "0.75rem",
                  }}
                >
                  Hapus Foto
                </button>
              )}
            </div>

            {/* Actions */}
            <div style={{
              display: "flex", gap: "10px",
              paddingTop: "16px", borderTop: "1px solid var(--color-ocean-100)",
            }}>
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

      {/* List */}
      <div style={{
        background: "white", borderRadius: "16px",
        overflow: "hidden", boxShadow: "var(--shadow-card)",
      }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-ocean-400)" }}>
            Memuat data perangkat...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--color-ocean-400)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👥</div>
            <p>Belum ada data perangkat desa.</p>
            <p style={{ fontSize: "0.82rem", marginTop: "6px" }}>
              Klik "+ Tambah Perangkat" untuk mulai mengisi.
            </p>
          </div>
        ) : (
          list.map((p, i) => (
            <div key={p.id} style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "14px 20px",
              borderTop: i === 0 ? "none" : "1px solid var(--color-ocean-100)",
              background: i % 2 === 0 ? "white" : "var(--color-ocean-50)",
              transition: "background 0.15s",
            }}>
              {/* Foto */}
              <div style={{
                width: 48, height: 48, borderRadius: "50%",
                overflow: "hidden", flexShrink: 0,
                background: "var(--color-ocean-200)",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "2px solid var(--color-ocean-100)",
              }}>
                {p.photo ? (
                  <img
                    src={p.photo}
                    alt={p.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <span style={{ fontSize: "1.25rem" }}>👤</span>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontWeight: 600, fontSize: "0.9rem",
                  color: "var(--color-ocean-900)",
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {p.name || "—"}
                </div>
                <div style={{
                  fontSize: "0.775rem", color: "var(--color-ocean-500)",
                  marginTop: "2px",
                }}>
                  {p.jabatan}
                </div>
              </div>

              {/* Urutan badge */}
              <div style={{
                background: "var(--color-ocean-100)",
                color: "var(--color-ocean-600)",
                fontSize: "0.7rem", fontWeight: 600,
                padding: "3px 10px", borderRadius: "9999px",
                flexShrink: 0,
              }}>
                #{p.urutan}
              </div>

              {/* Foto indicator */}
              <div style={{
                fontSize: "0.7rem",
                color: p.photo ? "var(--color-forest-600)" : "var(--color-ocean-300)",
                flexShrink: 0, minWidth: "50px", textAlign: "center",
              }}>
                {p.photo ? "📸 Ada" : "📷 —"}
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={() => openEdit(p)}
                  style={{
                    padding: "6px 14px", borderRadius: "8px",
                    background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                    border: "none", cursor: "pointer",
                    fontSize: "0.78rem", fontWeight: 500,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.name)}
                  style={{
                    padding: "6px 14px", borderRadius: "8px",
                    background: "#FEE2E2", color: "#991B1B",
                    border: "none", cursor: "pointer",
                    fontSize: "0.78rem", fontWeight: 500,
                  }}
                >
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info urutan */}
      {list.length > 0 && (
        <p style={{
          marginTop: "12px", fontSize: "0.78rem",
          color: "var(--color-ocean-400)", textAlign: "center",
        }}>
          💡 Ubah angka "Urutan Tampil" untuk mengatur posisi perangkat di halaman publik
        </p>
      )}
    </div>
  );
}