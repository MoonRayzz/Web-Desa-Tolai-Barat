"use client";

import { useEffect, useState, FormEvent } from "react";
import {
  collection, getDocs, addDoc, updateDoc, deleteDoc,
  doc, orderBy, query, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { PerangkatDesa } from "@/types";

const COL = "perangkat";

async function getAll(): Promise<PerangkatDesa[]> {
  try {
    const snap = await getDocs(query(collection(db, COL), orderBy("urutan", "asc")));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as PerangkatDesa));
  } catch { return []; }
}

// Baris ini sudah diperbaiki tipe datanya
const EMPTY = { name: "", jabatan: "", photo: null as string | null, urutan: 99 };

export default function AdminPerangkatPage() {
  const [list, setList]     = useState<PerangkatDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm]     = useState<typeof EMPTY | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function load() { const d = await getAll(); setList(d); setLoading(false); }
  useEffect(() => { load(); }, []);

  function openAdd()              { setForm({ ...EMPTY }); setEditId(null); }
  function openEdit(p: PerangkatDesa){ setForm({ name: p.name, jabatan: p.jabatan, photo: p.photo, urutan: p.urutan }); setEditId(p.id); }
  function closeForm()            { setForm(null); setEditId(null); }

  function setF(key: string, value: string | number) {
    setForm((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      if (editId) await updateDoc(doc(db, COL, editId), { ...form, updatedAt: serverTimestamp() });
      else        await addDoc(collection(db, COL), { ...form, createdAt: serverTimestamp() });
      closeForm(); await load();
    } catch { alert("Gagal menyimpan."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus perangkat "${name}"?`)) return;
    await deleteDoc(doc(db, COL, id));
    setList((p) => p.filter((x) => x.id !== id));
  }

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-ocean-900)" }}>
            Kelola Perangkat Desa
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--color-ocean-500)", marginTop: "2px" }}>
            Data tampil di halaman Profil Desa
          </p>
        </div>
        <button onClick={openAdd} className="btn-primary" style={{ padding: "10px 22px" }}>
          + Tambah Perangkat
        </button>
      </div>

      {form && (
        <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)", marginBottom: "24px", border: "2px solid var(--color-ocean-200)" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-ocean-900)", marginBottom: "20px" }}>
            {editId ? "Edit Perangkat" : "Tambah Perangkat Baru"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "20px" }}>
              <div>
                <label style={ls}>Nama Lengkap</label>
                <input value={form.name} onChange={(e) => setF("name", e.target.value)}
                  className="input-base" required />
              </div>
              <div>
                <label style={ls}>Jabatan</label>
                <input value={form.jabatan} onChange={(e) => setF("jabatan", e.target.value)}
                  placeholder="contoh: Kepala Desa"
                  className="input-base" required />
              </div>
              <div>
                <label style={ls}>Urutan Tampil</label>
                <input type="number" value={form.urutan}
                  onChange={(e) => setF("urutan", parseInt(e.target.value))}
                  className="input-base" min={1} />
              </div>
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

      <div style={{ background: "white", borderRadius: "16px", overflow: "hidden", boxShadow: "var(--shadow-card)" }}>
        {loading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "var(--color-ocean-400)" }}>Memuat...</div>
        ) : list.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "var(--color-ocean-400)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>👥</div>
            Belum ada data perangkat desa.
          </div>
        ) : list.map((p, i) => (
          <div key={p.id} style={{
            display: "flex", alignItems: "center", gap: "16px",
            padding: "14px 20px",
            borderTop: i === 0 ? "none" : "1px solid var(--color-ocean-100)",
            background: i % 2 === 0 ? "white" : "var(--color-ocean-50)",
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: "50%",
              background: "var(--color-ocean-200)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "1.1rem", flexShrink: 0,
            }}>
              👤
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-ocean-900)" }}>
                {p.name || "—"}
              </div>
              <div style={{ fontSize: "0.775rem", color: "var(--color-ocean-500)" }}>{p.jabatan}</div>
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginRight: "12px" }}>
              Urutan #{p.urutan}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => openEdit(p)} style={{ padding: "5px 12px", borderRadius: "7px", background: "var(--color-ocean-100)", color: "var(--color-ocean-700)", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>
                Edit
              </button>
              <button onClick={() => handleDelete(p.id, p.name)} style={{ padding: "5px 12px", borderRadius: "7px", background: "#FEE2E2", color: "#991B1B", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500 }}>
                Hapus
              </button>
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