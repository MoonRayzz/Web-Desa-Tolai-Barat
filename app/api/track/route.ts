import { NextRequest, NextResponse } from "next/server";
import { logVisit } from "@/lib/firebase/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const page = body.page || "/";

    // Ambil IP dari header (Vercel otomatis set x-forwarded-for)
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

    let city    = "Tidak Diketahui";
    let region  = "Tidak Diketahui";
    let country = "Indonesia";

    // Lewati IP lokal / development
    const isLocal =
      ip === "unknown" ||
      ip === "::1"     ||
      ip === "127.0.0.1" ||
      ip.startsWith("192.168") ||
      ip.startsWith("10.");

    if (!isLocal) {
      try {
        // ip-api.com — gratis, tidak perlu API key, 45 req/menit
        const geoRes = await fetch(
          `http://ip-api.com/json/${ip}?fields=status,city,regionName,country&lang=id`,
          { next: { revalidate: 0 }, signal: AbortSignal.timeout(3000) }
        );
        if (geoRes.ok) {
          const geo = await geoRes.json();
          if (geo.status === "success") {
            city    = geo.city       || "Tidak Diketahui";
            region  = geo.regionName || "Tidak Diketahui";
            country = geo.country    || "Indonesia";
          }
        }
      } catch {
        // Gagal geo → tetap log dengan nilai default
      }
    } else {
      city   = "Localhost (Dev)";
      region = "Development";
    }

    await logVisit({ page, city, region, country });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}