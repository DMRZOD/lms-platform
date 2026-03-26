"use client";

import {
  Activity,
  AlertTriangle,
  Clock,
  Cpu,
  Database,
  HardDrive,
  Wifi,
} from "lucide-react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockMonitoringStats,
  mockServiceHealth,
  mockSystemMetrics,
} from "@/constants/admin-mock-data";
import type { ServiceStatus } from "@/types/admin";

const serviceStatusColors: Record<
  ServiceStatus,
  { bg: string; text: string }
> = {
  Healthy: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Degraded: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Down: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

function usageColor(pct: number) {
  if (pct >= 90) return "bg-[#ef4444]";
  if (pct >= 75) return "bg-[#f59e0b]";
  return "bg-[#22c55e]";
}

function usageAccent(
  pct: number,
): "danger" | "warning" | "success" {
  if (pct >= 90) return "danger";
  if (pct >= 75) return "warning";
  return "success";
}

function responseAccent(ms: number): "danger" | "warning" | "default" {
  if (ms >= 500) return "danger";
  if (ms >= 300) return "warning";
  return "default";
}

export default function AdminMonitoringPage() {
  const s = mockMonitoringStats;
  const degradedOrDown = mockServiceHealth.filter(
    (svc) => svc.status !== "Healthy",
  );

  return (
    <div>
      <PageHeader
        title="System Monitoring"
        description="Real-time system health, performance metrics, and service status"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="CPU Usage"
          value={`${s.cpuUsage}%`}
          icon={Cpu}
          accent={usageAccent(s.cpuUsage)}
        />
        <StatCard
          label="Memory Usage"
          value={`${s.memoryUsage}%`}
          icon={HardDrive}
          accent={usageAccent(s.memoryUsage)}
        />
        <StatCard
          label="Disk Usage"
          value={`${s.diskUsage}%`}
          icon={Database}
          accent={usageAccent(s.diskUsage)}
        />
        <StatCard
          label="Active Connections"
          value={s.activeConnections}
          icon={Wifi}
          accent="info"
        />
        <StatCard
          label="Requests / min"
          value={s.requestsPerMinute}
          icon={Activity}
        />
        <StatCard
          label="Avg Response"
          value={`${s.avgResponseTime}ms`}
          icon={Clock}
          accent={responseAccent(s.avgResponseTime)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Service Health">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Service</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Uptime</th>
                    <th className="pb-2 font-medium">Response</th>
                    <th className="pb-2 font-medium">CPU</th>
                    <th className="pb-2 font-medium">Memory</th>
                    <th className="pb-2 font-medium">Error Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockServiceHealth.map((svc) => {
                    const colors =
                      serviceStatusColors[svc.status] ??
                      serviceStatusColors.Down;
                    const isDown = svc.status === "Down";
                    return (
                      <tr
                        key={svc.id}
                        className="hover:bg-secondary/40 transition-colors"
                      >
                        <td className="py-2.5 font-medium">{svc.name}</td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                          >
                            {svc.status}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 ${svc.uptime < 99 ? "text-[#dc2626] font-medium" : "text-secondary-foreground"}`}
                        >
                          {svc.uptime}%
                        </td>
                        <td
                          className={`py-2.5 ${isDown ? "text-secondary-foreground" : svc.responseTime > 400 ? "text-[#dc2626] font-medium" : "text-secondary-foreground"}`}
                        >
                          {isDown ? "—" : `${svc.responseTime}ms`}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {isDown ? "—" : `${svc.cpuUsage}%`}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {isDown ? "—" : `${svc.memoryUsage}%`}
                        </td>
                        <td
                          className={`py-2.5 ${isDown ? "text-[#dc2626] font-medium" : svc.errorRate > 1 ? "text-[#dc2626] font-medium" : "text-secondary-foreground"}`}
                        >
                          {svc.errorRate === 100 ? "100%" : `${svc.errorRate}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard title="Performance Trend (Last 24h)">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Time</th>
                    <th className="pb-2 font-medium">CPU %</th>
                    <th className="pb-2 font-medium">Memory %</th>
                    <th className="pb-2 font-medium">Disk %</th>
                    <th className="pb-2 font-medium">Connections</th>
                    <th className="pb-2 font-medium">Req/min</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockSystemMetrics.map((m) => (
                    <tr
                      key={m.timestamp}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <td className="py-1.5 font-mono text-xs">
                        {m.timestamp}
                      </td>
                      <td
                        className={`py-1.5 ${m.cpuUsage >= 80 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}
                      >
                        {m.cpuUsage}%
                      </td>
                      <td
                        className={`py-1.5 ${m.memoryUsage >= 80 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}
                      >
                        {m.memoryUsage}%
                      </td>
                      <td
                        className={`py-1.5 ${m.diskUsage >= 90 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}
                      >
                        {m.diskUsage}%
                      </td>
                      <td className="py-1.5 text-secondary-foreground">
                        {m.activeConnections}
                      </td>
                      <td className="py-1.5 text-secondary-foreground">
                        {m.requestsPerMinute}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">
          {degradedOrDown.length > 0 && (
            <SectionCard title="System Alerts">
              <div className="space-y-3">
                {degradedOrDown.map((svc) => (
                  <div
                    key={svc.id}
                    className={`flex items-start gap-2.5 rounded-md p-3 ${svc.status === "Down" ? "bg-[#fef2f2]" : "bg-[#fffbeb]"}`}
                  >
                    <AlertTriangle
                      className={`mt-0.5 h-4 w-4 shrink-0 ${svc.status === "Down" ? "text-[#dc2626]" : "text-[#d97706]"}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${svc.status === "Down" ? "text-[#991b1b]" : "text-[#854d0e]"}`}
                      >
                        {svc.name}
                      </p>
                      <p
                        className={`text-xs ${svc.status === "Down" ? "text-[#b91c1c]" : "text-[#b45309]"}`}
                      >
                        {svc.status} · Uptime: {svc.uptime}% · Error:{" "}
                        {svc.errorRate}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          <SectionCard title="Resource Usage">
            <div className="space-y-4">
              {[
                { label: "CPU", value: s.cpuUsage },
                { label: "Memory", value: s.memoryUsage },
                { label: "Disk", value: s.diskUsage },
              ].map((r) => (
                <div key={r.label}>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="text-secondary-foreground">
                      {r.label}
                    </span>
                    <span
                      className={`font-semibold ${r.value >= 90 ? "text-[#dc2626]" : r.value >= 75 ? "text-[#d97706]" : "text-[#16a34a]"}`}
                    >
                      {r.value}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full transition-all ${usageColor(r.value)}`}
                      style={{ width: `${r.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Uptime Summary">
            <div className="divide-y divide-border">
              {mockServiceHealth.map((svc) => {
                const colors =
                  serviceStatusColors[svc.status] ??
                  serviceStatusColors.Down;
                return (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm">{svc.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-secondary-foreground">
                        {svc.uptime}%
                      </span>
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {svc.status}
                      </span>
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
