import { WPCategory, WPPage, WPPost } from "@/types/wp";

const WP_BASE_URL = process.env.WP_BASE_URL ?? "https://bauk.uis.ac.id";
const WP_API_BASE = `${WP_BASE_URL}/wp-json/wp/v2`;

export interface WPMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WPMedia {
  id: number;
  source_url: string;
  alt_text?: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: {
      thumbnail?: WPMediaSize;
      medium?: WPMediaSize;
      medium_large?: WPMediaSize;
      large?: WPMediaSize;
      full?: WPMediaSize;
      [key: string]: WPMediaSize | undefined;
    };
  };
}


interface WPListOptions {
  perPage?: number;
  page?: number;
  /** Extra query params, e.g. { categories: "3", search: "keuangan" } */
  params?: Record<string, string>;
}

function buildQuery({ perPage = 10, page = 1, params = {} }: WPListOptions) {
  const qs = new URLSearchParams({
    per_page: String(perPage),
    page: String(page),
    ...params,
  });
  return qs.toString();
}

/** GET /wp-json/wp/v2/posts — list published posts. */
// export async function fetchPosts(options: WPListOptions = {}): Promise<WPPost[]> {
//   const res = await fetch(`${WP_API_BASE}/posts?${buildQuery(options)}`, {
//     next: { revalidate: 900 },
//   });
//   if (!res.ok) {
//     throw new Error(`WordPress posts API responded with status ${res.status}`);
//   }
//   return (await res.json()) as WPPost[];
// }

// lib/api/wp.ts
export async function fetchPosts({ perPage = 10 }: { perPage?: number }) {
  const res = await fetch(
    `https://bauk.uis.ac.id/wp-json/wp/v2/posts?per_page=${perPage}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Failed to fetch posts");
  const posts: WPPost[] = await res.json();

  // Kumpulkan ID featured_media yang valid (bukan 0)
  const mediaIds = [...new Set(posts.map((p) => p.featured_media).filter(Boolean))];

  if (mediaIds.length > 0) {
    const mediaRes = await fetch(
      `https://bauk.uis.ac.id/wp-json/wp/v2/media?include=${mediaIds.join(",")}&per_page=100`,
      { next: { revalidate: 300 } }
    );
    if (mediaRes.ok) {
      const mediaList: WPMedia[] = await mediaRes.json();
      const mediaMap = new Map(mediaList.map((m) => [m.id, m]));

      // Tempelkan langsung ke tiap post
      return posts.map((post) => ({
        ...post,
        _thumbnail: mediaMap.get(post.featured_media) ?? null,
      }));
    }
  }

  return posts.map((post) => ({ ...post, _thumbnail: null }));
}

/** GET /wp-json/wp/v2/pages — list published pages. */
export async function fetchPages(options: WPListOptions = {}): Promise<WPPage[]> {
  const res = await fetch(`${WP_API_BASE}/pages?${buildQuery(options)}`, {
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    throw new Error(`WordPress pages API responded with status ${res.status}`);
  }
  return (await res.json()) as WPPage[];
}

/** GET /wp-json/wp/v2/pages?slug=... — single page by slug (undefined if not found). */
export async function fetchPageBySlug(slug: string) {
  const url = `${WP_API_BASE}/pages?slug=${slug}`;

  console.log(url);

  const res = await fetch(url, {
    cache: "no-store",
  });

  const pages = await res.json();

  console.log(JSON.stringify(pages, null, 2));

  return pages[0];
}

/** GET /wp-json/wp/v2/posts?slug=... — single post by slug (undefined if not found). */
export async function fetchPostBySlug(
  slug: string
): Promise<WPPost | undefined> {
  const res = await fetch(
    `${WP_API_BASE}/posts?slug=${slug}`,
    {
      cache: "no-store",
      // atau:
      // next: { revalidate: 300 }
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch post");
  }

  const posts: WPPost[] = await res.json();

  return posts[0];
}

/** GET /wp-json/wp/v2/categories?slug=... — single category by slug (undefined if not found). */
export async function fetchCategoryBySlug(slug: string): Promise<WPCategory | undefined> {
  const categories = await fetchCategories({ params: { slug } });
  return categories[0];
}
