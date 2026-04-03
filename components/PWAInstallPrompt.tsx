"use client";

import { useEffect, useState } from "react";

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable]   = useState(false);
  const [isInstalled, setIsInstalled]       = useState(false);

  useEffect(() => {
    // 1. Daftarkan Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker terdaftar!", reg.scope))
        .catch((err) => console.error("PWA Service Worker gagal:", err));
    }

    // 2. Deteksi apakah sudah diinstal (Standalone mode)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    // 3. Tangkap event install dari browser
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // 4. Deteksi jika sukses diinstal
    window.addEventListener("appinstalled", () => {
      setIsInstallable(false);
      setIsInstalled(true);
      console.log("PWA Berhasil diinstal!");
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  // Jika tidak bisa diinstal (misal sudah diinstal, atau browser tidak support), jangan tampilkan apa-apa
  if (!isInstallable || isInstalled) return null;

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div style={{
      position: "fixed", bottom: "24px", left: "24px", zIndex: 9999,
      animation: "fadeUp 0.5s ease-out forwards",
    }}>
      <button
        onClick={handleInstallClick}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          background: "var(--color-ocean-900)", color: "white",
          padding: "12px 20px", borderRadius: "16px",
          boxShadow: "var(--shadow-card-lg)", border: "none", cursor: "pointer",
          fontWeight: 600, fontSize: "0.875rem", transition: "all 0.2s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-ocean-800)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "var(--color-ocean-900)")}
      >
        <span style={{ fontSize: "1.2rem" }}>📱</span>
        Install Aplikasi Desa
      </button>
    </div>
  );
}