"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ApplicantDocument } from "@/types/applicant";
import { AlertCircle, File, RefreshCw, Upload } from "lucide-react";
import { StatusBadge } from "./status-badge";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function DocumentCard({
  document,
  onUpload,
  onReupload,
  className,
}: {
  document: ApplicantDocument;
  onUpload?: () => void;
  onReupload?: () => void;
  className?: string;
}) {
  const isPending = document.status === "pending";
  const isRejected = document.status === "rejected";

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-background p-4",
        isRejected && "border-red-200",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
              isPending ? "bg-secondary" : "bg-blue-50",
            )}
          >
            <File
              className={cn(
                "h-5 w-5",
                isPending ? "text-secondary-foreground" : "text-blue-600",
              )}
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">{document.name}</p>
              {document.required && (
                <span className="text-xs text-red-500">*</span>
              )}
            </div>
            {document.fileName && (
              <p className="mt-0.5 text-xs text-secondary-foreground">
                {document.fileName}
                {document.fileSize
                  ? ` — ${formatFileSize(document.fileSize)}`
                  : ""}
              </p>
            )}
          </div>
        </div>
        <StatusBadge status={document.status} />
      </div>

      {isRejected && document.rejectionReason && (
        <div className="mt-3 flex gap-2 rounded-md bg-red-50 p-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
          <p className="text-xs text-red-700">{document.rejectionReason}</p>
        </div>
      )}

      {(isPending || isRejected) && (
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={isRejected ? onReupload : onUpload}
            className="w-full"
          >
            {isRejected ? (
              <>
                <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                Re-upload
              </>
            ) : (
              <>
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Upload
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
