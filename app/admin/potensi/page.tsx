"use client";

import { useEffect, useState, FormEvent } from "react";
import { getAllPotensi, createPotensi, updatePotensi, deletePotensi } from "@/lib/firebase/potensi";
import ImageUpload from "@/components/admin/ImageUpload";
import type { PotensiDesa, PotensiKategori, PotensiSektor } from "@/types";

export default function AdminPotensiPage() {
  const [list, setList] = useState<PotensiDesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PotensiKategori | "semua">("semua");
  const [form, setForm] = useState<Partial<PotensiDesa> | null>(null);
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  async function load() {
    const data = await getAllPotensi();
    setList(data);
    setLoading(false);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form?.nama) return;
    try {
      if (editId) await updatePotensi(editId, form);
      else await createPotensi(form as Omit<PotensiDesa, "id">);
      setForm(null); setEditId(null);
      load();
    } catch { alert("Gagal menyimpan."); }
  }

  const filteredList = filter === "semua" ? list : list.filter(item => item.kategori === filter);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-ocean-900">Manajemen Potensi Desa</h1>
        <button 
          onClick={() => setForm({ kategori: "mikro", sektor: "pertanian", image: "" })}
          className="btn-primary"
        >+ Tambah Potensi/Usaha</button>
      </div>

      {/* Filter Kategori */}
      <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-sm w-fit">
        {["semua", "makro", "mikro"].map(k => (
          <button 
            key={k} 
            onClick={() => setFilter(k as any)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === k ? 'bg-ocean-700 text-white' : 'text-ocean-600 hover:bg-ocean-50'}`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Form Overlay */}
      {form && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editId ? 'Edit' : 'Tambah'} Potensi/Usaha</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-bold block mb-1">Nama Potensi/Usaha *</label>
                <input type="text" className="input-base" value={form.nama || ""} onChange={e => setForm({...form, nama: e.target.value})} required />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Kategori *</label>
                <select className="input-base" value={form.kategori} onChange={e => setForm({...form, kategori: e.target.value as any})}>
                  <option value="makro">Makro (Komoditas Utama)</option>
                  <option value="mikro">Mikro (UMKM Warga)</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Sektor *</label>
                <select className="input-base" value={form.sektor} onChange={e => setForm({...form, sektor: e.target.value as any})}>
                  <option value="pertanian">Pertanian</option>
                  <option value="perkebunan">Perkebunan</option>
                  <option value="perikanan">Perikanan</option>
                  <option value="perdagangan">Perdagangan</option>
                  <option value="jasa">Jasa</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Angka Metrik (Opsional)</label>
                <input type="text" className="input-base" placeholder="Cth: 446 Hektar" value={form.metrik || ""} onChange={e => setForm({...form, metrik: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-bold block mb-1">Nama Kontak</label>
                <input type="text" className="input-base" value={form.kontakName || ""} onChange={e => setForm({...form, kontakName: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold block mb-1">WhatsApp (628...)</label>
                <input type="text" className="input-base" value={form.whatsapp || ""} onChange={e => setForm({...form, whatsapp: e.target.value})} />
              </div>
              <div className="col-span-2">
                <label className="text-sm font-bold block mb-1">Deskripsi</label>
                <textarea className="input-base" rows={3} value={form.deskripsi || ""} onChange={e => setForm({...form, deskripsi: e.target.value})} />
              </div>
              <div className="col-span-2">
                <ImageUpload value={form.image || ""} onChange={url => setForm({...form, image: url})} label="Foto Potensi" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="btn-primary flex-1">Simpan</button>
              <button type="button" onClick={() => setForm(null)} className="btn-secondary">Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Table Content */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-ocean-50 text-ocean-700 text-sm uppercase">
            <tr>
              <th className="p-4">Potensi</th>
              <th className="p-4">Kategori</th>
              <th className="p-4">Metrik</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map(item => (
              <tr key={item.id} className="border-t hover:bg-ocean-50/50">
                <td className="p-4">
                  <div className="font-bold">{item.nama}</div>
                  <div className="text-xs text-ocean-500 uppercase">{item.sektor}</div>
                </td>
                <td className="p-4 text-sm capitalize">{item.kategori}</td>
                <td className="p-4 text-sm font-mono">{item.metrik || '-'}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => {setForm(item); setEditId(item.id)}} className="p-2 text-ocean-600 hover:bg-ocean-100 rounded-lg">Edit</button>
                  <button onClick={() => { if(confirm('Hapus?')) deletePotensi(item.id).then(load)}} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}