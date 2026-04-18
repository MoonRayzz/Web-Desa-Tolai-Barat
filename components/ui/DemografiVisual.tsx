// components/ui/DemografiVisual.tsx
"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import type { DusunData } from "@/types";

interface Props {
  totalJiwa: number;
  dusunList: DusunData[];
}

// ─── Palette per-dusun (cycling) ────────────────────────────────────────────
const DUSUN_COLORS = [
  { stroke: "#378ADD", bg: "#E6F1FB", text: "#185FA5", border: "#B5D4F4" },
  { stroke: "#1D9E75", bg: "#E1F5EE", text: "#0F6E56", border: "#9FE1CB" },
  { stroke: "#BA7517", bg: "#FAEEDA", text: "#854F0B", border: "#FAC775" },
  { stroke: "#993556", bg: "#FBEAF0", text: "#72243E", border: "#F4C0D1" },
  { stroke: "#534AB7", bg: "#EEEDFE", text: "#3C3489", border: "#CECBF6" },
  { stroke: "#0F6E56", bg: "#E1F5EE", text: "#085041", border: "#5DCAA5" },
];

// ─── SVG Radial Ring ─────────────────────────────────────────────────────────
const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function RadialRing({
  pct,
  color,
  animate,
}: {
  pct: number;
  color: string;
  animate: boolean;
}) {
  const offset = CIRCUMFERENCE - (pct / 100) * CIRCUMFERENCE;

  return (
    <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
      <svg
        width={60}
        height={60}
        viewBox="0 0 60 60"
        style={{ transform: "rotate(-90deg)", display: "block" }}
        role="img"
        aria-label={`${Math.round(pct)}% dari total penduduk`}
      >
        {/* Track */}
        <circle
          cx={30} cy={30} r={RADIUS}
          fill="none"
          stroke="var(--color-background-secondary)"
          strokeWidth={6}
        />
        {/* Fill */}
        <circle
          cx={30} cy={30} r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={animate ? offset : CIRCUMFERENCE}
          style={{
            transition: animate
              ? "stroke-dashoffset 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "none",
          }}
        />
      </svg>
      {/* Percentage label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 11,
          fontWeight: 500,
          color: "var(--color-text-primary)",
          lineHeight: 1,
        }}
      >
        {Math.round(pct)}%
      </div>
    </div>
  );
}

// ─── Dusun Card ───────────────────────────────────────────────────────────────
function DusunCard({
  dusun,
  totalJiwa,
  colorSet,
  animate,
}: {
  dusun: DusunData;
  totalJiwa: number;
  colorSet: (typeof DUSUN_COLORS)[0];
  animate: boolean;
}) {
  const jiwa = Number(dusun.total) || 0;
  const kk = Number(dusun.kk) || 0;
  const laki = Number(dusun.lakiLaki) || 0;
  const perempuan = Number(dusun.perempuan) || 0;
  const pct = totalJiwa > 0 ? (jiwa / totalJiwa) * 100 : 0;
  const lPct = jiwa > 0 ? (laki / jiwa) * 100 : 50;

  return (
    <div
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "16px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      {/* Top row: name + ring */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.35 }}>
            {dusun.nama}
          </div>
          <div style={{ fontSize: 11, color: "var(--color-text-secondary)", marginTop: 3 }}>
            {jiwa.toLocaleString("id-ID")} jiwa
          </div>
        </div>
        <RadialRing pct={pct} color={colorSet.stroke} animate={animate} />
      </div>

      {/* Mini gender split bar */}
      <div
        style={{
          display: "flex",
          height: 4,
          borderRadius: 99,
          overflow: "hidden",
          background: "var(--color-background-secondary)",
        }}
        title={`Laki-laki ${Math.round(lPct)}% · Perempuan ${Math.round(100 - lPct)}%`}
      >
        <div
          style={{
            width: `${lPct}%`,
            background: "#378ADD",
            transition: animate ? "width 1.2s ease" : "none",
          }}
        />
        <div style={{ flex: 1, background: "#D4537E" }} />
      </div>

      {/* Stats pills */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        <span style={{
          fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
          background: "var(--color-background-secondary)",
          border: "0.5px solid var(--color-border-tertiary)",
          color: "var(--color-text-secondary)",
        }}>
          🏠 {kk} KK
        </span>
        <span style={{
          fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
          background: "#E6F1FB", border: "0.5px solid #B5D4F4", color: "#185FA5",
        }}>
          ♂ {laki.toLocaleString("id-ID")}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 4,
          background: "#FBEAF0", border: "0.5px solid #F4C0D1", color: "#993556",
        }}>
          ♀ {perempuan.toLocaleString("id-ID")}
        </span>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DemografiVisual({ totalJiwa, dusunList }: Props) {
  const [animate, setAnimate] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Trigger animation saat masuk viewport (IntersectionObserver)
  useEffect(() => {
    if (!wrapRef.current) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setAnimate(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(wrapRef.current);
    return () => obs.disconnect();
  }, []);

  const totals = useMemo(() => {
    let l = 0;
    let p = 0;
    dusunList.forEach((d) => {
      l += Number(d.lakiLaki) || 0;
      p += Number(d.perempuan) || 0;
    });
    return { l, p };
  }, [dusunList]);

  const safeTotalJiwa = totalJiwa || (totals.l + totals.p) || 1;
  const lPct = (totals.l / safeTotalJiwa) * 100;
  const pPct = (totals.p / safeTotalJiwa) * 100;

  return (
    <div ref={wrapRef} style={{ marginTop: 40 }}>

      {/* ── Outer card wrapper ── */}
      <div style={{
        background: "white",
        border: "1px solid var(--color-ocean-100, #E0F0FF)",
        borderRadius: 24,
        padding: "28px 28px 24px",
        boxShadow: "var(--shadow-card, 0 2px 16px rgba(0,0,0,0.06))",
      }}>

        {/* ── Gender Split Bar ── */}
        <div style={{ marginBottom: 24 }}>
          {/* Label */}
          <div style={{
            fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
            textTransform: "uppercase", color: "var(--color-ocean-500, #6B8FAB)",
            marginBottom: 16,
          }}>
            Komposisi gender · total {safeTotalJiwa.toLocaleString("id-ID")} jiwa
          </div>

          {/* Two big numbers */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 36, fontWeight: 500, lineHeight: 1, color: "#378ADD" }}>
                {totals.l.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-ocean-500, #6B8FAB)", marginTop: 4 }}>
                laki-laki
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 36, fontWeight: 500, lineHeight: 1, color: "#D4537E" }}>
                {totals.p.toLocaleString("id-ID")}
              </div>
              <div style={{ fontSize: 11, color: "var(--color-ocean-500, #6B8FAB)", marginTop: 4 }}>
                perempuan
              </div>
            </div>
          </div>

          {/* Animated split bar */}
          <div style={{ display: "flex", height: 10, borderRadius: 99, overflow: "hidden", background: "#F0F6FF" }}>
            <div
              style={{
                width: animate ? `${lPct}%` : "0%",
                background: "#378ADD",
                borderRadius: "99px 0 0 99px",
                transition: animate ? "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
              }}
            />
            <div
              style={{
                width: animate ? `${pPct}%` : "0%",
                background: "#D4537E",
                borderRadius: "0 99px 99px 0",
                transition: animate ? "width 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s" : "none",
              }}
            />
          </div>

          {/* Pct labels */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
              background: "#E6F1FB", color: "#185FA5",
            }}>
              {lPct.toFixed(1)}% ♂
            </span>
            <span style={{
              fontSize: 11, fontWeight: 500, padding: "2px 8px", borderRadius: 4,
              background: "#FBEAF0", color: "#993556",
            }}>
              ♀ {pPct.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* ── Divider ── */}
        {dusunList.length > 0 && (
          <div style={{
            borderTop: "1px solid var(--color-ocean-100, #E0F0FF)",
            marginBottom: 20,
          }} />
        )}

        {/* ── Dusun Cards Grid ── */}
        {dusunList.length > 0 && (
          <div>
            <div style={{
              fontSize: 11, fontWeight: 500, letterSpacing: "0.12em",
              textTransform: "uppercase", color: "var(--color-ocean-500, #6B8FAB)",
              marginBottom: 14,
            }}>
              Distribusi per dusun
            </div>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))",
              gap: 12,
            }}>
              {dusunList.map((d, i) => (
                <DusunCard
                  key={d.id}
                  dusun={d}
                  totalJiwa={safeTotalJiwa}
                  colorSet={DUSUN_COLORS[i % DUSUN_COLORS.length]}
                  animate={animate}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}