import type { Metadata, Viewport } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
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

// PWA: Viewport & Warna Tema
export const viewport: Viewport = {
  themeColor: "#0B5E6B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

// Pastikan siteUrl menggunakan domain asli jika sudah ada, atau Vercel sebagai fallback
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-desa-tolai-barat.vercel.app/";

// PWA & SEO: Tambahkan manifest, konfigurasi Apple/iOS, dan OpenGraph
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
    "Sulawesi Tengah", "Pantai Arjuna", "Desa Digital"
  ],
  metadataBase: new URL(siteUrl),
  authors: [{ name: "Pemerintah Desa Tolai Barat" }],
  
  // OpenGraph: Untuk preview bagus saat link disebar di Sosmed/WA
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Desa Tolai Barat",
    title: "Website Resmi Desa Tolai Barat",
    description: "Portal informasi resmi Desa Tolai Barat, pesisir Teluk Tomini, Kecamatan Torue.",
    url: siteUrl,
    images: [
      {
        url: "/og-image.jpg", // Buat gambar banner (1200x630px) simpan di folder public/ dengan nama og-image.jpg
        width: 1200,
        height: 630,
        alt: "Desa Tolai Barat",
      },
    ],
  },

  // Verifikasi Google Search Console (Kosongkan dulu string-nya, nanti diisi di Langkah 4)
  verification: {
    google: "ISI_KODE_VERIFIKASI_DARI_GOOGLE_DISINI", 
  },

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tolai Barat",
  },
  formatDetection: {
    telephone: false,
  },
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
        {/* Tombol Install PWA melayang */}
        <PWAInstallPrompt />
        {children}
      </body>
    </html>
  );
}