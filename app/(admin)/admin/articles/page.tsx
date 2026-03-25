"use client";

import { useEffect, useState, useCallback } from "react";
import ArticlesTable from "@/components/admin/ArticlesTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import type { Article } from "@/types";
import { FileText, Plus } from "lucide-react";
import Link from "next/link";

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/articles?admin=true");
      if (!res.ok) throw new Error("Failed to load articles");
      const data = await res.json();
      setArticles(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "Delete failed");
      return;
    }
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleStatus = async (id: string, status: "draft" | "published") => {
    const res = await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? "Update failed");
      return;
    }
    const updated = await res.json();
    setArticles((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Articles</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Manage all knowledge base articles.
          </p>
        </div>
        <Link href="/admin/upload">
          <Button>
            <Plus className="h-4 w-4" />
            New Article
          </Button>
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-24">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
          <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          <Button variant="outline" onClick={loadArticles} className="mt-3">
            Retry
          </Button>
        </div>
      ) : articles.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No articles yet"
          description="Upload a document or create your first article to get started."
          action={
            <Link href="/admin/upload">
              <Button>
                <Plus className="h-4 w-4" />
                Upload Document
              </Button>
            </Link>
          }
        />
      ) : (
        <ArticlesTable
          articles={articles}
          onDelete={handleDelete}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
}