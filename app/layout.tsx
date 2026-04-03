import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets:  ["latin"],
  variable: "--font-playfair",
  weight:   ["400", "500", "600", "700"],
  display:  "swap",
});

const dmSans = DM_Sans({
  subsets:  ["latin"],
  variable: "--font-dm-sans",
  weight:   ["300", "400", "500", "600"],
  display:  "swap",
});

export const metadata: Metadata = {
  title: {
    default:  "Desa Tolai Barat — Kec. Torue, Parigi Moutong",
    template: "%s | Desa Tolai Barat",
  },
  description:
    "Website resmi Desa Tolai Barat, Kecamatan Torue, Kabupaten Parigi Moutong, " +
    "Sulawesi Tengah. Informasi desa, wisata Pantai Arjuna, UMKM, dan layanan warga.",
  keywords: [
    "Desa Tolai Barat", "Torue", "Parigi Moutong",
    "Sulawesi Tengah", "Pantai Arjuna",
  ],
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${playfair.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <body style={{ fontFamily: "var(--font-sans)", backgroundColor: "white" }}>
        {children}
      </body>
    </html>
  );
}