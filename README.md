# BAUK Top Menu — Next.js Project

Project Next.js (App Router) lengkap: top menu responsif yang datanya diambil dari API
custom menu WordPress, melalui API route internal Next.js sebagai proxy.

## Struktur project

```
bauk-topmenu/
├── app/
│   ├── api/
│   │   ├── menu/route.ts        # GET /api/menu       -> custom-menu-api (menu utama)
│   │   ├── posts/route.ts       # GET /api/posts       -> wp/v2/posts (berita/artikel)
│   │   ├── categories/route.ts  # GET /api/categories  -> wp/v2/categories
│   │   └── pages/route.ts       # GET /api/pages       -> wp/v2/pages
│   ├── berita/
│   │   ├── page.tsx             # Arsip berita (server-rendered, langsung dari WP)
│   │   └── [slug]/page.tsx      # Single berita
│   ├── [slug]/page.tsx          # Template halaman WP dinamis (mis. /biaya-studi)
│   ├── layout.tsx               # Root layout: font, <Header />, <Footer />
│   ├── page.tsx                 # Homepage: Hero, Layanan, Berita, Kategori
│   ├── not-found.tsx            # Halaman 404 kustom
│   └── globals.css              # Directive Tailwind
├── components/
│   ├── Header.tsx                # Top bar kontak + <TopMenu />
│   ├── TopMenu.tsx                # Menu navigasi utama (dropdown + mobile)
│   ├── Footer.tsx                 # Footer 3 kolom (server component, fetch pages)
│   ├── Hero.tsx                   # Hero section dengan motif ledger-line
│   ├── ServicesGrid.tsx           # Grid layanan dari WP pages (server component)
│   ├── PostList.tsx               # Grid berita terbaru (client component)
│   ├── CategoryList.tsx           # Daftar kategori (client component)
│   └── PageList.tsx               # Daftar halaman statis (client component)
├── lib/
│   └── api/
│       ├── menu.ts              # Fetcher server-side untuk custom-menu-api
│       └── wp.ts                # Fetcher untuk posts/pages/categories + fetch by slug
├── types/
│   ├── menu.ts                  # Tipe untuk response custom-menu-api
│   └── wp.ts                    # Tipe untuk WPPost, WPPage, WPCategory
├── .env.local.example           # WP_MENU_API_URL, WP_BASE_URL
├── next.config.mjs
├── tailwind.config.ts           # Token warna brand, font, plugin typography
├── postcss.config.mjs
├── tsconfig.json
├── package.json
└── .gitignore
```

## Halaman theme

| Route              | Tipe                | Sumber data                          |
|---------------------|----------------------|----------------------------------------|
| `/`                 | Homepage             | Hero + `ServicesGrid` (pages) + `PostList` (posts) + `CategoryList` |
| `/[slug]`           | Halaman WP dinamis   | `fetchPageBySlug` langsung ke `wp/v2/pages?slug=` |
| `/berita`           | Arsip berita         | `fetchPosts` langsung ke `wp/v2/posts` |
| `/berita/[slug]`    | Single berita        | `fetchPostBySlug` langsung ke `wp/v2/posts?slug=` |

Halaman-halaman ini adalah **server component** yang fetch langsung lewat `lib/api/wp.ts`
(tanpa lewat `/api/*`) supaya konten ter-render di server (SEO-friendly, cepat). Sementara
`PostList`, `CategoryList`, `PageList` di homepage/`Footer` sengaja tetap ada dua versi:
versi client (`components/*List.tsx`, fetch ke `/api/*`) untuk bagian yang interaktif, dan
versi server langsung (`ServicesGrid`, `Footer`) untuk bagian yang tidak butuh interaktivitas
di browser.

## Alur data (API flow)

```
Browser (TopMenu.tsx)
      │  fetch("/api/menu")
      ▼
Next.js Route Handler (app/api/menu/route.ts)
      │  fetchMenuFromWordPress()  [lib/api/menu.ts]
      ▼
WordPress REST API
https://bauk.uis.ac.id/wp-json/custom-menu-api/v1/menus/location/primary
```

Kenapa lewat API route sendiri, bukan fetch langsung ke WordPress dari browser?

- **Satu titik kontrol**: kalau suatu saat URL/response WordPress berubah, cukup ubah
  `lib/api/menu.ts`, tidak perlu sentuh komponen UI.
- **Caching di server**: `route.ts` memakai `revalidate = 3600` (1 jam) + header
  `Cache-Control`, jadi permintaan berulang dari banyak pengguna tidak selalu
  membebani server WordPress.
- **Menyembunyikan endpoint asli** dan mempermudah penambahan logika lain nanti
  (misalnya transformasi data, autentikasi, atau menggabungkan beberapa sumber menu).
- **CORS aman**: karena fetch dari browser menuju domain sendiri (`/api/menu`), bukan
  ke domain lain.

## Daftar endpoint API internal

Semua endpoint ini berjalan di server Next.js (`app/api/**/route.ts`), memproxy REST
API WordPress, dan mengembalikan JSON apa adanya (dengan sedikit caching).

| Endpoint             | Sumber WordPress             | Query params yang didukung                     | Kegunaan                          |
|-----------------------|-------------------------------|--------------------------------------------------|-------------------------------------|
| `GET /api/menu`       | `custom-menu-api/v1/menus/location/primary` | –                                    | Menu navigasi utama (dipakai `TopMenu`) |
| `GET /api/posts`      | `wp/v2/posts`                  | `per_page`, `page`, `category` (ID), `search`     | Daftar berita/artikel               |
| `GET /api/categories` | `wp/v2/categories`             | `per_page`, `page`                                | Daftar kategori post                |
| `GET /api/pages`      | `wp/v2/pages`                  | `per_page`, `page`, `search`                      | Daftar halaman statis               |

Contoh pemakaian langsung:

```bash
curl "http://localhost:3000/api/posts?per_page=5"
curl "http://localhost:3000/api/posts?category=3&search=beasiswa"
curl "http://localhost:3000/api/categories"
curl "http://localhost:3000/api/pages?search=profil"
```

Catatan: endpoint `wp/v2/posts`, `wp/v2/pages`, dan `wp/v2/categories` adalah REST API
bawaan WordPress (bukan plugin custom), jadi otomatis tersedia selama REST API tidak
dinonaktifkan di situs WordPress-nya. Jika suatu saat butuh tambahan field (mis.
`_embed` untuk featured image dan info penulis), tinggal tambahkan di
`buildQuery`/`params` pada `lib/api/wp.ts`.

## Komponen tampilan

- **`PostList`** — grid kartu berita terbaru (judul, tanggal, ringkasan), fetch dari
  `/api/posts`. HTML dari WordPress (title/excerpt) dibersihkan dengan `stripHtml`
  sebelum ditampilkan.
- **`CategoryList`** — daftar kategori berbentuk chip, fetch dari `/api/categories`,
  otomatis menyembunyikan kategori kosong (`count === 0`).
- **`PageList`** — daftar tautan ke halaman statis, fetch dari `/api/pages`.

Ketiganya mengikuti pola yang sama seperti `TopMenu`: skeleton saat loading, pesan
singkat saat error, dan render `null`/pesan kosong bila data tidak ada — sehingga
kegagalan salah satu sumber data tidak merusak halaman secara keseluruhan.

## Desain tema

- **Warna**: navy (`brand.navy` / `#0f2c52`) sebagai warna utama header, footer, dan hero;
  emas (`brand.gold` / `#d9a441`) sebagai aksen link/hover/CTA; krem (`brand.cream`) untuk
  section alternatif. Semua didefinisikan sebagai token di `tailwind.config.ts`.
- **Tipografi**: `Newsreader` (serif) untuk judul/heading lewat kelas `font-serif`, `Inter`
  (sans) untuk body lewat `font-sans`. Dimuat via `next/font/google` di `app/layout.tsx`.
- **Motif signature**: garis-garis tipis emas ala buku besar ("ledger lines") di background
  Hero — merujuk ke identitas biro administrasi & keuangan.
- **Konten WordPress** (`page.content.rendered`, `post.content.rendered`) dirender dengan
  `dangerouslySetInnerHTML` dan di-style pakai plugin `@tailwindcss/typography` (kelas
  `prose`), supaya heading/list/link dari editor WordPress otomatis rapi tanpa perlu
  styling manual per elemen.

## Instalasi & menjalankan

```bash
npm install
cp .env.local.example .env.local   # opsional, isi default sudah sama
npm run dev
```

Buka `http://localhost:3000` — menu di bagian atas akan otomatis memuat data dari
`/api/menu`.

## Environment variable

| Variable          | Default                                                                 | Keterangan                          |
|--------------------|--------------------------------------------------------------------------|--------------------------------------|
| `WP_MENU_API_URL`  | `https://bauk.uis.ac.id/wp-json/custom-menu-api/v1/menus/location/primary` | URL sumber data menu di WordPress    |
| `WP_BASE_URL`      | `https://bauk.uis.ac.id`                                                  | Base URL untuk `wp/v2/posts`, `wp/v2/pages`, `wp/v2/categories` |

## Fitur `components/TopMenu.tsx`

- Loading skeleton saat data belum siap.
- Menyembunyikan nav (return `null`) jika API gagal atau menu kosong, agar tidak
  merusak layout halaman.
- **Dropdown desktop**: dibuka lewat hover atau klik, tertutup otomatis saat klik di
  luar nav atau tekan `Esc`.
- **Menu mobile**: panel slide-down dengan accordion submenu, dipicu tombol hamburger.
- Menghormati `target` dan `url` asli dari WordPress.
- Aksesibilitas dasar: `aria-expanded`, `aria-haspopup`, `aria-controls`.

## Kustomisasi warna

Warna brand didefinisikan sebagai token di `tailwind.config.ts`
(`brand.navy`, `brand.navyLight`, `brand.gold`) supaya konsisten dan mudah diganti di
satu tempat, lalu dipakai lewat kelas seperti `bg-brand-navy` / `text-brand-gold` di
`components/TopMenu.tsx`.
# bauk-frontend
