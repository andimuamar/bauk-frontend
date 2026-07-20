import { NextRequest, NextResponse } from "next/server";
import { fetchPosts } from "@/lib/api/wp";

export const revalidate = 900;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const perPage = Number(searchParams.get("per_page") ?? 10);
  const page = Number(searchParams.get("page") ?? 1);
  const category = searchParams.get("category"); // category ID
  const search = searchParams.get("search");

  try {
    const posts = await fetchPosts({
      perPage,
      page,
      params: {
        ...(category ? { categories: category } : {}),
        ...(search ? { search } : {}),
      },
    });

    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    console.error("GET /api/posts failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data posts dari WordPress." },
      { status: 502 }
    );
  }
}
