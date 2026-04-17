// File: app/admin/fasilitas/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getFasilitas, saveFasilitas, type FasilitasData, DEFAULT_FASILITAS } from "@/lib/firebase/fasilitas";

export default function AdminFasilitasPage() {
  const [data, setData] = useState<FasilitasData | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getFasilitas().then(setData);
  }, []);

  function update(category: keyof FasilitasData, field: string, value: string) {
    const numValue = parseInt(value) || 0;
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [category]: {
          ...prev[category],
          [field]: numValue
        }
      };
    });
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    try {
      await saveFasilitas(data);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert("Gagal menyimpan fasilitas.");
    } finally {
      setSaving(false);
    }
  }

  if (!data) return <div className="p-8 text-ocean-500">Memuat data fasilitas...</div>;

  const inputStyle = "w-full border border-ocean-200 rounded-xl px-4 py-2 mt-1 text-ocean-900 focus:outline-none focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-all font-bold text-lg";

  return (
    <div className="p-8 max-w-5xl">
      <div className="flex justify-between items-start mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display font-bold text-2xl text-ocean-900 mb-1">
            Katalog Fasilitas Desa
          </h1>
          <p className="text-sm text-ocean-500">
            Perbarui jumlah infrastruktur dan fasilitas sosial di Desa Tolai Barat.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-primary px-8 py-3">
          {saving ? "Menyimpan..." : saved ? "✓ Tersimpan!" : "Simpan Perubahan"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* PENDIDIKAN */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gold-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gold-50">
            <span className="text-3xl">🎓</span>
            <h2 className="font-bold text-gold-800 text-lg">Pendidikan</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-gold-600">TK / PAUD</label><input type="number" min="0" value={data.pendidikan.tk} onChange={e => update("pendidikan", "tk", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-gold-600">Sekolah Dasar (SD)</label><input type="number" min="0" value={data.pendidikan.sd} onChange={e => update("pendidikan", "sd", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-gold-600">SMP / Sederajat</label><input type="number" min="0" value={data.pendidikan.smp} onChange={e => update("pendidikan", "smp", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-gold-600">SMA / SMK</label><input type="number" min="0" value={data.pendidikan.sma} onChange={e => update("pendidikan", "sma", e.target.value)} className={inputStyle} /></div>
          </div>
        </div>

        {/* KESEHATAN */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-ocean-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ocean-50">
            <span className="text-3xl">🏥</span>
            <h2 className="font-bold text-ocean-800 text-lg">Kesehatan</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-ocean-600">Pustu</label><input type="number" min="0" value={data.kesehatan.pustu} onChange={e => update("kesehatan", "pustu", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-ocean-600">Posyandu</label><input type="number" min="0" value={data.kesehatan.posyandu} onChange={e => update("kesehatan", "posyandu", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-ocean-600">Polindes</label><input type="number" min="0" value={data.kesehatan.polindes} onChange={e => update("kesehatan", "polindes", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-ocean-600">Apotek / Klinik</label><input type="number" min="0" value={data.kesehatan.apotek} onChange={e => update("kesehatan", "apotek", e.target.value)} className={inputStyle} /></div>
          </div>
        </div>

        {/* IBADAH */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-forest-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-forest-50">
            <span className="text-3xl">🕌</span>
            <h2 className="font-bold text-forest-800 text-lg">Tempat Ibadah</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-forest-600">Pura</label><input type="number" min="0" value={data.ibadah.pura} onChange={e => update("ibadah", "pura", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-forest-600">Masjid / Musholla</label><input type="number" min="0" value={data.ibadah.masjid} onChange={e => update("ibadah", "masjid", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-forest-600">Gereja</label><input type="number" min="0" value={data.ibadah.gereja} onChange={e => update("ibadah", "gereja", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-forest-600">Vihara</label><input type="number" min="0" value={data.ibadah.vihara} onChange={e => update("ibadah", "vihara", e.target.value)} className={inputStyle} /></div>
          </div>
        </div>

        {/* OLAHRAGA */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-orange-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-orange-50">
            <span className="text-3xl">⚽</span>
            <h2 className="font-bold text-orange-800 text-lg">Olahraga & Publik</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-bold text-orange-600">Lapangan Voli</label><input type="number" min="0" value={data.olahraga.voli} onChange={e => update("olahraga", "voli", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-orange-600">Lapangan Bola</label><input type="number" min="0" value={data.olahraga.sepakbola} onChange={e => update("olahraga", "sepakbola", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-orange-600">Lapangan Bulutangkis</label><input type="number" min="0" value={data.olahraga.bulutangkis} onChange={e => update("olahraga", "bulutangkis", e.target.value)} className={inputStyle} /></div>
            <div><label className="text-xs font-bold text-orange-600">Gedung Olahraga / GOR</label><input type="number" min="0" value={data.olahraga.gor} onChange={e => update("olahraga", "gor", e.target.value)} className={inputStyle} /></div>
          </div>
        </div>

      </div>
    </div>
  );
}