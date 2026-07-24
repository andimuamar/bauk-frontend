import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { fetchPostBySlug } from "@/lib/api/wp";

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, "").trim();
}

type PostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);
  if (!post) return {};
  return {
    title: stripHtml(post.title.rendered),
    description: stripHtml(post.excerpt.rendered).slice(0, 160),
  };
}

export default async function SinglePostPage({ params }: PostPageProps)  {
  const { slug } = await params;
  const post = await fetchPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/berita"
        className="text-xs font-semibold uppercase tracking-widest text-brand-gold hover:underline"
      >
        &larr; Kembali ke Category
      </Link>

      <time className="mt-4 block text-sm text-slate-500">
        {new Date(post.date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </time>
      <h1 className="mt-1 font-serif text-3xl font-medium text-brand-navy sm:text-4xl">
        {stripHtml(post.title.rendered)}
      </h1>

      <div
        className="prose prose-slate mt-8 max-w-none prose-headings:font-serif prose-headings:text-brand-navy prose-a:text-brand-navy prose-a:underline-offset-2 hover:prose-a:text-brand-gold"
        dangerouslySetInnerHTML={{ __html: post.content?.rendered ?? "" }}
      />
    </article>
  );
}
