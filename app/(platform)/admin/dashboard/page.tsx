"use client";

import {
  Activity,
  AlertTriangle,
  LifeBuoy,
  Link2,
  Monitor,
  ShieldAlert,
  Users,
} from "lucide-react";
import Link from "next/link";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAdminDashboardStats,
  mockIntegrations,
  mockServiceHealth,
  mockSupportTickets,
  mockSystemLogs,
} from "@/constants/admin-mock-data";

const logLevelColors: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  info: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]", label: "INFO" },
  warning: { bg: "bg-[#fffbeb]", text: "text-[#b45309]", label: "WARN" },
  error: { bg: "bg-[#fef2f2]", text: "text-[#b91c1c]", label: "ERROR" },
  critical: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]", label: "CRIT" },
};

const integrationStatusColors: Record<string, { dot: string; text: string }> =
  {
    Connected: { dot: "bg-[#22c55e]", text: "text-[#166534]" },
    Disconnected: { dot: "bg-[#94a3b8]", text: "text-[#475569]" },
    Error: { dot: "bg-[#ef4444]", text: "text-[#991b1b]" },
    Syncing: { dot: "bg-[#3b82f6]", text: "text-[#1e40af]" },
  };

const serviceStatusColors: Record<string, { bg: string; text: string }> = {
  Healthy: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Degraded: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Down: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const ticketPriorityColors: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  High: { bg: "bg-[#ffedd5]", text: "text-[#9a3412]" },
  Medium: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Low: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
};

const quickActions = [
  { label: "Manage Users", href: "/admin/users", icon: Users },
  { label: "Roles & Perms", href: "/admin/roles", icon: ShieldAlert },
  { label: "System Config", href: "/admin/system-config", icon: Link2 },
  { label: "Monitoring", href: "/admin/monitoring", icon: Activity },
  { label: "Security", href: "/admin/security", icon: ShieldAlert },
  { label: "Support", href: "/admin/support", icon: LifeBuoy },
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AdminDashboardPage() {
  const stats = mockAdminDashboardStats;
  const recentLogs = mockSystemLogs.slice(0, 5);
  const openTickets = mockSupportTickets
    .filter((t) => t.status === "Open" || t.status === "InProgress")
    .slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Admin Dashboard"
        description="System overview, health status, and key administrative metrics"
      />

      {stats.securityAlerts > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#dc2626]" />
          <p className="text-sm text-[#991b1b]">
            <span className="font-semibold">
              {stats.securityAlerts} security alert
              {stats.securityAlerts > 1 ? "s" : ""} require attention.
            </span>{" "}
            <Link
              href="/admin/security"
              className="underline underline-offset-2"
            >
              View Security →
            </Link>
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          subtitle={`${stats.activeUsers} active`}
        />
        <StatCard
          label="Active Sessions"
          value={stats.activeSessions}
          icon={Monitor}
          accent="info"
        />
        <StatCard
          label="System Uptime"
          value={`${stats.systemUptime}%`}
          icon={Activity}
          accent={stats.systemUptime >= 99.5 ? "success" : "warning"}
        />
        <StatCard
          label="Error Rate"
          value={`${stats.errorRate}%`}
          icon={AlertTriangle}
          accent={stats.errorRate > 1 ? "danger" : "success"}
        />
        <StatCard
          label="Pending Tickets"
          value={stats.pendingTickets}
          icon={LifeBuoy}
          accent={stats.pendingTickets > 5 ? "warning" : "default"}
        />
        <StatCard
          label="Security Alerts"
          value={stats.securityAlerts}
          icon={ShieldAlert}
          accent={stats.securityAlerts > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="Service Health"
            action={
              <Link
                href="/admin/monitoring"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Service</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Uptime</th>
                    <th className="pb-2 font-medium">Response</th>
                    <th className="pb-2 font-medium">CPU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockServiceHealth.map((svc) => {
                    const colors =
                      serviceStatusColors[svc.status] ??
                      serviceStatusColors.Down;
                    return (
                      <tr key={svc.id} className="hover:bg-secondary/40">
                        <td className="py-2 font-medium">{svc.name}</td>
                        <td className="py-2">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                          >
                            {svc.status}
                          </span>
                        </td>
                        <td className="py-2 text-secondary-foreground">
                          {svc.uptime}%
                        </td>
                        <td className="py-2 text-secondary-foreground">
                          {svc.status === "Down" ? "—" : `${svc.responseTime}ms`}
                        </td>
                        <td className="py-2 text-secondary-foreground">
                          {svc.status === "Down" ? "—" : `${svc.cpuUsage}%`}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Activity"
            action={
              <Link
                href="/admin/logs"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all logs →
              </Link>
            }
          >
            <div className="space-y-3">
              {recentLogs.map((log) => {
                const colors =
                  logLevelColors[log.level] ?? logLevelColors.info;
                return (
                  <div
                    key={log.id}
                    className="flex items-start gap-3 rounded-md p-2 hover:bg-secondary/40"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded px-1.5 py-0.5 text-xs font-bold ${colors.bg} ${colors.text}`}
                    >
                      {colors.label}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">
                        {log.message}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {log.source} · {formatTime(log.timestamp)} ·{" "}
                        {log.ipAddress}
                        {log.userName ? ` · ${log.userName}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-sm hover:bg-secondary/60 transition-colors"
                >
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Integrations"
            action={
              <Link
                href="/admin/system-config"
                className="text-secondary-foreground hover:text-foreground"
              >
                Manage →
              </Link>
            }
          >
            <div className="space-y-2.5">
              {mockIntegrations.map((integration) => {
                const colors =
                  integrationStatusColors[integration.status] ??
                  integrationStatusColors.Disconnected;
                return (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm font-medium">
                      {integration.name}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${colors.dot}`}
                      />
                      <span className={`text-xs font-medium ${colors.text}`}>
                        {integration.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard
            title="Open Tickets"
            action={
              <Link
                href="/admin/support"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="space-y-3">
              {openTickets.map((ticket) => {
                const colors =
                  ticketPriorityColors[ticket.priority] ??
                  ticketPriorityColors.Low;
                return (
                  <div key={ticket.id} className="space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-secondary-foreground">
                        {ticket.ticketNumber}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {ticket.priority}
                      </span>
                    </div>
                    <p className="line-clamp-1 text-sm">{ticket.subject}</p>
                    <p className="text-xs text-secondary-foreground">
                      {ticket.submittedBy} · {ticket.status}
                    </p>
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
