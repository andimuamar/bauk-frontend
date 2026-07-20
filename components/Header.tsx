import TopMenu from "./TopMenu";

export default function Header() {
  return (
    <header className="sticky top-0">
      <div className="hidden bg-brand-navyDark text-slate-300 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-1.5 text-xs sm:px-6 lg:px-8">
          <span>Universitas Ibnu Sina &mdash; Biro Administrasi Umum &amp; Keuangan</span>
          <a
            href="mailto:bauk@uis.ac.id"
            className="transition-colors hover:text-brand-gold"
          >
            bauk@uis.ac.id
          </a>
        </div>
      </div>
      <TopMenu />
    </header>
  );
}
