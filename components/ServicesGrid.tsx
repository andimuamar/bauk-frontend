import Link from "next/link";
import { fetchPages } from "@/lib/api/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function ServicesGrid() {
  let pages: { id: number; title: string; excerpt: string; slug: string }[] = [];

  try {
    const data = await fetchPages({ perPage: 6 });
    pages = data.map((p) => ({
      id: p.id,
      title: stripHtml(p.title.rendered),
      excerpt: stripHtml(p.excerpt.rendered),
      slug: p.slug,
    }));
  } catch {
    return (
      <p className="text-sm text-red-600">
        Gagal memuat daftar layanan. Silakan coba lagi nanti.
      </p>
    );
  }

  if (pages.length === 0) {
    return <p className="text-sm text-slate-500">Belum ada halaman layanan.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((page, i) => (
        <Link
          key={page.id}
          href={`/${page.slug}`}
          className="group rounded-lg border border-slate-200 p-5 transition-colors hover:border-brand-gold"
        >
          <span className="font-serif text-2xl text-brand-gold/70">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-2 text-base font-semibold text-brand-navy group-hover:text-brand-gold">
            {page.title}
          </h3>
          {page.excerpt && (
            <p className="mt-1 line-clamp-2 text-sm text-slate-600">{page.excerpt}</p>
          )}
        </Link>
      ))}
    </div>
  );
}
