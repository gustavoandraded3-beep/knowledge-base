import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Article } from "@/types";
import { formatDistanceToNow } from "date-fns";

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (articles.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
        Related Articles
      </h2>
      <div className="space-y-2">
        {articles.map((article) => (
          <Link key={article.id} href={`/articles/${article.slug}`} className="group flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors truncate">
                {article.title}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-brand-500 shrink-0 ml-3 transition-colors" />
          </Link>
        ))}
      </div>
    </section>
  );
}