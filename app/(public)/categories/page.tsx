import { getCategoriesWithCounts } from "@/lib/categories";
import CategoryCard from "@/components/kb/CategoryCard";
import Breadcrumbs from "@/components/kb/Breadcrumbs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Categories" };

export default function CategoriesPage() {
  const categories = getCategoriesWithCounts();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs crumbs={[{ label: "Categories" }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">All Categories</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Browse all {categories.length} categories across the knowledge base.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <CategoryCard key={cat.id} category={cat} />
        ))}
      </div>
    </div>
  );
}