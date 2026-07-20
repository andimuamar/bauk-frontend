"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WPPage } from "@/types/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function PageList() {
  const [pages, setPages] = useState<WPPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/pages?per_page=20");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: WPPage[] = await res.json();
        if (!cancelled) {
          setPages(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat halaman:", err);
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
  }, []);

  if (loading) {
    return (
      <ul className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="h-5 w-2/3 animate-pulse rounded bg-slate-100" />
        ))}
      </ul>
    );
  }

  if (error) {
    return <p className="text-sm text-red-600">Gagal memuat halaman. Silakan coba lagi nanti.</p>;
  }

  if (pages.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada halaman.</p>;
  }

  return (
    <ul className="space-y-1.5">
      {pages.map((page) => (
        <li key={page.id}>
          <Link
            href={page.link}
            target="_blank"
            className="text-sm text-brand-navy underline-offset-2 hover:text-brand-gold hover:underline"
          >
            {stripHtml(page.title.rendered)}
          </Link>
        </li>
      ))}
    </ul>
  );
}
