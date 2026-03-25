import Link from "next/link";
import { Calendar, Eye, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Article, Category } from "@/types";
import Badge from "@/components/ui/Badge";

interface ArticleCardProps {
  article: Article;
  category?: Category;
  showExcerpt?: boolean;
}

export default function ArticleCard({ article, category, showExcerpt = true }: ArticleCardProps) {
  return (
    <Link href={`/articles/${article.slug}`} className="group block">
      <article className="h-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-200">
        {category && (
          <div className="mb-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${category.color}`}>
              {category.name}
            </span>
          </div>
        )}

        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-2 mb-2">
          {article.title}
        </h3>

        {showExcerpt && (
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
            {article.excerpt}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" />
              {article.viewCount}
            </span>
          </div>

          {article.tags.length > 0 && (
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3 text-slate-300" />
              <span className="text-xs text-slate-400 truncate max-w-[100px]">
                {article.tags[0]}
              </span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}