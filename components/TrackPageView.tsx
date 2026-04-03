"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function TrackPageView() {
  const pathname = usePathname();

  useEffect(() => {
    // Delay 1 detik supaya tidak spam saat navigasi cepat
    const timer = setTimeout(() => {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page: pathname }),
      }).catch(() => {});
    }, 1000);

    return () => clearTimeout(timer);
  }, [pathname]);

  // Tidak render apapun — invisible tracker
  return null;
}