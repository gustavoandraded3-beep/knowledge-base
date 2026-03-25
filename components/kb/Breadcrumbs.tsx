import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
      <Link href="/" className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition-colors">
        <Home className="h-3.5 w-3.5" />
        <span>Home</span>
      </Link>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          <ChevronRight className="h-3.5 w-3.5" />
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-slate-900 dark:hover:text-white transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-slate-800 dark:text-slate-200 font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}