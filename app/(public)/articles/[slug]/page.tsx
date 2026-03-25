import { notFound } from "next/navigation";
import { getArticleBySlug, getRelatedArticles, getPublishedArticles } from "@/lib/articles";
import { getCategoryBySlug } from "@/lib/categories";
import { extractHeadings, injectHeadingIds } from "@/utils/toc";
import Breadcrumbs from "@/components/kb/Breadcrumbs";
import TableOfContents from "@/components/kb/TableOfContents";
import RelatedArticles from "@/components/kb/RelatedArticles";
import HelpfulWidget from "@/components/kb/HelpfulWidget";
import ViewTracker from "@/components/kb/ViewTracker";
import Badge from "@/components/ui/Badge";
import { Calendar, User, Eye, Download, Tag } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Metadata } from "next";
import Link from "next/link";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getPublishedArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  return {
    title: article?.title ?? "Article",
    description: article?.excerpt,
  };
}

export default function ArticlePage({ params }: Props) {
  const article = getArticleBySlug(params.slug);
  if (!article || article.status !== "published") notFound();

  const category = getCategoryBySlug(article.category);
  const related = getRelatedArticles(article, 4);
  const contentWithIds = injectHeadingIds(article.content);
  const headings = extractHeadings(contentWithIds);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <ViewTracker articleId={article.id} />

      {/* Breadcrumbs */}
      <Breadcrumbs
        crumbs={[
          { label: "Categories", href: "/categories" },
          ...(category ? [{ label: category.name, href: `/categories/${category.slug}` }] : []),
          { label: article.title },
        ]}
      />

      <div className="mt-8 flex gap-10">
        {/* Main content */}
        <article className="flex-1 min-w-0">
          {/* Header */}
          <header className="mb-8">
            {category && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mb-4 ${category.color}`}>
                {category.name}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
              {article.title}
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              {article.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 pb-6 border-b border-slate-200 dark:border-slate-700">
              <span className="flex items-center gap-1.5">
                <User className="h-4 w-4" />
                {article.author}
              </span>
              <span className="flex items-center gap-1.5" title={format(new Date(article.createdAt), "PPP")}>
                <Calendar className="h-4 w-4" />
                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {article.viewCount} views
              </span>

              {article.sourceFile && (
                <Link
                  href={article.sourceFile}
                  target="_blank"
                  className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 hover:underline ml-auto"
                >
                  <Download className="h-4 w-4" />
                  Download original
                </Link>
              )}
            </div>

            {/* Tags */}
            {article.tags.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-4">
                <Tag className="h-3.5 w-3.5 text-slate-400" />
                {article.tags.map((tag) => (
                  <Badge key={tag} variant="default">{tag}</Badge>
                ))}
              </div>
            )}
          </header>

          {/* Article Body */}
          <div
            className="kb-content"
            dangerouslySetInnerHTML={{ __html: contentWithIds }}
          />

          {/* Helpful Widget */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <HelpfulWidget />
          </div>

          {/* Last updated */}
          <p className="text-xs text-slate-400 mt-6 text-center">
            Last updated {format(new Date(article.updatedAt), "MMMM d, yyyy")}
          </p>
        </article>

        {/* Right sidebar */}
        <aside className="hidden xl:block w-64 shrink-0">
          <TableOfContents headings={headings} />

          {related.length > 0 && (
            <div className="mt-10">
              <RelatedArticles articles={related} />
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}