// app/(public)/umkm/page.tsx
import { getAllUmkm } from "@/lib/firebase/umkm";
import { UMKM_MOCK } from "@/data/mock";
import UmkmClient from "./UmkmClient";

export const revalidate = 60;

export default async function UmkmPage() {
  let list = await getAllUmkm();
  if (list.length === 0) list = UMKM_MOCK;
  return <UmkmClient initialData={list} />;
}