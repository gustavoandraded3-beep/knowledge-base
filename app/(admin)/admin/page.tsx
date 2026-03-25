import { getAllArticles } from "@/lib/articles";
import { getCategoriesWithCounts } from "@/lib/categories";
import Link from "next/link";
import { FileText, Upload, Eye, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import Badge from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

export default function AdminDashboard() {
  const articles = getAllArticles();
  const categories = getCategoriesWithCounts();

  const published = articles.filter((a) => a.status === "published");
  const drafts = articles.filter((a) => a.status === "draft");
  const totalViews = articles.reduce((sum, a) => sum + a.viewCount, 0);
  const recent = [...articles]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Articles", value: articles.length, icon: FileText, color: "text-blue-600 bg-blue-100 dark:bg-blue-900/20" },
    { label: "Published", value: published.length, icon: BookOpen, color: "text-green-600 bg-green-100 dark:bg-green-900/20" },
    { label: "Drafts", value: drafts.length, icon: FileText, color: "text-amber-600 bg-amber-100 dark:bg-amber-900/20" },
    { label: "Total Views", value: totalViews, icon: Eye, color: "text-purple-600 bg-purple-100 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Overview of your knowledge base content.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
            <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg mb-3 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/admin/upload" className="group flex items-center gap-4 bg-brand-600 hover:bg-brand-700 rounded-xl p-5 transition-colors">
          <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
            <Upload className="h-5 w-5 text-white" />
          </div>
          <div className="text-white">
            <p className="font-semibold">Upload Document</p>
            <p className="text-sm text-brand-200">Parse PDF or Word files into articles</p>
          </div>
          <ArrowRight className="h-5 w-5 text-white/60 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>

        <Link href="/admin/articles" className="group flex items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-5 hover:border-brand-300 dark:hover:border-brand-600 transition-colors">
          <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
            <FileText className="h-5 w-5 text-slate-600 dark:text-slate-300" />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-white">Manage Articles</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Edit, publish, or delete articles</p>
          </div>
          <ArrowRight className="h-5 w-5 text-slate-300 ml-auto group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-slate-400" />
            <h2 className="font-semibold text-slate-900 dark:text-white text-sm">Recent Activity</h2>
          </div>
          <Link href="/admin/articles" className="text-xs text-brand-600 dark:text-brand-400 hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {recent.length === 0 ? (
            <p className="px-5 py-8 text-center text-sm text-slate-400">No articles yet.</p>
          ) : (
            recent.map((article) => (
              <div key={article.id} className="flex items-center justify-between px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                    {article.title}
                  </p>
                  <p className="text-xs text-slate-400">
                    {formatDistanceToNow(new Date(article.updatedAt), { addSuffix: true })}
                  </p>
                </div>
                <div className="flex items-center gap-3 ml-4">
                  <Badge variant={article.status === "published" ? "success" : "warning"}>
                    {article.status}
                  </Badge>
                  <Link
                    href={`/admin/articles/${article.id}/edit`}
                    className="text-xs text-slate-400 hover:text-brand-600 transition-colors"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}