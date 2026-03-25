import { NextRequest, NextResponse } from "next/server";
import { searchArticles } from "@/lib/search";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  if (!query.trim()) {
    return NextResponse.json([]);
  }

  const results = searchArticles(query);
  return NextResponse.json(results);
}