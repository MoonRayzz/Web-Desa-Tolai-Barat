// app/admin/perangkat/page.tsx
"use client";

import { useEffect, useState, FormEvent, useRef } from "react";
import {
  getAllPerangkat, createPerangkat,
  updatePerangkat, deletePerangkat,
} from "@/lib/firebase/perangkat";
import ImageUpload from "@/components/admin/ImageUpload";
import type { PerangkatDesa } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────
const EMPTY: Omit<PerangkatDesa, "id"> = {
  name: "", jabatan: "", photo: null, urutan: 99,
};

const JABATAN_LIST = [
  { label: "Kepala Desa",        group: "Pimpinan" },
  { label: "Sekretaris Desa",    group: "Sekretariat" },
  { label: "Bendahara Desa",     group: "Sekretariat" },
  { label: "Kaur Pemerintahan",  group: "Teknis" },
  { label: "Kaur Kesejahteraan", group: "Teknis" },
  { label: "Kaur Pembangunan",   group: "Teknis" },
  { label: "Kasi Pelayanan",     group: "Teknis" },
  { label: "Kasi Ketentraman",   group: "Teknis" },
  { label: "Kadus Dusun I",      group: "Wilayah" },
  { label: "Kadus Dusun II",     group: "Wilayah" },
  { label: "Kadus Dusun III",    group: "Wilayah" },
  { label: "Ketua BPD",          group: "BPD" },
  { label: "Anggota BPD",        group: "BPD" },
  { label: "Lainnya",            group: "Lainnya" },
];

// ─── Group Colors ─────────────────────────────────────────────────────────────
const GROUP_META: Record<string, { color: string; bg: string; icon: string; label: string }> = {
  bpd:        { color: "#166534", bg: "#DCFCE7", icon: "🏛️", label: "BPD" },
  pimpinan:   { color: "#B8860B", bg: "#FEF9C3", icon: "⭐", label: "Pimpinan" },
  sekretariat:{ color: "#1D4ED8", bg: "#DBEAFE", icon: "📋", label: "Sekretariat" },
  teknis:     { color: "#0369A1", bg: "#E0F2FE", icon: "⚙️", label: "Kaur & Kasi" },
  wilayah:    { color: "#065F46", bg: "#D1FAE5", icon: "🗺️", label: "Kadus/Wilayah" },
  lainnya:    { color: "#92400E", bg: "#FEF3C7", icon: "👤", label: "Lainnya" },
};

function getGroup(jabatan: string): string {
  const j = (jabatan || "").toLowerCase();
  if (j.includes("kepala desa")) return "pimpinan";
  if (j.includes("bpd") || j.includes("badan permusyawaratan")) return "bpd";
  if (j.includes("sekretaris") || j.includes("bendahara")) return "sekretariat";
  if (j.includes("kaur") || j.includes("kasi")) return "teknis";
  if (j.includes("dusun") || j.includes("kadus")) return "wilayah";
  return "lainnya";
}

// ─── Mini Avatar ──────────────────────────────────────────────────────────────
const MiniAvatar = ({ photo, name, size = 36 }: { photo?: string | null; name: string; size?: number }) => {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  if (photo) return (
    <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
  );
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #60A5FA, #1D4ED8)",
      display: "flex", alignItems: "center", justifyContent: "center",
      color: "white", fontWeight: 700, fontSize: size * 0.32, flexShrink: 0,
    }}>
      {initials || "?"}
    </div>
  );
};

// ─── Structure Preview (Mini Org Chart) ───────────────────────────────────────
function StructurePreview({ list }: { list: PerangkatDesa[] }) {
  const groups = {
    bpd:         list.filter((p) => getGroup(p.jabatan) === "bpd"),
    pimpinan:    list.filter((p) => getGroup(p.jabatan) === "pimpinan"),
    sekretariat: list.filter((p) => getGroup(p.jabatan) === "sekretariat"),
    teknis:      list.filter((p) => getGroup(p.jabatan) === "teknis"),
    wilayah:     list.filter((p) => getGroup(p.jabatan) === "wilayah"),
    lainnya:     list.filter((p) => getGroup(p.jabatan) === "lainnya"),
  };

  const orderedGroups = ["bpd", "pimpinan", "sekretariat", "teknis", "wilayah", "lainnya"] as const;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {orderedGroups.map((key) => {
        const members = groups[key];
        if (members.length === 0) return null;
        const meta = GROUP_META[key];
        return (
          <div key={key} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 80, fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase",
              letterSpacing: "0.08em", color: meta.color, textAlign: "right", flexShrink: 0,
            }}>
              {meta.label}
            </div>
            <div style={{ width: 1, height: 24, background: meta.color + "40", flexShrink: 0 }} />
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {members.map((p) => (
                <div key={p.id} style={{
                  background: meta.bg,
                  border: `1px solid ${meta.color}30`,
                  borderRadius: 8,
                  padding: "3px 8px",
                  fontSize: "0.65rem",
                  color: meta.color,
                  fontWeight: 600,
                  display: "flex", alignItems: "center", gap: 5,
                }}>
                  <MiniAvatar photo={p.photo} name={p.name} size={18} />
                  {p.name || "—"}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Draggable Row ─────────────────────────────────────────────────────────────
function DraggableRow({
  p, index, total, onEdit, onDelete, onMoveUp, onMoveDown,
}: {
  p: PerangkatDesa;
  index: number;
  total: number;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}) {
  const group = getGroup(p.jabatan);
  const meta = GROUP_META[group];

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 16px",
      background: "white",
      borderRadius: 14,
      border: "1px solid #E2E8F0",
      boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
      transition: "box-shadow 0.15s",
    }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
      }}
    >
      {/* Drag handle / order buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0 }}>
        <button
          onClick={onMoveUp}
          disabled={index === 0}
          title="Naik"
          style={{
            width: 22, height: 22, borderRadius: 6, border: "1px solid #E2E8F0",
            background: index === 0 ? "#F8FAFC" : "white",
            color: index === 0 ? "#CBD5E1" : "#64748B",
            cursor: index === 0 ? "not-allowed" : "pointer",
            fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ↑
        </button>
        <button
          onClick={onMoveDown}
          disabled={index === total - 1}
          title="Turun"
          style={{
            width: 22, height: 22, borderRadius: 6, border: "1px solid #E2E8F0",
            background: index === total - 1 ? "#F8FAFC" : "white",
            color: index === total - 1 ? "#CBD5E1" : "#64748B",
            cursor: index === total - 1 ? "not-allowed" : "pointer",
            fontSize: "0.7rem", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ↓
        </button>
      </div>

      {/* Urutan number */}
      <div style={{
        width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
        background: "#F1F5F9", color: "#64748B",
        fontSize: "0.7rem", fontWeight: 700,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {p.urutan}
      </div>

      {/* Avatar */}
      <MiniAvatar photo={p.photo} name={p.name} size={40} />

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: "0.875rem", color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {p.name || "—"}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{
            background: meta.bg, color: meta.color,
            fontSize: "0.62rem", fontWeight: 700,
            padding: "2px 8px", borderRadius: 99,
            border: `1px solid ${meta.color}30`,
          }}>
            {meta.icon} {p.jabatan}
          </span>
        </div>
      </div>

      {/* Group indicator */}
      <div style={{
        width: 4, height: 40, borderRadius: 99,
        background: meta.color + "60",
        flexShrink: 0,
      }} />

      {/* Actions */}
      <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
        <button
          onClick={onEdit}
          style={{
            padding: "6px 14px", borderRadius: 9,
            background: "#EFF6FF", color: "#1D4ED8",
            border: "1px solid #BFDBFE",
            cursor: "pointer", fontSize: "0.75rem", fontWeight: 600,
          }}
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          style={{
            padding: "6px 14px", borderRadius: 9,
            background: "#FEF2F2", color: "#991B1B",
            border: "1px solid #FECACA",
            cursor: "pointer", fontSize: "0.75rem", fontWeight: 600,
          }}
        >
          Hapus
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AdminPerangkatPage() {
  const [list, setList]         = useState<PerangkatDesa[]>([]);
  const [loading, setLoading]   = useState(true);
  const [form, setForm]         = useState<Omit<PerangkatDesa, "id"> | null>(null);
  const [editId, setEditId]     = useState<string | null>(null);
  const [saving, setSaving]     = useState(false);
  const [customJabatan, setCustomJabatan] = useState(false);
  const [tab, setTab]           = useState<"list" | "preview">("list");
  const [savingOrder, setSavingOrder] = useState(false);

  async function load() {
    const data = await getAllPerangkat();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  // ── Form Handlers ──
  function openAdd() {
    setForm({ ...EMPTY, urutan: list.length + 1 });
    setEditId(null);
    setCustomJabatan(false);
  }

  function openEdit(p: PerangkatDesa) {
    const isCustom = !JABATAN_LIST.find((j) => j.label === p.jabatan);
    setForm({ name: p.name, jabatan: p.jabatan, photo: p.photo, urutan: p.urutan });
    setEditId(p.id);
    setCustomJabatan(isCustom);
  }

  function closeForm() { setForm(null); setEditId(null); setCustomJabatan(false); }
  function setF(key: string, value: string | number | null) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    if (!form.name.trim() || !form.jabatan.trim()) { alert("Nama dan jabatan wajib diisi."); return; }
    setSaving(true);
    try {
      if (editId) await updatePerangkat(editId, form);
      else await createPerangkat(form);
      closeForm();
      await load();
    } catch { alert("Gagal menyimpan. Coba lagi."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Hapus perangkat "${name}"?`)) return;
    await deletePerangkat(id);
    setList((p) => p.filter((x) => x.id !== id));
  }

  // ── Move up/down & save order ──
  async function moveItem(index: number, direction: "up" | "down") {
    const newList = [...list];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newList.length) return;
    [newList[index], newList[targetIndex]] = [newList[targetIndex], newList[index]];
    // Re-assign urutan
    const updated = newList.map((p, i) => ({ ...p, urutan: i + 1 }));
    setList(updated);
    // Save to Firebase
    setSavingOrder(true);
    try {
      await Promise.all(updated.map((p) => updatePerangkat(p.id, { urutan: p.urutan })));
    } catch { alert("Gagal menyimpan urutan."); }
    finally { setSavingOrder(false); }
  }

  // ─── Grouped by level for display ─────────────────────────────────────────
  const groupedList = (() => {
    const order = ["pimpinan", "bpd", "sekretariat", "teknis", "wilayah", "lainnya"];
    const groups: Record<string, PerangkatDesa[]> = {};
    order.forEach((k) => (groups[k] = []));
    list.forEach((p) => {
      const g = getGroup(p.jabatan);
      groups[g] = [...(groups[g] || []), p];
    });
    return { groups, order };
  })();

  // ─── Input styling ──────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "10px 14px", borderRadius: 12,
    border: "1.5px solid #CBD5E1", fontSize: "0.875rem",
    outline: "none", background: "white", color: "#1E293B",
    boxSizing: "border-box",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ padding: "32px", maxWidth: 1000, margin: "0 auto" }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.6rem", color: "#0F172A", marginBottom: 4 }}>
            Kelola Perangkat Desa
          </h1>
          <p style={{ fontSize: "0.82rem", color: "#64748B" }}>
            {list.length} perangkat terdaftar · Urutan tampil dapat diatur langsung
          </p>
        </div>
        <button
          onClick={openAdd}
          style={{
            padding: "10px 22px", borderRadius: 12,
            background: "linear-gradient(135deg, #1D4ED8, #2563EB)",
            color: "white", border: "none", cursor: "pointer",
            fontSize: "0.875rem", fontWeight: 700,
            boxShadow: "0 4px 12px #1D4ED840",
          }}
        >
          + Tambah Perangkat
        </button>
      </div>

      {/* ── Structure Preview Card ── */}
      {list.length > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #F8FAFC, #EFF6FF)",
          border: "1.5px solid #BFDBFE",
          borderRadius: 20, padding: "20px 24px", marginBottom: 24,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: "0.875rem", color: "#1E293B" }}>
                🏛️ Preview Struktur Bagan
              </div>
              <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: 2 }}>
                Tampilan live sesuai data saat ini
              </div>
            </div>
            {savingOrder && (
              <div style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 600 }}>
                💾 Menyimpan urutan...
              </div>
            )}
          </div>
          <StructurePreview list={list} />
        </div>
      )}

      {/* ── Form ── */}
      {form && (
        <div style={{
          background: "white",
          borderRadius: 20, padding: "28px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          marginBottom: 24,
          border: "2px solid #3B82F620",
        }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontWeight: 700, fontSize: "1.1rem", color: "#0F172A", marginBottom: 20 }}>
            {editId ? "✏️ Edit Perangkat" : "➕ Tambah Perangkat Baru"}
          </h2>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16, marginBottom: 20 }}>

              {/* Nama */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setF("name", e.target.value)}
                  placeholder="contoh: Ahmad Fauzi, S.Sos"
                  style={inputStyle}
                  required
                />
              </div>

              {/* Jabatan */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Jabatan *
                </label>
                {customJabatan ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="text"
                      value={form.jabatan}
                      onChange={(e) => setF("jabatan", e.target.value)}
                      placeholder="Tulis jabatan..."
                      style={{ ...inputStyle, flex: 1 }}
                      required
                    />
                    <button type="button" onClick={() => { setCustomJabatan(false); setF("jabatan", ""); }}
                      style={{ padding: "0 12px", borderRadius: 10, background: "#F1F5F9", color: "#64748B", border: "1px solid #CBD5E1", cursor: "pointer", fontSize: "0.75rem", flexShrink: 0 }}>
                      ↩
                    </button>
                  </div>
                ) : (
                  <select
                    value={form.jabatan}
                    onChange={(e) => {
                      if (e.target.value === "Lainnya") { setCustomJabatan(true); setF("jabatan", ""); }
                      else setF("jabatan", e.target.value);
                    }}
                    style={inputStyle}
                    required
                  >
                    <option value="">-- Pilih Jabatan --</option>
                    {/* Group by category */}
                    {["Pimpinan", "Sekretariat", "Teknis", "Wilayah", "BPD", "Lainnya"].map((group) => (
                      <optgroup key={group} label={`── ${group} ──`}>
                        {JABATAN_LIST.filter((j) => j.group === group).map((j) => (
                          <option key={j.label} value={j.label}>{j.label}</option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                )}
                {/* Group preview */}
                {form.jabatan && (
                  <div style={{ marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
                    {(() => {
                      const g = getGroup(form.jabatan);
                      const m = GROUP_META[g];
                      return (
                        <span style={{ background: m.bg, color: m.color, fontSize: "0.62rem", fontWeight: 700, padding: "2px 8px", borderRadius: 99, border: `1px solid ${m.color}30` }}>
                          {m.icon} {m.label}
                        </span>
                      );
                    })()}
                    <span style={{ fontSize: "0.62rem", color: "#94A3B8" }}>Level bagan</span>
                  </div>
                )}
              </div>

              {/* Urutan */}
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={form.urutan}
                  onChange={(e) => setF("urutan", parseInt(e.target.value) || 99)}
                  style={inputStyle}
                  min={1}
                />
                <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: 4 }}>
                  Angka kecil tampil lebih awal
                </div>
              </div>
            </div>

            {/* Upload Foto */}
            <div style={{ marginBottom: 20 }}>
              <ImageUpload
                value={form.photo ?? ""}
                onChange={(url) => setF("photo", url)}
                label="Foto Perangkat (opsional)"
              />
              {form.photo && (
                <button type="button" onClick={() => setF("photo", null)}
                  style={{ marginTop: 8, padding: "5px 12px", borderRadius: 8, background: "#FEE2E2", color: "#991B1B", border: "none", cursor: "pointer", fontSize: "0.75rem" }}>
                  🗑️ Hapus Foto
                </button>
              )}
            </div>

            <div style={{ display: "flex", gap: 10, paddingTop: 16, borderTop: "1px solid #F1F5F9" }}>
              <button type="submit" disabled={saving}
                style={{ padding: "10px 24px", borderRadius: 12, background: saving ? "#93C5FD" : "linear-gradient(135deg, #1D4ED8, #2563EB)", color: "white", border: "none", cursor: saving ? "not-allowed" : "pointer", fontSize: "0.875rem", fontWeight: 700 }}>
                {saving ? "Menyimpan..." : editId ? "💾 Update" : "✅ Simpan"}
              </button>
              <button type="button" onClick={closeForm}
                style={{ padding: "10px 24px", borderRadius: 12, background: "#F1F5F9", color: "#475569", border: "none", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600 }}>
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── List ── */}
      <div style={{ background: "white", borderRadius: 20, overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #E2E8F0" }}>
        {/* List header */}
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Daftar Perangkat · Urutan Bagan
          </span>
          <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
            Klik ↑↓ untuk atur posisi
          </span>
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#94A3B8" }}>
            <div style={{ fontSize: "2rem", marginBottom: 12 }}>⏳</div>
            Memuat data perangkat...
          </div>
        ) : list.length === 0 ? (
          <div style={{ padding: "80px 40px", textAlign: "center", color: "#94A3B8" }}>
            <div style={{ fontSize: "3rem", marginBottom: 16, opacity: 0.4 }}>👥</div>
            <p style={{ fontWeight: 600, color: "#64748B", marginBottom: 6 }}>Belum ada data perangkat desa</p>
            <p style={{ fontSize: "0.82rem" }}>Klik "+ Tambah Perangkat" untuk mulai mengisi.</p>
          </div>
        ) : (
          <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 8 }}>
            {list.map((p, i) => (
              <DraggableRow
                key={p.id}
                p={p}
                index={i}
                total={list.length}
                onEdit={() => openEdit(p)}
                onDelete={() => handleDelete(p.id, p.name)}
                onMoveUp={() => moveItem(i, "up")}
                onMoveDown={() => moveItem(i, "down")}
              />
            ))}
          </div>
        )}
      </div>

      {list.length > 0 && (
        <p style={{ marginTop: 12, fontSize: "0.72rem", color: "#94A3B8", textAlign: "center" }}>
          💡 Urutan disimpan otomatis ke Firebase setelah klik ↑↓
        </p>
      )}
    </div>
  );
}