import { NextRequest, NextResponse } from "next/server";
import { getArticleById, updateArticle, deleteArticle } from "@/lib/articles";
import fs from "fs";
import path from "path";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const article = getArticleById(params.id);
  if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(article);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = updateArticle(params.id, body);
    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const article = getArticleById(params.id);
    if (!article) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Optionally remove uploaded file
    if (article.sourceFile) {
      const filePath = path.join(process.cwd(), "public", article.sourceFile);
      const uploadsDir = path.join(process.cwd(), "public", "uploads");
      if (filePath.startsWith(uploadsDir) && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    const ok = deleteArticle(params.id);
    if (!ok) return NextResponse.json({ error: "Delete failed" }, { status: 500 });
    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}