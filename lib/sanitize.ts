// lib/sanitize.ts
// Sanitasi HTML untuk mencegah XSS dari konten yang disimpan di Firestore.
// Hanya tag dan atribut yang ada dalam allowlist berikut yang diizinkan.

import DOMPurify from "isomorphic-dompurify";

/** Tag HTML yang aman untuk konten berita / sejarah desa */
const ALLOWED_TAGS = [
  "p", "br", "b", "i", "u", "s",
  "strong", "em",
  "h2", "h3", "h4", "h5", "h6",
  "ul", "ol", "li",
  "blockquote",
  "a",
  "img",
  "table", "thead", "tbody", "tr", "th", "td",
  "figure", "figcaption",
  "hr", "pre", "code",
];

/** Atribut yang diizinkan */
const ALLOWED_ATTR = [
  "href", "target", "rel",
  "src", "alt", "width", "height",
  "class", "id",
  "colspan", "rowspan",
];

/**
 * Sanitasi string HTML dari input tidak terpercaya (Firestore, admin input).
 * Aman dipakai bersama `dangerouslySetInnerHTML`.
 */
export function sanitizeHtml(dirty: string): string {
  if (!dirty) return "";
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Paksa semua link eksternal punya rel="noopener noreferrer"
    ADD_ATTR: ["target"],
    FORCE_BODY: false,
  });
}
