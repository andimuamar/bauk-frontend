import { NextResponse } from "next/server";
import { fetchMenuFromWordPress } from "@/lib/api/menu";

// Revalidate this route's cache every hour.
export const revalidate = 3600;

export async function GET() {
  try {
    const menu = await fetchMenuFromWordPress();
    return NextResponse.json(menu, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/menu failed:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data menu dari WordPress." },
      { status: 502 }
    );
  }
}
