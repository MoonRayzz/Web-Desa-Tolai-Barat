"use client";

import { useEffect, useState, useRef } from "react";
import { getAllGaleri, createGaleri, deleteGaleri, type GaleriItem } from "@/lib/firebase/galeri";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

const KATEGORI_LIST = [
  { value: "wisata",        label: "🏖️ Wisata"        },
  { value: "kegiatan",      label: "🎉 Kegiatan"       },
  { value: "infrastruktur", label: "🏗️ Infrastruktur"  },
  { value: "budaya",        label: "🎭 Budaya"         },
];

export default function AdminGaleriPage() {
  const [list, setList]           = useState<GaleriItem[]>([]);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption]     = useState("");
  const [kategori, setKategori]   = useState("wisata");
  const [preview, setPreview]     = useState<string | null>(null);
  const [file, setFile]           = useState<File | null>(null);
  const inputRef                  = useRef<HTMLInputElement>(null);

  async function load() {
    const data = await getAllGaleri();
    setList(data);
    setLoading(false);
  }
  useEffect(() => { load(); }, []);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleUpload() {
    if (!file || !caption.trim()) {
      alert("Pilih gambar dan isi keterangan foto terlebih dahulu.");
      return;
    }
    setUploading(true);
    try {
      // 1. Upload ke Cloudinary → dapat URL
      const imageUrl = await uploadImageToCloudinary(file);
      // 2. Simpan URL + metadata ke Firestore
      await createGaleri({ imageUrl, caption, kategori });
      // 3. Reset form
      setFile(null);
      setPreview(null);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
      await load();
    } catch (e) {
      console.error(e);
      alert("Gagal upload. Cek konfigurasi Cloudinary.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string, caption: string) {
    if (!confirm(`Hapus foto "${caption}"?`)) return;
    await deleteGaleri(id);
    setList((p) => p.filter((g) => g.id !== id));
  }

  return (
    <div style={{ padding: "32px" }}>
      <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem", color: "var(--color-ocean-900)", marginBottom: "24px" }}>
        Kelola Galeri
      </h1>

      {/* Form Upload */}
      <div style={{ background: "white", borderRadius: "16px", padding: "24px", boxShadow: "var(--shadow-card)", marginBottom: "28px", border: "2px solid var(--color-ocean-100)" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "var(--color-ocean-900)", marginBottom: "20px" }}>
          Upload Foto Baru
        </h2>

        {/* Drop zone */}
        <div
          onClick={() => inputRef.current?.click()}
          style={{ border: "2px dashed var(--color-ocean-200)", borderRadius: "14px", padding: "32px", textAlign: "center", cursor: "pointer", marginBottom: "16px", background: "var(--color-ocean-50)", transition: "all 0.2s" }}
        >
          {preview ? (
            <img src={preview} alt="Preview"
              style={{ maxHeight: "200px", maxWidth: "100%", borderRadius: "10px", objectFit: "contain" }} />
          ) : (
            <div>
              <div style={{ fontSize: "2.5rem", marginBottom: "8px" }}>📸</div>
              <div style={{ fontSize: "0.875rem", color: "var(--color-ocean-500)", fontWeight: 500 }}>
                Klik untuk pilih foto
              </div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-400)", marginTop: "4px" }}>
                JPG, PNG, WebP — Maks. 10MB
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*"
            onChange={handleFileChange} style={{ display: "none" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={ls}>Keterangan Foto</label>
            <input value={caption} onChange={(e) => setCaption(e.target.value)}
              placeholder="Contoh: Pantai Arjuna Sore Hari"
              className="input-base" />
          </div>
          <div>
            <label style={ls}>Kategori</label>
            <select value={kategori} onChange={(e) => setKategori(e.target.value)}
              className="input-base">
              {KATEGORI_LIST.map((k) => (
                <option key={k.value} value={k.value}>{k.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button onClick={handleUpload} disabled={uploading || !file}
          className="btn-primary" style={{ padding: "11px 28px" }}>
          {uploading ? "Mengupload..." : "Upload ke Galeri"}
        </button>

        {uploading && (
          <div style={{ fontSize: "0.8rem", color: "var(--color-ocean-500)", marginTop: "10px" }}>
            ⏳ Mengupload ke Cloudinary → Menyimpan ke Firestore...
          </div>
        )}
      </div>

      {/* Grid galeri */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {loading ? (
          <div style={{ color: "var(--color-ocean-400)", padding: "20px" }}>Memuat...</div>
        ) : list.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "60px", color: "var(--color-ocean-400)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>🖼️</div>
            Belum ada foto. Upload foto pertama!
          </div>
        ) : list.map((g) => (
          <div key={g.id} style={{ borderRadius: "12px", overflow: "hidden", background: "white", boxShadow: "var(--shadow-card)", border: "1px solid var(--color-ocean-100)" }}>
            <div style={{ height: "160px", overflow: "hidden" }}>
              <img src={g.imageUrl} alt={g.caption}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div style={{ padding: "12px" }}>
              <div style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--color-ocean-900)", marginBottom: "4px",
                display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                {g.caption}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                <span style={{ background: "var(--color-ocean-100)", color: "var(--color-ocean-700)", fontSize: "0.65rem", fontWeight: 600, padding: "2px 8px", borderRadius: "9999px" }}>
                  {g.kategori}
                </span>
                <button onClick={() => handleDelete(g.id, g.caption)} style={{
                  padding: "4px 10px", borderRadius: "6px", background: "#FEE2E2",
                  color: "#991B1B", border: "none", cursor: "pointer",
                  fontSize: "0.72rem", fontWeight: 500,
                }}>
                  Hapus
                </button>
              </div>
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