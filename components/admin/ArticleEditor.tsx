"use client";

import { useState } from "react";
import { slugify } from "@/utils/slugify";
import Button from "@/components/ui/Button";
import type { Article, Category } from "@/types";
import type { ParsedDocument } from "@/lib/parser";
import { Save, Eye, EyeOff } from "lucide-react";

interface ArticleEditorProps {
  initial?: Partial<Article>;
  parsed?: ParsedDocument;
  categories: Category[];
  filePath?: string;
  fileName?: string;
  onSave: (data: Partial<Article>) => Promise<void>;
  mode?: "create" | "edit";
}

export default function ArticleEditor({
  initial,
  parsed,
  categories,
  filePath,
  fileName,
  onSave,
  mode = "create",
}: ArticleEditorProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? parsed?.title ?? "",
    slug: initial?.slug ?? slugify(parsed?.title ?? ""),
    content: initial?.content ?? parsed?.content ?? "",
    excerpt: initial?.excerpt ?? parsed?.excerpt ?? "",
    category: initial?.category ?? (categories[0]?.slug ?? ""),
    tags: initial?.tags?.join(", ") ?? "",
    author: initial?.author ?? "Admin",
    status: initial?.status ?? "draft",
  });
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const set = (key: string, value: string) => {
    setForm((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "title" && mode === "create") {
        updated.slug = slugify(value);
      }
      return updated;
    });
  };

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);
    try {
      await onSave({
        ...form,
        status,
        tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        sourceFile: filePath ?? initial?.sourceFile,
        originalFileName: fileName ?? initial?.originalFileName,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title & Slug */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Article title"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Slug
          </label>
          <input
            type="text"
            value={form.slug}
            onChange={(e) => set("slug", e.target.value)}
            placeholder="article-slug"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>
      </div>

      {/* Category, Author, Tags */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Category
          </label>
          <select
            value={form.category}
            onChange={(e) => set("category", e.target.value)}
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Author
          </label>
          <input
            type="text"
            value={form.author}
            onChange={(e) => set("author", e.target.value)}
            placeholder="Author name"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
          </label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="tag-one, tag-two"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          Excerpt
        </label>
        <textarea
          value={form.excerpt}
          onChange={(e) => set("excerpt", e.target.value)}
          rows={2}
          placeholder="Short description shown in article cards and search results"
          className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Content (HTML)
          </label>
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-600 transition-colors"
          >
            {preview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            {preview ? "Edit" : "Preview"}
          </button>
        </div>

        {preview ? (
          <div
            className="kb-content min-h-64 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-4 py-3 overflow-auto max-h-[500px]"
            dangerouslySetInnerHTML={{ __html: form.content }}
          />
        ) : (
          <textarea
            value={form.content}
            onChange={(e) => set("content", e.target.value)}
            rows={18}
            placeholder="<h2>Introduction</h2><p>Your content here...</p>"
            className="w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 px-3 py-2 text-sm font-mono focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 outline-none resize-y"
          />
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
        <p className="text-sm text-slate-400">
                    {mode === "edit" ? "Editing existing article" : "Creating new article"}
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => handleSave("draft")}
            loading={saving}
            disabled={!form.title}
          >
            <Save className="h-4 w-4" />
            Save as Draft
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave("published")}
            loading={saving}
            disabled={!form.title}
          >
            Publish Article
          </Button>
        </div>
      </div>
    </div>
  );
}
