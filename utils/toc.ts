import type { Heading } from "@/types";
import { slugify } from "./slugify";

export function extractHeadings(html: string): Heading[] {
  const headingRegex = /<h([2-4])[^>]*>(.*?)<\/h[2-4]>/gi;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const rawText = match[2].replace(/<[^>]+>/g, "").trim();
    const id = slugify(rawText);
    headings.push({ id, text: rawText, level });
  }

  return headings;
}

export function injectHeadingIds(html: string): string {
  return html.replace(/<h([2-4])([^>]*)>(.*?)<\/h[2-4]>/gi, (_, level, attrs, content) => {
    const rawText = content.replace(/<[^>]+>/g, "").trim();
    const id = slugify(rawText);
    return `<h${level}${attrs} id="${id}">${content}</h${level}>`;
  });
}