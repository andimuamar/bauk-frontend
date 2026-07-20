import React from 'react'
import { ArrowRight } from "lucide-react";

export const SliderCategories = ({handlePrev, handleNext, currentIndex, maxIndex, setCurrentIndex, visibleCards, items} : {handlePrev:any, handleNext:any, currentIndex:any, maxIndex:number, setCurrentIndex:any, visibleCards:any, items:any}) => {

  console.log(items);
  
  return (
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
              {items.map((item:any) => {
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
  )
}
