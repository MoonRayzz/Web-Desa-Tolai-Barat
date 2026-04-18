"use client";

import { useEffect, useRef, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface FasilitasData {
    pendidikan: { tk: number; sd: number; smp: number; sma: number };
    kesehatan: { pustu: number; posyandu: number; polindes: number; apotek: number };
    ibadah: { pura: number; masjid: number; gereja: number; vihara: number };
    olahraga: { voli: number; sepakbola: number; bulutangkis: number; gor: number };
}

// ─── Animated Counter Hook ────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1000, shouldStart = false) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!shouldStart) return;
        if (target === 0) { setValue(0); return; }
        const start = performance.now();
        const raf = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setValue(Math.round(eased * target));
            if (p < 1) requestAnimationFrame(raf);
            else setValue(target);
        };
        requestAnimationFrame(raf);
    }, [target, duration, shouldStart]);
    return value;
}

// ─── Donut Chart (pure SVG) ───────────────────────────────────────────────────
function DonutChart({
    segments, animated, total,
}: {
    segments: { value: number; color: string; label: string }[];
    animated: boolean;
    total: number;
}) {
    const r = 60;
    const cx = 80;
    const cy = 80;
    const circumference = 2 * Math.PI * r;
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!animated) return;
        const start = performance.now();
        const raf = (now: number) => {
            const p = Math.min((now - start) / 1100, 1);
            const eased = 1 - Math.pow(1 - p, 2);
            setProgress(eased);
            if (p < 1) requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
    }, [animated]);

    let offset = -circumference * 0.25;
    const tot = segments.reduce((s, x) => s + x.value, 0) || 1;

    return (
        <svg width="160" height="160" viewBox="0 0 160 160" role="img" aria-label="Proporsi fasilitas desa">
            <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="16" />
            {segments.map((seg, i) => {
                const frac = (seg.value / tot) * progress;
                const dash = circumference * frac;
                const gap = circumference - dash;
                const el = (
                    <circle
                        key={i}
                        cx={cx} cy={cy} r={r}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth="16"
                        strokeDasharray={`${dash} ${gap}`}
                        strokeDashoffset={-offset}
                        strokeLinecap="butt"
                    />
                );
                offset += circumference * frac;
                return el;
            })}
            <text x={cx} y={cy - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.55)" fontFamily="var(--font-sans)">total</text>
            <text x={cx} y={cy + 14} textAnchor="middle" fontSize="26" fontWeight="600" fill="white" fontFamily="var(--font-sans)">{total}</text>
        </svg>
    );
}

// ─── Animated Bar ─────────────────────────────────────────────────────────────
function AnimatedBar({ pct, color, started }: { pct: number; color: string; started: boolean }) {
    return (
        <div style={{ height: 4, borderRadius: 99, background: "rgba(0,0,0,0.08)", overflow: "hidden" }}>
            <div
                style={{
                    height: "100%",
                    borderRadius: 99,
                    background: color,
                    width: started ? `${pct}%` : "0%",
                    transition: started ? "width 1.2s cubic-bezier(.4,0,.2,1)" : "none",
                }}
            />
        </div>
    );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({
    icon, title, color, bgColor, total, items, started,
}: {
    icon: string; title: string; color: string; bgColor: string;
    total: number; items: { label: string; value: number; maxVal: number }[]; started: boolean;
}) {
    const count = useCountUp(total, 900, started);

    return (
        <div
            style={{
                background: "white",
                borderRadius: 20,
                padding: "1.5rem",
                boxShadow: "0 4px 24px rgba(0,0,0,0.18), 0 1px 4px rgba(0,0,0,0.1)",
                border: "1px solid rgba(0,0,0,0.06)",
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: "1.1rem",
                    paddingBottom: "1rem",
                    borderBottom: `2px solid ${bgColor}`,
                }}
            >
                <div
                    style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: bgColor,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, flexShrink: 0,
                    }}
                >
                    {icon}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: "#1a2340", flex: 1 }}>{title}</span>
                <span style={{ fontSize: 28, fontWeight: 700, color, lineHeight: 1 }}>{count}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {items.map((item) => {
                    const pct = item.maxVal > 0 ? Math.round((item.value / item.maxVal) * 100) : 0;
                    return (
                        <div key={item.label}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                                <span style={{ fontSize: 12, color: "#6b7280" }}>{item.label}</span>
                                <span style={{ fontSize: 13, fontWeight: 600, color: "#1a2340" }}>{item.value}</span>
                            </div>
                            <AnimatedBar pct={pct} color={color} started={started} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// ─── Summary Pill ─────────────────────────────────────────────────────────────
function SummaryPill({
    label, value, color, started,
}: {
    label: string; value: number; color: string; started: boolean;
}) {
    const count = useCountUp(value, 900, started);
    return (
        <div
            style={{
                background: "rgba(255,255,255,0.1)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 16,
                padding: "1rem 1.25rem",
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
            }}
        >
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color }} />
            <div style={{ fontSize: 30, fontWeight: 700, color: "white", lineHeight: 1, marginTop: 4 }}>{count}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", marginTop: 6, fontWeight: 500 }}>{label}</div>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function FasilitasSection({ fasilitas }: { fasilitas: FasilitasData }) {
    const ref = useRef<HTMLDivElement>(null);
    const [started, setStarted] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
            { threshold: 0.15 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const f = fasilitas;

    const totalEdu = f.pendidikan.tk + f.pendidikan.sd + f.pendidikan.smp + f.pendidikan.sma;
    const totalKes = f.kesehatan.pustu + f.kesehatan.posyandu + f.kesehatan.polindes + f.kesehatan.apotek;
    const totalIba = f.ibadah.pura + f.ibadah.masjid + f.ibadah.gereja + f.ibadah.vihara;
    const totalOla = f.olahraga.voli + f.olahraga.sepakbola + f.olahraga.bulutangkis + f.olahraga.gor;
    const totalAll = totalEdu + totalKes + totalIba + totalOla;

    const PALETTE = {
        edu: { color: "#b45309", bg: "#fef3c7" },
        kes: { color: "#0f766e", bg: "#ccfbf1" },
        iba: { color: "#1d4ed8", bg: "#dbeafe" },
        ola: { color: "#9d174d", bg: "#fce7f3" },
    };

    const donutSegments = [
        { value: totalIba, color: PALETTE.iba.color, label: "Ibadah" },
        { value: totalKes, color: PALETTE.kes.color, label: "Kesehatan" },
        { value: totalEdu, color: PALETTE.edu.color, label: "Pendidikan" },
        { value: totalOla, color: PALETTE.ola.color, label: "Olahraga" },
    ];

    const maxEdu = Math.max(f.pendidikan.tk, f.pendidikan.sd, f.pendidikan.smp, f.pendidikan.sma, 1);
    const maxKes = Math.max(f.kesehatan.pustu, f.kesehatan.posyandu, f.kesehatan.polindes, f.kesehatan.apotek, 1);
    const maxIba = Math.max(f.ibadah.pura, f.ibadah.masjid, f.ibadah.gereja, f.ibadah.vihara, 1);
    const maxOla = Math.max(f.olahraga.voli, f.olahraga.sepakbola, f.olahraga.bulutangkis, f.olahraga.gor, 1);

    const cards = [
        {
            icon: "📚", title: "Pendidikan",
            color: PALETTE.edu.color, bgColor: PALETTE.edu.bg,
            total: totalEdu,
            items: [
                { label: "TK / PAUD", value: f.pendidikan.tk, maxVal: maxEdu },
                { label: "SD", value: f.pendidikan.sd, maxVal: maxEdu },
                { label: "SMP", value: f.pendidikan.smp, maxVal: maxEdu },
                { label: "SMA / SMK", value: f.pendidikan.sma, maxVal: maxEdu },
            ],
        },
        {
            icon: "🏥", title: "Kesehatan",
            color: PALETTE.kes.color, bgColor: PALETTE.kes.bg,
            total: totalKes,
            items: [
                { label: "Pustu", value: f.kesehatan.pustu, maxVal: maxKes },
                { label: "Posyandu", value: f.kesehatan.posyandu, maxVal: maxKes },
                { label: "Polindes", value: f.kesehatan.polindes, maxVal: maxKes },
                { label: "Apotek / Klinik", value: f.kesehatan.apotek, maxVal: maxKes },
            ],
        },
        {
            icon: "🕌", title: "Tempat Ibadah",
            color: PALETTE.iba.color, bgColor: PALETTE.iba.bg,
            total: totalIba,
            items: [
                { label: "Pura", value: f.ibadah.pura, maxVal: maxIba },
                { label: "Masjid / Musholla", value: f.ibadah.masjid, maxVal: maxIba },
                { label: "Gereja", value: f.ibadah.gereja, maxVal: maxIba },
                { label: "Vihara", value: f.ibadah.vihara, maxVal: maxIba },
            ],
        },
        {
            icon: "⚽", title: "Olahraga",
            color: PALETTE.ola.color, bgColor: PALETTE.ola.bg,
            total: totalOla,
            items: [
                { label: "Lapangan Voli", value: f.olahraga.voli, maxVal: maxOla },
                { label: "Sepak Bola", value: f.olahraga.sepakbola, maxVal: maxOla },
                { label: "Bulutangkis", value: f.olahraga.bulutangkis, maxVal: maxOla },
                { label: "GOR", value: f.olahraga.gor, maxVal: maxOla },
            ],
        },
    ];

    return (
        <section
            ref={ref}
            style={{
                padding: "5rem 0",
                background: "linear-gradient(135deg, #0d3349 0%, #0f4c6e 40%, #1a3a5c 70%, #0d2b40 100%)",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Decorative circles */}
            <div style={{ position: "absolute", top: -100, right: -100, width: 380, height: 380, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />
            <div style={{ position: "absolute", bottom: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
            {/* Dot grid */}
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px", pointerEvents: "none" }} />

            <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 1.5rem", position: "relative" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                    <span
                        style={{
                            display: "inline-block",
                            background: "rgba(255,255,255,0.12)",
                            color: "rgba(255,255,255,0.85)",
                            padding: "4px 16px",
                            borderRadius: 999,
                            fontSize: 11,
                            fontWeight: 700,
                            letterSpacing: ".1em",
                            textTransform: "uppercase",
                            marginBottom: 14,
                            border: "1px solid rgba(255,255,255,0.18)",
                        }}
                    >
                        Infrastruktur
                    </span>
                    <h2
                        style={{
                            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                            fontWeight: 700,
                            color: "white",
                            fontFamily: "var(--font-display, Georgia, serif)",
                            margin: 0,
                        }}
                    >
                        Fasilitas Publik &amp; Sosial
                    </h2>
                    <p style={{ color: "rgba(255,255,255,0.45)", marginTop: 8, fontSize: 14 }}>
                        Data infrastruktur dan fasilitas layanan Desa Tolai Barat
                    </p>
                </div>

                {/* Summary pills */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: "2rem" }}>
                    <SummaryPill label="Pendidikan" value={totalEdu} color={PALETTE.edu.color} started={started} />
                    <SummaryPill label="Kesehatan" value={totalKes} color={PALETTE.kes.color} started={started} />
                    <SummaryPill label="Ibadah" value={totalIba} color={PALETTE.iba.color} started={started} />
                    <SummaryPill label="Olahraga" value={totalOla} color={PALETTE.ola.color} started={started} />
                </div>

                {/* Donut overview */}
                <div
                    style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.12)",
                        borderRadius: 20,
                        padding: "2rem",
                        marginBottom: "2rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexWrap: "wrap",
                        gap: "2.5rem",
                    }}
                >
                    <DonutChart segments={donutSegments} animated={started} total={totalAll} />
                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {donutSegments.map((seg) => (
                            <div key={seg.label} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                <span style={{ width: 12, height: 12, borderRadius: "50%", background: seg.color, flexShrink: 0 }} />
                                <span style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", minWidth: 110 }}>{seg.label}</span>
                                <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                                    {seg.value} unit · {totalAll > 0 ? Math.round((seg.value / totalAll) * 100) : 0}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: 14 }}>
                    {cards.map((card) => (
                        <CategoryCard key={card.title} {...card} started={started} />
                    ))}
                </div>
            </div>
        </section>
    );
}   