"use client";

import {
  AlertTriangle,
  Ban,
  Monitor,
  ShieldAlert,
  ShieldCheck,
  X,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  mockActiveSessions,
  mockBlockedIPs,
  mockSecurityEvents,
  mockSecurityStats,
} from "@/constants/admin-mock-data";
import type { AlertSeverity, SecurityEventType, UserRole } from "@/types/admin";

const severityColors: Record<AlertSeverity, { bg: string; text: string }> = {
  danger: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  warning: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  info: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  success: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
};

const eventTypeLabels: Record<SecurityEventType, string> = {
  LoginFailed: "Login Failed",
  LoginSuccess: "Login Success",
  PasswordChanged: "Password Changed",
  "2FAEnabled": "2FA Enabled",
  "2FADisabled": "2FA Disabled",
  IPBlocked: "IP Blocked",
  SessionRevoked: "Session Revoked",
  RoleChanged: "Role Changed",
  SuspiciousActivity: "Suspicious Activity",
};

const eventTypeFilters = [
  { label: "All", value: "all" },
  { label: "Suspicious", value: "SuspiciousActivity" },
  { label: "Login Failed", value: "LoginFailed" },
  { label: "IP Blocked", value: "IPBlocked" },
  { label: "Role Changed", value: "RoleChanged" },
  { label: "Password Changed", value: "PasswordChanged" },
];

const roleColors: Record<string, { bg: string; text: string }> = {
  admin: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  "it-ops": { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
  deputy: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  academic: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  accountant: { bg: "bg-[#f0fdf4]", text: "text-[#15803d]" },
  aqad: { bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
  resource: { bg: "bg-[#fefce8]", text: "text-[#a16207]" },
  teacher: { bg: "bg-[#f0f9ff]", text: "text-[#0369a1]" },
  student: { bg: "bg-[#f8fafc]", text: "text-[#334155]" },
  applicant: { bg: "bg-[#fafaf9]", text: "text-[#44403c]" },
};

const roleLabelMap: Record<UserRole, string> = {
  admin: "Admin",
  "it-ops": "IT Ops",
  deputy: "Deputy",
  academic: "Academic",
  accountant: "Finance",
  aqad: "AQAD",
  resource: "Resource",
  teacher: "Teacher",
  student: "Student",
  applicant: "Applicant",
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function AdminSecurityPage() {
  const [eventFilter, setEventFilter] = useState("all");
  const s = mockSecurityStats;

  const filteredEvents = mockSecurityEvents.filter(
    (e) => eventFilter === "all" || e.type === eventFilter,
  );

  return (
    <div>
      <PageHeader
        title="Security Management"
        description="Security events, session management, IP blocking, and 2FA oversight"
      />

      {s.suspiciousActivities > 0 && (
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
          <AlertTriangle className="h-4 w-4 shrink-0 text-[#dc2626]" />
          <p className="text-sm text-[#991b1b]">
            <span className="font-semibold">
              {s.suspiciousActivities} suspicious activit
              {s.suspiciousActivities > 1 ? "ies" : "y"} detected.
            </span>{" "}
            Review the security events tab immediately.
          </p>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Failed Logins (24h)"
          value={s.failedLogins24h}
          icon={XCircle}
          accent={s.failedLogins24h > 20 ? "danger" : "default"}
        />
        <StatCard
          label="Blocked IPs"
          value={s.blockedIPs}
          icon={Ban}
          accent={s.blockedIPs > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Active Sessions"
          value={s.activeSessions}
          icon={Monitor}
          accent="info"
        />
        <StatCard
          label="2FA Adoption"
          value={`${s.twoFactorAdoption}%`}
          icon={ShieldCheck}
          accent={s.twoFactorAdoption >= 80 ? "success" : "warning"}
        />
        <StatCard
          label="Security Events (24h)"
          value={s.securityEvents24h}
          icon={ShieldAlert}
        />
        <StatCard
          label="Suspicious Activities"
          value={s.suspiciousActivities}
          icon={AlertTriangle}
          accent={s.suspiciousActivities > 0 ? "danger" : "success"}
        />
      </div>

      <Tabs defaultValue="events">
        <TabsList className="mb-6">
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="blocked">Blocked IPs</TabsTrigger>
        </TabsList>

        {/* ── Security Events ── */}
        <TabsContent value="events">
          <SectionCard>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {eventTypeFilters.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setEventFilter(f.value)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    eventFilter === f.value
                      ? "bg-foreground text-background"
                      : "border border-border bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              {filteredEvents.map((event) => {
                const colors =
                  severityColors[event.severity] ?? severityColors.info;
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-md border border-border p-3 hover:bg-secondary/40 transition-colors"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {event.severity.toUpperCase()}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">
                          {eventTypeLabels[event.type]}
                        </span>
                        <span className="text-xs text-secondary-foreground">
                          {formatDateTime(event.timestamp)}
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-secondary-foreground">
                        {event.details}
                      </p>
                      <p className="mt-0.5 text-xs text-secondary-foreground">
                        IP: {event.ipAddress}
                        {event.userName ? ` · User: ${event.userName}` : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
              {filteredEvents.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No events match the selected filter.
                </p>
              )}
            </div>
          </SectionCard>
        </TabsContent>

        {/* ── Active Sessions ── */}
        <TabsContent value="sessions">
          <SectionCard>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">User</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 font-medium">IP Address</th>
                    <th className="pb-2 font-medium">Location</th>
                    <th className="pb-2 font-medium">Started</th>
                    <th className="pb-2 font-medium">Last Activity</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockActiveSessions.map((session) => {
                    const rc =
                      roleColors[session.role] ?? roleColors.student;
                    return (
                      <tr
                        key={session.id}
                        className="hover:bg-secondary/40 transition-colors"
                      >
                        <td className="py-2.5">
                          <p className="font-medium">{session.userName}</p>
                          <p className="text-xs text-secondary-foreground">
                            {session.userAgent}
                          </p>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${rc.bg} ${rc.text}`}
                          >
                            {roleLabelMap[session.role]}
                          </span>
                        </td>
                        <td className="py-2.5 font-mono text-xs">
                          {session.ipAddress}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {session.location}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDateTime(session.startedAt)}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDateTime(session.lastActivity)}
                        </td>
                        <td className="py-2.5">
                          <button className="flex items-center gap-1 rounded-md border border-[#fecaca] bg-[#fef2f2] px-2 py-1 text-xs text-[#991b1b] hover:bg-[#fee2e2] transition-colors">
                            <X className="h-3 w-3" />
                            Revoke
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>

        {/* ── Blocked IPs ── */}
        <TabsContent value="blocked">
          <SectionCard>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">IP Address</th>
                    <th className="pb-2 font-medium">Reason</th>
                    <th className="pb-2 font-medium">Blocked At</th>
                    <th className="pb-2 font-medium">Blocked By</th>
                    <th className="pb-2 font-medium">Expires</th>
                    <th className="pb-2 text-center font-medium">Attempts</th>
                    <th className="pb-2 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockBlockedIPs.map((ip) => (
                    <tr
                      key={ip.id}
                      className="hover:bg-secondary/40 transition-colors"
                    >
                      <td className="py-2.5 font-mono text-xs">
                        {ip.ipAddress}
                      </td>
                      <td className="py-2.5 max-w-[200px]">
                        <p className="line-clamp-2 text-sm">{ip.reason}</p>
                      </td>
                      <td className="py-2.5 text-secondary-foreground">
                        {formatDateTime(ip.blockedAt)}
                      </td>
                      <td className="py-2.5 text-secondary-foreground">
                        {ip.blockedBy}
                      </td>
                      <td className="py-2.5 text-secondary-foreground">
                        {ip.expiresAt
                          ? formatDateTime(ip.expiresAt)
                          : "Permanent"}
                      </td>
                      <td className="py-2.5 text-center font-medium">
                        {ip.attempts.toLocaleString()}
                      </td>
                      <td className="py-2.5">
                        <button className="rounded-md border border-border bg-background px-2 py-1 text-xs hover:bg-secondary transition-colors">
                          Unblock
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
