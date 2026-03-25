"use client";

import { useState } from "react";
import { AlertCircle, CheckCircle, Download, FileText, Upload } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/platform/page-header";

const MOCK_PREVIEW_ROWS = [
  {
    row: 1,
    name: "Davron Qodirov",
    email: "d.qodirov@uou.edu",
    phone: "+998 90 111 2233",
    department: "Computer Science",
    specialization: "Python, AI",
    error: null,
  },
  {
    row: 2,
    name: "Lola Tosheva",
    email: "l.tosheva@uou.edu",
    phone: "+998 91 222 3344",
    department: "Business",
    specialization: "Management",
    error: null,
  },
  {
    row: 3,
    name: "Kamol Ergashev",
    email: "k.ergashev@uou.edu",
    phone: "+998 93 333 4455",
    department: "Physics",
    specialization: "Thermodynamics",
    error: null,
  },
  {
    row: 4,
    name: "Zulfiya Nazarova",
    email: "z.nazarova@uou.edu", // duplicate email simulation
    phone: "+998 94 444 5566",
    department: "",
    specialization: "Mathematics",
    error: "Department is required",
  },
  {
    row: 5,
    name: "",
    email: "no-name@uou.edu",
    phone: "+998 95 555 6677",
    department: "English",
    specialization: "IELTS",
    error: "Full name is required",
  },
];

type ImportState = "idle" | "preview" | "importing" | "done";

export default function ImportTeachersPage() {
  const [importState, setImportState] = useState<ImportState>("idle");
  const [fileName, setFileName] = useState("");

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault();
    simulateFileLoad("teachers_import.csv");
  }

  function handleFileSelect() {
    simulateFileLoad("teachers_import.csv");
  }

  function simulateFileLoad(name: string) {
    setFileName(name);
    setImportState("preview");
  }

  function handleImport() {
    setImportState("importing");
    setTimeout(() => setImportState("done"), 1200);
  }

  const validRows = MOCK_PREVIEW_ROWS.filter((r) => !r.error);
  const errorRows = MOCK_PREVIEW_ROWS.filter((r) => r.error);

  return (
    <div>
      <PageHeader
        title="Import Teachers"
        description="Bulk import teacher profiles from a CSV or Excel file."
      />

      {/* Template download */}
      <div className="mb-6 flex items-center justify-between rounded-lg border border-border bg-background px-5 py-4">
        <div>
          <p className="text-sm font-medium">Download Import Template</p>
          <p className="text-xs text-secondary-foreground">
            Use this template to prepare your data. All imported teachers will be
            created with Pending status.
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm hover:bg-secondary">
          <Download className="h-4 w-4" />
          Download Template
        </button>
      </div>

      {importState === "idle" && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleFileDrop}
          className="rounded-lg border-2 border-dashed border-border bg-background p-16 text-center"
        >
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-secondary p-4">
              <Upload className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <p className="mb-2 font-semibold">Drop your file here</p>
          <p className="mb-4 text-sm text-secondary-foreground">
            Supports CSV and Excel (.xlsx) files
          </p>
          <button
            onClick={handleFileSelect}
            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            Browse Files
          </button>
        </div>
      )}

      {(importState === "preview" || importState === "importing") && (
        <>
          {/* File info */}
          <div className="mb-4 flex items-center gap-3 rounded-md border border-border bg-background px-4 py-3">
            <FileText className="h-5 w-5 text-secondary-foreground" />
            <span className="text-sm font-medium">{fileName}</span>
            <span className="text-xs text-secondary-foreground">
              {MOCK_PREVIEW_ROWS.length} rows detected
            </span>
          </div>

          {/* Summary */}
          <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-background px-4 py-3">
              <p className="text-2xl font-bold">{MOCK_PREVIEW_ROWS.length}</p>
              <p className="text-xs text-secondary-foreground">Total rows</p>
            </div>
            <div className="rounded-md border border-[#dcfce7] bg-[#f0fdf4] px-4 py-3">
              <p className="text-2xl font-bold text-[#166534]">{validRows.length}</p>
              <p className="text-xs text-[#166534]">Valid rows</p>
            </div>
            <div className="rounded-md border border-[#fee2e2] bg-[#fff5f5] px-4 py-3">
              <p className="text-2xl font-bold text-[#991b1b]">{errorRows.length}</p>
              <p className="text-xs text-[#991b1b]">Rows with errors</p>
            </div>
          </div>

          {/* Preview table */}
          <div className="mb-4 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary">
                  <th className="px-3 py-2.5 text-left font-medium">#</th>
                  <th className="px-3 py-2.5 text-left font-medium">Name</th>
                  <th className="px-3 py-2.5 text-left font-medium">Email</th>
                  <th className="px-3 py-2.5 text-left font-medium">Department</th>
                  <th className="px-3 py-2.5 text-left font-medium">Specialization</th>
                  <th className="px-3 py-2.5 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_PREVIEW_ROWS.map((row) => (
                  <tr
                    key={row.row}
                    className={`border-b last:border-b-0 ${
                      row.error ? "bg-[#fff5f5]" : ""
                    }`}
                  >
                    <td className="px-3 py-2.5 text-secondary-foreground">{row.row}</td>
                    <td className="px-3 py-2.5">
                      {row.name || (
                        <span className="italic text-[#ef4444]">missing</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-secondary-foreground">{row.email}</td>
                    <td className="px-3 py-2.5">
                      {row.department || (
                        <span className="italic text-[#ef4444]">missing</span>
                      )}
                    </td>
                    <td className="px-3 py-2.5 text-secondary-foreground">
                      {row.specialization}
                    </td>
                    <td className="px-3 py-2.5">
                      {row.error ? (
                        <span className="flex items-center gap-1 text-xs text-[#dc2626]">
                          <AlertCircle className="h-3.5 w-3.5" />
                          {row.error}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-[#166534]">
                          <CheckCircle className="h-3.5 w-3.5" />
                          OK
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {errorRows.length > 0 && (
            <div className="mb-4 rounded-md border border-[#fef3c7] bg-[#fffbeb] px-4 py-3">
              <p className="mb-1 text-sm font-medium text-[#92400e]">
                {errorRows.length} rows have errors and will be skipped
              </p>
              <ul className="space-y-0.5">
                {errorRows.map((r) => (
                  <li key={r.row} className="text-xs text-[#92400e]">
                    Row {r.row}: {r.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setImportState("idle");
                setFileName("");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={importState === "importing"}
              className="rounded-md bg-foreground px-5 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              {importState === "importing"
                ? "Importing…"
                : `Import ${validRows.length} Teachers`}
            </button>
          </div>
        </>
      )}

      {importState === "done" && (
        <div className="mx-auto mt-8 max-w-md text-center">
          <div className="mb-4 flex justify-center">
            <CheckCircle className="h-16 w-16 text-[#22c55e]" />
          </div>
          <h2 className="mb-2 text-xl font-semibold">Import Complete</h2>
          <p className="mb-2 text-sm text-secondary-foreground">
            <span className="font-medium text-[#166534]">{validRows.length} teachers</span>{" "}
            imported successfully with <strong>Pending</strong> status.
          </p>
          {errorRows.length > 0 && (
            <p className="mb-6 text-sm text-secondary-foreground">
              <span className="font-medium text-[#dc2626]">{errorRows.length} rows</span>{" "}
              were skipped due to errors.
            </p>
          )}
          <div className="flex justify-center gap-3">
            <Link
              href="/resource/teachers"
              className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              View Teachers
            </Link>
            <button
              onClick={() => {
                setImportState("idle");
                setFileName("");
              }}
              className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary"
            >
              Import More
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
