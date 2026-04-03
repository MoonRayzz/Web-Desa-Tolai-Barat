// File: lib/cloudinary.ts

/**
 * Fungsi untuk mengunggah gambar ke Cloudinary menggunakan mode Unsigned.
 * * @param file Objek File dari input type="file" di form HTML/React.
 * @returns Promise berupa string URL gambar publik (secure_url) dari Cloudinary.
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Konfigurasi Cloudinary belum lengkap di file environment (.env).");
  }

  // Siapkan data sebagai FormData untuk dikirim via HTTP POST
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  try {
    // Endpoint API resmi Cloudinary untuk un-signed upload
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Gagal mengunggah gambar ke Cloudinary.");
    }

    const data = await response.json();
    
    // Cloudinary mengembalikan banyak data, tapi kita hanya butuh URL amannya (https)
    // URL inilah yang nantinya akan kita simpan di Firestore
    return data.secure_url;
  } catch (error) {
    console.error("Error saat upload ke Cloudinary:", error);
    throw error;
  }
}