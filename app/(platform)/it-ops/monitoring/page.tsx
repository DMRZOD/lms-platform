"use client";

import { useState } from "react";
import {
  Activity,
  AlertTriangle,
  Cpu,
  HardDrive,
  MemoryStick,
  Network,
} from "lucide-react";

import { FilterBar } from "@/components/it-ops/filter-bar";
import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAlertRules,
  mockItOpsAlerts,
  mockItOpsServices,
  mockMonitoringStats,
  mockUptimeRecords,
} from "@/constants/it-ops-mock-data";

const serviceStatusColors: Record<string, { bg: string; text: string }> = {
  Healthy: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Degraded: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Down: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Maintenance: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const alertSeverityColors: Record<string, { bg: string; text: string }> = {
  critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  high: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
  info: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
};

const alertFilters = [
  { label: "All", value: "all" },
  { label: "Critical", value: "critical" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

function usageAccent(value: number): "danger" | "warning" | "default" {
  if (value >= 85) return "danger";
  if (value >= 70) return "warning";
  return "default";
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsMonitoringPage() {
  const [alertFilter, setAlertFilter] = useState("all");
  const [alertSearch, setAlertSearch] = useState("");

  const stats = mockMonitoringStats;

  const filteredAlerts = mockItOpsAlerts.filter((a) => {
    const matchesSeverity = alertFilter === "all" || a.severity === alertFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(alertSearch.toLowerCase()) ||
      a.service.toLowerCase().includes(alertSearch.toLowerCase());
    return matchesSeverity && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        title="Monitoring"
        description="Real-time infrastructure metrics, service health, and active alerts"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="CPU Usage"
          value={`${stats.cpuUsage}%`}
          icon={Cpu}
          subtitle="Across all nodes"
          accent={usageAccent(stats.cpuUsage)}
        />
        <StatCard
          label="Memory Usage"
          value={`${stats.memoryUsage}%`}
          icon={MemoryStick}
          subtitle="Across all nodes"
          accent={usageAccent(stats.memoryUsage)}
        />
        <StatCard
          label="Disk Usage"
          value={`${stats.diskUsage}%`}
          icon={HardDrive}
          subtitle="Primary storage"
          accent={usageAccent(stats.diskUsage)}
        />
        <StatCard
          label="Network I/O"
          value={stats.networkIO}
          icon={Network}
          subtitle="Current throughput"
        />
        <StatCard
          label="Active Alerts"
          value={stats.activeAlerts}
          icon={AlertTriangle}
          accent={stats.activeAlerts > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Uptime"
          value={`${stats.uptimePercent}%`}
          icon={Activity}
          subtitle="Last 30 days"
          accent="success"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Health Matrix */}
          <SectionCard title="Service Health Matrix">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Uptime</th>
                    <th className="pb-3 font-medium">Resp. Time</th>
                    <th className="pb-3 font-medium">CPU</th>
                    <th className="pb-3 font-medium">Memory</th>
                    <th className="pb-3 font-medium">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockItOpsServices.map((svc) => {
                    const colors = serviceStatusColors[svc.status] ?? serviceStatusColors.Healthy;
                    return (
                      <tr key={svc.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{svc.name}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {svc.status}
                          </span>
                        </td>
                        <td className={`py-2.5 ${svc.uptime < 99 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {svc.status === "Down" || svc.status === "Maintenance" ? "—" : `${svc.uptime}%`}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {svc.responseTime > 0 ? `${svc.responseTime}ms` : "—"}
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full rounded-full ${svc.cpuUsage > 80 ? "bg-[#ef4444]" : svc.cpuUsage > 60 ? "bg-[#f59e0b]" : "bg-foreground"}`}
                                style={{ width: `${svc.cpuUsage}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-foreground">{svc.cpuUsage}%</span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full rounded-full ${svc.memoryUsage > 80 ? "bg-[#ef4444]" : svc.memoryUsage > 60 ? "bg-[#f59e0b]" : "bg-foreground"}`}
                                style={{ width: `${svc.memoryUsage}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-foreground">{svc.memoryUsage}%</span>
                          </div>
                        </td>
                        <td className={`py-2.5 ${svc.errorRate > 1 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {svc.errorRate}%
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Alert Rules */}
          <SectionCard title="Alert Rules">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Rule Name</th>
                    <th className="pb-3 font-medium">Threshold</th>
                    <th className="pb-3 font-medium">Severity</th>
                    <th className="pb-3 font-medium">Last Triggered</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockAlertRules.map((rule) => {
                    const colors = alertSeverityColors[rule.severity] ?? alertSeverityColors.info;
                    return (
                      <tr key={rule.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{rule.name}</td>
                        <td className="py-2.5 text-secondary-foreground">{rule.threshold}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {rule.severity.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {rule.lastTriggered ? formatDateTime(rule.lastTriggered) : "Never"}
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            rule.enabled ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f1f5f9] text-[#475569]"
                          }`}>
                            {rule.enabled ? "Enabled" : "Disabled"}
                          </span>
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
          {/* Active Alerts */}
          <SectionCard title="Active Alerts">
            <FilterBar
              filters={alertFilters}
              activeFilter={alertFilter}
              onFilterChange={setAlertFilter}
              searchValue={alertSearch}
              onSearchChange={setAlertSearch}
              placeholder="Search alerts..."
              className="mb-4"
            />
            {filteredAlerts.length === 0 ? (
              <p className="py-4 text-center text-sm text-secondary-foreground">No alerts match your filter.</p>
            ) : (
              <div className="divide-y divide-border">
                {filteredAlerts.map((alert) => {
                  const colors = alertSeverityColors[alert.severity] ?? alertSeverityColors.info;
                  return (
                    <div key={alert.id} className="py-3">
                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                          {alert.severity.toUpperCase()}
                        </span>
                        {alert.acknowledged && (
                          <span className="text-xs text-[#22c55e]">ACK</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium">{alert.title}</p>
                      <p className="text-xs text-secondary-foreground">
                        {alert.service} · {formatDateTime(alert.timestamp)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Uptime History */}
          <SectionCard title="Uptime History (Yesterday)">
            <div className="space-y-3">
              {mockUptimeRecords.map((record) => (
                <div key={record.id}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">{record.service}</span>
                    <span className={`text-sm font-medium ${record.uptimePercent < 99 ? "text-[#dc2626]" : "text-[#166534]"}`}>
                      {record.uptimePercent}%
                    </span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${record.uptimePercent < 99 ? "bg-[#ef4444]" : "bg-[#22c55e]"}`}
                      style={{ width: `${record.uptimePercent}%` }}
                    />
                  </div>
                  {record.downtime !== "0m" && (
                    <p className="mt-0.5 text-xs text-[#dc2626]">Downtime: {record.downtime}</p>
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
