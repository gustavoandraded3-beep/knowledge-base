export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 rounded px-0.5">$1</mark>');
}

export function getExcerptWithHighlight(
  content: string,
  query: string,
  maxLength = 200
): string {
  // Strip HTML tags
  const plain = content.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (!query.trim()) return plain.slice(0, maxLength) + (plain.length > maxLength ? "…" : "");

  const lowerPlain = plain.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerPlain.indexOf(lowerQuery);

  let excerpt: string;
  if (idx === -1) {
    excerpt = plain.slice(0, maxLength);
  } else {
    const start = Math.max(0, idx - 80);
    const end = Math.min(plain.length, idx + query.length + 120);
    excerpt = (start > 0 ? "…" : "") + plain.slice(start, end) + (end < plain.length ? "…" : "");
  }

  return highlightText(excerpt, query);
}
