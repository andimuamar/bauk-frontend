import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { fetchPosts } from "@/lib/api/wp";
import { CardNews } from "@/components/CardNews";

export const metadata: Metadata = {
  title: "Berita & Pengumuman",
  description: "Berita dan pengumuman terbaru dari BAUK Universitas Ibnu Sina.",
};

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

function getThumbnail(post: Awaited<ReturnType<typeof fetchPosts>>[number]) {
  const media = post._thumbnail;

  const sizes = media?.media_details?.sizes;

  return (
    sizes?.medium_large?.source_url ??
    sizes?.medium?.source_url ??
    sizes?.large?.source_url ??
    media?.source_url ??
    null
  );
}

export default async function BeritaArchivePage() {
  let posts: Awaited<ReturnType<typeof fetchPosts>> = [];
  let error = false;

  try {
    posts = await fetchPosts({ perPage: 20 });
  } catch {
    error = true;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
        Arsip
      </span>
      <h1 className="mt-1 font-serif text-3xl font-medium text-brand-navy">
        Berita &amp; Pengumuman
      </h1>

      {error && (
        <p className="mt-6 text-sm text-red-600">
          Gagal memuat berita. Silakan coba lagi nanti.
        </p>
      )}

      {!error && posts.length === 0 && (
        <p className="mt-6 text-sm text-slate-500">Belum ada berita.</p>
      )}

      {!error && posts.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const thumbnail = getThumbnail(post);
            
            return (
              <article
                key={post.id}
                className="overflow-hidden rounded-lg border border-slate-200 transition-shadow hover:shadow-md"
              >
                <CardNews
                  imageUrl={thumbnail}
                  author="Admin"
                  commentCount={0}
                  title={"Supporting local\nbusiness to bounce back"}
                  href={`/berita/${post.slug}`}
                />
              </article>
              
            );
          })}
        </div>
      )}
    </div>
  );
}