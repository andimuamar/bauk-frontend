"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { MenuItem, MenuResponse } from "@/types/menu";

export default function TopMenu() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [openDesktop, setOpenDesktop] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSubOpen, setMobileSubOpen] = useState<number | null>(null);
  const navRef = useRef<HTMLElement>(null);

  // Fetch menu from our own API route (/api/menu), not WordPress directly.
  useEffect(() => {
    let cancelled = false;

    async function loadMenu() {
      try {
        const res = await fetch("/api/menu");
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const data: MenuResponse = await res.json();
        if (!cancelled) {
          setItems(data.items ?? []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Gagal memuat menu:", err);
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadMenu();
    return () => {
      cancelled = true;
    };
  }, []);

  // Close desktop dropdown when clicking outside the nav.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDesktop(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close everything on Escape.
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenDesktop(null);
        setMobileOpen(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  if (loading) {
    return (
      <nav className="border-b border-brand-navyLight bg-brand-navy">
        <div className="mx-auto flex h-[52px] max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-40 animate-pulse rounded bg-white/20" />
        </div>
      </nav>
    );
  }

  if (error || items.length === 0) {
    // Fail quietly rather than breaking the page layout.
    return null;
  }

  return (
    <nav
      ref={navRef}
      className="relative z-50 border-b border-brand-navyLight bg-brand-navy"
      aria-label="Menu utama"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link
          href="https://bauk.uis.ac.id/"
          className="flex items-center gap-2 py-3 text-sm font-bold tracking-wide text-white"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-sm bg-brand-gold text-brand-navy">
            B
          </span>
          <span className="hidden sm:inline">BAUK &mdash; UIS</span>
        </Link>

        {/* Desktop menu */}
        <ul className="hidden items-stretch md:flex">
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const isOpen = openDesktop === item.id;

            return (
              <li
                key={item.id}
                className="relative flex items-stretch"
                onMouseEnter={() => hasChildren && setOpenDesktop(item.id)}
                onMouseLeave={() => hasChildren && setOpenDesktop(null)}
              >
                <Link
                  href={item.url}
                  target={item.target || undefined}
                  aria-haspopup={hasChildren || undefined}
                  aria-expanded={hasChildren ? isOpen : undefined}
                  onClick={(e) => {
                    if (hasChildren) {
                      e.preventDefault();
                      setOpenDesktop(isOpen ? null : item.id);
                    }
                  }}
                  className="flex items-center gap-1 px-4 py-3 text-[13px] font-semibold uppercase tracking-wide text-slate-100 transition-colors hover:bg-brand-navyLight hover:text-brand-gold focus:outline-none focus-visible:bg-brand-navyLight"
                >
                  {item.title}
                  {hasChildren && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className={`h-3.5 w-3.5 shrink-0 stroke-current transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      <path
                        d="M5 7.5 10 12.5 15 7.5"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </Link>

                {hasChildren && (
                  <div
                    className={`absolute left-0 top-full min-w-[260px] origin-top border border-brand-navyLight bg-white shadow-lg transition-all duration-150 ${
                      isOpen
                        ? "visible translate-y-0 opacity-100"
                        : "invisible -translate-y-1 opacity-0"
                    }`}
                  >
                    <ul className="py-1">
                      {item.children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={child.url}
                            target={child.target || undefined}
                            className="block px-4 py-2.5 text-sm text-brand-navy transition-colors hover:bg-[#f4f1ea] hover:text-brand-gold"
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Tutup menu" : "Buka menu"}
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
        >
          <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 stroke-current">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6 6 18" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={`overflow-hidden border-t border-brand-navyLight bg-brand-navy transition-[max-height] duration-300 md:hidden ${
          mobileOpen ? "max-h-[80vh] overflow-y-auto" : "max-h-0"
        }`}
      >
        <ul className="px-2 py-2">
          {items.map((item) => {
            const hasChildren = item.children.length > 0;
            const isSubOpen = mobileSubOpen === item.id;

            return (
              <li key={item.id} className="border-b border-brand-navyLight last:border-none">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.url}
                    target={item.target || undefined}
                    onClick={() => !hasChildren && setMobileOpen(false)}
                    className="flex-1 px-3 py-3 text-sm font-semibold uppercase tracking-wide text-slate-100"
                  >
                    {item.title}
                  </Link>
                  {hasChildren && (
                    <button
                      type="button"
                      onClick={() => setMobileSubOpen(isSubOpen ? null : item.id)}
                      aria-expanded={isSubOpen}
                      aria-label={`Buka submenu ${item.title}`}
                      className="flex h-10 w-10 items-center justify-center text-slate-100"
                    >
                      <svg
                        viewBox="0 0 20 20"
                        fill="none"
                        className={`h-4 w-4 stroke-current transition-transform duration-200 ${
                          isSubOpen ? "rotate-180" : ""
                        }`}
                      >
                        <path
                          d="M5 7.5 10 12.5 15 7.5"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <ul
                    className={`overflow-hidden pl-4 transition-[max-height] duration-200 ${
                      isSubOpen ? "max-h-96 pb-2" : "max-h-0"
                    }`}
                  >
                    {item.children.map((child) => (
                      <li key={child.id}>
                        <Link
                          href={child.url}
                          target={child.target || undefined}
                          onClick={() => setMobileOpen(false)}
                          className="block px-3 py-2 text-sm text-slate-300 hover:text-brand-gold"
                        >
                          {child.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
