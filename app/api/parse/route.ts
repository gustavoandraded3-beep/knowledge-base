import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { parseDocument } from "@/lib/parser";
import { injectHeadingIds, extractHeadings } from "@/utils/toc";

export async function POST(req: NextRequest) {
  try {
    const { filePath, fileName } = await req.json();

    if (!filePath || !fileName) {
      return NextResponse.json(
        { error: "filePath and fileName are required" },
        { status: 400 }
      );
    }

    // Resolve path safely — only allow files under /public/uploads
    const absolutePath = path.join(process.cwd(), "public", filePath);
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!absolutePath.startsWith(uploadsDir)) {
      return NextResponse.json({ error: "Invalid file path" }, { status: 403 });
    }

    if (!fs.existsSync(absolutePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const buffer = fs.readFileSync(absolutePath);
    const parsed = await parseDocument(buffer, fileName);

    // Inject IDs into headings for TOC linking
    const contentWithIds = injectHeadingIds(parsed.content);
    const headings = extractHeadings(contentWithIds);

    return NextResponse.json({
      ...parsed,
      content: contentWithIds,
      headings,
    });
  } catch (err: unknown) {
    console.error("[parse]", err);
    const message = err instanceof Error ? err.message : "Parse failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}