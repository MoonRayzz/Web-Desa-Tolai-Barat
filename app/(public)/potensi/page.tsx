import { getAllPotensi } from "@/lib/firebase/potensi";
import SectionHeader from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

export default async function PotensiPage() {
  const all = await getAllPotensi();
  const makro = all.filter(p => p.kategori === "makro");
  const mikro = all.filter(p => p.kategori === "mikro");

  return (
    <div className="min-h-screen">
      {/* Hero Section Khusus */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/potensi-hero.jpg" // Ganti dengan foto sawah asli Tolai
            className="w-full h-full object-cover brightness-50"
            alt="Hero Potensi"
          />
        </div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-up">Pusat Penggerak Ekonomi</h1>
          <p className="text-xl md:text-2xl font-light text-ocean-100 max-w-2xl mx-auto">Desa Tolai Barat: Kekayaan Alam Makro & Kreativitas UMKM Mikro</p>
        </div>
      </section>

      {/* Seksi Makro (Komoditas Utama) */}
      <section className="section-padding bg-ocean-50">
        <div className="container-desa">
          <SectionHeader 
            badge="Komoditas Unggulan"
            title="Potensi Makro Desa"
            subtitle="Sumber pendapatan utama desa yang menggerakkan ekonomi skala besar."
            center
          />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
            {makro.map(item => (
              <div key={item.id} className="group relative overflow-hidden rounded-[2rem] h-[400px] shadow-xl transition-all duration-500 hover:scale-[1.02]">
                <img src={item.image} className="absolute inset-0 w-full h-full object-cover" alt={item.nama} />
                {/* Glassmorphism Card Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-900/40 to-transparent flex flex-col justify-end p-8">
                  <div className="backdrop-blur-md bg-white/10 p-8 rounded-3xl border border-white/20 shadow-2xl">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-gold-400 text-xs font-bold uppercase tracking-widest">{item.sektor}</span>
                        <h3 className="text-3xl font-display font-bold text-white mt-1">{item.nama}</h3>
                      </div>
                      <div className="bg-gold-500 text-ocean-950 px-4 py-2 rounded-xl font-bold text-sm">
                        {item.metrik}
                      </div>
                    </div>
                    <p className="text-ocean-100 text-sm mb-6 line-clamp-3">{item.deskripsi}</p>
                    <button className="btn-gold w-full">Pelajari Lebih Lanjut</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seksi Mikro (UMKM Warga) */}
      <section className="section-padding bg-white">
        <div className="container-desa">
          <SectionHeader 
            badge="UMKM Warga"
            title="Usaha Mikro & Kreatif"
            subtitle="Produk lokal hasil kreativitas warga Desa Tolai Barat."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            {mikro.map(item => (
              <div key={item.id} className="card-base group">
                <div className="h-48 overflow-hidden relative">
                  <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={item.nama} />
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-ocean-700">
                    {item.sektor}
                  </span>
                </div>
                <div className="p-5">
                  <h4 className="font-bold text-ocean-900 mb-2">{item.nama}</h4>
                  <p className="text-xs text-ocean-600 line-clamp-2 mb-4">{item.deskripsi}</p>
                  
                  {item.whatsapp && (
                    <a 
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      className="flex items-center justify-center gap-2 w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-colors"
                    >
                      <span>💬 Hubungi Penjual</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}