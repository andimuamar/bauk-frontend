import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPageBySlug } from "@/lib/api/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const page = await fetchPageBySlug(params.slug);
  if (!page) return {};
  return {
    title: stripHtml(page.title.rendered),
    description: stripHtml(page.excerpt.rendered).slice(0, 160),
  };
}

export default async function WordPressPage({ params }: PageProps) {
  const page = await fetchPageBySlug(params.slug);

  console.log(page);
  
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
        className="prose prose-slate mt-8 max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-navy prose-a:underline-offset-2 hover:prose-a:text-brand-gold"
        dangerouslySetInnerHTML={{ __html: page.content?.rendered ?? "" }}
      />
    </article>
  );
}
