"use client";

import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const ACCEPTED_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export function FileDropzone({
  onFileSelect,
  disabled,
  className,
}: {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
  className?: string;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = useCallback(
    (file: File) => {
      setError(null);
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Accepted formats: PDF, JPEG, PNG, WebP");
        return;
      }
      if (file.size > MAX_SIZE) {
        setError("Maximum file size is 10 MB");
        return;
      }
      onFileSelect(file);
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      const file = e.dataTransfer.files[0];
      if (file) validateAndSelect(file);
    },
    [disabled, validateAndSelect],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) validateAndSelect(file);
      // Reset input so the same file can be re-selected
      e.target.value = "";
    },
    [validateAndSelect],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
        isDragging
          ? "border-foreground bg-secondary"
          : "border-border hover:border-foreground/40 hover:bg-secondary/50",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <Upload className="mb-2 h-8 w-8 text-secondary-foreground" />
      <p className="text-sm font-medium">
        Drag and drop a file here or click to browse
      </p>
      <p className="mt-1 text-xs text-secondary-foreground">
        PDF, JPEG, PNG, WebP — up to 10 MB
      </p>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png,.webp"
        onChange={handleChange}
        className="hidden"
      />
    </div>
  );
}
