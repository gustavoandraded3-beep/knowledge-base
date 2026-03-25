import Link from "next/link";
import { FileText, Tag, ArrowRight } from "lucide-react";
import type { SearchResult } from "@/types";
import Badge from "@/components/ui/Badge";

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

export default function SearchResults({ results, query }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-100 dark:bg-slate-800 mb-4">
          <FileText className="h-7 w-7 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
          No results for &ldquo;{query}&rdquo;
        </h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
          Try different keywords, or browse articles by category.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map(({ article, highlights, matchedIn }) => (
        <Link key={article.id} href={`/articles/${article.slug}`} className="group block">
          <article className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <FileText className="h-4 w-4 text-slate-400 shrink-0" />
                  <h3
                    className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-1"
                    dangerouslySetInnerHTML={{ __html: highlights.title ?? article.title }}
                  />
                </div>

                <p
                  className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: highlights.excerpt ?? article.excerpt }}
                />

                <div className="flex items-center gap-3 mt-3">
                  {matchedIn.includes("tags") && (
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tag className="h-3.5 w-3.5 text-slate-300" />
                      {article.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="default">{tag}</Badge>
                      ))}
                    </div>
                  )}
                  <span className="text-xs text-slate-400 capitalize">{article.category.replace(/-/g, " ")}</span>
                </div>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-brand-500 shrink-0 mt-0.5 transition-colors" />
            </div>
          </article>
        </Link>
      ))}
    </div>
  );
}