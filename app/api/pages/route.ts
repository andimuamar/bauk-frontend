import { NextRequest, NextResponse } from "next/server";
import { fetchPages } from "@/lib/api/wp";

export const revalidate = 3600;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = Number(searchParams.get("per_page") ?? 20);
  const page = Number(searchParams.get("page") ?? 1);
  const search = searchParams.get("search");

  try {
    const pages = await fetchPages({
      perPage,
      page,
      params: search ? { search } : {},
    });

    return NextResponse.json(pages, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/pages failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data halaman dari WordPress." },
      { status: 502 }
    );
  }
}
