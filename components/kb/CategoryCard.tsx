import Link from "next/link";
import { FileText } from "lucide-react";
import * as Icons from "lucide-react";
import type { Category } from "@/types";
import { LucideIcon } from "lucide-react";

interface CategoryCardProps {
  category: Category & { articleCount: number };
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const Icon = (Icons[category.icon as keyof typeof Icons] as LucideIcon) ?? FileText;

  return (
    <Link href={`/categories/${category.slug}`} className="group block">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:shadow-md hover:border-brand-300 dark:hover:border-brand-600 transition-all duration-200">
        <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg mb-3 ${category.color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="font-semibold text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
          {category.name}
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
          {category.description}
        </p>
        <span className="text-xs font-medium text-slate-400">
          {category.articleCount} {category.articleCount === 1 ? "article" : "articles"}
        </span>
      </div>
    </Link>
  );
}