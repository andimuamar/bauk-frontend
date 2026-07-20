import { NextRequest, NextResponse } from "next/server";
import { fetchCategories } from "@/lib/api/wp";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = Number(searchParams.get("per_page") ?? 20);
  const page = Number(searchParams.get("page") ?? 1);

  try {
    const categories = await fetchCategories({ perPage, page });

    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/categories failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data kategori dari WordPress." },
      { status: 502 }
    );
  }
}
