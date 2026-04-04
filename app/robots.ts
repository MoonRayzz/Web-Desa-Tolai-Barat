import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://web-desa-tolai-barat.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"], // Melarang Google mengindeks halaman panel admin dan API
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}