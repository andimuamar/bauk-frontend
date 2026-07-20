"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { WPCategory } from "@/types/wp";

export default function CategoryList() {
  const [categories, setCategories] = useState<WPCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/categories?per_page=20");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: WPCategory[] = await res.json();
        if (!cancelled) {
          // "Uncategorized" biasanya tidak relevan ditampilkan ke publik.
          setCategories(data.filter((c) => c.count > 0));
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat kategori:", err);
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
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-7 w-24 animate-pulse rounded-full bg-slate-100" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-sm text-red-600">Gagal memuat kategori. Silakan coba lagi nanti.</p>
    );
  }

  if (categories.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada kategori.</p>;
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={cat.link}
          target="_blank"
          className="rounded-full border border-brand-navy/20 px-3 py-1 text-xs font-medium text-brand-navy transition-colors hover:border-brand-gold hover:bg-brand-gold/10"
        >
          {cat.name}
          <span className="ml-1 text-slate-400">({cat.count})</span>
        </Link>
      ))}
    </div>
  );
}
