"use client";

import { useEffect, useState } from "react";
import { List } from "lucide-react";
import type { Heading } from "@/types";
import { clsx } from "clsx";

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24">
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
        <List className="h-3.5 w-3.5" />
        On this page
      </div>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className={clsx(
                "block text-sm py-1 pr-2 transition-colors duration-150 hover:text-brand-600 dark:hover:text-brand-400 border-l-2",
                heading.level === 2 ? "pl-3" : heading.level === 3 ? "pl-6" : "pl-9",
                activeId === heading.id
                  ? "border-brand-500 text-brand-600 dark:text-brand-400 font-medium"
                  : "border-transparent text-slate-500 dark:text-slate-400"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}