"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ArticleEditor from "@/components/admin/ArticleEditor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { Article, Category } from "@/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Props {
  params: { id: string };
}

export default function EditArticlePage({ params }: Props) {
  const router = useRouter();
  const [article, setArticle] = useState<Article | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [articleRes, categoriesRes] = await Promise.all([
          fetch(`/api/articles/${params.id}`),
          fetch("/api/categories"),
        ]);

        if (!articleRes.ok) throw new Error("Article not found");
        const [articleData, categoriesData] = await Promise.all([
          articleRes.json(),
          categoriesRes.json(),
        ]);

        setArticle(articleData);
        setCategories(categoriesData);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [params.id]);

  const handleSave = async (data: Partial<Article>) => {
    const res = await fetch(`/api/articles/${params.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Update failed");
    }

    router.push("/admin/articles");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/articles"
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Edit Article</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Update content, metadata, or publish status.
        </p>
      </div>

      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
        </div>
      ) : article ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
          <ArticleEditor
            initial={article}
            categories={categories}
            onSave={handleSave}
            mode="edit"
          />
        </div>
      ) : null}
    </div>
  );
}