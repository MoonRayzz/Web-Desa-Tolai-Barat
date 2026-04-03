"use client";

import { useEffect, useState, FormEvent, use } from "react";
import { useRouter } from "next/navigation";
import { getPengumumanById, updatePengumuman } from "@/lib/firebase/pengumuman";
import type { Pengumuman } from "@/types";

const ls: React.CSSProperties = {
  display: "block", fontSize: "0.82rem", fontWeight: 500,
  color: "var(--color-ocean-700)", marginBottom: "6px",
};

export default function EditPengumumanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id }  = use(params);
  const router  = useRouter();
  const [form, setForm]     = useState<Pengumuman | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getPengumumanById(id).then((data) => {
      if (data) setForm(data);
    });
  }, [id]);

  function set(key: string, value: string | boolean | null) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await updatePengumuman(id, {
        title:     form.title,
        content:   form.content,
        type:      form.type,
        priority:  form.priority,
        startDate: form.startDate,
        endDate:   form.endDate && form.endDate.trim() !== "" ? form.endDate : null,
        aktif:     form.aktif,
      });
      router.push("/admin/pengumuman");
    } catch {
      alert("Gagal menyimpan. Coba lagi.");
      setSaving(false);
    }
  }

  if (!form) return (
    <div style={{ padding: "32px", color: "var(--color-ocean-500)" }}>
      Memuat data...
    </div>
  );

  return (
    <div style={{ padding: "32px", maxWidth: "720px" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "none", border: "none",
            cursor: "pointer", color: "var(--color-ocean-500)",
            fontSize: "1.1rem", lineHeight: 1,
          }}
        >
          back
        </button>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.5rem", color: "var(--color-ocean-900)",
          }}>
            Edit Pengumuman
          </h1>
          <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginTop: "2px", fontFamily: "var(--font-mono)" }}>
            ID: {id}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{
          background: "white", borderRadius: "16px", padding: "28px",
          boxShadow: "var(--shadow-card)",
          display: "flex", flexDirection: "column", gap: "20px",
        }}>

          {/* Judul */}
          <div>
            <label style={ls}>Judul *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              className="input-base"
              required
            />
          </div>

          {/* Tipe + Prioritas */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={ls}>Tipe</label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="input-base"
              >
                <option value="pengumuman">Pengumuman</option>
                <option value="agenda">Agenda Kegiatan</option>
              </select>
            </div>
            <div>
              <label style={ls}>Prioritas</label>
              <select
                value={form.priority}
                onChange={(e) => set("priority", e.target.value)}
                className="input-base"
              >
                <option value="normal">Normal</option>
                <option value="penting">Penting (banner kuning)</option>
                <option value="darurat">Darurat (banner merah)</option>
              </select>
            </div>
          </div>

          {/* Tanggal */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label style={ls}>Tanggal Mulai *</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                className="input-base"
                required
              />
            </div>
            <div>
              <label style={ls}>Tanggal Selesai / Kadaluarsa</label>
              <input
                type="date"
                value={form.endDate ?? ""}
                onChange={(e) =>
                  set("endDate", e.target.value.trim() !== "" ? e.target.value : null)
                }
                className="input-base"
              />
              <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
                Kosongkan jika tidak ada kadaluarsa
              </div>
            </div>
          </div>

          {/* Isi */}
          <div>
            <label style={ls}>Isi / Keterangan</label>
            <textarea
              value={form.content}
              onChange={(e) => set("content", e.target.value)}
              rows={5}
              className="input-base"
              style={{ resize: "vertical" }}
            />
          </div>

          {/* Aktif */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <input
              type="checkbox"
              id="aktif-edit"
              checked={form.aktif}
              onChange={(e) => set("aktif", e.target.checked)}
              style={{ width: 16, height: 16, cursor: "pointer" }}
            />
            <label
              htmlFor="aktif-edit"
              style={{ fontSize: "0.875rem", color: "var(--color-ocean-700)", cursor: "pointer" }}
            >
              Aktif dan tampil di website
            </label>
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
              {saving ? "Menyimpan..." : "Update"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}