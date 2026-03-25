"use client";

import { useCallback, useState } from "react";
import { Upload, File, X, CheckCircle, AlertCircle } from "lucide-react";
import { clsx } from "clsx";
import Button from "@/components/ui/Button";

interface UploadedFile {
  file: File;
  status: "pending" | "uploading" | "done" | "error";
  progress: number;
  error?: string;
  result?: { path: string; name: string };
}

interface FileUploaderProps {
  onUploadComplete: (filePath: string, fileName: string) => void;
}

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];
const ALLOWED_EXTS = [".pdf", ".doc", ".docx", ".txt"];
const MAX_SIZE_MB = 20;

export default function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);

  const validateFile = (file: File): string | null => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
      return `Unsupported file type. Allowed: ${ALLOWED_EXTS.join(", ")}`;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File is too large. Maximum size is ${MAX_SIZE_MB}MB.`;
    }
    return null;
  };

  const addFiles = (incoming: FileList | File[]) => {
    const newFiles: UploadedFile[] = Array.from(incoming).map((file) => ({
      file,
      status: "pending",
      progress: 0,
      error: validateFile(file) ?? undefined,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const uploadFile = async (idx: number) => {
    const item = files[idx];
    if (!item || item.error) return;

    setFiles((prev) =>
      prev.map((f, i) => (i === idx ? { ...f, status: "uploading", progress: 10 } : f))
    );

    try {
      const formData = new FormData();
      formData.append("file", item.file);

      // Simulate progress increments
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f, i) =>
            i === idx && f.progress < 85 ? { ...f, progress: f.progress + 15 } : f
          )
        );
      }, 300);

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      clearInterval(progressInterval);

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Upload failed");
      }

      const data = await res.json();
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx ? { ...f, status: "done", progress: 100, result: data } : f
        )
      );
      onUploadComplete(data.path, data.name);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setFiles((prev) =>
        prev.map((f, i) =>
          i === idx ? { ...f, status: "error", error: message } : f
        )
      );
    }
  };

  const uploadAll = () => {
    files.forEach((f, i) => {
      if (f.status === "pending" && !f.error) uploadFile(i);
    });
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    addFiles(e.dataTransfer.files);
  }, []);

  const pendingCount = files.filter((f) => f.status === "pending" && !f.error).length;

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDrop={onDrop}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={clsx(
          "relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-200 cursor-pointer",
          dragging
            ? "border-brand-500 bg-brand-50 dark:bg-brand-900/10"
            : "border-slate-300 dark:border-slate-700 hover:border-brand-400 dark:hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50"
        )}
        onClick={() => document.getElementById("file-input")?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt"
          className="hidden"
          onChange={(e) => e.target.files && addFiles(e.target.files)}
        />
        <div className="flex flex-col items-center gap-3">
          <div className={clsx("h-14 w-14 rounded-full flex items-center justify-center", dragging ? "bg-brand-100 dark:bg-brand-900/30" : "bg-slate-100 dark:bg-slate-800")}>
            <Upload className={clsx("h-6 w-6", dragging ? "text-brand-600" : "text-slate-400")} />
          </div>
          <div>
            <p className="font-medium text-slate-700 dark:text-slate-300">
              Drop files here, or <span className="text-brand-600">click to browse</span>
            </p>
            <p className="text-sm text-slate-400 mt-1">
              PDF, DOC, DOCX, TXT — max {MAX_SIZE_MB}MB each
            </p>
          </div>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
              <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                <File className="h-4 w-4 text-slate-500" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {item.file.name}
                </p>
                <p className="text-xs text-slate-400">
                  {(item.file.size / 1024 / 1024).toFixed(2)} MB
                </p>

                {item.status === "uploading" && (
                  <div className="mt-1.5 h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-brand-500 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}

                {item.error && (
                  <p className="text-xs text-red-500 mt-0.5">{item.error}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {item.status === "done" && <CheckCircle className="h-5 w-5 text-green-500" />}
                {item.status === "error" && <AlertCircle className="h-5 w-5 text-red-500" />}
                {item.status === "pending" && !item.error && (
                  <Button size="sm" variant="outline" onClick={() => uploadFile(idx)}>
                    Upload
                  </Button>
                )}
                <button
                  onClick={() => removeFile(idx)}
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {pendingCount > 1 && (
            <Button onClick={uploadAll} className="w-full mt-2">
              Upload All ({pendingCount} files)
            </Button>
          )}
        </div>
      )}
    </div>
  );
}