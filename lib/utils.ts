import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTanggal(isoString: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  }).format(new Date(isoString));
}

export function truncate(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trim() + "…";
}