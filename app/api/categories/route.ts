import { NextResponse } from "next/server";
import { getCategoriesWithCounts } from "@/lib/categories";

export async function GET() {
  const categories = getCategoriesWithCounts();
  return NextResponse.json(categories);
}