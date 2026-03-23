"use client";

import { useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { DocumentCard } from "@/components/applicant/document-card";
import { FileDropzone } from "@/components/applicant/file-dropzone";
import { Progress } from "@/components/ui/progress";
import { mockDocuments } from "@/constants/applicant-mock-data";
import type { ApplicantDocument } from "@/types/applicant";

export default function ApplicantDocumentsPage() {
  const [documents, setDocuments] = useState<ApplicantDocument[]>(mockDocuments);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeDropzoneId, setActiveDropzoneId] = useState<string | null>(null);

  const simulateUpload = useCallback(
    (docId: string, file: File) => {
      setUploadingId(docId);
      setUploadProgress(0);
      setActiveDropzoneId(null);

      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 30 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setDocuments((prev) =>
            prev.map((d) =>
              d.id === docId
                ? {
                    ...d,
                    status: "uploaded" as const,
                    fileName: file.name,
                    fileSize: file.size,
                    uploadedAt: new Date().toISOString(),
                    rejectionReason: undefined,
                  }
                : d,
            ),
          );
          setUploadingId(null);
        }
        setUploadProgress(Math.min(progress, 100));
      }, 300);
    },
    [],
  );

  const requiredDocs = documents.filter((d) => d.required);
  const uploadedCount = documents.filter(
    (d) => d.status !== "pending",
  ).length;
  const approvedCount = documents.filter(
    (d) => d.status === "approved",
  ).length;
  const rejectedDocs = documents.filter((d) => d.status === "rejected");

  return (
    <div>
      <PageHeader
        title="Documents"
        description="Upload the required documents for your admission"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Required Documents</p>
          <p className="mt-1 text-2xl font-bold">{requiredDocs.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Uploaded</p>
          <p className="mt-1 text-2xl font-bold">{uploadedCount}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-5">
          <p className="text-sm text-secondary-foreground">Approved</p>
          <p className="mt-1 text-2xl font-bold">{approvedCount}</p>
        </div>
      </div>

      {/* Rejection alert */}
      {rejectedDocs.length > 0 && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-medium text-red-800">
            {rejectedDocs.length} document(s) rejected
          </p>
          <p className="mt-1 text-sm text-red-700">
            Please address the issues and re-upload the documents.
          </p>
        </div>
      )}

      {/* Upload progress */}
      {uploadingId && (
        <div className="mb-6 rounded-lg border border-border bg-background p-4">
          <p className="mb-2 text-sm font-medium">Uploading file...</p>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Document list */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {documents.map((doc) => (
          <div key={doc.id}>
            <DocumentCard
              document={doc}
              onUpload={() => setActiveDropzoneId(doc.id)}
              onReupload={() => setActiveDropzoneId(doc.id)}
            />
            {activeDropzoneId === doc.id && (
              <div className="mt-2">
                <FileDropzone
                  onFileSelect={(file) => simulateUpload(doc.id, file)}
                  disabled={uploadingId !== null}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
