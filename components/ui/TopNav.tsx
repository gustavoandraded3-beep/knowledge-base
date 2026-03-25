"use client";

import Link from "next/link";
import { BookOpen, Search, Settings } from "lucide-react";
import ThemeToggle from "./ThemeToggle";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TopNav() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-slate-900 dark:text-white shrink-0">
          <div className="h-7 w-7 rounded-lg bg-brand-600 flex items-center justify-center">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <span className="hidden sm:block">InternalKB</span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search articles…"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 border-transparent focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:bg-white dark:focus:bg-slate-900 text-sm outline-none transition-all"
            />
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <Link href="/categories" className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            Categories
          </Link>
          <Link href="/admin" className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5">
            <Settings className="h-4 w-4" />
            Admin
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}