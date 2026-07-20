import { MenuResponse } from "@/types/menu";

const WP_MENU_API_URL =
  process.env.WP_MENU_API_URL ??
  "https://bauk.uis.ac.id/wp-json/custom-menu-api/v1/menus/location/primary";

/**
 * Calls the WordPress custom-menu-api plugin directly.
 * Runs on the server only (used inside the /api/menu route handler).
 * Cached for 1 hour via Next.js fetch cache (ISR-style revalidation).
 */
export async function fetchMenuFromWordPress(): Promise<MenuResponse> {
  const res = await fetch(WP_MENU_API_URL, {
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    throw new Error(`WordPress menu API responded with status ${res.status}`);
  }

  return (await res.json()) as MenuResponse;
}
