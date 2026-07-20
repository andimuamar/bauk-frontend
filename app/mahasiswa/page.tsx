"use client";

import React, { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import { SliderCategories } from "@/components/SliderCategories";
import { WPPost } from "@/types/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default function InformasiKeuanganMahasiswa() {
  const [posts, setPosts] = useState<WPPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

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
    window.addEventListener("resize", updateVisibleCards);

    return () => window.removeEventListener("resize", updateVisibleCards);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      try {
        const res = await fetch("/api/posts?per_page=10");

        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }

        const data: WPPost[] = await res.json();

        if (!cancelled) {
          setPosts(data);
          setLoading(false);
        }
      } catch (err) {
        console.error(err);

        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      cancelled = true;
    };
  }, []);

  const items = posts.map((post, index) => ({
    number: String(index + 1).padStart(2, "0"),
    title: stripHtml(post.title.rendered),
    desc: stripHtml(post.excerpt.rendered),
    slug: post.slug,
    icon: BookOpen,
  }));
  
  const maxIndex = Math.max(items.length - visibleCards, 0);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  if (loading) {
    return <div className="py-10 text-center">Memuat informasi...</div>;
  }

  if (error) {
    return (
      <div className="py-10 text-center text-red-600">Gagal memuat data.</div>
    );
  }

  return (
    <div className="bg-white-50 px-2 py-5 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-amber-600">
              Informasi Mahasiswa
            </p>
          </div>
        </div>
        <SliderCategories
          handlePrev={handlePrev}
          handleNext={handleNext}
          currentIndex={currentIndex}
          maxIndex={maxIndex}
          setCurrentIndex={setCurrentIndex}
          visibleCards={visibleCards}
          items={items}
        />
      </div>
    </div>
  );
}
