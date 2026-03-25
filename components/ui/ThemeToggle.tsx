"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-9 w-9" />;

  const options = [
    { value: "light", icon: Sun },
    { value: "dark", icon: Moon },
    { value: "system", icon: Monitor },
  ];

  const current = options.find((o) => o.value === theme) ?? options[2];
  const Icon = current.icon;

  return (
    <div className="relative group">
      <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400">
        <Icon className="h-5 w-5" />
      </button>
      <div className="absolute right-0 top-10 hidden group-hover:flex flex-col bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg overflow-hidden z-50">
        {options.map(({ value, icon: OptionIcon }) => (
          <button
            key={value}
            onClick={() => setTheme(value)}
            className={`flex items-center gap-2 px-4 py-2 text-sm capitalize hover:bg-slate-50 dark:hover:bg-slate-700 ${theme === value ? "text-brand-600 font-medium" : "text-slate-600 dark:text-slate-300"}`}
          >
            <OptionIcon className="h-4 w-4" />
            {value}
          </button>
        ))}
      </div>
    </div>
  );
}