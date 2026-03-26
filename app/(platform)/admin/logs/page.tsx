"use client";

import { AlertCircle, AlertTriangle, ScrollText, XCircle } from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockLogsStats, mockSystemLogs } from "@/constants/admin-mock-data";
import type { LogLevel, LogSource } from "@/types/admin";

const logLevelColors: Record<
  LogLevel,
  { bg: string; text: string; label: string }
> = {
  info: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", label: "INFO" },
  warning: { bg: "bg-[#fffbeb]", text: "text-[#b45309]", label: "WARN" },
  error: { bg: "bg-[#fef2f2]", text: "text-[#b91c1c]", label: "ERROR" },
  critical: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]", label: "CRIT" },
};

const levelFilters = [
  { label: "All", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warning", value: "warning" },
  { label: "Error", value: "error" },
  { label: "Critical", value: "critical" },
];

const sourceOptions: { label: string; value: string }[] = [
  { label: "All Sources", value: "all" },
  { label: "Auth", value: "Auth" },
  { label: "API", value: "API" },
  { label: "System", value: "System" },
  { label: "Database", value: "Database" },
  { label: "Scheduler", value: "Scheduler" },
  { label: "Integration", value: "Integration" },
];

const sourceColors: Record<LogSource, { bg: string; text: string }> = {
  Auth: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  API: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  System: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  Database: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  Scheduler: { bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
  Integration: { bg: "bg-[#fefce8]", text: "text-[#a16207]" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

export default function AdminLogsPage() {
  const [levelFilter, setLevelFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [search, setSearch] = useState("");
  const s = mockLogsStats;

  const filtered = mockSystemLogs.filter((log) => {
    const matchLevel = levelFilter === "all" || log.level === levelFilter;
    const matchSource = sourceFilter === "all" || log.source === sourceFilter;
    const matchSearch =
      search === "" ||
      log.message.toLowerCase().includes(search.toLowerCase()) ||
      log.source.toLowerCase().includes(search.toLowerCase()) ||
      (log.userName?.toLowerCase().includes(search.toLowerCase()) ?? false);
    return matchLevel && matchSource && matchSearch;
  });

  const levelDistribution = (["info", "warning", "error", "critical"] as LogLevel[]).map(
    (lvl) => ({
      level: lvl,
      count: mockSystemLogs.filter((l) => l.level === lvl).length,
    }),
  );
  const maxLevelCount = Math.max(...levelDistribution.map((l) => l.count), 1);

  const sourceDistribution = (
    ["Auth", "API", "System", "Database", "Scheduler", "Integration"] as LogSource[]
  ).map((src) => ({
    source: src,
    count: mockSystemLogs.filter((l) => l.source === src).length,
  }));
  const maxSrcCount = Math.max(...sourceDistribution.map((s) => s.count), 1);

  const criticalLogs = mockSystemLogs.filter(
    (l) => l.level === "critical" || l.level === "error",
  );

  return (
    <div>
      <PageHeader
        title="System Logs"
        description="Real-time system event logs, errors, and audit trail"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Logs (24h)"
          value={s.totalLogs24h.toLocaleString()}
          icon={ScrollText}
        />
        <StatCard
          label="Errors (24h)"
          value={s.errors24h}
          icon={XCircle}
          accent={s.errors24h > 10 ? "danger" : "default"}
        />
        <StatCard
          label="Warnings (24h)"
          value={s.warnings24h}
          icon={AlertTriangle}
          accent={s.warnings24h > 50 ? "warning" : "default"}
        />
        <StatCard
          label="Critical Events"
          value={s.criticalEvents}
          icon={AlertCircle}
          accent={s.criticalEvents > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Log entries — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="mb-4 flex flex-col gap-3">
              <div className="flex flex-wrap gap-1.5">
                {levelFilters.map((f) => (
                  <button
                    key={f.value}
                    onClick={() => setLevelFilter(f.value)}
                    className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                      levelFilter === f.value
                        ? "bg-foreground text-background"
                        : "border border-border bg-background text-foreground hover:bg-secondary"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="rounded-md border border-border bg-background px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
                >
                  {sourceOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search logs..."
                  className="w-full rounded-md border border-border bg-background py-1.5 px-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20 sm:w-56"
                />
              </div>
            </div>
            <p className="mb-3 text-sm text-secondary-foreground">
              {filtered.length} log entr{filtered.length !== 1 ? "ies" : "y"}
            </p>
            <div className="space-y-2">
              {filtered.map((log) => {
                const lc = logLevelColors[log.level] ?? logLevelColors.info;
                const sc = sourceColors[log.source] ?? sourceColors.System;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold ${lc.bg} ${lc.text}`}
                    >
                      {lc.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{log.message}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                        >
                          {log.source}
                        </span>
                        <span className="text-xs text-secondary-foreground">
                          {formatDateTime(log.timestamp)}
                        </span>
                        <span className="font-mono text-xs text-secondary-foreground">
                          {log.ipAddress}
                        </span>
                        {log.userName && (
                          <span className="text-xs text-secondary-foreground">
                            {log.userName}
                          </span>
                        )}
                      </div>
                      {log.details && (
                        <p className="mt-1 text-xs text-secondary-foreground">
                          {log.details}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No log entries match the selected filters.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="Level Distribution">
            <div className="space-y-2.5">
              {levelDistribution.map((l) => {
                const lc = logLevelColors[l.level] ?? logLevelColors.info;
                return (
                  <div key={l.level}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded px-1.5 py-0.5 font-mono text-xs font-bold ${lc.bg} ${lc.text}`}
                      >
                        {lc.label}
                      </span>
                      <span className="font-medium">{l.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${(l.count / maxLevelCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Logs by Source">
            <div className="space-y-2.5">
              {sourceDistribution.map((s) => {
                const sc = sourceColors[s.source] ?? sourceColors.System;
                return (
                  <div key={s.source}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                      >
                        {s.source}
                      </span>
                      <span className="font-medium">{s.count}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-foreground"
                        style={{
                          width: `${(s.count / maxSrcCount) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Recent Critical Events">
            <div className="space-y-3">
              {criticalLogs.slice(0, 5).map((log) => {
                const lc = logLevelColors[log.level] ?? logLevelColors.info;
                return (
                  <div key={log.id} className="flex items-start gap-2">
                    <span
                      className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 font-mono text-xs font-bold ${lc.bg} ${lc.text}`}
                    >
                      {lc.label}
                    </span>
                    <div>
                      <p className="line-clamp-2 text-sm">{log.message}</p>
                      <p className="text-xs text-secondary-foreground">
                        {log.source} ·{" "}
                        {new Date(log.timestamp).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
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
