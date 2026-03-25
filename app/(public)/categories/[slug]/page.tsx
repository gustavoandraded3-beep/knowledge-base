import { notFound } from "next/navigation";
import { getCategoryBySlug } from "@/lib/categories";
import { getArticlesByCategory } from "@/lib/articles";
import { getAllCategories } from "@/lib/categories";
import ArticleCard from "@/components/kb/ArticleCard";
import Breadcrumbs from "@/components/kb/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import { FileText } from "lucide-react";
import type { Metadata } from "next";

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  return getAllCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  return { title: category?.name ?? "Category" };
}

export default function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) notFound();

  const articles = getArticlesByCategory(params.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs
        crumbs={[
          { label: "Categories", href: "/categories" },
          { label: category.name },
        ]}
      />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          {category.name}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">{category.description}</p>
        <p className="text-sm text-slate-400 mt-2">
          {articles.length} {articles.length === 1 ? "article" : "articles"}
        </p>
      </div>

      {articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles yet"
          description="This category doesn't have any published articles yet."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}