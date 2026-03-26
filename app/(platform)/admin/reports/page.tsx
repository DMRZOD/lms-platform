"use client";

import {
  Calendar,
  Clock,
  Download,
  FileBarChart,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockReportsStats,
  mockSystemReports,
} from "@/constants/admin-mock-data";
import type { ReportFormat, ReportStatus, ReportType } from "@/types/admin";

const reportTypeLabels: Record<ReportType, string> = {
  UserActivity: "User Activity",
  SystemPerformance: "System Performance",
  SecurityAudit: "Security Audit",
  UsageStatistics: "Usage Statistics",
  ComplianceReport: "Compliance",
  ErrorAnalysis: "Error Analysis",
};

const reportTypeColors: Record<ReportType, { bg: string; text: string }> = {
  UserActivity: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  SystemPerformance: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  SecurityAudit: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  UsageStatistics: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  ComplianceReport: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  ErrorAnalysis: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const reportStatusColors: Record<ReportStatus, { bg: string; text: string }> =
  {
    Ready: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
    Generating: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
    Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  };

const formatColors: Record<ReportFormat, { bg: string; text: string }> = {
  PDF: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Excel: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  CSV: { bg: "bg-[#fefce8]", text: "text-[#a16207]" },
};

const typeFilters = [
  { label: "All", value: "all" },
  { label: "User Activity", value: "UserActivity" },
  { label: "Performance", value: "SystemPerformance" },
  { label: "Security Audit", value: "SecurityAudit" },
  { label: "Usage Stats", value: "UsageStatistics" },
  { label: "Compliance", value: "ComplianceReport" },
  { label: "Error Analysis", value: "ErrorAnalysis" },
];

const reportTypeOptions: { label: string; value: ReportType }[] = [
  { label: "User Activity", value: "UserActivity" },
  { label: "System Performance", value: "SystemPerformance" },
  { label: "Security Audit", value: "SecurityAudit" },
  { label: "Usage Statistics", value: "UsageStatistics" },
  { label: "Compliance Report", value: "ComplianceReport" },
  { label: "Error Analysis", value: "ErrorAnalysis" },
];

const periodOptions = [
  "Current Month",
  "Last Month",
  "Current Quarter",
  "Last Quarter",
  "Current Year",
  "Last Year",
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

const scheduledReports = [
  {
    label: "Monthly User Activity",
    schedule: "1st of every month, 08:00",
    nextRun: "2026-04-01T08:00:00Z",
  },
  {
    label: "Weekly Error Analysis",
    schedule: "Every Monday, 07:00",
    nextRun: "2026-03-30T07:00:00Z",
  },
  {
    label: "Quarterly Compliance",
    schedule: "1st of quarter, 09:00",
    nextRun: "2026-04-01T09:00:00Z",
  },
  {
    label: "Daily Security Audit",
    schedule: "Every day, 06:00",
    nextRun: "2026-03-27T06:00:00Z",
  },
  {
    label: "Monthly System Performance",
    schedule: "1st of every month, 08:30",
    nextRun: "2026-04-01T08:30:00Z",
  },
];

export default function AdminReportsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState<ReportType>("UserActivity");
  const [selectedPeriod, setSelectedPeriod] = useState("Current Month");
  const [selectedFormat, setSelectedFormat] = useState<ReportFormat>("PDF");
  const s = mockReportsStats;

  const filtered = mockSystemReports.filter((r) => {
    const matchType = typeFilter === "all" || r.type === typeFilter;
    const matchSearch =
      search === "" ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.period.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const byType = reportTypeOptions.map((t) => ({
    label: t.label,
    type: t.value,
    count: mockSystemReports.filter((r) => r.type === t.value).length,
  }));
  const maxTypeCount = Math.max(...byType.map((t) => t.count), 1);

  return (
    <div>
      <PageHeader
        title="System Reports"
        description="Generate, schedule, and download system reports"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={s.totalReports}
          icon={FileBarChart}
        />
        <StatCard
          label="Generated This Month"
          value={s.generatedThisMonth}
          icon={Calendar}
          accent="info"
        />
        <StatCard
          label="Scheduled Reports"
          value={s.scheduledReports}
          icon={Clock}
        />
        <StatCard
          label="Failed Reports"
          value={s.failedReports}
          icon={XCircle}
          accent={s.failedReports > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Report History — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {typeFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setTypeFilter(f.value)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      typeFilter === f.value
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search reports..."
                className="w-full rounded-md border border-border bg-background py-1.5 px-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 sm:w-56"
              />
            </div>
            <p className="mb-3 text-sm text-secondary-foreground">
              {filtered.length} report{filtered.length !== 1 ? "s" : ""}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Title</th>
                    <th className="pb-2 font-medium">Period</th>
                    <th className="pb-2 font-medium">Format</th>
                    <th className="pb-2 font-medium">Generated</th>
                    <th className="pb-2 font-medium">Size</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((r) => {
                    const tc =
                      reportTypeColors[r.type] ??
                      reportTypeColors.UserActivity;
                    const sc =
                      reportStatusColors[r.status] ??
                      reportStatusColors.Ready;
                    const fc = formatColors[r.format] ?? formatColors.PDF;
                    return (
                      <tr
                        key={r.id}
                        className="hover:bg-secondary/40 transition-colors"
                      >
                        <td className="py-2.5">
                          <p className="font-medium">{r.title}</p>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}
                          >
                            {reportTypeLabels[r.type]}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {r.period}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${fc.bg} ${fc.text}`}
                          >
                            {r.format}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDateTime(r.generatedAt)}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {r.fileSize}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                          >
                            {r.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {r.status === "Ready" && (
                            <button className="flex items-center gap-1 text-xs text-secondary-foreground hover:text-foreground transition-colors">
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No reports match the selected filters.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="Generate New Report">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm text-secondary-foreground">
                  Report Type
                </label>
                <select
                  value={selectedType}
                  onChange={(e) =>
                    setSelectedType(e.target.value as ReportType)
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {reportTypeOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-secondary-foreground">
                  Period
                </label>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {periodOptions.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm text-secondary-foreground">
                  Format
                </label>
                <div className="flex gap-3">
                  {(["PDF", "Excel", "CSV"] as ReportFormat[]).map((fmt) => (
                    <label
                      key={fmt}
                      className="flex cursor-pointer items-center gap-1.5 text-sm"
                    >
                      <input
                        type="radio"
                        name="format"
                        value={fmt}
                        checked={selectedFormat === fmt}
                        onChange={() => setSelectedFormat(fmt)}
                        className="accent-foreground"
                      />
                      {fmt}
                    </label>
                  ))}
                </div>
              </div>
              <button className="w-full rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 transition-opacity">
                Generate Report
              </button>
            </div>
          </SectionCard>

          <SectionCard title="Reports by Type">
            <div className="space-y-2.5">
              {byType.map((t) => {
                const tc =
                  reportTypeColors[t.type] ?? reportTypeColors.UserActivity;
                return (
                  <div key={t.type}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}
                      >
                        {t.label}
                      </span>
                      <span className="font-medium">{t.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${(t.count / maxTypeCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Scheduled Reports">
            <div className="space-y-3">
              {scheduledReports.map((r) => (
                <div key={r.label} className="flex flex-col gap-0.5">
                  <p className="text-sm font-medium">{r.label}</p>
                  <p className="text-xs text-secondary-foreground">
                    {r.schedule}
                  </p>
                  <p className="text-xs text-secondary-foreground">
                    Next:{" "}
                    {new Date(r.nextRun).toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })}
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
