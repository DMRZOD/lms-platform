"use client";

import { useState } from "react";
import { Download, FileBarChart, FileSpreadsheet, FileText } from "lucide-react";

import { SectionCard } from "@/components/accountant/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockReportHistory } from "@/constants/accountant-mock-data";
import type { ReportFormat, ReportType } from "@/types/accountant";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const reportTypes: { type: ReportType; label: string; description: string }[] =
  [
    {
      type: "Revenue",
      label: "Revenue Report",
      description: "Total revenue, trends, and breakdown by program",
    },
    {
      type: "Debt",
      label: "Debt Report",
      description: "Outstanding debts, severity breakdown, aging analysis",
    },
    {
      type: "PaymentCollection",
      label: "Payment Collection",
      description: "Collection rates, payment methods, and efficiency",
    },
    {
      type: "ContractSummary",
      label: "Contract Summary",
      description: "Active, expired, and terminated contracts overview",
    },
    {
      type: "Reconciliation",
      label: "Reconciliation Report",
      description: "1C sync results, mismatches, and resolution status",
    },
    {
      type: "StudentBalance",
      label: "Student Balance",
      description: "Per-student financial balance and payment status",
    },
  ];

const periods = [
  "January 2026",
  "February 2026",
  "March 2026",
  "Q1 2026",
  "Q4 2025",
  "2025–2026 Academic Year",
];

const departments = [
  "All Departments",
  "Engineering",
  "Economics",
  "Humanities",
  "Health Sciences",
  "Design",
  "Natural Sciences",
];

const reportStatusColors: Record<string, string> = {
  Ready: "bg-[#dcfce7] text-[#166534]",
  Generating: "bg-[#fef9c3] text-[#854d0e]",
  Failed: "bg-[#fee2e2] text-[#991b1b]",
};

const reportTypeLabels: Record<ReportType, string> = {
  Revenue: "Revenue",
  Debt: "Debt",
  PaymentCollection: "Payment Collection",
  ContractSummary: "Contract Summary",
  Reconciliation: "Reconciliation",
  StudentBalance: "Student Balance",
};

const previewData = [
  { label: "Engineering", paid: "$1,240,000", pending: "$48,000", overdue: "$12,000" },
  { label: "Economics", paid: "$980,000", pending: "$35,000", overdue: "$8,500" },
  { label: "Health Sciences", paid: "$1,580,000", pending: "$62,000", overdue: "$21,000" },
  { label: "Humanities", paid: "$420,000", pending: "$18,000", overdue: "$5,200" },
  { label: "Design", paid: "$630,000", pending: "$24,000", overdue: "$9,800" },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType | null>(null);
  const [period, setPeriod] = useState(periods[2]);
  const [department, setDepartment] = useState(departments[0]);
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [showPreview, setShowPreview] = useState(false);
  const [generating, setGenerating] = useState(false);

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowPreview(true);
    }, 1500);
  }

  return (
    <div>
      <PageHeader
        title="Financial Reports"
        description="Generate and download financial reports"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — Report Config */}
        <div className="space-y-6 lg:col-span-2">
          {/* Report Type Selector */}
          <SectionCard title="Select Report Type">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
              {reportTypes.map((r) => (
                <button
                  key={r.type}
                  onClick={() => {
                    setSelectedType(r.type);
                    setShowPreview(false);
                  }}
                  className={`rounded-lg border p-4 text-left transition-colors ${
                    selectedType === r.type
                      ? "border-foreground bg-secondary"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <FileBarChart
                      className={`h-5 w-5 ${selectedType === r.type ? "text-foreground" : "text-secondary-foreground"}`}
                    />
                    <p className="text-sm font-semibold">{r.label}</p>
                  </div>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    {r.description}
                  </p>
                </button>
              ))}
            </div>
          </SectionCard>

          {/* Config */}
          {selectedType && (
            <SectionCard title="Report Configuration">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Period
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  >
                    {periods.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  >
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Format
                  </label>
                  <div className="flex gap-2">
                    {(["PDF", "Excel"] as ReportFormat[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFormat(f)}
                        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition-colors ${
                          format === f
                            ? "border-foreground bg-foreground text-background"
                            : "border-border bg-background hover:bg-secondary"
                        }`}
                      >
                        {f === "PDF" ? (
                          <FileText className="h-4 w-4" />
                        ) : (
                          <FileSpreadsheet className="h-4 w-4" />
                        )}
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                >
                  {generating ? "Generating..." : "Generate Report"}
                </button>
                {showPreview && (
                  <button className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-secondary">
                    <Download className="h-4 w-4" />
                    Download {format}
                  </button>
                )}
              </div>
            </SectionCard>
          )}

          {/* Preview */}
          {showPreview && selectedType && (
            <SectionCard title={`Preview — ${reportTypeLabels[selectedType]}`}>
              <p className="mb-3 text-xs text-secondary-foreground">
                Period: {period} · Department: {department} · Format: {format}
              </p>
              <div className="overflow-x-auto rounded-md bg-secondary p-4">
                <div className="grid min-w-[400px] grid-cols-[1fr_1fr_1fr_1fr] gap-x-4 border-b border-border pb-2 text-xs font-medium text-secondary-foreground">
                  <span>Department</span>
                  <span>Paid</span>
                  <span>Pending</span>
                  <span>Overdue</span>
                </div>
                <div className="min-w-[400px] divide-y divide-border">
                  {previewData.map((row) => (
                    <div
                      key={row.label}
                      className="grid grid-cols-[1fr_1fr_1fr_1fr] gap-x-4 py-2 text-sm"
                    >
                      <span className="font-medium">{row.label}</span>
                      <span className="text-[#166534]">{row.paid}</span>
                      <span className="text-[#854d0e]">{row.pending}</span>
                      <span className="text-[#991b1b]">{row.overdue}</span>
                    </div>
                  ))}
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Right — History */}
        <div>
          <SectionCard title="Report History">
            <div className="space-y-3">
              {mockReportHistory.map((report) => (
                <div
                  key={report.id}
                  className="rounded-md border border-border p-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium">
                      {reportTypeLabels[report.type]}
                    </p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${reportStatusColors[report.status]}`}
                    >
                      {report.status}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {report.period} · {report.format}
                  </p>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {formatDate(report.generatedAt)} by {report.generatedBy}
                  </p>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    {report.fileSize}
                  </p>
                  {report.status === "Ready" && (
                    <button className="mt-2 flex items-center gap-1 text-xs font-medium text-secondary-foreground hover:text-foreground">
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </button>
                  )}
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
