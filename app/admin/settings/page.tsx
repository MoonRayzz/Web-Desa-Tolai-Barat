"use client";

import { useEffect, useState } from "react";
import { getDesaSettings, saveDesaSettings, type DesaSettings } from "@/lib/firebase/settings";

type Tab = "statistik" | "profil" | "kontak" | "sosmed";

export default function SettingsPage() {
  const [tab, setTab]         = useState<Tab>("statistik");
  const [data, setData]       = useState<DesaSettings | null>(null);
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);

  useEffect(() => {
    getDesaSettings().then(setData);
  }, []);

  function update(key: keyof DesaSettings, value: string) {
    setData((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function updateMisi(index: number, value: string) {
    setData((prev) => {
      if (!prev) return prev;
      const misi = [...prev.misi];
      misi[index] = value;
      return { ...prev, misi };
    });
  }

  function addMisi() {
    setData((prev) => prev ? { ...prev, misi: [...prev.misi, ""] } : prev);
  }

  function removeMisi(index: number) {
    setData((prev) => {
      if (!prev) return prev;
      return { ...prev, misi: prev.misi.filter((_, i) => i !== index) };
    });
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await saveDesaSettings(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      alert("Gagal menyimpan. Coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return (
    <div style={{ padding: "32px", color: "var(--color-ocean-500)" }}>
      Memuat pengaturan...
    </div>
  );

  const TABS: { key: Tab; label: string; emoji: string }[] = [
    { key: "statistik", label: "Statistik Desa", emoji: "📊" },
    { key: "profil",    label: "Profil & Visi Misi", emoji: "📋" },
    { key: "kontak",    label: "Kontak & Jam Layanan", emoji: "📞" },
    { key: "sosmed",    label: "Sosial Media", emoji: "🔗" },
  ];

  return (
    <div style={{ padding: "32px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.5rem", color: "var(--color-ocean-900)", marginBottom: "4px",
          }}>
            Pengaturan Desa
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-ocean-500)" }}>
            Semua perubahan langsung tampil di website publik
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary"
          style={{ padding: "11px 28px" }}
        >
          {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Semua"}
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex", gap: "4px", marginBottom: "24px",
        background: "white", padding: "4px", borderRadius: "12px",
        boxShadow: "var(--shadow-card)", flexWrap: "wrap",
      }}>
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            padding: "10px 18px", borderRadius: "9px",
            border: "none", cursor: "pointer",
            fontSize: "0.85rem", fontWeight: tab === t.key ? 600 : 400,
            background: tab === t.key ? "var(--color-ocean-700)" : "transparent",
            color: tab === t.key ? "white" : "var(--color-ocean-600)",
            transition: "all 0.15s",
          }}>
            {t.emoji} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{
        background: "white", borderRadius: "16px", padding: "28px",
        boxShadow: "var(--shadow-card)",
      }}>

        {/* TAB: STATISTIK */}
        {tab === "statistik" && (
          <div>
            <p style={{ fontSize: "0.85rem", color: "var(--color-ocean-500)", marginBottom: "24px" }}>
              Data ini ditampilkan di homepage dan halaman profil desa.
            </p>
            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "20px",
            }}>
              {[
                { key: "jumlahPenduduk", label: "Jumlah Penduduk", hint: "contoh: 2.412" },
                { key: "jumlahKK",       label: "Jumlah KK",       hint: "contoh: 687"   },
                { key: "luasWilayah",    label: "Luas Wilayah (Ha)", hint: "contoh: 1.240" },
                { key: "jumlahDusun",    label: "Jumlah Dusun",    hint: "contoh: 3"     },
                { key: "rtRw",           label: "RT / RW",         hint: "contoh: 12 / 4" },
                { key: "kodePos",        label: "Kode Pos",        hint: "contoh: 94473" },
              ].map((f) => (
                <div key={f.key}>
                  <label style={{
                    display: "block", fontSize: "0.82rem", fontWeight: 500,
                    color: "var(--color-ocean-700)", marginBottom: "6px",
                  }}>
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={(data as any)[f.key]}
                    onChange={(e) => update(f.key as keyof DesaSettings, e.target.value)}
                    placeholder={f.hint}
                    className="input-base"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PROFIL */}
        {tab === "profil" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={{
                display: "block", fontSize: "0.82rem", fontWeight: 500,
                color: "var(--color-ocean-700)", marginBottom: "6px",
              }}>
                Sejarah Desa
              </label>
              <textarea
                value={data.sejarah}
                onChange={(e) => update("sejarah", e.target.value)}
                rows={5}
                className="input-base"
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <label style={{
                display: "block", fontSize: "0.82rem", fontWeight: 500,
                color: "var(--color-ocean-700)", marginBottom: "6px",
              }}>
                Visi Desa
              </label>
              <textarea
                value={data.visi}
                onChange={(e) => update("visi", e.target.value)}
                rows={3}
                className="input-base"
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                <label style={{
                  fontSize: "0.82rem", fontWeight: 500,
                  color: "var(--color-ocean-700)",
                }}>
                  Misi Desa
                </label>
                <button onClick={addMisi} style={{
                  padding: "5px 12px", borderRadius: "8px",
                  background: "var(--color-ocean-100)", color: "var(--color-ocean-700)",
                  border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 500,
                }}>
                  + Tambah Misi
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {data.misi.map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: "50%",
                      background: "var(--color-ocean-100)",
                      color: "var(--color-ocean-700)",
                      fontSize: "0.72rem", fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0,
                    }}>
                      {i + 1}
                    </span>
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => updateMisi(i, e.target.value)}
                      className="input-base"
                      style={{ flex: 1 }}
                    />
                    <button onClick={() => removeMisi(i)} style={{
                      padding: "8px 10px", borderRadius: "8px",
                      background: "#FEE2E2", color: "#991B1B",
                      border: "none", cursor: "pointer", fontSize: "0.85rem",
                      flexShrink: 0,
                    }}>
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: KONTAK */}
        {tab === "kontak" && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {[
              { key: "telepon",    label: "Nomor Telepon",    hint: "(0451) xxx-xxxx",            type: "text"  },
              { key: "email",      label: "Email Desa",       hint: "desa@tolaibaratofc.id",       type: "email" },
              { key: "alamat",     label: "Alamat Kantor",    hint: "Jl. Desa Tolai Barat...",     type: "text"  },
              { key: "jamLayanan", label: "Jam Layanan",      hint: "Senin–Jumat, 08.00–15.00",    type: "text"  },
              { key: "whatsapp",   label: "Nomor WhatsApp",   hint: "628xxxxxxxxxx (tanpa +)",     type: "text"  },
            ].map((f) => (
              <div key={f.key}>
                <label style={{
                  display: "block", fontSize: "0.82rem", fontWeight: 500,
                  color: "var(--color-ocean-700)", marginBottom: "6px",
                }}>
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={(data as any)[f.key]}
                  onChange={(e) => update(f.key as keyof DesaSettings, e.target.value)}
                  placeholder={f.hint}
                  className="input-base"
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB: SOSMED */}
        {tab === "sosmed" && (
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "20px",
          }}>
            {[
              { key: "facebook",  label: "Facebook URL",  hint: "https://facebook.com/...",  emoji: "📘" },
              { key: "instagram", label: "Instagram URL", hint: "https://instagram.com/...", emoji: "📸" },
              { key: "youtube",   label: "YouTube URL",   hint: "https://youtube.com/...",   emoji: "▶️" },
            ].map((f) => (
              <div key={f.key}>
                <label style={{
                  display: "block", fontSize: "0.82rem", fontWeight: 500,
                  color: "var(--color-ocean-700)", marginBottom: "6px",
                }}>
                  {f.emoji} {f.label}
                </label>
                <input
                  type="url"
                  value={(data as any)[f.key]}
                  onChange={(e) => update(f.key as keyof DesaSettings, e.target.value)}
                  placeholder={f.hint}
                  className="input-base"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}