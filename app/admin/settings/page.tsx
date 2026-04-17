// File: app/admin/settings/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getDesaSettings, saveDesaSettings, type DesaSettings } from "@/lib/firebase/settings";
import { DusunData } from "@/types";
import ImageUpload from "@/components/admin/ImageUpload"; // <-- IMPORT KOMPONEN UPLOAD

type Tab = "statistik" | "profil" | "kontak" | "sosmed" | "lokasi";
const ls: React.CSSProperties = { display: "block", fontSize: "0.82rem", fontWeight: 500, color: "var(--color-ocean-700)", marginBottom: "6px" };

export default function SettingsPage() {
  const [tab, setTab] = useState<Tab>("statistik");
  const [data, setData] = useState<DesaSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => { getDesaSettings().then(setData); }, []);

  useEffect(() => {
    if (!data?.dusunList) return;
    const totalJiwa = data.dusunList.reduce((acc, d) => acc + (Number(d.lakiLaki) + Number(d.perempuan)), 0);
    const totalKK = data.dusunList.reduce((acc, d) => acc + Number(d.kk), 0);
    const totalDusun = data.dusunList.length;
    if (data.jumlahPenduduk !== totalJiwa.toLocaleString("id-ID") || data.jumlahKK !== totalKK.toLocaleString("id-ID") || data.jumlahDusun !== totalDusun.toString()) {
      setData(prev => prev ? { ...prev, jumlahPenduduk: totalJiwa.toLocaleString("id-ID"), jumlahKK: totalKK.toLocaleString("id-ID"), jumlahDusun: totalDusun.toString() } : null);
    }
  }, [data?.dusunList]);

  function update(key: keyof DesaSettings, value: any) { setData(prev => prev ? { ...prev, [key]: value } : prev); }
  function updateDusun(index: number, field: keyof DusunData, value: string | number) {
    setData(prev => {
      if (!prev) return prev; const newList = [...prev.dusunList]; const target = { ...newList[index], [field]: value };
      if (field === "lakiLaki" || field === "perempuan") target.total = Number(target.lakiLaki) + Number(target.perempuan);
      newList[index] = target; return { ...prev, dusunList: newList };
    });
  }
  function addDusun() { setData(prev => prev ? { ...prev, dusunList: [...prev.dusunList, { id: Date.now().toString(), nama: "Dusun Baru", kk: 0, lakiLaki: 0, perempuan: 0, total: 0 }] } : prev); }
  function removeDusun(index: number) { if (confirm("Hapus data dusun ini?")) setData(prev => prev ? { ...prev, dusunList: prev.dusunList.filter((_, i) => i !== index) } : prev); }
  function updateMisi(index: number, value: string) { setData(prev => { if (!prev) return prev; const misi = [...prev.misi]; misi[index] = value; return { ...prev, misi }; }); }
  function addMisi() { setData(prev => prev ? { ...prev, misi: [...prev.misi, ""] } : prev); }
  function removeMisi(index: number) { setData(prev => prev ? { ...prev, misi: prev.misi.filter((_, i) => i !== index) } : prev); }
  function updateProgram(index: number, field: "judul" | "isi", value: string) {
    setData(prev => { if (!prev) return prev; const prog = [...(prev.programUnggulan || [])]; prog[index] = { ...prog[index], [field]: value }; return { ...prev, programUnggulan: prog }; });
  }
  function addProgram() { setData(prev => prev ? { ...prev, programUnggulan: [...(prev.programUnggulan || []), { judul: "Program Baru", isi: "Penjelasan..." }] } : prev); }
  function removeProgram(index: number) { setData(prev => prev ? { ...prev, programUnggulan: (prev.programUnggulan || []).filter((_, i) => i !== index) } : prev); }

  async function handleSave() {
    if (!data) return; setSaving(true);
    try { await saveDesaSettings(data); setSaved(true); setTimeout(() => setSaved(false), 3000); } catch { alert("Gagal menyimpan."); } finally { setSaving(false); }
  }

  if (!data) return <div className="p-8 text-ocean-500">Memuat pengaturan...</div>;

  const TABS: { key: Tab; label: string }[] = [ { key: "statistik", label: "📊 Demografi Dusun" }, { key: "profil", label: "📋 Profil, Logo & Program" }, { key: "kontak", label: "📞 Kontak" }, { key: "sosmed", label: "🔗 Sosial Media" }, { key: "lokasi", label: "📍 Lokasi" } ];

  return (
    <div style={{ padding: "32px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "28px", flexWrap: "wrap", gap: "12px" }}>
        <div><h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-ocean-900)", marginBottom: "4px" }}>Pengaturan Desa</h1></div>
        <button onClick={handleSave} disabled={saving} className="btn-primary" style={{ padding: "11px 28px" }}>{saving ? "Menyimpan..." : saved ? "Tersimpan!" : "Simpan Perubahan"}</button>
      </div>

      <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: "white", padding: "4px", borderRadius: "12px", boxShadow: "var(--shadow-card)", flexWrap: "wrap" }}>
        {TABS.map((t) => (<button key={t.key} onClick={() => setTab(t.key)} style={{ padding: "10px 16px", borderRadius: "9px", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: tab === t.key ? 600 : 400, background: tab === t.key ? "var(--color-ocean-700)" : "transparent", color: tab === t.key ? "white" : "var(--color-ocean-600)", transition: "all 0.15s" }}>{t.label}</button>))}
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "28px", boxShadow: "var(--shadow-card)" }}>
        
        {tab === "statistik" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "16px", marginBottom: "32px", padding: "20px", background: "var(--color-ocean-50)", borderRadius: "12px" }}>
              <div><label style={ls}>Luas Wilayah (Ha)</label><input type="text" value={data.luasWilayah} onChange={e => update("luasWilayah", e.target.value)} className="input-base" /></div>
              <div><label style={ls}>RT / RW</label><input type="text" value={data.rtRw} onChange={e => update("rtRw", e.target.value)} className="input-base" /></div>
              <div><label style={ls}>Kode Pos</label><input type="text" value={data.kodePos} onChange={e => update("kodePos", e.target.value)} className="input-base" /></div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}><h3 style={{ fontSize: "1rem", fontWeight: 600 }}>Rincian Data Per Dusun</h3><button onClick={addDusun} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>+ Tambah Dusun</button></div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.875rem" }}>
                <thead><tr style={{ textAlign: "left", borderBottom: "2px solid var(--color-ocean-100)" }}><th>Nama Dusun</th><th>KK</th><th>Laki-Laki</th><th>Perempuan</th><th>Total Jiwa</th><th>Aksi</th></tr></thead>
                <tbody>{data.dusunList.map((d, i) => (<tr key={d.id} style={{ borderBottom: "1px solid var(--color-ocean-50)" }}><td style={{ padding: "8px" }}><input type="text" value={d.nama} onChange={e => updateDusun(i, "nama", e.target.value)} className="input-base" /></td><td style={{ padding: "8px" }}><input type="number" value={d.kk} onChange={e => updateDusun(i, "kk", Number(e.target.value))} className="input-base" /></td><td style={{ padding: "8px" }}><input type="number" value={d.lakiLaki} onChange={e => updateDusun(i, "lakiLaki", Number(e.target.value))} className="input-base" /></td><td style={{ padding: "8px" }}><input type="number" value={d.perempuan} onChange={e => updateDusun(i, "perempuan", Number(e.target.value))} className="input-base" /></td><td style={{ padding: "8px", fontWeight: "bold" }}>{d.total}</td><td style={{ padding: "8px" }}><button onClick={() => removeDusun(i)} style={{ color: "#ef4444", border: "none", background: "none", cursor: "pointer" }}>✕</button></td></tr>))}</tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "profil" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            
            {/* FITUR BARU: LOGO DESA */}
            <div className="bg-ocean-50/50 p-6 rounded-2xl border border-ocean-100">
              <h3 className="font-bold text-ocean-900 text-lg mb-4">Logo Desa Tolai Barat</h3>
              <div className="w-48 h-48">
                <ImageUpload value={data.logoDesa} onChange={url => update("logoDesa", url)} label="Upload Logo Resmi" />
              </div>
              <p className="text-xs text-ocean-500 mt-3">Gunakan gambar dengan format PNG (transparan) agar menyatu dengan warna website.</p>
            </div>

            <div><label style={ls}>Sejarah Desa</label><textarea value={data.sejarah} onChange={e => update("sejarah", e.target.value)} rows={6} className="input-base" /></div>
            <div><label style={ls}>Visi Desa</label><textarea value={data.visi} onChange={e => update("visi", e.target.value)} rows={3} className="input-base" /></div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}><label style={{ ...ls, marginBottom: 0 }}>Misi Desa</label><button onClick={addMisi} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "0.78rem" }}>+ Tambah Misi</button></div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {data.misi.map((m, i) => (<div key={i} style={{ display: "flex", gap: "8px", alignItems: "center" }}><span style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--color-ocean-100)", display: "flex", alignItems: "center", justifyContent: "center" }}>{i + 1}</span><input type="text" value={m} onChange={e => updateMisi(i, e.target.value)} className="input-base" style={{ flex: 1 }} /><button onClick={() => removeMisi(i)} style={{ padding: "8px", background: "#FEE2E2", color: "#991B1B", borderRadius: "8px" }}>✕</button></div>))}
              </div>
            </div>

            <hr className="border-t border-ocean-100" />

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <div><h3 className="font-bold text-ocean-900 text-lg">Program Unggulan Desa</h3><p className="text-xs text-ocean-500">Program ini akan ditampilkan di bagian Footer website.</p></div>
                <button onClick={addProgram} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem" }}>+ Tambah Program</button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(data.programUnggulan || []).map((p, i) => (
                  <div key={i} className="bg-ocean-50 p-4 rounded-xl border border-ocean-100 relative">
                    <button onClick={() => removeProgram(i)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 bg-white rounded-md p-1 shadow-sm">✕</button>
                    <label style={ls}>Nama Program</label><input type="text" value={p.judul} onChange={e => updateProgram(i, "judul", e.target.value)} className="input-base mb-3" />
                    <label style={ls}>Deskripsi Singkat</label><textarea value={p.isi} onChange={e => updateProgram(i, "isi", e.target.value)} rows={2} className="input-base" />
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}

        {tab === "kontak" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {[{ key: "telepon", label: "Nomor Telepon" }, { key: "email", label: "Email Desa" }, { key: "jamLayanan", label: "Jam Pelayanan" }, { key: "whatsapp", label: "No. WhatsApp" }].map(f => (<div key={f.key}><label style={ls}>{f.label}</label><input type="text" value={(data as any)[f.key] ?? ""} onChange={e => update(f.key as any, e.target.value)} className="input-base" /></div>))}
            <div style={{ gridColumn: "1 / -1" }}><label style={ls}>Alamat Kantor Desa</label><textarea value={data.alamat} onChange={e => update("alamat", e.target.value)} rows={2} className="input-base" /></div>
          </div>
        )}

        {tab === "sosmed" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {[{ key: "facebook", label: "Facebook URL" }, { key: "instagram", label: "Instagram URL" }, { key: "youtube", label: "YouTube URL" }].map(f => (<div key={f.key}><label style={ls}>{f.label}</label><input type="url" value={(data as any)[f.key] ?? ""} onChange={e => update(f.key as any, e.target.value)} className="input-base" /></div>))}
          </div>
        )}

        {tab === "lokasi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              <div><label style={ls}>Latitude</label><input type="text" value={data.koordinatLat} onChange={e => update("koordinatLat", e.target.value)} className="input-base" /></div><div><label style={ls}>Longitude</label><input type="text" value={data.koordinatLng} onChange={e => update("koordinatLng", e.target.value)} className="input-base" /></div><div style={{ gridColumn: "1 / -1" }}><label style={ls}>Google Maps URL</label><input type="url" value={data.googleMapsUrl} onChange={e => update("googleMapsUrl", e.target.value)} className="input-base" /></div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
              <div><label style={ls}>Batas Utara</label><input type="text" value={data.batasUtara || ""} onChange={e => update("batasUtara", e.target.value)} className="input-base" /></div><div><label style={ls}>Batas Timur</label><input type="text" value={data.batasTimur || ""} onChange={e => update("batasTimur", e.target.value)} className="input-base" /></div><div><label style={ls}>Batas Selatan</label><input type="text" value={data.batasSelatan || ""} onChange={e => update("batasSelatan", e.target.value)} className="input-base" /></div><div><label style={ls}>Batas Barat</label><input type="text" value={data.batasBarat || ""} onChange={e => update("batasBarat", e.target.value)} className="input-base" /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}