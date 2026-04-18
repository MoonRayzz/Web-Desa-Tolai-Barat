// File: components/ui/CountUpBanner.tsx
"use client";

import { useState, useEffect, useRef } from "react";

export default function CountUpBanner({ total }: { total: number }) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Intersection observer — animasi hanya berjalan saat banner masuk viewport
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.disconnect(); } },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Count-up animation
  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const duration = 2400;
    const raf = (now: number) => {
      if (!startTime) startTime = now;
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setCount(Math.floor(eased * total));
      if (p < 1) requestAnimationFrame(raf);
      else setCount(total);
    };
    requestAnimationFrame(raf);
  }, [isVisible, total]);

  const formatRp = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(num);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        overflow: "hidden",
        borderRadius: 24,
        padding: "3.5rem 2rem",
        textAlign: "center",
        background: "linear-gradient(145deg, #061b2e 0%, #0d3349 50%, #0a2a42 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
      }}
    >
      {/* Aurora blobs */}
      <div
        style={{
          position: "absolute", top: -60, left: -40,
          width: 280, height: 280, borderRadius: "50%",
          background: "rgba(212,160,23,0.12)",
          filter: "blur(70px)",
          animation: "floatA 9s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute", bottom: -60, right: -40,
          width: 320, height: 320, borderRadius: "50%",
          background: "rgba(212,160,23,0.09)",
          filter: "blur(90px)",
          animation: "floatB 12s ease-in-out infinite alternate",
          pointerEvents: "none",
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: "absolute", inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          pointerEvents: "none",
        }}
      />

      {/* Content */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "#BA7517",
            marginBottom: 20,
          }}
        >
          Total Nilai Produksi Komoditas Utama
        </p>

        <div
          style={{
            fontSize: "clamp(2rem, 6vw, 4.5rem)",
            fontWeight: 800,
            fontFamily: "var(--font-display, Georgia, serif)",
            lineHeight: 1,
            marginBottom: 20,
            padding: "0 1rem",
            // Gold gradient text
            background: "linear-gradient(135deg, #fde68a 0%, #EF9F27 40%, #f59e0b 70%, #fde68a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {formatRp(count)}
        </div>

        {/* Decorative line */}
        <div
          style={{
            width: 60,
            height: 2,
            background: "linear-gradient(to right, transparent, #EF9F27, transparent)",
            margin: "0 auto 20px",
            borderRadius: 99,
          }}
        />

        <p
          style={{
            fontSize: 14,
            color: "rgba(255,255,255,0.45)",
            maxWidth: 520,
            margin: "0 auto",
            lineHeight: 1.75,
          }}
        >
          Estimasi perputaran uang per tahun dari hasil bumi dan laut Desa Tolai Barat.
          Membuka peluang besar bagi investor, kemitraan BUMDes, dan pengembangan hilirisasi produk.
        </p>
      </div>

      <style>{`
        @keyframes floatA {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(30px, -40px) scale(1.15); }
        }
        @keyframes floatB {
          0%   { transform: translate(0, 0) scale(1); }
          100% { transform: translate(-30px, 30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
}