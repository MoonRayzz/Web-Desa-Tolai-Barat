import SectionHeader from "@/components/ui/SectionHeader";
import { getDesaSettings } from "@/lib/firebase/settings";

export default async function MapSection() {
  const s = await getDesaSettings();

  const lat = s.koordinatLat || "-0.988611";
  const lng = s.koordinatLng || "120.330833";

  const embedUrl = [
    "https://www.google.com/maps/embed?pb=",
    "!1m18!1m12!1m3!1d15958.07736653288",
    `!2d${lng}!3d${lat}`,
    "!2m3!1f0!2f0!3f0",
    "!3m2!1i1024!2i768!4f13.1",
    "!3m3!1m2!1s0x0%3A0x0",
    "!2sTolai%20Barat%2C%20Torue%2C%20Parigi%20Moutong",
    "!5e0!3m2!1sid!2sid!4v1712150000000!5m2!1sid!2sid",
  ].join("");

  const mapsUrl = s.googleMapsUrl || "https://maps.google.com";

  const latNum = parseFloat(lat).toFixed(6);
  const lngNum = parseFloat(lng).toFixed(6);

  return (
    <section
      className="section-padding"
      style={{ background: "white" }}
    >
      <div className="container-desa">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "48px",
            alignItems: "center",
          }}
        >
          {/* Kolom kiri */}
          <div>
            <SectionHeader
              badge="Lokasi Desa"
              title="Akses Menuju Desa"
              subtitle="Terletak strategis di pesisir Teluk Tomini, Kecamatan Torue."
            />

            <div
              style={{
                marginTop: "32px",
                display: "flex",
                flexDirection: "column",
                gap: "20px",
              }}
            >
              {/* Alamat */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "var(--color-ocean-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.25rem",
                  }}
                >
                  📍
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-ocean-900)",
                    }}
                  >
                    Alamat Kantor
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-ocean-600)",
                      marginTop: "4px",
                      lineHeight: 1.65,
                    }}
                  >
                    {s.alamat}
                  </p>
                </div>
              </div>

              {/* Koordinat */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "var(--color-gold-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.25rem",
                  }}
                >
                  🗺️
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-ocean-900)",
                    }}
                  >
                    Koordinat Geografis
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-ocean-600)",
                      marginTop: "4px",
                    }}
                  >
                    {latNum} LS, {lngNum} BT
                  </p>
                </div>
              </div>

              {/* Telepon */}
              <div style={{ display: "flex", gap: "16px" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "12px",
                    background: "var(--color-forest-100)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: "1.25rem",
                  }}
                >
                  📞
                </div>
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: "var(--color-ocean-900)",
                    }}
                  >
                    Hubungi Kami
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--color-ocean-600)",
                      marginTop: "4px",
                    }}
                  >
                    {s.telepon}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: "var(--color-ocean-500)",
                      marginTop: "2px",
                    }}
                  >
                    {s.jamLayanan}
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px",
                marginTop: "32px",
              }}
            >
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Buka di Google Maps
              </a>

              {s.whatsapp && (
                <a
                  href={"https://wa.me/" + s.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "8px",
                    background: "#25D366",
                    color: "white",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                    padding: "12px 20px",
                    borderRadius: "12px",
                    textDecoration: "none",
                  }}
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>

          {/* Kolom kanan — peta */}
          <div
            style={{
              height: "450px",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "var(--shadow-card-lg)",
              border: "8px solid white",
              background: "var(--color-ocean-50)",
            }}
          >
            <iframe
              src={embedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, display: "block" }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Lokasi Desa Tolai Barat"
            />
          </div>
        </div>
      </div>
    </section>
  );
}