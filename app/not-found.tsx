import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <span className="font-serif text-6xl text-brand-gold">404</span>
      <h1 className="mt-4 font-serif text-2xl font-medium text-brand-navy">
        Halaman tidak ditemukan
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Halaman yang Anda cari mungkin sudah dipindahkan atau tidak tersedia.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-sm bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-navyLight"
      >
        Kembali ke Beranda
      </Link>
    </div>
  );
}
