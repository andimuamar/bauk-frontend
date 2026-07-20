"use client"

import React, { useEffect, useState } from 'react';
import { BookOpen, Wallet, Briefcase, ArrowRight } from 'lucide-react';

const items = [
  {
    number: '01',
    title: 'Biaya Studi',
    desc: 'Rincian biaya kuliah, komponen pembayaran, dan informasi pendukung akademik.',
    icon: BookOpen,
  },
  {
    number: '02',
    title: 'Panduan Keuangan Mahasiswa',
    desc: 'Tips mengatur anggaran, strategi pembayaran, dan pengelolaan dana selama kuliah.',
    icon: Wallet,
  },
  {
    number: '03',
    title: 'Unit Usaha',
    desc: 'Informasi layanan dan peluang usaha yang relevan untuk kebutuhan mahasiswa.',
    icon: Briefcase,
  },
  {
    number: '04',
    title: 'Beasiswa',
    desc: 'Informasi program beasiswa, syarat pendaftaran, dan jadwal seleksi terbaru.',
    icon: BookOpen,
  },
  {
    number: '05',
    title: 'Pembayaran Online',
    desc: 'Panduan kanal pembayaran digital untuk memudahkan transaksi mahasiswa.',
    icon: Wallet,
  },
  {
    number: '06',
    title: 'Layanan Pendukung',
    desc: 'Akses informasi layanan tambahan yang mendukung kegiatan akademik dan usaha.',
    icon: Briefcase,
  },
];

export default function InformasiKeuanganMahasiswa() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);
  const maxIndex = Math.max(items.length - visibleCards, 0);

  useEffect(() => {
    const updateVisibleCards = () => {
      if (window.innerWidth < 640) {
        setVisibleCards(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCards(2);
      } else {
        setVisibleCards(3);
      }
    };

    updateVisibleCards();
    window.addEventListener('resize', updateVisibleCards);

    return () => window.removeEventListener('resize', updateVisibleCards);
  }, []);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  return (
    <div className="bg-white-50 px-2 py-5 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-amber-600">Informasi Mahasiswa</p>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Keuangan & Layanan Pendukung</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
              Tampilan modern berbasis Tailwind untuk menampilkan tiga kategori utama secara ringkas, rapi, dan mudah dipindai.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                Prev
              </button>
              <button
                onClick={handleNext}
                disabled={currentIndex === maxIndex}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
              >
                Next
              </button>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Slide {currentIndex + 1} dari {maxIndex + 1} · {visibleCards} kartu / tampilan
            </p>
          </div>

          <div className="overflow-hidden">
            <div
              className="flex gap-5 pt-6 transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
            >
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.number} className="flex-none" style={{ width: `calc(${100 / visibleCards}% - 1.25rem)` }}>
                    <div
                      className="group relative h-full rounded-3xl border border-slate-200 bg-white p-6 pt-10 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl dark:border-slate-800 dark:bg-slate-900"
                    >
                      <div className="absolute -top-6 left-6 inline-flex items-center rounded-2xl bg-blue-600 px-4 py-2 text-3xl font-light tracking-wide text-white shadow-lg shadow-blue-200 dark:shadow-blue-950">
                        {item.number}
                      </div>

                      <div className="mb-6 flex justify-end">
                        <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">{item.title}</h2>
                      <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.desc}</p>

                      <div className="mt-6 flex items-center text-sm font-semibold text-slate-800 transition group-hover:text-blue-600 dark:text-slate-100 dark:group-hover:text-blue-400">
                        Lihat detail
                        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={index === currentIndex ? 'h-2 w-8 rounded-full bg-blue-600' : 'h-2 w-2 rounded-full bg-slate-300 dark:bg-slate-700'}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
