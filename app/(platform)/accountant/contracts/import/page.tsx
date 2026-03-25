"use client";

import Link from "next/link";
import { useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  Download,
  Upload,
} from "lucide-react";

import { SectionCard } from "@/components/accountant/section-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockImportHistory,
  mockImportValidationPreview,
} from "@/constants/accountant-mock-data";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const importStatusColors: Record<string, string> = {
  Completed: "bg-[#dcfce7] text-[#166534]",
  Failed: "bg-[#fee2e2] text-[#991b1b]",
  PartialSuccess: "bg-[#fef9c3] text-[#854d0e]",
};

export default function ContractImportPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<{ name: string } | null>(null);
  const [validated, setValidated] = useState(false);
  const [imported, setImported] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) {
      setFile(dropped);
      setValidated(false);
      setImported(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setValidated(false);
      setImported(false);
    }
  }

  function handleValidate() {
    setValidated(true);
  }

  function handleImport() {
    setImported(true);
  }

  const validCount = mockImportValidationPreview.filter(
    (r) => r.status === "Valid",
  ).length;
  const errorCount = mockImportValidationPreview.filter(
    (r) => r.status === "Error",
  ).length;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Link
          href="/accountant/contracts"
          className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Contracts
        </Link>
      </div>

      <PageHeader
        title="Import Contracts"
        description="Bulk import student contracts from a spreadsheet file"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Upload Zone */}
          <SectionCard title="Upload File">
            {!file ? (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center transition-colors ${
                  isDragging
                    ? "border-foreground bg-secondary"
                    : "border-border bg-secondary/50"
                }`}
              >
                <Upload className="mb-3 h-10 w-10 text-secondary-foreground" />
                <p className="font-medium">Drop your file here</p>
                <p className="mt-1 text-sm text-secondary-foreground">
                  Supports .xlsx and .csv files
                </p>
                <label className="mt-4 cursor-pointer rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                  Browse File
                  <input
                    type="file"
                    accept=".xlsx,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between rounded-md border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-secondary">
                      <Upload className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-secondary-foreground">
                        Ready to validate
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null);
                      setValidated(false);
                      setImported(false);
                    }}
                    className="text-sm text-secondary-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </div>

                {!validated && (
                  <button
                    onClick={handleValidate}
                    className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                  >
                    Validate File
                  </button>
                )}
              </div>
            )}
          </SectionCard>

          {/* Validation Results */}
          {validated && (
            <SectionCard title="Validation Results">
              <div className="mb-4 flex gap-4">
                <div className="flex items-center gap-2 rounded-md bg-[#dcfce7] px-3 py-1.5">
                  <CheckCircle2 className="h-4 w-4 text-[#16a34a]" />
                  <span className="text-sm font-medium text-[#166534]">
                    {validCount} valid
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-md bg-[#fee2e2] px-3 py-1.5">
                  <AlertCircle className="h-4 w-4 text-[#dc2626]" />
                  <span className="text-sm font-medium text-[#991b1b]">
                    {errorCount} errors
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="grid min-w-[600px] grid-cols-[50px_1fr_120px_1fr_100px_1fr] gap-x-4 border-b border-border px-3 pb-2 text-xs font-medium text-secondary-foreground">
                  <span>Row</span>
                  <span>Student</span>
                  <span>ID</span>
                  <span>Program</span>
                  <span>Amount</span>
                  <span>Status / Error</span>
                </div>
                <div className="min-w-[600px] divide-y divide-border">
                  {mockImportValidationPreview.map((row) => (
                    <div
                      key={row.rowNumber}
                      className={`grid grid-cols-[50px_1fr_120px_1fr_100px_1fr] items-center gap-x-4 px-3 py-2.5 ${
                        row.status === "Error" ? "bg-[#fef2f2]" : ""
                      }`}
                    >
                      <span className="text-sm text-secondary-foreground">
                        {row.rowNumber}
                      </span>
                      <span className="text-sm">{row.studentName}</span>
                      <span className="text-sm text-secondary-foreground">
                        {row.studentId || "—"}
                      </span>
                      <span className="text-sm">{row.program}</span>
                      <span className="text-sm">${row.amount}</span>
                      <span>
                        {row.status === "Valid" ? (
                          <span className="flex items-center gap-1 text-xs text-[#166534]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Valid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-[#dc2626]">
                            <AlertCircle className="h-3.5 w-3.5" />
                            {row.errorDetails}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {!imported ? (
                <button
                  onClick={handleImport}
                  disabled={validCount === 0}
                  className="mt-4 w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Import {validCount} valid contracts
                </button>
              ) : (
                <div className="mt-4 flex items-center gap-2 rounded-md bg-[#dcfce7] p-3">
                  <CheckCircle2 className="h-5 w-5 text-[#16a34a]" />
                  <span className="text-sm font-medium text-[#166534]">
                    Successfully imported {validCount} contracts
                  </span>
                </div>
              )}
            </SectionCard>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Template Download */}
          <SectionCard title="Template">
            <p className="mb-3 text-sm text-secondary-foreground">
              Download the official import template to ensure your data is
              formatted correctly.
            </p>
            <button className="flex w-full items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-secondary">
              <Download className="h-4 w-4" />
              Download Template (.xlsx)
            </button>
            <div className="mt-3 rounded-md bg-secondary p-3">
              <p className="mb-1 text-xs font-medium">Required columns:</p>
              <ul className="space-y-0.5 text-xs text-secondary-foreground">
                <li>• student_id</li>
                <li>• student_name</li>
                <li>• student_email</li>
                <li>• program</li>
                <li>• contract_type (Full/Partial/Grant)</li>
                <li>• total_amount</li>
                <li>• start_date (YYYY-MM-DD)</li>
                <li>• end_date (YYYY-MM-DD)</li>
                <li>• installment_count</li>
              </ul>
            </div>
          </SectionCard>

          {/* Import History */}
          <SectionCard title="Recent Imports">
            <div className="space-y-3">
              {mockImportHistory.map((record) => (
                <div
                  key={record.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="truncate text-sm font-medium">
                      {record.fileName}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${importStatusColors[record.status]}`}
                    >
                      {record.status === "PartialSuccess"
                        ? "Partial"
                        : record.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    {formatDate(record.importedAt)} by {record.importedBy}
                  </p>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {record.validRows}/{record.totalRows} rows imported
                    {record.errorRows > 0 && `, ${record.errorRows} errors`}
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
