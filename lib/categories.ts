import { readCategories } from "./store";
import type { Category } from "@/types";
import { getPublishedArticles } from "./articles";

export function getAllCategories(): Category[] {
  return readCategories();
}

export function getCategoryBySlug(slug: string): Category | null {
  return readCategories().find((c) => c.slug === slug) ?? null;
}

export function getCategoriesWithCounts(): (Category & { articleCount: number })[] {
  const categories = readCategories();
  const articles = getPublishedArticles();

  return categories.map((cat) => ({
    ...cat,
    articleCount: articles.filter((a) => a.category === cat.slug).length,
  }));
}