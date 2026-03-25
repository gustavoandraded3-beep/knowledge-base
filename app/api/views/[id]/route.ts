import { NextRequest, NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/articles";

export async function POST(_req: NextRequest, { params }: { params: { id: string } }) {
  incrementViewCount(params.id);
  return NextResponse.json({ success: true });
}