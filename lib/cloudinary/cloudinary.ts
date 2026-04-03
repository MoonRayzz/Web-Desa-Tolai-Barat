// File: lib/cloudinary.ts

/**
 * Fungsi untuk mengunggah gambar ke Cloudinary menggunakan mode Unsigned.
 * @param file Objek File dari input type="file" di form HTML/React.
 * @returns Promise berupa string URL gambar publik (secure_url) dari Cloudinary.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  // PERBAIKAN: Menggunakan .trim() untuk membuang spasi/enter tersembunyi
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary belum lengkap di file environment (.env.local).");
  }

  // Siapkan data sebagai FormData untuk dikirim via HTTP POST
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  try {
    // Endpoint API resmi Cloudinary untuk un-signed upload
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("Detail Error Cloudinary:", errorData);
      throw new Error(errorData?.error?.message || `Gagal mengunggah gambar. HTTP Status: ${response.status}`);
    }

    const data = await response.json();
    return data.secure_url;
  } catch (error: any) {
    console.error("Error saat upload ke Cloudinary:", error);
    
    // PERBAIKAN: Menangani error "Failed to fetch" secara spesifik
    if (error.name === "TypeError" && error.message === "Failed to fetch") {
      throw new Error(
        "Gagal menghubungi server Cloudinary. Pastikan koneksi internet stabil dan MATIKAN ekstensi AdBlocker (Pemblokir Iklan) di browser Anda saat mengunggah foto."
      );
    }
    
    throw error;
  }
}