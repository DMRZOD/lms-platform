"use client";

import { Bell, Key, Phone, Settings, Shield } from "lucide-react";

import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAlertThresholds,
  mockBackupRetentionPolicies,
  mockEscalationPolicies,
  mockNotificationChannels,
  mockOnCallEntries,
  mockSettingsStats,
} from "@/constants/it-ops-mock-data";

const channelTypeColors: Record<string, { bg: string; text: string }> = {
  Email: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Slack: { bg: "bg-[#f0fdf4]", text: "text-[#166534]" },
  Teams: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  SMS: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Webhook: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
};

const backupTypeColors: Record<string, { bg: string; text: string }> = {
  Full: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  Incremental: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Differential: { bg: "bg-[#f5f3ff]", text: "text-[#5b21b6]" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ItOpsSettingsPage() {
  const stats = mockSettingsStats;

  return (
    <div>
      <PageHeader
        title="IT Operations Settings"
        description="Configure notification channels, alert thresholds, backup policies, and on-call schedules"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Notification Channels"
          value={stats.notificationChannels}
          icon={Bell}
          subtitle={`${mockNotificationChannels.filter((c) => c.enabled).length} active`}
        />
        <StatCard
          label="Active Alert Rules"
          value={stats.activeAlertRules}
          icon={Shield}
        />
        <StatCard
          label="Backup Policies"
          value={stats.backupPolicies}
          icon={Settings}
        />
        <StatCard
          label="On-Call Members"
          value={stats.onCallMembers}
          icon={Phone}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Notification Channels */}
          <SectionCard title="Notification Channels">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Channel</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Endpoint</th>
                    <th className="pb-3 font-medium">Events</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockNotificationChannels.map((ch) => {
                    const typeColors = channelTypeColors[ch.type] ?? channelTypeColors.Webhook;
                    return (
                      <tr key={ch.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{ch.name}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {ch.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className="max-w-[160px] truncate font-mono text-xs text-secondary-foreground" title={ch.endpoint}>
                            {ch.endpoint.length > 30 ? ch.endpoint.slice(0, 30) + "…" : ch.endpoint}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex flex-wrap gap-1">
                            {ch.events.map((evt) => (
                              <span key={evt} className="rounded bg-secondary px-1.5 py-0.5 text-xs">{evt}</span>
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            ch.enabled ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f1f5f9] text-[#475569]"
                          }`}>
                            {ch.enabled ? "Enabled" : "Disabled"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Alert Thresholds */}
          <SectionCard title="Alert Thresholds">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Metric</th>
                    <th className="pb-3 font-medium">Warning Threshold</th>
                    <th className="pb-3 font-medium">Critical Threshold</th>
                    <th className="pb-3 font-medium">Unit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockAlertThresholds.map((threshold) => (
                    <tr key={threshold.id} className="transition-colors hover:bg-secondary/40">
                      <td className="py-2.5 font-medium">{threshold.metric}</td>
                      <td className="py-2.5">
                        <span className="font-medium text-[#b45309]">{threshold.warning}</span>
                        <span className="text-secondary-foreground"> {threshold.unit}</span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-medium text-[#dc2626]">{threshold.critical}</span>
                        <span className="text-secondary-foreground"> {threshold.unit}</span>
                      </td>
                      <td className="py-2.5 text-secondary-foreground">{threshold.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Backup Retention Policies */}
          <SectionCard title="Backup Retention Policies">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Policy Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Retention</th>
                    <th className="pb-3 font-medium">Storage</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockBackupRetentionPolicies.map((policy) => {
                    const typeColors = backupTypeColors[policy.backupType] ?? backupTypeColors.Full;
                    return (
                      <tr key={policy.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{policy.name}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {policy.backupType}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{policy.retentionDays} days</td>
                        <td className="py-2.5">
                          <span className="font-mono text-xs text-secondary-foreground">{policy.storageLocation}</span>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            policy.enabled ? "bg-[#dcfce7] text-[#166534]" : "bg-[#f1f5f9] text-[#475569]"
                          }`}>
                            {policy.enabled ? "Active" : "Disabled"}
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
          {/* On-Call Schedule */}
          <SectionCard title="On-Call Schedule">
            <div className="divide-y divide-border">
              {mockOnCallEntries.map((entry) => {
                const isCurrentWeek =
                  new Date(entry.startDate) <= new Date("2026-03-26") &&
                  new Date(entry.endDate) >= new Date("2026-03-26");
                return (
                  <div key={entry.id} className={`py-3 ${isCurrentWeek ? "rounded-md bg-secondary/40 px-2" : ""}`}>
                    {isCurrentWeek && (
                      <span className="mb-1 block text-xs font-medium text-[#1e40af]">Current Week</span>
                    )}
                    <p className="text-sm font-medium">{entry.name}</p>
                    <p className="text-xs text-secondary-foreground">{entry.role}</p>
                    <p className="text-xs text-secondary-foreground">
                      {formatDate(entry.startDate)} — {formatDate(entry.endDate)}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Phone className="h-3 w-3 text-secondary-foreground" />
                      <span className="text-xs text-secondary-foreground">{entry.phone}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* Escalation Policies */}
          <SectionCard title="Escalation Policies">
            <div className="space-y-4">
              {mockEscalationPolicies.map((policy) => (
                <div key={policy.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-semibold">{policy.name}</p>
                  <div className="mt-2 space-y-1.5">
                    {policy.levels.map((level) => (
                      <div key={level.level} className="flex items-center gap-2 text-xs">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-foreground text-background text-xs font-bold">
                          {level.level}
                        </span>
                        <span className="text-secondary-foreground">{level.contact}</span>
                        {level.delayMinutes > 0 && (
                          <span className="ml-auto text-secondary-foreground">+{level.delayMinutes}m</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* API Keys */}
          <SectionCard title="Integration API Keys">
            <div className="space-y-2.5 text-sm">
              {[
                { name: "Microsoft Graph API", key: "••••••••••••••••ab3f" },
                { name: "1C Accounting API", key: "••••••••••••••••9d2c" },
                { name: "aSc Timetables API", key: "••••••••••••••••7e4a" },
                { name: "Classmate API", key: "••••••••••••••••2b1e" },
              ].map((apiKey) => (
                <div key={apiKey.name} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
                  <div>
                    <p className="font-medium">{apiKey.name}</p>
                    <p className="flex items-center gap-1 font-mono text-xs text-secondary-foreground">
                      <Key className="h-3 w-3" />
                      {apiKey.key}
                    </p>
                  </div>
                  <button className="shrink-0 text-xs text-secondary-foreground hover:text-foreground">
                    Rotate
                  </button>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
