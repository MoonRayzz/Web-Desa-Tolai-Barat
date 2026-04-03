import { getAllWisata } from "@/lib/firebase/wisata";
import { WISATA_MOCK } from "@/data/mock";
import WisataClient from "./WisataClient";

export const revalidate = 60;

export default async function WisataPage() {
  let list = await getAllWisata();
  if (list.length === 0) list = WISATA_MOCK;
  return <WisataClient initialData={list} />;
}