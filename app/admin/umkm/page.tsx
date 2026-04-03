"use client";

import { useEffect, useState, FormEvent } from "react";
import { getAllUmkm, createUmkm, updateUmkm, deleteUmkm } from "@/lib/firebase/umkm";
import type { Umkm, UmkmKategori } from "@/types";

const EMPTY: Omit<Umkm, "id"> = {
  name: "", owner: "", description: "",
  image: "", kategori: "kuliner", whatsapp: "",
};

export default function AdminUmkmPage() {
  const [list, setList]       = useState<Umkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]       = useState<Omit<Umkm, "id"> | null>(null);
  const [editId, setEditId]   = useState<string | null>(null);
  const [saving, setSaving]   = useState(false);

  async function load() { const d = await getAllUmkm(); setList(d); setLoading(false); }
  useEffect(() => { load(); }, []);

  function openAdd()          { setForm({ ...EMPTY }); setEditId(null); }
  function openEdit(u: Umkm)  { setForm({ name: u.name, owner: u.owner, description: u.description, image: u.image, kategori: u.kategori, whatsapp: u.whatsapp }); setEditId(u.id); }
  function closeForm()        { setForm(null); setEditId(null); }

  function setF(key: string, value: string) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editId) await updateUmkm(editId, form);
      else        await createUmkm(form);
      closeForm(); await load();
    } catch { alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus UMKM "${name}"?`)) return;
    await deleteUmkm(id);
    setList((p) => p.filter((u) => u.id !== id));
  }

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-ocean-900)" }}>
          Kelola UMKM
        </h1>
        <button onClick={openAdd} className="btn-primary" style={{ padding: "10px 22px" }}>
          + Tambah UMKM
        </button>
      </div>

      {form && (
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)", marginBottom: "24px", border: "2px solid var(--color-ocean-200)" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-ocean-900)", marginBottom: "20px" }}>
            {editId ? "Edit UMKM" : "Tambah UMKM Baru"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "16px", marginBottom: "16px" }}>
              {[
                { key: "name",     label: "Nama Usaha"   },
                { key: "owner",    label: "Nama Pemilik" },
                { key: "whatsapp", label: "No. WhatsApp (628xxx)" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={ls}>{f.label}</label>
                  <input value={(form as any)[f.key] ?? ""}
                    onChange={(e) => setF(f.key, e.target.value)}
                    className="input-base" required={f.key !== "whatsapp"} />
                </div>
              ))}
              <div>
                <label style={ls}>Kategori</label>
                <select value={form.kategori}
                  onChange={(e) => setF("kategori", e.target.value)}
                  className="input-base">
                  <option value="kuliner">🍴 Kuliner</option>
                  <option value="kerajinan">🎨 Kerajinan</option>
                  <option value="pertanian">🌾 Pertanian</option>
                  <option value="perikanan">🐟 Perikanan</option>
                  <option value="jasa">🛎️ Jasa</option>
                </select>
              </div>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={ls}>Deskripsi Usaha</label>
              <textarea value={form.description}
                onChange={(e) => setF("description", e.target.value)}
                rows={3} className="input-base" style={{ resize: "vertical" }} required />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" disabled={saving} className="btn-primary" style={{ padding: "10px 22px" }}>
                {saving ? "Menyimpan..." : editId ? "Update" : "Simpan"}
              </button>
              <button type="button" onClick={closeForm} className="btn-secondary" style={{ padding: "10px 22px" }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {loading ? (
          <div style={{ color: "var(--color-ocean-400)" }}>Memuat...</div>
        ) : list.map((u) => (
          <div key={u.id} style={{ background: "white", borderRadius: "14px", padding: "18px", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-ocean-100)" }}>
            <div style={{ fontWeight: 600, fontSize: "0.9rem", color: "var(--color-ocean-900)", marginBottom: "2px" }}>{u.name}</div>
            <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-500)", marginBottom: "6px" }}>👤 {u.owner}</div>
            <span style={{ background: "var(--color-forest-100)", color: "var(--color-forest-700)", fontSize: "0.68rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px", display: "inline-block", marginBottom: "8px" }}>
              {u.kategori}
            </span>
            <p style={{ fontSize: "0.8rem", color: "var(--color-ocean-600)", lineHeight: 1.6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden", marginBottom: "12px" }}>
              {u.description}
            </p>
            {u.whatsapp && (
              <div style={{ fontSize: "0.75rem", color: "var(--color-forest-600)", marginBottom: "12px" }}>
                📱 {u.whatsapp}
              </div>
            )}
            <div style={{ display: "flex", gap: "8px", paddingTop: "12px", borderTop: "1px solid var(--color-ocean-100)" }}>
              <button onClick={() => openEdit(u)} style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "var(--color-ocean-100)", color: "var(--color-ocean-700)", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>Edit</button>
              <button onClick={() => handleDelete(u.id, u.name)} style={{ flex: 1, padding: "7px", borderRadius: "8px", background: "#FEE2E2", color: "#991B1B", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>Hapus</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};