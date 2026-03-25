import path from "path";

export interface ParsedDocument {
  title: string;
  content: string;
  excerpt: string;
  wordCount: number;
  fileType: "pdf" | "docx" | "doc" | "txt";
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function generateExcerpt(content: string, maxLength = 200): string {
  const plain = stripHtml(content);
  return plain.length > maxLength ? plain.slice(0, maxLength).trim() + "…" : plain;
}

function inferTitle(content: string, fileName: string): string {
  // Try to grab from first <h1> or <h2>
  const h1 = content.match(/<h1[^>]*>(.*?)<\/h1>/i);
  if (h1) return h1[1].replace(/<[^>]+>/g, "").trim();
  const h2 = content.match(/<h2[^>]*>(.*?)<\/h2>/i);
  if (h2) return h2[1].replace(/<[^>]+>/g, "").trim();
  // Fall back to filename without extension
  return path.basename(fileName, path.extname(fileName)).replace(/[-_]/g, " ");
}

function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// ─── PDF Parser ─────────────────────────────────────────────

async function parsePdf(buffer: Buffer, fileName: string): Promise<ParsedDocument> {
  // Dynamically import to avoid SSR issues with native modules
  const pdfParse = (await import("pdf-parse")).default;
  const data = await pdfParse(buffer);

  const rawText = data.text;
  const lines = rawText.split("\n").map((l) => l.trim()).filter(Boolean);

  // Build basic HTML from lines
  let html = "";
  for (const line of lines) {
    if (line.length < 80 && line === line.toUpperCase() && line.length > 3) {
      // Looks like a heading
      html += `<h2>${escapeHtml(line)}</h2>\n`;
    } else if (line.startsWith("•") || line.startsWith("-") || line.startsWith("*")) {
      html += `<li>${escapeHtml(line.replace(/
^
[•\-*]\s*/, ""))}</li>\n`;
    } else {
      html += `<p>${escapeHtml(line)}</p>\n`;
    }
  }

  // Wrap consecutive <li> in <ul>
  html = html.replace(/(<li>.*?<\/li>\n)+/gs, (match) => `<ul>\n${match}</ul>\n`);

  const title = inferTitle(html, fileName);
  return {
    title,
    content: html,
    excerpt: generateExcerpt(html),
    wordCount: countWords(rawText),
    fileType: "pdf",
  };
}

// ─── DOCX Parser ─────────────────────────────────────────────

async function parseDocx(buffer: Buffer, fileName: string): Promise<ParsedDocument> {
  const mammoth = await import("mammoth");
  const result = await mammoth.convertToHtml({ buffer });
  const html = result.value;

  const title = inferTitle(html, fileName);
  return {
    title,
    content: html,
    excerpt: generateExcerpt(html),
    wordCount: countWords(stripHtml(html)),
    fileType: "docx",
  };
}

// ─── Plain Text Parser ───────────────────────────────────────

function parseTxt(buffer: Buffer, fileName: string): ParsedDocument {
  const text = buffer.toString("utf-8");
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);

  let html = "";
  for (const line of lines) {
    if (line.length < 80 && !line.endsWith(".")) {
      html += `<h2>${escapeHtml(line)}</h2>\n`;
    } else {
      html += `<p>${escapeHtml(line)}</p>\n`;
    }
  }

  const title = inferTitle(html, fileName);
  return {
    title,
    content: html,
    excerpt: generateExcerpt(html),
    wordCount: countWords(text),
    fileType: "txt",
  };
}

// ─── HTML Escape ────────────────────────────────────────────

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, "&quot;");
}

// ─── Main Dispatcher ─────────────────────────────────────────

export async function parseDocument(
  buffer: Buffer,
  fileName: string
): Promise<ParsedDocument> {
  const ext = path.extname(fileName).toLowerCase();

  switch (ext) {
    case ".pdf":
      return parsePdf(buffer, fileName);
    case ".docx":
      return parseDocx(buffer, fileName);
    case ".doc":
      // For .doc we attempt docx parser (works for many modern .doc files)
      try {
        return await parseDocx(buffer, fileName);
      } catch {
        return parseTxt(buffer, fileName);
      }
    case ".txt":
      return parseTxt(buffer, fileName);
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
}