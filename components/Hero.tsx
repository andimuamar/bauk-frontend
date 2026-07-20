import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-navy">
      {/* Signature: faint ledger rules referencing financial record-books */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{}}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <span className="inline-block rounded-full border border-brand-gold/40 px-3 py-1 text-xs font-medium uppercase tracking-widest text-brand-gold">
          Universitas Ibnu Sina
        </span>
        <h1 className="mt-5 max-w-2xl font-serif text-4xl font-medium leading-tight text-white sm:text-5xl">
          Biro Administrasi Umum &amp; Keuangan
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-slate-300">
          Pusat layanan administrasi, sumber daya manusia, dan pengelolaan keuangan
          bagi seluruh sivitas akademika Universitas Ibnu Sina.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/biaya-studi"
            className="rounded-sm bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-navy transition-colors hover:bg-white"
          >
            Biaya Studi
          </Link>
          <Link
            href="/berita"
            className="rounded-sm border border-white/30 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-brand-gold hover:text-brand-gold"
          >
            Berita &amp; Pengumuman
          </Link>
        </div>
      </div>
    </section>
  );
}
