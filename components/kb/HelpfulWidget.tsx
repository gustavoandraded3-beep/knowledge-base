"use client";

import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState } from "react";

export default function HelpfulWidget() {
  const [voted, setVoted] = useState<"yes" | "no" | null>(null);

  if (voted) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5 text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {voted === "yes" ? "🎉 Thanks for the feedback!" : "😔 We'll work on improving this."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-5">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-4 text-center">
        Was this article helpful?
      </p>
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={() => setVoted("yes")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-green-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
        >
          <ThumbsUp className="h-4 w-4" />
          Yes, helpful
        </button>
        <button
          onClick={() => setVoted("no")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:border-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <ThumbsDown className="h-4 w-4" />
          Not really
        </button>
      </div>
    </div>
  );
}