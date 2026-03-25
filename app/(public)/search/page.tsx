import { searchArticles } from "@/lib/search";
import SearchBar from "@/components/kb/SearchBar";
import SearchResults from "@/components/kb/SearchResults";
import Breadcrumbs from "@/components/kb/Breadcrumbs";
import { Suspense } from "react";
import type { Metadata } from "next";

interface Props { searchParams: { q?: string } }

export function generateMetadata({ searchParams }: Props): Metadata {
  return { title: searchParams.q ? `Search: ${searchParams.q}` : "Search" };
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q ?? "";
  const results = query ? searchArticles(query) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <Breadcrumbs crumbs={[{ label: "Search" }]} />

      <div className="mt-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
          {query ? `Results for "${query}"` : "Search"}
        </h1>
        <Suspense>
          <SearchBar autoFocus={!query} size="lg" />
        </Suspense>
      </div>

      {query && (
        <div>
          <p className="text-sm text-slate-500 mb-4">
            {results.length === 0
              ? "No results found"
              : `${results.length} result${results.length === 1 ? "" : "s"}`}
          </p>
          <SearchResults results={results} query={query} />
        </div>
      )}
    </div>
  );
}