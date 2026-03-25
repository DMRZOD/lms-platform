"use client";

import { useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  Flame,
  Search,
  XCircle,
} from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockIncidents } from "@/constants/deputy-mock-data";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "Investigating", value: "investigating" },
  { label: "Escalated", value: "escalated" },
  { label: "Resolved", value: "resolved" },
];

const severities = ["All", "critical", "high", "medium", "low"];

const severityConfig: Record<
  string,
  { label: string; color: string; bgColor: string; icon: React.ElementType }
> = {
  critical: {
    label: "Critical",
    color: "text-[#991b1b]",
    bgColor: "bg-[#fee2e2]",
    icon: XCircle,
  },
  high: {
    label: "High",
    color: "text-[#9a3412]",
    bgColor: "bg-[#ffedd5]",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    color: "text-[#92400e]",
    bgColor: "bg-[#fef3c7]",
    icon: AlertCircle,
  },
  low: {
    label: "Low",
    color: "text-[#374151]",
    bgColor: "bg-[#f3f4f6]",
    icon: AlertCircle,
  },
};

const statusBadgeConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  open: { label: "Open", color: "text-[#991b1b]", bgColor: "bg-[#fee2e2]" },
  investigating: { label: "Investigating", color: "text-[#92400e]", bgColor: "bg-[#fef3c7]" },
  escalated: { label: "Escalated", color: "text-[#1e40af]", bgColor: "bg-[#dbeafe]" },
  resolved: { label: "Resolved", color: "text-[#166534]", bgColor: "bg-[#dcfce7]" },
};

const avgResolutionDays: Record<string, number> = {
  critical: 1.8,
  high: 3.2,
  medium: 6.5,
  low: 14.2,
};

export default function IncidentsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [search, setSearch] = useState("");

  const openCount = mockIncidents.filter(
    (i) => i.status === "open" || i.status === "investigating" || i.status === "escalated",
  ).length;
  const criticalHighCount = mockIncidents.filter(
    (i) =>
      (i.severity === "critical" || i.severity === "high") &&
      i.status !== "resolved",
  ).length;
  const investigatingCount = mockIncidents.filter(
    (i) => i.status === "investigating",
  ).length;
  const resolvedThisMonth = mockIncidents.filter(
    (i) => i.status === "resolved",
  ).length;

  const hasCriticalOpen = mockIncidents.some(
    (i) => i.severity === "critical" && i.status !== "resolved",
  );

  const filtered = mockIncidents.filter((i) => {
    if (statusFilter !== "all" && i.status !== statusFilter) return false;
    if (severityFilter !== "All" && i.severity !== severityFilter) return false;
    if (
      search &&
      !i.title.toLowerCase().includes(search.toLowerCase()) &&
      !i.department.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const severityDistribution = (["critical", "high", "medium", "low"] as const).map(
    (sev) => ({
      severity: sev,
      count: mockIncidents.filter((i) => i.severity === sev).length,
    }),
  );

  const deptCounts = mockIncidents.reduce(
    (acc, i) => {
      acc[i.department] = (acc[i.department] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const deptCountsSorted = Object.entries(deptCounts).sort(([, a], [, b]) => b - a);

  return (
    <div>
      <PageHeader
        title="Critical Incidents"
        description="University incident tracking, escalation management, and resolution monitoring"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Open Incidents"
          value={openCount}
          icon={Flame}
          accent={openCount > 3 ? "danger" : "warning"}
          subtitle="Require action"
        />
        <StatCard
          label="Critical / High"
          value={criticalHighCount}
          icon={XCircle}
          accent="danger"
          subtitle="Unresolved"
        />
        <StatCard
          label="Under Investigation"
          value={investigatingCount}
          icon={Clock}
          accent="warning"
          subtitle="In progress"
        />
        <StatCard
          label="Resolved (This Month)"
          value={resolvedThisMonth}
          icon={CheckCircle}
          accent="success"
          subtitle="Closed incidents"
        />
      </div>

      {hasCriticalOpen && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4">
          <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#ef4444]" />
          <div>
            <p className="text-sm font-medium text-[#991b1b]">
              Critical incidents require immediate attention
            </p>
            <p className="mt-0.5 text-xs text-[#991b1b]/80">
              One or more critical-severity incidents are currently open.
              Immediate action is required to prevent further impact.
            </p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? "bg-foreground text-background"
                  : "border border-border bg-background text-foreground hover:bg-secondary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
          >
            {severities.map((s) => (
              <option key={s} value={s}>
                {s === "All" ? "All Severities" : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-secondary-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="w-48 rounded-md border border-border bg-background py-1.5 pl-9 pr-3 text-sm placeholder:text-secondary-foreground focus:outline-none focus:ring-1 focus:ring-foreground/20"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionCard title={`Incident Log (${filtered.length})`}>
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No incidents match the selected filters.
                </p>
              ) : (
                filtered.map((incident) => {
                  const sevCfg = severityConfig[incident.severity];
                  const statusCfg = statusBadgeConfig[incident.status];
                  const SevIcon = sevCfg.icon;
                  return (
                    <div
                      key={incident.id}
                      className="rounded-lg border border-border p-4 hover:bg-secondary/50"
                    >
                      <div className="flex items-start gap-3">
                        <SevIcon
                          className={`mt-0.5 h-4 w-4 shrink-0 ${sevCfg.color}`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{incident.title}</p>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${sevCfg.bgColor} ${sevCfg.color}`}
                            >
                              {sevCfg.label}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusCfg.bgColor} ${statusCfg.color}`}
                            >
                              {statusCfg.label}
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-secondary-foreground">
                            {incident.description}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-3 text-xs text-secondary-foreground">
                            <span>Dept: {incident.department}</span>
                            <span>By: {incident.reportedBy}</span>
                            <span>
                              {new Date(incident.reportedAt).toLocaleDateString()}
                            </span>
                            {incident.resolvedAt && (
                              <span className="text-[#166534]">
                                Resolved:{" "}
                                {new Date(incident.resolvedAt).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Severity Distribution">
            <div className="space-y-3">
              {severityDistribution.map(({ severity, count }) => {
                const cfg = severityConfig[severity];
                return (
                  <div key={severity}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className={`flex items-center gap-2 font-medium capitalize ${cfg.color}`}>
                        <cfg.icon className="h-3.5 w-3.5" />
                        {severity}
                      </span>
                      <span>{count}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${(count / mockIncidents.length) * 100}%`,
                          backgroundColor:
                            severity === "critical"
                              ? "#ef4444"
                              : severity === "high"
                                ? "#f97316"
                                : severity === "medium"
                                  ? "#f59e0b"
                                  : "#9ca3af",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Avg Resolution Time">
            <div className="space-y-3">
              {(["critical", "high", "medium", "low"] as const).map((sev) => {
                const cfg = severityConfig[sev];
                const days = avgResolutionDays[sev];
                const maxDays = 15;
                return (
                  <div key={sev}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className={`font-medium capitalize ${cfg.color}`}>
                        {sev}
                      </span>
                      <span className="font-medium">{days} days</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-[#3b82f6]"
                        style={{ width: `${(days / maxDays) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Incidents by Department">
            <div className="space-y-2">
              {deptCountsSorted.map(([dept, count]) => (
                <div
                  key={dept}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-secondary-foreground">{dept}</span>
                  <span
                    className={`font-medium ${count >= 3 ? "text-[#991b1b]" : count >= 2 ? "text-[#92400e]" : ""}`}
                  >
                    {count}
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
