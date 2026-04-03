"use client";

import { useState } from "react";
import { seedAll } from "@/lib/firebase/seed";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [result, setResult] = useState<{ berita: number; wisata: number; umkm: number } | null>(null);

  async function handleSeed() {
    setStatus("loading");
    try {
      const res = await seedAll();
      setResult(res);
      setStatus("done");
    } catch (e) {
      console.error(e);
      setStatus("error");
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "var(--color-ocean-50)",
      padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "20px",
        padding: "40px", maxWidth: "480px", width: "100%",
        boxShadow: "var(--shadow-card-lg)", textAlign: "center",
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "16px" }}>🌱</div>

        <h1 style={{
          fontFamily: "var(--font-display)", fontWeight: 700,
          fontSize: "1.5rem", color: "var(--color-ocean-900)", marginBottom: "12px",
        }}>
          Seed Data ke Firestore
        </h1>

        <p style={{
          fontSize: "0.875rem", color: "var(--color-ocean-600)",
          lineHeight: 1.7, marginBottom: "28px",
        }}>
          Halaman ini akan mengisi data awal (berita, wisata, UMKM) dari mock data ke Firestore.
          Proses ini hanya perlu dijalankan <strong>sekali saja</strong>.
          Jika collection sudah ada isinya, proses ini akan di-skip otomatis.
        </p>

        {status === "idle" && (
          <button onClick={handleSeed} className="btn-primary"
            style={{ padding: "14px 32px", fontSize: "1rem", width: "100%" }}>
            Mulai Seed Data
          </button>
        )}

        {status === "loading" && (
          <div style={{ color: "var(--color-ocean-600)", fontSize: "0.9rem" }}>
            <div style={{
              width: "40px", height: "40px", border: "3px solid var(--color-ocean-200)",
              borderTop: "3px solid var(--color-ocean-700)",
              borderRadius: "50%", margin: "0 auto 16px",
              animation: "spin 0.8s linear infinite",
            }} />
            Mengisi data ke Firestore...
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        )}

        {status === "done" && result && (
          <div>
            <div style={{
              background: "var(--color-forest-100)", borderRadius: "12px",
              padding: "20px", marginBottom: "20px",
            }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "12px" }}>✅</div>
              <div style={{ fontWeight: 600, color: "var(--color-forest-700)", marginBottom: "12px" }}>
                Seed berhasil!
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "20px", fontSize: "0.875rem" }}>
                <div><strong>{result.berita}</strong><br /><span style={{ color: "var(--color-ocean-500)" }}>berita</span></div>
                <div><strong>{result.wisata}</strong><br /><span style={{ color: "var(--color-ocean-500)" }}>wisata</span></div>
                <div><strong>{result.umkm}</strong><br /><span style={{ color: "var(--color-ocean-500)" }}>UMKM</span></div>
              </div>
            </div>
            <p style={{ fontSize: "0.8rem", color: "var(--color-ocean-400)", marginBottom: "16px" }}>
              Data sudah masuk ke Firestore. Hapus atau amankan halaman ini setelah selesai.
            </p>
            <a href="/" className="btn-primary"
              style={{ display: "block", padding: "12px", textAlign: "center" }}>
              Kembali ke Beranda
            </a>
          </div>
        )}

        {status === "error" && (
          <div>
            <div style={{
              background: "#FEE2E2", borderRadius: "12px",
              padding: "20px", marginBottom: "20px",
              color: "#991B1B", fontSize: "0.875rem",
            }}>
              ❌ Terjadi error. Cek console browser untuk detail.
              Pastikan .env.local sudah diisi dengan benar.
            </div>
            <button onClick={() => setStatus("idle")} className="btn-secondary"
              style={{ width: "100%", padding: "12px" }}>
              Coba Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}