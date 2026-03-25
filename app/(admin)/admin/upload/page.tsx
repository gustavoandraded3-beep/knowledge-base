"use client";

import { useState } from "react";
import FileUploader from "@/components/admin/FileUploader";
import ParsePreview from "@/components/admin/ParsePreview";
import ArticleEditor from "@/components/admin/ArticleEditor";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import type { ParsedDocument } from "@/lib/parser";
import type { Category } from "@/types";
import { useRouter } from "next/navigation";
import { CheckCircle, Upload, FileSearch, Edit3 } from "lucide-react";
import { useEffect } from "react";

type Step = "upload" | "parse" | "preview" | "edit" | "done";

const steps = [
  { id: "upload", label: "Upload", icon: Upload },
  { id: "parse", label: "Parse", icon: FileSearch },
  { id: "edit", label: "Edit & Publish", icon: Edit3 },
];

export default function UploadPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("upload");
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedFile, setUploadedFile] = useState<{ path: string; name: string } | null>(null);
  const [parsed, setParsed] = useState<ParsedDocument | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/articles?admin=true")
      .then(() => fetch("/api/categories"))
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);

    // Load categories separately
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(console.error);
  }, []);

  const handleUploadComplete = async (filePath: string, fileName: string) => {
    setUploadedFile({ path: filePath, name: fileName });
    setParseError(null);
    setParsing(true);
    setStep("parse");

    try {
      const res = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath, fileName }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Parsing failed");
      }

      const data = await res.json();
      setParsed(data);
      setStep("preview");
    } catch (err: unknown) {
      setParseError(err instanceof Error ? err.message : "Parsing failed");
      setStep("upload");
    } finally {
      setParsing(false);
    }
  };

  const handleSave = async (data: Partial<unknown>) => {
    const res = await fetch("/api/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error ?? "Save failed");
    }

    setStep("done");
    setTimeout(() => router.push("/admin/articles"), 2000);
  };

  const currentStepIndex = steps.findIndex((s) => s.id === step || (step === "preview" && s.id === "parse"));

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Upload Document</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Upload a PDF or Word document to automatically create a knowledge base article.
        </p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {steps.map((s, i) => {
          const isActive = i === currentStepIndex;
          const isDone = i < currentStepIndex || step === "done";
          return (
            <div key={s.id} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isDone ? "text-green-600 dark:text-green-400" :
                isActive ? "text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20" :
                "text-slate-400"
              }`}>
                {isDone ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <s.icon className="h-4 w-4" />
                )}
                <span className="hidden sm:block">{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div className={`flex-1 h-px ${isDone ? "bg-green-300 dark:bg-green-700" : "bg-slate-200 dark:bg-slate-700"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step content */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-6">
        {step === "upload" && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Select a file to upload</h2>
            {parseError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-4 py-3 text-sm text-red-700 dark:text-red-300">
                {parseError}
              </div>
            )}
            <FileUploader onUploadComplete={handleUploadComplete} />
          </div>
        )}

        {step === "parse" && parsing && (
          <div className="py-12 flex flex-col items-center gap-4">
            <LoadingSpinner size="lg" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Parsing document content…
            </p>
          </div>
        )}

        {step === "preview" && parsed && uploadedFile && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Review Parsed Content</h2>
            <ParsePreview
              result={parsed}
              fileName={uploadedFile.name}
              onProceed={() => setStep("edit")}
            />
          </div>
        )}

        {step === "edit" && parsed && uploadedFile && (
          <div className="space-y-4">
            <h2 className="font-semibold text-slate-900 dark:text-white">Edit Article</h2>
            <ArticleEditor
              parsed={parsed}
              categories={categories}
              filePath={uploadedFile.path}
              fileName={uploadedFile.name}
              onSave={handleSave}
              mode="create"
            />
          </div>
        )}

        {step === "done" && (
          <div className="py-12 flex flex-col items-center gap-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                Article saved successfully!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Redirecting to articles list…
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

