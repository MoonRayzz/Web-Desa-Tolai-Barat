"use client";

import { useRef, useState } from "react";
import { uploadImageToCloudinary } from "@/lib/cloudinary/cloudinary";

interface Props {
  value:    string;
  onChange: (url: string) => void;
  label?:   string;
}

export default function ImageUpload({ value, onChange, label = "Foto" }: Props) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      onChange(url);
    } catch {
      alert("Gagal upload gambar. Cek konfigurasi Cloudinary di .env.local");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 500, color: "var(--color-ocean-700)", marginBottom: "6px" }}>
        {label}
      </label>

      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start", flexWrap: "wrap" }}>
        {/* Preview */}
        {value && (
          <img src={value} alt="Preview"
            style={{ width: "100px", height: "70px", objectFit: "cover", borderRadius: "10px", border: "1px solid var(--color-ocean-200)", flexShrink: 0 }} />
        )}

        {/* Upload btn */}
        <div style={{ flex: 1, minWidth: "200px" }}>
          <button type="button" onClick={() => inputRef.current?.click()}
            disabled={uploading}
            style={{ padding: "9px 18px", borderRadius: "10px", background: "var(--color-ocean-100)", color: "var(--color-ocean-700)", border: "1px solid var(--color-ocean-200)", cursor: "pointer", fontSize: "0.82rem", fontWeight: 500, display: "flex", alignItems: "center", gap: "8px" }}>
            {uploading ? "⏳ Mengupload..." : "📸 Pilih & Upload Gambar"}
          </button>
          <input ref={inputRef} type="file" accept="image/*"
            onChange={handleChange} style={{ display: "none" }} />
          {value && (
            <div style={{ fontSize: "0.72rem", color: "var(--color-ocean-400)", marginTop: "6px", wordBreak: "break-all" }}>
              ✓ {value.substring(0, 60)}...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}