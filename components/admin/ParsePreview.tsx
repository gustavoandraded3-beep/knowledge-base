"use client";

import { useState } from "react";
import type { ParsedDocument } from "@/lib/parser";
import Button from "@/components/ui/Button";
import { Eye, Code } from "lucide-react";

interface ParsePreviewProps {
  result: ParsedDocument;
  fileName: string;
  onProceed: (data: ParsedDocument) => void;
}

export default function ParsePreview({ result, fileName, onProceed }: ParsePreviewProps) {
  const [tab, setTab] = useState<"preview" | "html">("preview");

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
          <div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{fileName}</p>
            <p className="text-xs text-slate-400">{result.wordCount} words · {result.fileType.toUpperCase()}</p>
          </div>
          <div className="flex items-center gap-1 bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
            {(["preview", "html"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  tab === t
                    ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                }`}
              >
                {t === "preview" ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="max-h-96 overflow-y-auto p-6">
          {tab === "preview" ? (
            <div
              className="kb-content text-sm"
              dangerouslySetInnerHTML={{ __html: result.content }}
            />
          ) : (
            <pre className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono bg-slate-50 dark:bg-slate-900 rounded-lg p-4 overflow-x-auto">
              {result.content}
            </pre>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">
          Parsed title: <strong className="text-slate-700 dark:text-slate-300">{result.title}</strong>
        </p>
        <Button onClick={() => onProceed(result)}>
          Continue to Editor →
        </Button>
      </div>
    </div>
  );
}