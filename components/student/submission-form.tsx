"use client";

import type { Assignment } from "@/types/student";
import { useState, useRef } from "react";
import { FileText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

type SubmissionFormProps = {
  assignment: Assignment;
  onSubmit: (data: { text: string; files: File[] }) => void;
  disabled?: boolean;
};

export function SubmissionForm({ assignment, onSubmit, disabled }: SubmissionFormProps) {
  const [text, setText] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files ?? []);
    setFiles((prev) => [...prev, ...newFiles]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    onSubmit({ text, files });
  };

  if (disabled) {
    return (
      <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Submissions are currently disabled due to account restrictions. Resolve outstanding issues to submit assignments.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium">Written Response (optional)</label>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your answer or notes here..."
          className="min-h-32"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium">File Upload</label>
        <div
          onClick={() => fileInputRef.current?.click()}
          className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:bg-secondary"
        >
          <Upload className="mb-2 h-8 w-8 text-secondary-foreground" />
          <p className="text-sm font-medium">Click to upload files</p>
          <p className="mt-0.5 text-xs text-secondary-foreground">PDF, DOCX, ZIP, or image files</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-secondary-foreground" />
                <span className="text-sm">{file.name}</span>
                <span className="text-xs text-secondary-foreground">
                  ({(file.size / 1024 / 1024).toFixed(2)} MB)
                </span>
              </div>
              <button onClick={() => removeFile(i)} className="text-secondary-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {assignment.maxAttempts !== undefined && (
        <p className="text-xs text-secondary-foreground">
          Attempt {(assignment.currentAttempt ?? 0) + 1} of {assignment.maxAttempts}
        </p>
      )}
      {assignment.latePolicy && (
        <p className="text-xs text-secondary-foreground">Late policy: {assignment.latePolicy}</p>
      )}

      <Button onClick={handleSubmit} disabled={!text.trim() && files.length === 0}>
        Submit Assignment
      </Button>
    </div>
  );
}
