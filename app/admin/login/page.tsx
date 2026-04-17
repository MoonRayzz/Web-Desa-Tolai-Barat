// File: app/admin/login/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { getDesaSettings } from "@/lib/firebase/settings";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // STATE UNTUK LOGO DESA
  const [logoUrl, setLogoUrl] = useState("");
  const router = useRouter();

  // AMBIL LOGO SAAT HALAMAN DIMUAT
  useEffect(() => {
    getDesaSettings().then((s) => setLogoUrl(s.logoDesa || ""));
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError("Email atau password salah.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-ocean-900 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl">
        <div className="text-center mb-8">
          
          {/* AREA LOGO DINAMIS */}
          <div className="flex justify-center mb-6">
            <div style={{ 
              width: 80, height: 80, 
              background: logoUrl ? "transparent" : "var(--color-ocean-700)",
              display: "flex", alignItems: "center", justifyContent: "center",
              borderRadius: "20px", overflow: "hidden"
            }}>
              {logoUrl ? (
                <img src={logoUrl} alt="Logo Desa" className="w-full h-full object-contain" />
              ) : (
                <span className="text-3xl">🌊</span>
              )}
            </div>
          </div>

          <h1 className="font-display font-bold text-2xl text-ocean-900 mb-2">
            Panel Admin
          </h1>
          <p className="text-sm text-ocean-500">
            Masuk untuk mengelola data Desa Tolai Barat
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl mb-6 text-center font-medium border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-ocean-700 uppercase tracking-widest ml-1 mb-2 block">
              Email Address
            </label>
            <input
              type="email"
              required
              className="input-base w-full bg-ocean-50 border-none focus:ring-2 focus:ring-ocean-500"
              placeholder="admin@desa.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs font-bold text-ocean-700 uppercase tracking-widest ml-1 mb-2 block">
              Password
            </label>
            <input
              type="password"
              required
              className="input-base w-full bg-ocean-50 border-none focus:ring-2 focus:ring-ocean-500"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 mt-4 text-base shadow-lg shadow-ocean-900/20"
          >
            {loading ? "Menghubungkan..." : "Masuk ke Dashboard"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button"
            onClick={() => router.push("/")}
            className="text-sm text-ocean-400 hover:text-ocean-600 transition-colors"
          >
            ← Kembali ke Beranda
          </button>
        </div>
      </div>
    </div>
  );
}