// File: app/(public)/profil/page.tsx
// Ganti seluruh section fasilitas lama dengan komponen FasilitasSection

import type { Metadata } from "next";
import { getDesaSettings } from "@/lib/firebase/settings";
import { getAllPerangkat } from "@/lib/firebase/perangkat";
import { getFasilitas } from "@/lib/firebase/fasilitas";
import DemografiVisual from "@/components/ui/DemografiVisual";
import CompassWilayah from "@/components/ui/CompassWilayah";
import BaganPerangkat from "@/components/ui/BaganPerangkat";
import FasilitasSection from "@/components/ui/FasilitasSection";
import { sanitizeHtml } from "@/lib/sanitize";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Profil Desa",
  description: "Profil lengkap dan struktur pemerintahan Desa Tolai Barat.",
};

export default async function ProfilPage() {
  const [s, perangkatFirestore, f] = await Promise.all([
    getDesaSettings(),
    getAllPerangkat(),
    getFasilitas(),
  ]);

  const safePerangkat = Array.isArray(perangkatFirestore)
    ? perangkatFirestore.map((p) => ({
      id: p?.id || Math.random().toString(),
      name: p?.name || "Belum Diisi",
      jabatan: p?.jabatan || "-",
      photo: p?.photo || null,
      urutan: p?.urutan || 99,
    }))
    : [];

  const safeDusunList = Array.isArray(s?.dusunList)
    ? s.dusunList.map((d) => ({
      id: d?.id || Math.random().toString(),
      nama: d?.nama || "Dusun",
      kk: Number(d?.kk) || 0,
      lakiLaki: Number(d?.lakiLaki) || 0,
      perempuan: Number(d?.perempuan) || 0,
      total: Number(d?.total) || 0,
    }))
    : [];

  // Sanitasi data fasilitas dengan default 0 agar komponen tidak crash
  const safeFasilitas = {
    pendidikan: {
      tk: Number(f?.pendidikan?.tk) || 0,
      sd: Number(f?.pendidikan?.sd) || 0,
      smp: Number(f?.pendidikan?.smp) || 0,
      sma: Number(f?.pendidikan?.sma) || 0,
    },
    kesehatan: {
      pustu: Number(f?.kesehatan?.pustu) || 0,
      posyandu: Number(f?.kesehatan?.posyandu) || 0,
      polindes: Number(f?.kesehatan?.polindes) || 0,
      apotek: Number(f?.kesehatan?.apotek) || 0,
    },
    ibadah: {
      pura: Number(f?.ibadah?.pura) || 0,
      masjid: Number(f?.ibadah?.masjid) || 0,
      gereja: Number(f?.ibadah?.gereja) || 0,
      vihara: Number(f?.ibadah?.vihara) || 0,
    },
    olahraga: {
      voli: Number(f?.olahraga?.voli) || 0,
      sepakbola: Number(f?.olahraga?.sepakbola) || 0,
      bulutangkis: Number(f?.olahraga?.bulutangkis) || 0,
      gor: Number(f?.olahraga?.gor) || 0,
    },
  };

  const STATS = [
    { label: "Jumlah Penduduk", value: s?.jumlahPenduduk || "0", unit: "jiwa", icon: "👥" },
    { label: "Kepala Keluarga", value: s?.jumlahKK || "0", unit: "KK", icon: "🏠" },
    { label: "Luas Wilayah", value: s?.luasWilayah || "-", unit: "Ha", icon: "🗺️" },
    { label: "Jumlah Dusun", value: s?.jumlahDusun || "0", unit: "dusun", icon: "🌿" },
    { label: "RT / RW", value: s?.rtRw || "-", unit: "", icon: "📍" },
    { label: "Kode Pos", value: s?.kodePos || "-", unit: "", icon: "📮" },
  ];

  const totalJiwa = parseInt((s?.jumlahPenduduk || "0").replace(/\./g, "")) || 0;

  return (
    <>
      {/* ── Hero ── */}
      <div className="page-hero">
        <div className="container-desa" style={{ textAlign: "center" }}>
          <span
            className="badge"
            style={{
              background: "rgba(245,200,66,0.15)",
              color: "var(--color-gold-300)",
              marginBottom: "16px",
              display: "inline-block",
            }}
          >
            Profil Desa
          </span>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "white",
              lineHeight: 1.2,
              marginBottom: "16px",
            }}
          >
            Desa Tolai Barat
          </h1>
          <p style={{ color: "var(--color-ocean-300)", fontSize: "1.05rem", maxWidth: "560px", margin: "0 auto" }}>
            Kecamatan Torue · Kabupaten Parigi Moutong · Sulawesi Tengah
          </p>
        </div>
      </div>

      {/* ── Statistik & Demografi ── */}
      <section className="section-padding-sm" style={{ background: "var(--color-ocean-50)" }}>
        <div className="container-desa">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: "16px",
            }}
          >
            {STATS.map((st) => (
              <div
                key={st.label}
                className="card-hover"
                style={{
                  background: "white",
                  borderRadius: "16px",
                  padding: "20px",
                  textAlign: "center",
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div style={{ fontSize: "1.75rem", marginBottom: "8px" }}>{st.icon}</div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "1.35rem",
                    color: "var(--color-ocean-700)",
                  }}
                >
                  {st.value}
                  {st.unit && (
                    <span style={{ fontSize: "0.75rem", marginLeft: "4px", fontFamily: "var(--font-sans)", fontWeight: 400 }}>
                      {st.unit}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--color-ocean-500)", marginTop: "4px" }}>{st.label}</div>
              </div>
            ))}
          </div>

          {safeDusunList.length > 0 && <DemografiVisual totalJiwa={totalJiwa} dusunList={safeDusunList} />}
        </div>
      </section>

      {/* ── FASILITAS — komponen baru dengan animasi ── */}
      <FasilitasSection fasilitas={safeFasilitas} />

      {/* ── Sejarah & Visi Misi ── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-desa">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "48px",
              alignItems: "start",
            }}
          >
            <div>
              <span className="badge-ocean" style={{ marginBottom: "16px", display: "inline-block" }}>Sejarah</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.75rem",
                  color: "var(--color-ocean-900)",
                  marginBottom: "20px",
                }}
              >
                Asal Usul Desa
              </h2>
              <div
                style={{ fontSize: "0.95rem", lineHeight: 1.85, color: "var(--color-ocean-800)", whiteSpace: "pre-wrap" }}
                dangerouslySetInnerHTML={{ __html: sanitizeHtml(s?.sejarah || "") }}
              />
            </div>

            <div>
              <span className="badge-gold" style={{ marginBottom: "16px", display: "inline-block" }}>Arah Pembangunan</span>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 600,
                  fontSize: "1.75rem",
                  color: "var(--color-ocean-900)",
                  marginBottom: "20px",
                }}
              >
                Visi &amp; Misi Desa
              </h2>
              <div
                style={{
                  background: "var(--color-ocean-700)",
                  borderRadius: "16px",
                  padding: "24px",
                  marginBottom: "20px",
                }}
              >
                <div
                  style={{
                    color: "var(--color-gold-400)",
                    fontWeight: 600,
                    fontSize: "0.8rem",
                    marginBottom: "10px",
                    textTransform: "uppercase" as const,
                    letterSpacing: "0.06em",
                  }}
                >
                  Visi
                </div>
                <p style={{ color: "white", fontSize: "1rem", lineHeight: 1.65, fontStyle: "italic" as const }}>
                  &ldquo;{s?.visi || ""}&rdquo;
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" as const, gap: "12px" }}>
                {(s?.misi || []).map((m, i) => (
                  <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--color-ocean-100)",
                        color: "var(--color-ocean-700)",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                        marginTop: "1px",
                      }}
                    >
                      {i + 1}
                    </div>
                    <div style={{ fontSize: "0.9rem", lineHeight: 1.65, color: "var(--color-ocean-800)", whiteSpace: "pre-wrap" }}>
                      {m}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Batas Wilayah ── */}
      <section
        className="section-padding-sm overflow-hidden"
        style={{ background: "linear-gradient(145deg, var(--color-ocean-950) 0%, var(--color-ocean-800) 100%)" }}
      >
        <div className="container-desa">
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <span
              style={{
                background: "rgba(212, 160, 23, 0.15)",
                color: "var(--color-gold-400)",
                padding: "4px 12px",
                borderRadius: "999px",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "12px",
                display: "inline-block",
                border: "1px solid rgba(212, 160, 23, 0.3)",
              }}
            >
              Geografis &amp; Lokasi
            </span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "2rem", color: "white" }}>
              Batas Wilayah Desa
            </h2>
          </div>
          <CompassWilayah
            batasUtara={s?.batasUtara || "Utara"}
            batasTimur={s?.batasTimur || "Timur"}
            batasSelatan={s?.batasSelatan || "Selatan"}
            batasBarat={s?.batasBarat || "Barat"}
          />
        </div>
      </section>

      {/* ── Struktur Organisasi ── */}
      <section className="section-padding" style={{ background: "white" }}>
        <div className="container-desa">
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <span className="badge-forest" style={{ marginBottom: "12px", display: "inline-block" }}>Pemerintahan</span>
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                color: "var(--color-ocean-900)",
                marginBottom: "16px",
              }}
            >
              Struktur Organisasi Desa
            </h2>
            <p className="text-ocean-500 text-sm max-w-2xl mx-auto">
              Perangkat Desa Tolai Barat yang siap melayani dan mengabdi untuk kemajuan dan kesejahteraan masyarakat.
            </p>
          </div>
          <BaganPerangkat list={safePerangkat} />
        </div>
      </section>
    </>
  );
}