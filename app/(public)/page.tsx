import Link from "next/link";
import { getRecentArticles } from "@/lib/articles";
import { getCategoriesWithCounts } from "@/lib/categories";
import ArticleCard from "@/components/kb/ArticleCard";
import CategoryCard from "@/components/kb/CategoryCard";
import SearchBar from "@/components/kb/SearchBar";
import { Suspense } from "react";
import { ArrowRight, BookOpen, FileText, FolderOpen } from "lucide-react";

export default async function HomePage() {
  const recentArticles = getRecentArticles(6);
  const categories = getCategoriesWithCounts();
  const totalArticles = recentArticles.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-16">
      {/* Hero */}
      <section className="text-center py-12">
        <div className="inline-flex items-center gap-2 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <BookOpen className="h-4 w-4" />
          Internal Knowledge Base
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
          Find the answers <br className="hidden sm:block" />
          you're looking for
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 mb-8 max-w-xl mx-auto">
          Search across all company documentation, guides, and policies in one place.
        </p>
        <div className="max-w-xl mx-auto">
          <Suspense>
            <SearchBar placeholder="Search articles, guides, policies…" size="lg" />
          </Suspense>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 mt-10 text-sm text-slate-400">
          <span className="flex items-center gap-1.5">
            <FileText className="h-4 w-4" />
            {totalArticles}+ articles
          </span>
          <span className="flex items-center gap-1.5">
            <FolderOpen className="h-4 w-4" />
            {categories.length} categories
          </span>
        </div>
      </section>

      {/* Categories */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Browse by Category</h2>
          <Link
            href="/categories"
            className="flex items-center gap-1 text-sm text-brand-600 dark:text-brand-400 hover:underline font-medium"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Recent Articles */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Articles</h2>
        </div>
        {recentArticles.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No articles published yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentArticles.map((article) => {
              const cat = categories.find((c) => c.slug === article.category);
              return (
                <ArticleCard
                  key={article.id}
                  article={article}
                  category={cat}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}