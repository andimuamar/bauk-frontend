import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";
import PostList from "@/components/PostList";
import CategoryList from "@/components/CategoryList";
import Link from "next/link";
import InformasiKeuanganMahasiswa from "./mahasiswa/page";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* <ServicesGrid /> */}
        <InformasiKeuanganMahasiswa/>
      </section>

      <section className="border-y border-slate-100 bg-brand-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
                Terkini
              </span>
              <h2 className="mt-1 font-serif text-2xl font-medium text-brand-navy">
                Berita &amp; Pengumuman
              </h2>
            </div>
            <Link
              href="/berita"
              className="shrink-0 text-sm font-semibold text-brand-navy hover:text-brand-gold"
            >
              Lihat semua &rarr;
            </Link>
          </div>
          {/* <PostList perPage={6} /> */}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
          Jelajahi
        </span>
        <h2 className="mt-1 font-serif text-2xl font-medium text-brand-navy">
          Kategori
        </h2>
        <div className="mt-6">
          <CategoryList />
        </div>
      </section>
    </>
  );
}
