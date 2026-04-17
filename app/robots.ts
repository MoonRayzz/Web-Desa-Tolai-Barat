// File: app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Diseragamkan url fallback-nya dengan yang ada di layout.tsx
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://desa-tolai-barat.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"], // Melarang Google mengindeks halaman panel admin dan API untuk keamanan
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}