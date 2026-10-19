"use client";

import React, { useState, useRef } from "react";
import { Upload, FileText, Image as ImageIcon, CheckCircle, X, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect?: (file: { name: string; size: number; type: string } | null, rawFile?: File | null) => void;
  maxSizeBytes?: number;
  allowedTypes?: string[];
  label?: string;
  helperText?: string;
}

const DEFAULT_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

export function FileUpload({
  onFileSelect,
  maxSizeBytes = 10 * 1024 * 1024, // 10MB
  allowedTypes = DEFAULT_TYPES,
  label = "Upload Media Kit or Portfolio",
  helperText = "PDF, JPG, PNG or WEBP (Max 10MB)",
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<{ name: string; size: number; type: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const validateAndSetFile = (file: File) => {
    setError(null);
    if (!allowedTypes.includes(file.type)) {
      setError("Invalid format. Please upload a PDF or image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > maxSizeBytes) {
      setError(`File is too large (${formatSize(file.size)}). Max allowed is ${formatSize(maxSizeBytes)}.`);
      return;
    }
    const info = { name: file.name, size: file.size, type: file.type };
    setSelectedFile(info);
    onFileSelect?.(info, file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setIsDragging(true);
    else if (e.type === "dragleave") setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
    onFileSelect?.(null, null);
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
        <label className="font-body text-xs tracking-wider uppercase text-ivory/80 font-medium">{label}</label>
        <span className="text-xs text-stone">{helperText}</span>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={allowedTypes.join(",")}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndSetFile(e.target.files[0]);
          }
        }}
        className="hidden"
        id="media-kit-upload"
      />

      {selectedFile ? (
        <div className="border border-gold/30 bg-plum/50 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
              {selectedFile.type === "application/pdf" ? <FileText size={20} /> : <ImageIcon size={20} />}
            </div>
            <div className="min-w-0">
              <p className="font-body text-xs sm:text-sm text-ivory font-medium truncate max-w-[200px] sm:max-w-xs">
                {selectedFile.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-stone">
                <span>{formatSize(selectedFile.size)}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle size={11} /> Attached
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="w-11 h-11 flex items-center justify-center text-stone hover:text-rose-400 hover:bg-obsidian/60 rounded-lg transition-colors shrink-0"
            aria-label="Remove uploaded file"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              inputRef.current?.click();
            }
          }}
          className={cn(
            "border border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all min-h-[110px]",
            "flex flex-col items-center justify-center gap-2.5",
            isDragging
              ? "border-gold bg-gold/10 scale-[0.99]"
              : "border-gold/30 hover:border-gold/60 bg-plum/20 hover:bg-plum/30",
            error && "border-rose-500/80 bg-rose-950/20"
          )}
          role="button"
          aria-label="Upload file"
        >
          <div className="w-11 h-11 rounded-full bg-gold/10 text-gold flex items-center justify-center shrink-0">
            <Upload size={20} />
          </div>
          <div>
            <p className="font-body text-xs sm:text-sm text-ivory font-medium">
              <span className="text-gold underline underline-offset-4">Click to browse</span> or drag & drop file
            </p>
            <p className="font-body text-[11px] text-stone mt-1">PDF decks, one-pagers, or screenshots (Max 10MB)</p>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-rose-400 mt-2 flex items-center gap-1.5">
          <AlertCircle size={13} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
