"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const { login } = useAuth();
  const router    = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/admin/dashboard");
    } catch {
      setError("Email atau password salah. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--color-ocean-900)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "24px",
        padding: "40px", width: "100%", maxWidth: "400px",
        boxShadow: "var(--shadow-card-lg)",
      }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: "16px",
            background: "var(--color-ocean-700)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.75rem", margin: "0 auto 14px",
          }}>
            🌊
          </div>
          <h1 style={{
            fontFamily: "var(--font-display)", fontWeight: 700,
            fontSize: "1.35rem", color: "var(--color-ocean-900)", marginBottom: "6px",
          }}>
            Panel Admin
          </h1>
          <p style={{ fontSize: "0.85rem", color: "var(--color-ocean-500)" }}>
            Desa Tolai Barat
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block", fontSize: "0.82rem", fontWeight: 500,
              color: "var(--color-ocean-700)", marginBottom: "6px",
            }}>
              Email Admin
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@email.com"
              required
              className="input-base"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label style={{
              display: "block", fontSize: "0.82rem", fontWeight: 500,
              color: "var(--color-ocean-700)", marginBottom: "6px",
            }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="input-base"
            />
          </div>

          {error && (
            <div style={{
              background: "#FEE2E2", color: "#991B1B",
              padding: "10px 14px", borderRadius: "10px",
              fontSize: "0.82rem", marginBottom: "16px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%", padding: "13px", fontSize: "0.95rem" }}
          >
            {loading ? "Memproses..." : "Masuk ke Panel Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}