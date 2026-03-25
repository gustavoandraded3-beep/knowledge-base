import { NextRequest, NextResponse } from "next/server";
import { getAllArticles, createArticle, getPublishedArticles } from "@/lib/articles";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const admin = searchParams.get("admin") === "true";

  const articles = admin ? getAllArticles() : getPublishedArticles();
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, slug, content, excerpt, category, tags, status, author, sourceFile, originalFileName } = body;

    if (!title || !content || !category) {
      return NextResponse.json(
        { error: "title, content, and category are required" },
        { status: 400 }
      );
    }

    const article = createArticle({
      title,
      slug: slug || "",
      content,
      excerpt: excerpt || content.replace(/<[^>]+>/g, " ").slice(0, 200),
      category,
      tags: Array.isArray(tags) ? tags : [],
      status: status || "draft",
      author: author || "Admin",
      sourceFile: sourceFile || null,
      originalFileName: originalFileName || null,
    });

    return NextResponse.json(article, { status: 201 });
  } catch (err: unknown) {
    console.error("[articles POST]", err);
    const message = err instanceof Error ? err.message : "Failed to create article";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}