import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getGuideBySlug } from "@/lib/data/guides";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.seo_title ?? guide.title,
    description: guide.seo_description ?? guide.excerpt ?? undefined,
    alternates: { canonical: `/guides/${slug}` },
  };
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <div className="container-page py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides", href: "/guides" }, { label: guide.title }]} />
      <article className="mt-6 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-ink">{guide.title}</h1>
        {guide.published_at && <p className="mt-2 text-sm text-ink-muted">{formatDate(guide.published_at)}</p>}
        {guide.excerpt && <p className="mt-4 text-lg text-ink-muted">{guide.excerpt}</p>}
        {guide.content && (
          <div className="prose prose-sm mt-8 max-w-none text-ink prose-headings:text-ink prose-a:text-accent-blue">
            <ReactMarkdown>{guide.content}</ReactMarkdown>
          </div>
        )}
      </article>
    </div>
  );
}
