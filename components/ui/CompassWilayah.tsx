"use client";

import { useEffect, useState } from "react";

interface Props {
  batasUtara: string;
  batasTimur: string;
  batasSelatan: string;
  batasBarat: string;
}

export default function CompassWilayah({ batasUtara, batasTimur, batasSelatan, batasBarat }: Props) {
  const [heading, setHeading] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState("");

  const handleOrientation = (event: DeviceOrientationEvent) => {
    let compassHeading = 0;
    // Deteksi khusus iOS (Apple)
    if ((event as any).webkitCompassHeading) {
      compassHeading = (event as any).webkitCompassHeading;
    } 
    // Deteksi untuk Android / Perangkat lain
    else if (event.alpha !== null) {
      // Alpha adalah rotasi Z. Dibalik agar sesuai arah utara kompas
      compassHeading = 360 - event.alpha;
    }
    setHeading(compassHeading);
  };

  const requestPermission = async () => {
    // iOS 13+ mewajibkan izin pengguna (user gesture)
    if (typeof (DeviceOrientationEvent as any).requestPermission === "function") {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", handleOrientation, true);
          setIsTracking(true);
        } else {
          setError("Izin sensor kompas ditolak.");
        }
      } catch (err) {
        setError("Gagal mengakses sensor kompas perangkat.");
      }
    } else {
      // Android atau perangkat lama tidak butuh request permission eksplisit
      window.addEventListener("deviceorientationabsolute", handleOrientation as any, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
      setIsTracking(true);
    }
  };

  // Animasi berputar otomatis sebagai Preview jika kompas belum diaktifkan
  useEffect(() => {
    if (!isTracking) {
      let h = 0;
      const interval = setInterval(() => {
        h = (h + 0.3) % 360;
        setHeading(h);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [isTracking]);

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[550px] relative overflow-hidden">
      
      {/* Tombol Akses Sensor */}
      {!isTracking && (
        <div className="absolute z-20 flex flex-col items-center gap-4 bg-ocean-950/80 p-6 rounded-3xl backdrop-blur-md border border-ocean-700/50 shadow-2xl">
          <div className="text-gold-400 text-4xl animate-bounce">🧭</div>
          <p className="text-ocean-100 text-sm text-center max-w-xs">
            Website ini dapat menggunakan sensor HP Anda untuk menunjukkan arah wilayah desa secara real-time.
          </p>
          <button 
            onClick={requestPermission}
            className="bg-gold-500 hover:bg-gold-400 text-gold-950 font-bold py-3 px-6 rounded-xl transition-all"
          >
            Aktifkan Kompas Pintar
          </button>
          {error && <p className="text-red-400 text-xs">{error}</p>}
        </div>
      )}

      {/* Kompas Utama */}
      <div 
        className="relative w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border-4 border-gold-500/40 shadow-[0_0_50px_rgba(212,160,23,0.15)] flex items-center justify-center"
        style={{
          transform: `rotate(${-heading}deg)`,
          transition: isTracking ? "transform 0.15s ease-out" : "none"
        }}
      >
        {/* Lingkaran Dalam & Jarum Pusat */}
        <div className="absolute inset-2 border-2 border-dashed border-ocean-400/30 rounded-full animate-[spin_60s_linear_infinite_reverse]"></div>
        <div className="w-12 h-12 bg-gold-500 rounded-full flex items-center justify-center shadow-lg border-4 border-ocean-900 z-10">
          <div className="w-3 h-3 bg-ocean-900 rounded-full"></div>
        </div>

        {/* --- TITIK UTARA --- */}
        <div className="absolute -top-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-end w-48 h-[120px]">
          <div 
            className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shadow-xl w-full"
            style={{ transform: `rotate(${heading}deg)`, transition: isTracking ? "transform 0.15s ease-out" : "none" }}
          >
            <span className="block text-gold-400 font-bold text-[10px] uppercase tracking-widest mb-1">🌊 Utara</span>
            <span className="text-white text-xs font-medium leading-tight">{batasUtara}</span>
          </div>
          <div className="text-gold-500 font-display font-bold text-2xl mt-2 mb-1">U</div>
        </div>

        {/* --- TITIK TIMUR --- */}
        <div className="absolute top-1/2 -right-[110px] md:-right-[140px] -translate-y-1/2 flex items-center w-[160px] h-32">
          <div className="text-gold-500 font-display font-bold text-2xl mr-3">T</div>
          <div 
            className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shadow-xl w-full"
            style={{ transform: `rotate(${heading}deg)`, transition: isTracking ? "transform 0.15s ease-out" : "none" }}
          >
            <span className="block text-gold-400 font-bold text-[10px] uppercase tracking-widest mb-1">🌅 Timur</span>
            <span className="text-white text-xs font-medium leading-tight">{batasTimur}</span>
          </div>
        </div>

        {/* --- TITIK SELATAN --- */}
        <div className="absolute -bottom-[100px] left-1/2 -translate-x-1/2 flex flex-col items-center justify-start w-48 h-[120px]">
          <div className="text-gold-500 font-display font-bold text-2xl mb-2 mt-1">S</div>
          <div 
            className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shadow-xl w-full"
            style={{ transform: `rotate(${heading}deg)`, transition: isTracking ? "transform 0.15s ease-out" : "none" }}
          >
            <span className="block text-gold-400 font-bold text-[10px] uppercase tracking-widest mb-1">⛰️ Selatan</span>
            <span className="text-white text-xs font-medium leading-tight">{batasSelatan}</span>
          </div>
        </div>

        {/* --- TITIK BARAT --- */}
        <div className="absolute top-1/2 -left-[110px] md:-left-[140px] -translate-y-1/2 flex items-center flex-row-reverse w-[160px] h-32">
          <div className="text-gold-500 font-display font-bold text-2xl ml-3">B</div>
          <div 
            className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-center shadow-xl w-full"
            style={{ transform: `rotate(${heading}deg)`, transition: isTracking ? "transform 0.15s ease-out" : "none" }}
          >
            <span className="block text-gold-400 font-bold text-[10px] uppercase tracking-widest mb-1">🌴 Barat</span>
            <span className="text-white text-xs font-medium leading-tight">{batasBarat}</span>
          </div>
        </div>
      </div>

    </div>
  );
}