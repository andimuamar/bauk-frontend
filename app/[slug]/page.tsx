import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPageBySlug } from "@/lib/api/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const page = await fetchPageBySlug(slug);

  if (!page) return {};

  return {
    title: stripHtml(page.title.rendered),
    description: stripHtml(page.excerpt.rendered),
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;

  const page = await fetchPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <span className="text-xs font-semibold uppercase tracking-widest text-brand-gold">
        Halaman
      </span>

      <h1 className="mt-1 font-serif text-3xl font-medium text-brand-navy sm:text-4xl">
        {stripHtml(page.title.rendered)}
      </h1>

      <div
        className="prose prose-slate mt-8 max-w-none"
        dangerouslySetInnerHTML={{
          __html: page.content?.rendered ?? "",
        }}
      />
    </article>
  );
}
