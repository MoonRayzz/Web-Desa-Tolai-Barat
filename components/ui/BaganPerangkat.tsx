// File: components/ui/BaganPerangkat.tsx
"use client";

// Sub-Komponen Kartu Profil (Dipindah ke luar agar tidak re-render terus menerus)
const PersonCard = ({ p, isTop = false, color = "ocean" }: { p: any, isTop?: boolean, color?: "ocean" | "gold" | "forest" }) => {
  const bgClass = color === "gold" ? "bg-gold-50 border-gold-200" : color === "forest" ? "bg-forest-50 border-forest-200" : "bg-white border-ocean-100";
  const badgeClass = color === "gold" ? "bg-gold-100 text-gold-700" : color === "forest" ? "bg-forest-100 text-forest-700" : "bg-ocean-100 text-ocean-700";

  return (
    <div 
      className={`group relative flex flex-col items-center p-6 rounded-[24px] shadow-card hover:shadow-card-md transition-all duration-300 w-full max-w-[240px] border ${bgClass} ${isTop ? 'scale-105 z-10 shadow-card-md border-gold-300' : 'hover:-translate-y-2'}`}
    >
      <div className={`w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mb-4 border-4 shadow-sm flex items-center justify-center ${color === "gold" ? "border-gold-200 bg-gold-100" : "border-white bg-ocean-100"}`}>
        {p.photo ? (
          <img src={p.photo} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
        ) : (
          <span className="text-3xl">👤</span>
        )}
      </div>
      <h4 className="font-bold text-[0.95rem] text-ocean-900 text-center leading-snug mb-2">
        {p.name === "—" || !p.name ? "Belum Diisi" : p.name}
      </h4>
      <div className={`text-[0.72rem] font-bold px-3 py-1 rounded-full text-center ${badgeClass} uppercase tracking-wider`}>
        {p.jabatan}
      </div>
    </div>
  );
};

export default function BaganPerangkat({ list }: { list: any[] }) {
  if (!list || list.length === 0) {
    return (
      <div style={{
        textAlign: "center", padding: "40px 20px",
        background: "var(--color-ocean-50)", borderRadius: "16px",
        border: "1px dashed var(--color-ocean-200)",
        maxWidth: "600px", margin: "0 auto"
      }}>
        <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "12px", opacity: 0.7 }}>👥</span>
        <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 600, fontSize: "1.1rem", color: "var(--color-ocean-900)", marginBottom: "6px" }}>
          Data Belum Tersedia
        </h3>
        <p style={{ fontSize: "0.85rem", color: "var(--color-ocean-600)" }}>
          Struktur organisasi dan perangkat desa akan segera diperbarui.
        </p>
      </div>
    );
  }

  const kades: any[] = [];
  const bpd: any[] = [];
  const sekretariat: any[] = [];
  const teknis: any[] = [];
  const wilayah: any[] = [];
  const lainnya: any[] = [];

  list.forEach((p) => {
    const j = p.jabatan.toLowerCase();
    if (j.includes("kepala desa")) {
      kades.push(p);
    } else if (j.includes("bpd")) {
      bpd.push(p);
    } else if (j.includes("sekretaris") || j.includes("bendahara") || j.includes("sekdes")) {
      sekretariat.push(p);
    } else if (j.includes("kaur") || j.includes("kasi")) {
      teknis.push(p);
    } else if (j.includes("dusun") || j.includes("kadus") || j.includes("lingkungan")) {
      wilayah.push(p);
    } else {
      lainnya.push(p);
    }
  });

  return (
    <div className="flex flex-col items-center w-full max-w-5xl mx-auto space-y-12">
      
      {/* 1. TINGKAT PUNCAK (KEPALA DESA & BPD) */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full relative">
        {bpd.length > 0 && (
          <div className="flex flex-col items-center gap-4">
            <h3 className="text-xs font-bold text-ocean-400 uppercase tracking-widest">Mitra Desa</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {bpd.map(p => <PersonCard key={p.id} p={p} color="forest" />)}
            </div>
          </div>
        )}

        {kades.length > 0 && (
          <div className="flex flex-col items-center gap-4 relative">
            <h3 className="text-xs font-bold text-gold-600 uppercase tracking-widest">Pimpinan</h3>
            {kades.map(p => <PersonCard key={p.id} p={p} isTop={true} color="gold" />)}
            <div className="hidden md:block absolute -bottom-10 left-1/2 w-0.5 h-10 bg-ocean-200"></div>
          </div>
        )}
      </div>

      {/* 2. SEKRETARIAT */}
      {sekretariat.length > 0 && (
        <div className="flex flex-col items-center w-full relative pt-2">
          <div className="bg-ocean-100/50 backdrop-blur-sm px-6 py-2 rounded-full mb-6 border border-ocean-100">
            <h3 className="text-xs font-bold text-ocean-600 uppercase tracking-widest">Sekretariat Desa</h3>
          </div>
          <div className="flex flex-wrap justify-center gap-6 relative">
            {sekretariat.map(p => <PersonCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* 3. PELAKSANA TEKNIS */}
      {teknis.length > 0 && (
        <div className="flex flex-col items-center w-full pt-4 border-t border-dashed border-ocean-200">
          <div className="bg-ocean-50 px-6 py-2 rounded-full mb-6">
            <h3 className="text-xs font-bold text-ocean-600 uppercase tracking-widest">Pelaksana Teknis (Kaur & Kasi)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full justify-items-center">
            {teknis.map(p => <PersonCard key={p.id} p={p} />)}
          </div>
        </div>
      )}

      {/* 4. WILAYAH */}
      {wilayah.length > 0 && (
        <div className="flex flex-col items-center w-full pt-4 border-t border-dashed border-ocean-200">
          <div className="bg-sand-100 px-6 py-2 rounded-full mb-6">
            <h3 className="text-xs font-bold text-sand-700 uppercase tracking-widest">Pelaksana Kewilayahan (Dusun)</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 w-full justify-items-center">
            {wilayah.map(p => <PersonCard key={p.id} p={p} color="forest" />)}
          </div>
        </div>
      )}

      {/* 5. LAINNYA */}
      {lainnya.length > 0 && (
        <div className="flex flex-col items-center w-full pt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full justify-items-center">
            {lainnya.map(p => <PersonCard key={p.id} p={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}