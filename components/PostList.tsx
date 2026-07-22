"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WPPost } from "@/types/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function PostList({ perPage = 6 }: { perPage?: number }) {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
 
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch(`/api/posts?per_page=${perPage}`);
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: WPPost[] = await res.json();
        if (!cancelled) {
          setPosts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat posts:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [perPage]);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: perPage }).map((_, i) => (
          <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat berita terbaru. Silakan coba lagi nanti.
      </p>
    );
  }

  if (posts.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada berita.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="rounded-lg border border-slate-200 p-4 transition-shadow hover:shadow-md"
        >
          <time className="text-xs uppercase tracking-wide text-brand-gold">
            {new Date(post.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
          <h3 className="mt-1 line-clamp-2 text-base font-semibold text-brand-navy">
            <Link href={post.link} target="_blank" className="hover:underline">
              {stripHtml(post.title.rendered)}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-3 text-sm text-slate-600">
            {stripHtml(post.excerpt.rendered)}
          </p>
        </article>
      ))}
    </div>
  );
}
