import type { Article, SearchResult } from "@/types";
import { getPublishedArticles } from "./articles";
import { getExcerptWithHighlight, highlightText } from "@/utils/highlight";

export function searchArticles(query: string): SearchResult[] {
  if (!query.trim()) return [];

  const articles = getPublishedArticles();
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  const results: SearchResult[] = [];

  for (const article of articles) {
    const titleLower = article.title.toLowerCase();
    const contentPlain = article.content.replace(/<[^>]+>/g, " ");
    const contentLower = contentPlain.toLowerCase();
    const tagsLower = article.tags.map((t) => t.toLowerCase());

    let score = 0;
    const matchedIn: SearchResult["matchedIn"] = [];

    for (const term of terms) {
      const titleMatches = (titleLower.match(new RegExp(term, "g")) ?? []).length;
      const contentMatches = (contentLower.match(new RegExp(term, "g")) ?? []).length;
      const tagMatches = tagsLower.filter((t) => t.includes(term)).length;

      if (titleMatches > 0) {
        score += titleMatches * 10;
        if (!matchedIn.includes("title")) matchedIn.push("title");
      }
      if (contentMatches > 0) {
        score += contentMatches * 1;
        if (!matchedIn.includes("content")) matchedIn.push("content");
      }
      if (tagMatches > 0) {
        score += tagMatches * 5;
        if (!matchedIn.includes("tags")) matchedIn.push("tags");
      }
    }

    if (score > 0) {
      results.push({
        article,
        score,
        matchedIn,
        highlights: {
          title: highlightText(article.title, query),
          excerpt: getExcerptWithHighlight(article.content, query),
        },
      });
    }
  }

  return results.sort((a, b) => b.score - a.score);
}