import Link from "next/link";
import { fetchPages } from "@/lib/api/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function Footer() {
  let quickLinks: { id: number; title: string; slug: string }[] = [];
  try {
    const pages = await fetchPages({ perPage: 6 });
    quickLinks = pages.map((p) => ({
      id: p.id,
      title: stripHtml(p.title.rendered),
      slug: p.slug,
    }));
  } catch {
    // Footer stays useful even if this section can't load.
    quickLinks = [];
  }

  return (
    <footer className="border-t border-brand-navyLight bg-brand-navy text-slate-300">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <div className="flex items-center gap-2 text-sm font-bold tracking-wide text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-gold text-brand-navy">
              B
            </span>
            BAUK &mdash; UIS
          </div>
          <p className="mt-3 max-w-xs text-sm text-slate-400">
            Biro Administrasi Umum dan Keuangan, Universitas Ibnu Sina. Melayani
            administrasi umum, sumber daya manusia, dan pengelolaan keuangan kampus.
          </p>
        </div>

        {quickLinks.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
              Tautan Cepat
            </h3>
            <ul className="mt-3 space-y-2 text-sm">
              {quickLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={`/${link.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-brand-gold">
            Kontak
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Universitas Ibnu Sina, Batam</li>
            <li>
              <a href="mailto:bauk@uis.ac.id" className="hover:text-white">
                bauk@uis.ac.id
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-brand-navyLight/60">
        <div className="mx-auto max-w-6xl px-4 py-4 text-xs text-slate-500 sm:px-6 lg:px-8">
          &copy; {new Date().getFullYear()} BAUK &mdash; Universitas Ibnu Sina. Seluruh hak
          cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
