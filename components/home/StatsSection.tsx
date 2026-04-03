import SectionHeader from "@/components/ui/SectionHeader";

const INFO_DESA = [
  {
    judul: "Sejarah Singkat",
    isi:
      "Desa Tolai Barat merupakan bagian dari wilayah transmigran yang mulai " +
      "berkembang sejak era 1967–1968. Desa ini tumbuh menjadi komunitas " +
      "multikultural yang harmonis di pesisir Teluk Tomini.",
    warna: "#E0F4F7",
    border: "#5ECFDE",
  },
  {
    judul: "Visi Desa",
    isi:
      '"Terwujudnya Desa Tolai Barat yang Maju, Mandiri, Sejahtera, dan ' +
      'Berdaya Saing Berbasis Potensi Lokal."',
    warna: "#FDF3C8",
    border: "#F5C842",
  },
  {
    judul: "Letak Geografis",
    isi:
      "Berbatasan langsung dengan Teluk Tomini di sebelah utara, bagian dari " +
      "Kecamatan Torue. Koordinat: 0°59′19″LS, 120°19′51″BT.",
    warna: "#EBF5E0",
    border: "#6FAB44",
  },
];

export default function StatsSection() {
  return (
    <section className="section-padding bg-sand-gradient">
      <div className="container-desa">
        <SectionHeader
          badge="Profil Singkat"
          title="Mengenal Desa Tolai Barat"
          subtitle="Desa di pesisir Teluk Tomini dengan kekayaan alam dan budaya yang terjaga."
          center
        />

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "24px",
          marginTop: "48px",
        }}>
          {INFO_DESA.map((item) => (
            <div key={item.judul} style={{
              background: item.warna,
              borderLeft: `4px solid ${item.border}`,
              borderRadius: "0 16px 16px 0",
              padding: "28px",
            }}>
              <h3 style={{
                fontFamily: "var(--font-display)",
                fontWeight: 600,
                fontSize: "1.125rem",
                color: "var(--color-ocean-900)",
                marginBottom: "12px",
              }}>
                {item.judul}
              </h3>
              <p style={{
                fontSize: "0.9rem",
                lineHeight: 1.75,
                color: "var(--color-ocean-800)",
              }}>
                {item.isi}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}