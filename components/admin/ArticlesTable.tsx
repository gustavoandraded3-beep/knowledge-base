"use client";

import { useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Search,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import type { Article } from "@/types";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ArticlesTableProps {
  articles: Article[];
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, status: "draft" | "published") => Promise<void>;
}

type SortKey = "title" | "category" | "status" | "createdAt" | "viewCount";
type SortDir = "asc" | "desc";

export default function ArticlesTable({
  articles,
  onDelete,
  onToggleStatus,
}: ArticlesTableProps) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [deleteTarget, setDeleteTarget] = useState<Article | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const filtered = articles
    .filter(
      (a) =>
        a.title.toLowerCase().includes(query.toLowerCase()) ||
        a.category.toLowerCase().includes(query.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(query.toLowerCase()))
    )
    .sort((a, b) => {
      let valA: string | number = a[sortKey] as string | number;
      let valB: string | number = b[sortKey] as string | number;
      if (sortKey === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (valA < valB) return sortDir === "asc" ? -1 : 1;
      if (valA > valB) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronUp className="h-3.5 w-3.5 opacity-30" />;
    return sortDir === "asc" ? (
      <ChevronUp className="h-3.5 w-3.5 text-brand-500" />
    ) : (
      <ChevronDown className="h-3.5 w-3.5 text-brand-500" />
    );
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await onDelete(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
  };

  const handleToggle = async (article: Article) => {
    setToggling(article.id);
    const next = article.status === "published" ? "draft" : "published";
    await onToggleStatus(article.id, next);
    setToggling(null);
  };

  return (
    <>
      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title, category, or tag…"
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              {(
                [
                  { key: "title", label: "Title" },
                  { key: "category", label: "Category" },
                  { key: "status", label: "Status" },
                  { key: "viewCount", label: "Views" },
                  { key: "createdAt", label: "Created" },
                ] as { key: SortKey; label: string }[]
              ).map(({ key, label }) => (
                <th
                  key={key}
                  onClick={() => handleSort(key)}
                  className="px-4 py-3 text-left font-medium text-slate-500 dark:text-slate-400 cursor-pointer hover:text-slate-700 dark:hover:text-slate-200 select-none"
                >
                  <span className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-3 text-right font-medium text-slate-500 dark:text-slate-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                  No articles found
                </td>
              </tr>
            ) : (
              filtered.map((article) => (
                <tr
                  key={article.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-medium text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                        {article.title}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        /{article.slug}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-600 dark:text-slate-300 capitalize">
                      {article.category.replace(/-/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={article.status === "published" ? "success" : "warning"}>
                      {article.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                    {article.viewCount}
                  </td>
                  <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                    {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* View */}
                      {article.status === "published" && (
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-brand-600 hover:bg-brand-50 dark:hover:bg-brand-900/20 transition-all"
                          title="View article"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
                      )}

                      {/* Toggle publish */}
                      <button
                        onClick={() => handleToggle(article)}
                        disabled={toggling === article.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all disabled:opacity-50"
                        title={article.status === "published" ? "Unpublish" : "Publish"}
                      >
                        {article.status === "published" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>

                      {/* Edit */}
                      <Link
                        href={`/admin/articles/${article.id}/edit`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit article"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>

                      {/* Delete */}
                      <button
                        onClick={() => setDeleteTarget(article)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Delete article"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <p className="text-xs text-slate-400 mt-2 text-right">
          Showing {filtered.length} of {articles.length} articles
        </p>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="Delete Article"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Are you sure you want to delete{" "}
            <strong className="text-slate-900 dark:text-white">
              {deleteTarget?.title}
            </strong>
            ? This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={deleting}>
              Delete Article
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
