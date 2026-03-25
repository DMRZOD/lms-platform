"use client";

import { useState } from "react";
import {
  BarChart3,
  Download,
  FileBarChart,
  FileText,
  GraduationCap,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockDepartmentPerformance,
  mockReportHistory,
} from "@/constants/deputy-mock-data";
import type { ReportFormat, ReportType } from "@/types/deputy";

const reportTypes: {
  id: ReportType;
  label: string;
  description: string;
  icon: React.ElementType;
}[] = [
  {
    id: "Executive",
    label: "Executive Summary",
    description: "University-wide KPIs, trends, and strategic highlights",
    icon: BarChart3,
  },
  {
    id: "Academic",
    label: "Academic Performance",
    description: "GPA, completion rates, program analysis, and comparisons",
    icon: GraduationCap,
  },
  {
    id: "Financial",
    label: "Financial Overview",
    description: "Revenue, budget utilization, debt, and collection rates",
    icon: Wallet,
  },
  {
    id: "Quality",
    label: "Quality Audit",
    description: "AQAD scores, audit findings, and compliance status",
    icon: ShieldCheck,
  },
  {
    id: "Custom",
    label: "Custom Report",
    description: "Select specific metrics, departments, and time periods",
    icon: FileText,
  },
];

const periods = [
  "Q1 2026",
  "Q4 2025",
  "Semester Spring 2026",
  "Semester Fall 2025",
  "FY 2025",
  "Custom Range",
];

const departments = [
  "All Departments",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const formats: ReportFormat[] = ["PDF", "Excel", "PowerPoint"];

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  Ready: { label: "Ready", color: "text-[#166534]", bgColor: "bg-[#dcfce7]" },
  Generating: { label: "Generating", color: "text-[#92400e]", bgColor: "bg-[#fef3c7]" },
  Failed: { label: "Failed", color: "text-[#991b1b]", bgColor: "bg-[#fee2e2]" },
};

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState<ReportType>("Executive");
  const [selectedPeriod, setSelectedPeriod] = useState(periods[0]);
  const [selectedDept, setSelectedDept] = useState(departments[0]);
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("PDF");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 1500);
  };

  return (
    <div>
      <PageHeader
        title="Executive Reports"
        description="Generate, download, and manage strategic reports across all departments"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Select Report Type">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {reportTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                    selectedType === type.id
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:bg-secondary"
                  }`}
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                    <type.icon className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{type.label}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground line-clamp-2">
                      {type.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Report Configuration">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {periods.map((p) => (
                    <option key={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Department
                </label>
                <select
                  value={selectedDept}
                  onChange={(e) => setSelectedDept(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {departments.map((d) => (
                    <option key={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">
                  Format
                </label>
                <div className="flex gap-2">
                  {formats.map((f) => (
                    <button
                      key={f}
                      onClick={() => setSelectedFormat(f)}
                      className={`flex-1 rounded-md border py-2 text-sm font-medium transition-colors ${
                        selectedFormat === f
                          ? "border-foreground bg-foreground text-background"
                          : "border-border hover:bg-secondary"
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:bg-foreground/90 disabled:opacity-50"
              >
                {generating ? "Generating..." : "Generate Report"}
              </button>
              {generated && (
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#dcfce7] px-3 py-1 text-sm font-medium text-[#166534]">
                    Report ready
                  </span>
                  <button className="flex items-center gap-1.5 text-sm text-secondary-foreground hover:text-foreground">
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Report Preview">
            <p className="mb-4 text-xs text-secondary-foreground">
              {reportTypes.find((t) => t.id === selectedType)?.label} ·{" "}
              {selectedPeriod} · {selectedDept}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Students</th>
                    <th className="pb-2 font-medium">GPA</th>
                    <th className="pb-2 font-medium">Revenue</th>
                    <th className="pb-2 font-medium">Quality</th>
                  </tr>
                </thead>
                <tbody>
                  {mockDepartmentPerformance.map((d) => (
                    <tr
                      key={d.department}
                      className="border-b border-border hover:bg-secondary/50 last:border-0"
                    >
                      <td className="py-2.5 font-medium">{d.department}</td>
                      <td className="py-2.5">
                        {d.enrollmentCount.toLocaleString()}
                      </td>
                      <td
                        className={`py-2.5 ${d.gpa >= 3.5 ? "text-[#166534]" : ""}`}
                      >
                        {d.gpa.toFixed(2)}
                      </td>
                      <td className="py-2.5">
                        ${(d.revenueCollected / 1_000_000).toFixed(1)}M
                      </td>
                      <td
                        className={`py-2.5 ${d.qualityScore >= 90 ? "text-[#166534]" : d.qualityScore >= 85 ? "" : "text-[#991b1b]"}`}
                      >
                        {d.qualityScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Report History">
            <div className="space-y-4">
              {mockReportHistory.map((report) => {
                const cfg = statusConfig[report.status];
                const TypeIcon =
                  report.type === "Executive"
                    ? BarChart3
                    : report.type === "Academic"
                      ? GraduationCap
                      : report.type === "Financial"
                        ? Wallet
                        : report.type === "Quality"
                          ? ShieldCheck
                          : FileBarChart;
                return (
                  <div
                    key={report.id}
                    className="flex items-start gap-3 rounded-lg border border-border p-3"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
                      <TypeIcon className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {report.title}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {report.period} · {report.format} · {report.fileSize}
                      </p>
                      <div className="mt-1.5 flex items-center gap-2">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bgColor} ${cfg.color}`}
                        >
                          {cfg.label}
                        </span>
                        {report.status === "Ready" && (
                          <button className="flex items-center gap-1 text-xs text-secondary-foreground hover:text-foreground">
                            <Download className="h-3 w-3" />
                            Download
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
