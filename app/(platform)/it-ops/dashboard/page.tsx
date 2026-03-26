"use client";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  ClipboardCheck,
  Database,
  Flame,
  Gauge,
  KeyRound,
  LayoutDashboard,
  Link2,
  Settings,
  ShieldAlert,
  Wrench,
  FileBarChart,
  Server,
  Zap,
} from "lucide-react";
import Link from "next/link";

import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockItOpsDashboardStats,
  mockItOpsServices,
  mockItOpsAlerts,
  mockItOpsIncidents,
  mockMaintenanceWindows,
  mockItOpsIntegrations,
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

const integrationStatusColors: Record<string, { dot: string; text: string }> = {
  Connected: { dot: "bg-[#22c55e]", text: "text-[#166534]" },
  Disconnected: { dot: "bg-[#94a3b8]", text: "text-[#475569]" },
  Error: { dot: "bg-[#ef4444]", text: "text-[#991b1b]" },
  Syncing: { dot: "bg-[#3b82f6]", text: "text-[#1e40af]" },
};

const incidentSeverityColors: Record<string, { bg: string; text: string }> = {
  P1: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  P2: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  P3: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  P4: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const quickActions = [
  { label: "Monitoring", href: "/it-ops/monitoring", icon: Activity },
  { label: "Integrations", href: "/it-ops/integrations", icon: Link2 },
  { label: "Incidents", href: "/it-ops/incidents", icon: Flame },
  { label: "Security", href: "/it-ops/security", icon: ShieldAlert },
  { label: "Backups", href: "/it-ops/backups", icon: Database },
  { label: "Performance", href: "/it-ops/performance", icon: Gauge },
  { label: "Access", href: "/it-ops/access", icon: KeyRound },
  { label: "Compliance", href: "/it-ops/compliance", icon: ClipboardCheck },
  { label: "Capacity", href: "/it-ops/capacity", icon: BarChart3 },
  { label: "Maintenance", href: "/it-ops/maintenance", icon: Wrench },
  { label: "Reports", href: "/it-ops/reports", icon: FileBarChart },
  { label: "Settings", href: "/it-ops/settings", icon: Settings },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsDashboardPage() {
  const stats = mockItOpsDashboardStats;
  const services = mockItOpsServices.slice(0, 6);
  const recentAlerts = mockItOpsAlerts.filter((a) => !a.resolvedAt).slice(0, 5);
  const openIncidents = mockItOpsIncidents
    .filter((i) => i.status !== "Resolved" && i.status !== "Closed")
    .slice(0, 3);
  const upcomingMaintenance = mockMaintenanceWindows
    .filter((m) => m.status === "Scheduled" || m.status === "InProgress")
    .slice(0, 2);

  return (
    <div>
      <PageHeader
        title="IT Operations"
        description="Infrastructure health, monitoring, and system operations overview"
      />

      {stats.activeAlerts > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#fde68a] bg-[#fffbeb] px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#b45309]" />
          <p className="text-sm text-[#92400e]">
            <span className="font-semibold">{stats.activeAlerts} active alert{stats.activeAlerts !== 1 ? "s" : ""}</span>
            {" "}require attention. {stats.openIncidents} open incident{stats.openIncidents !== 1 ? "s" : ""} in progress.
          </p>
          <Link href="/it-ops/incidents" className="ml-auto shrink-0 text-sm font-medium text-[#b45309] hover:underline">
            View Incidents →
          </Link>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="System Uptime"
          value={stats.uptime}
          icon={Activity}
          subtitle="Last 30 days"
          accent="success"
        />
        <StatCard
          label="Avg Response Time"
          value={stats.avgResponseTime}
          icon={Zap}
          subtitle="Across all services"
        />
        <StatCard
          label="Error Rate"
          value={stats.errorRate}
          icon={Server}
          subtitle="Last 24 hours"
        />
        <StatCard
          label="Active Alerts"
          value={stats.activeAlerts}
          icon={AlertTriangle}
          accent={stats.activeAlerts > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Open Incidents"
          value={stats.openIncidents}
          icon={Flame}
          accent={stats.openIncidents > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Pending Deployments"
          value={stats.pendingDeployments}
          icon={LayoutDashboard}
          accent="info"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main content — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Service Status */}
          <SectionCard
            title="Service Status"
            action={
              <Link href="/it-ops/monitoring" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[520px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Service</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Uptime</th>
                    <th className="pb-3 font-medium">Response</th>
                    <th className="pb-3 font-medium">CPU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {services.map((svc) => {
                    const colors = serviceStatusColors[svc.status] ?? serviceStatusColors.Healthy;
                    return (
                      <tr key={svc.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-3 font-medium">{svc.name}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {svc.status}
                          </span>
                        </td>
                        <td className={`py-3 ${svc.uptime < 99 ? "font-medium text-[#dc2626]" : "text-secondary-foreground"}`}>
                          {svc.status === "Down" || svc.status === "Maintenance" ? "—" : `${svc.uptime}%`}
                        </td>
                        <td className="py-3 text-secondary-foreground">
                          {svc.responseTime > 0 ? `${svc.responseTime}ms` : "—"}
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                              <div
                                className={`h-full rounded-full ${svc.cpuUsage > 80 ? "bg-[#ef4444]" : svc.cpuUsage > 60 ? "bg-[#f59e0b]" : "bg-foreground"}`}
                                style={{ width: `${svc.cpuUsage}%` }}
                              />
                            </div>
                            <span className="text-xs text-secondary-foreground">{svc.cpuUsage}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Recent Alerts */}
          <SectionCard
            title="Recent Alerts"
            action={
              <Link href="/it-ops/monitoring" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            {recentAlerts.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No active alerts.</p>
            ) : (
              <div className="divide-y divide-border">
                {recentAlerts.map((alert) => {
                  const colors = alertSeverityColors[alert.severity] ?? alertSeverityColors.info;
                  return (
                    <div key={alert.id} className="flex items-start gap-3 py-3">
                      <span className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{alert.title}</p>
                        <p className="text-xs text-secondary-foreground">{alert.service} · {formatTime(alert.timestamp)}</p>
                      </div>
                      {alert.acknowledged && (
                        <span className="shrink-0 text-xs text-[#22c55e]">ACK</span>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Open Incidents */}
          <SectionCard
            title="Open Incidents"
            action={
              <Link href="/it-ops/incidents" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            {openIncidents.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No open incidents.</p>
            ) : (
              <div className="divide-y divide-border">
                {openIncidents.map((incident) => {
                  const sevColors = incidentSeverityColors[incident.severity] ?? incidentSeverityColors.P4;
                  return (
                    <div key={incident.id} className="flex items-start gap-3 py-3">
                      <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${sevColors.bg} ${sevColors.text}`}>
                        {incident.severity}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{incident.title}</p>
                        <p className="text-xs text-secondary-foreground">
                          {incident.assignee} · {incident.affectedServices.join(", ")}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#eff6ff] px-2 py-0.5 text-xs font-medium text-[#1e40af]">
                        {incident.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Sidebar — 1/3 */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:bg-secondary"
                >
                  <action.icon className="h-4 w-4 shrink-0 text-secondary-foreground" />
                  <span className="truncate">{action.label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          {/* Upcoming Maintenance */}
          <SectionCard
            title="Upcoming Maintenance"
            action={
              <Link href="/it-ops/maintenance" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            {upcomingMaintenance.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No upcoming maintenance.</p>
            ) : (
              <div className="space-y-3">
                {upcomingMaintenance.map((mw) => (
                  <div key={mw.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{mw.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                        mw.status === "InProgress" ? "bg-[#fef9c3] text-[#854d0e]" : "bg-[#eff6ff] text-[#1e40af]"
                      }`}>
                        {mw.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      {new Date(mw.scheduledStart).toLocaleDateString("en-US", { month: "short", day: "numeric" })}{" "}
                      {formatTime(mw.scheduledStart)}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      Affects: {mw.affectedServices.join(", ")}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Integration Health */}
          <SectionCard
            title="Integration Health"
            action={
              <Link href="/it-ops/integrations" className="text-secondary-foreground hover:text-foreground">
                View all →
              </Link>
            }
          >
            <div className="space-y-2.5">
              {mockItOpsIntegrations.map((intg) => {
                const colors = integrationStatusColors[intg.status] ?? integrationStatusColors.Disconnected;
                return (
                  <div key={intg.id} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`h-2 w-2 shrink-0 rounded-full ${colors.dot}`} />
                      <span className="truncate text-sm">{intg.name}</span>
                    </div>
                    <span className={`shrink-0 text-xs font-medium ${colors.text}`}>{intg.status}</span>
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
