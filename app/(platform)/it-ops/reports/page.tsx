"use client";

import { useState } from "react";
import { Download, FileBarChart } from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockReportSchedules,
  mockReportsStats,
  mockTechReports,
} from "@/constants/it-ops-mock-data";

const reportTypeColors: Record<string, { bg: string; text: string }> = {
  SLA: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  Uptime: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Performance: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Security: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Capacity: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
};

const reportStatusColors: Record<string, { bg: string; text: string }> = {
  Ready: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Generating: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Scheduled: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const formatColors: Record<string, { bg: string; text: string }> = {
  PDF: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  CSV: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  XLSX: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const reportTypeFilters = [
  { label: "All", value: "all" },
  { label: "SLA", value: "SLA" },
  { label: "Uptime", value: "Uptime" },
  { label: "Performance", value: "Performance" },
  { label: "Security", value: "Security" },
  { label: "Capacity", value: "Capacity" },
];

const reportTemplates = [
  { type: "Uptime", title: "Monthly Uptime Report", desc: "Service availability and SLA metrics per service", icon: "📈" },
  { type: "SLA", title: "SLA Compliance Report", desc: "SLA adherence across all services and incidents", icon: "✅" },
  { type: "Performance", title: "Performance Analysis", desc: "API response times, slow queries, CDN metrics", icon: "⚡" },
  { type: "Security", title: "Security Incidents Report", desc: "Security events, vulnerabilities, and blocked IPs", icon: "🔐" },
  { type: "Capacity", title: "Capacity Planning Report", desc: "Resource utilization and growth forecasts", icon: "📦" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsReportsPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = mockReportsStats;

  const filteredReports = mockTechReports.filter((rep) => {
    const matchesType = typeFilter === "all" || rep.type === typeFilter;
    const matchesSearch =
      rep.title.toLowerCase().includes(search.toLowerCase()) ||
      rep.period.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Technical Reports"
        description="Generate, schedule, and download infrastructure and operational reports"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Reports"
          value={stats.totalReports}
          icon={FileBarChart}
        />
        <StatCard
          label="Generated This Month"
          value={stats.generatedThisMonth}
          accent="success"
        />
        <StatCard
          label="Scheduled Reports"
          value={stats.scheduledReports}
          accent="info"
        />
        <StatCard
          label="SLA Compliance"
          value={stats.slaCompliance}
          accent={parseFloat(stats.slaCompliance) >= 99 ? "success" : "warning"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Report Templates */}
          <SectionCard title="Report Templates">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {reportTemplates.map((tmpl) => {
                const colors = reportTypeColors[tmpl.type] ?? reportTypeColors.SLA;
                return (
                  <div
                    key={tmpl.type}
                    className="cursor-pointer rounded-md border border-border p-4 transition-colors hover:bg-secondary"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{tmpl.icon}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {tmpl.type}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium">{tmpl.title}</p>
                    <p className="mt-0.5 text-xs text-secondary-foreground">{tmpl.desc}</p>
                    <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-foreground hover:underline">
                      <FileBarChart className="h-3.5 w-3.5" />
                      Generate Report
                    </button>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Generated Reports */}
          <SectionCard title={`Generated Reports (${filteredReports.length})`}>
            <FilterBar
              filters={reportTypeFilters}
              activeFilter={typeFilter}
              onFilterChange={setTypeFilter}
              searchValue={search}
              onSearchChange={setSearch}
              placeholder="Search reports..."
            />
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Report</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Period</th>
                    <th className="pb-3 font-medium">Format</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredReports.map((rep) => {
                    const typeColors = reportTypeColors[rep.type] ?? reportTypeColors.SLA;
                    const stColors = reportStatusColors[rep.status] ?? reportStatusColors.Ready;
                    const fmtColors = formatColors[rep.format] ?? formatColors.PDF;
                    return (
                      <tr key={rep.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5">
                          <p className="font-medium">{rep.title}</p>
                          <p className="text-xs text-secondary-foreground">
                            {rep.status !== "Scheduled" ? formatDateTime(rep.generatedAt) : "Upcoming"}
                          </p>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {rep.type}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{rep.period}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${fmtColors.bg} ${fmtColors.text}`}>
                            {rep.format}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                            {rep.status}
                          </span>
                        </td>
                        <td className="py-2.5">
                          {rep.status === "Ready" && (
                            <button className="flex items-center gap-1 text-xs font-medium text-foreground hover:underline">
                              <Download className="h-3.5 w-3.5" />
                              {rep.fileSize}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Scheduled Reports */}
          <SectionCard title="Scheduled Reports">
            <div className="divide-y divide-border">
              {mockReportSchedules.map((sched) => {
                const colors = reportTypeColors[sched.type] ?? reportTypeColors.SLA;
                return (
                  <div key={sched.id} className="py-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{sched.name}</p>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {sched.type}
                      </span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-xs">{sched.frequency}</span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      Next: {new Date(sched.nextRun).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      {sched.recipients.length} recipient{sched.recipients.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* SLA Summary */}
          <SectionCard title="SLA Compliance Summary">
            <div className="space-y-3 text-sm">
              {[
                { label: "Uptime SLA (99.9%)", value: "99.87%", ok: false },
                { label: "Response Time SLA", value: "Achieved", ok: true },
                { label: "Incident Response SLA", value: "Achieved", ok: true },
                { label: "Backup Success SLA", value: "94.2%", ok: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-2">
                  <span className="text-secondary-foreground">{item.label}</span>
                  <span className={`font-medium ${item.ok ? "text-[#166534]" : "text-[#b45309]"}`}>
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
