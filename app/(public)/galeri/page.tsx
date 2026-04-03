// app/(public)/galeri/page.tsx
import { getAllGaleri } from "@/lib/firebase/galeri";
import { GALERI_MOCK } from "@/data/mock";
import GaleriClient from "./GaleriClient";

export const revalidate = 60;

export default async function GaleriPage() {
  let list = await getAllGaleri();
  if (list.length === 0) list = GALERI_MOCK.map((g) => ({
    id: g.id, imageUrl: g.src, caption: g.caption,
    kategori: g.kategori, createdAt: "",
  }));
  return <GaleriClient initialData={list} />;
}