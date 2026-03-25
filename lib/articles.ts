import { readArticles, writeArticles, readCategories } from "./store";
import type { Article, Category } from "@/types";
import { slugify } from "@/utils/slugify";
import { v4 as uuidv4 } from "uuid";

export function getAllArticles(): Article[] {
  return readArticles();
}

export function getPublishedArticles(): Article[] {
  return readArticles().filter((a) => a.status === "published");
}

export function getArticleById(id: string): Article | null {
  return readArticles().find((a) => a.id === id) ?? null;
}

export function getArticleBySlug(slug: string): Article | null {
  return readArticles().find((a) => a.slug === slug) ?? null;
}

export function getArticlesByCategory(categorySlug: string): Article[] {
  return readArticles().filter(
    (a) => a.category === categorySlug && a.status === "published"
  );
}

export function getRecentArticles(limit = 5): Article[] {
  return getPublishedArticles()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export function getRelatedArticles(article: Article, limit = 4): Article[] {
  const all = getPublishedArticles().filter((a) => a.id !== article.id);
  const scored = all.map((a) => {
    let score = 0;
    if (a.category === article.category) score += 3;
    article.tags.forEach((tag) => {
      if (a.tags.includes(tag)) score += 1;
    });
    return { article: a, score };
  });
  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.article);
}

export function createArticle(
  data: Omit<Article, "id" | "createdAt" | "updatedAt" | "viewCount">
): Article {
  const articles = readArticles();
  const now = new Date().toISOString();

  // Ensure unique slug
  let slug = data.slug || slugify(data.title);
  let counter = 1;
  while (articles.some((a) => a.slug === slug)) {
    slug = `${slugify(data.title)}-${counter++}`;
  }

  const article: Article = {
    ...data,
    id: uuidv4(),
    slug,
    viewCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  articles.push(article);
  writeArticles(articles);
  return article;
}

export function updateArticle(
  id: string,
  data: Partial<Omit<Article, "id" | "createdAt">>
): Article | null {
  const articles = readArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  articles[idx] = {
    ...articles[idx],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  writeArticles(articles);
  return articles[idx];
}

export function deleteArticle(id: string): boolean {
  const articles = readArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  writeArticles(filtered);
  return true;
}

export function incrementViewCount(id: string): void {
  const articles = readArticles();
  const idx = articles.findIndex((a) => a.id === id);
  if (idx !== -1) {
    articles[idx].viewCount += 1;
    writeArticles(articles);
  }
}

export function getArticlesWithCategoryCounts(): { categories: Category[]; counts: Record<string, number> } {
  const articles = getPublishedArticles();
  const categories = readCategories();
  const counts: Record<string, number> = {};
  articles.forEach((a) => {
    counts[a.category] = (counts[a.category] ?? 0) + 1;
  });
  return { categories, counts };
}
