"use client";
import Link from "next/link";
import React from "react";

function IconUser(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.41 0-8 2.16-8 4.82A1.68 1.68 0 0 0 5.75 21h12.5A1.68 1.68 0 0 0 20 19.07c0-2.66-3.59-4.82-8-4.82Z" />
    </svg>
  );
}

function IconChat(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20 3H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h3.6l3.5 2.7a1 1 0 0 0 1.2 0L15.8 18H20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm0 13H15.5a1 1 0 0 0-.6.2L12 18.5l-2.9-2.3a1 1 0 0 0-.6-.2H4V5h16v11Z" />
    </svg>
  );
}

export function CardNews({
  imageUrl,
  author,
  commentCount,
  title,
  href,
}: {
  imageUrl: any;
  author: any;
  commentCount: any;
  title: any;
  href: any;
}) {
  return (
    <article className="w-full max-w-sm overflow-hidden rounded bg-white shadow-sm ring-1 ring-slate-200">
      {imageUrl ? (
        <img src={imageUrl} alt={title} className="h-72 w-full object-cover" />
      ) : (
        <div className="h-72 w-full object-cover">Tidak ada gambar</div>
      )}

      <div className="px-8 pb-10 pt-6">
        <div className="flex items-center gap-6 text-sm text-slate-500">
          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
              <IconUser className="h-4 w-4" />
            </span>
            <span className="font-medium">{author}</span>
          </span>

          <span className="inline-flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 text-white">
              <IconChat className="h-4 w-4" />
            </span>
            <span className="font-medium">Comment ({commentCount})</span>
          </span>
        </div>

        <h3 className="mt-6 whitespace-pre-line text-3xl font-extrabold leading-tight text-slate-900">
          {title}
        </h3>

        <div className="mt-8">
          <Link href={href} className="block">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800">
              Read More <span aria-hidden="true">→</span>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
