"use client";

import { CheckCircle, Database, HardDrive, Shield } from "lucide-react";

import { SectionCard } from "@/components/it-ops/section-card";
import { StatCard } from "@/components/it-ops/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockBackupStats,
  mockItOpsBackups,
  mockItOpsDRPlans,
  mockRestoreTests,
} from "@/constants/it-ops-mock-data";

const backupStatusColors: Record<string, { bg: string; text: string }> = {
  Completed: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Running: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
  Scheduled: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  Skipped: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
};

const backupTypeColors: Record<string, { bg: string; text: string }> = {
  Full: { bg: "bg-[#fdf2f8]", text: "text-[#9d174d]" },
  Incremental: { bg: "bg-[#eff6ff]", text: "text-[#1e40af]" },
  Differential: { bg: "bg-[#f5f3ff]", text: "text-[#5b21b6]" },
};

const drStatusColors: Record<string, { bg: string; text: string }> = {
  Verified: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Untested: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const restoreResultColors: Record<string, { bg: string; text: string }> = {
  Success: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  Partial: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export default function ItOpsBackupsPage() {
  const stats = mockBackupStats;

  return (
    <div>
      <PageHeader
        title="Backup & Disaster Recovery"
        description="Backup schedules, restore tests, and DR plan readiness"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Last Backup"
          value={new Date(stats.lastBackup).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
          icon={Database}
          subtitle={new Date(stats.lastBackup).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
        />
        <StatCard
          label="Success Rate"
          value={stats.successRate}
          icon={CheckCircle}
          accent={parseFloat(stats.successRate) < 95 ? "warning" : "success"}
        />
        <StatCard
          label="Total Backup Size"
          value={stats.totalSize}
          icon={HardDrive}
        />
        <StatCard
          label="DR Plans Verified"
          value={`${stats.drPlansVerified}/${stats.drPlansTotal}`}
          icon={Shield}
          accent={stats.drPlansVerified < stats.drPlansTotal ? "warning" : "success"}
        />
        <StatCard
          label="Next Scheduled"
          value={new Date(stats.nextScheduled).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}
          subtitle={new Date(stats.nextScheduled).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          accent="info"
        />
        <StatCard
          label="Failed Backups"
          value={mockItOpsBackups.filter((b) => b.status === "Failed").length}
          accent={mockItOpsBackups.some((b) => b.status === "Failed") ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main — 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Backup Schedule */}
          <SectionCard title="Backup Schedule">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Backup Name</th>
                    <th className="pb-3 font-medium">Type</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Started</th>
                    <th className="pb-3 font-medium">Size</th>
                    <th className="pb-3 font-medium">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockItOpsBackups.map((bk) => {
                    const stColors = backupStatusColors[bk.status] ?? backupStatusColors.Scheduled;
                    const typeColors = backupTypeColors[bk.type] ?? backupTypeColors.Full;
                    return (
                      <tr key={bk.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{bk.name}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors.bg} ${typeColors.text}`}>
                            {bk.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${stColors.bg} ${stColors.text}`}>
                            {bk.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{formatDateTime(bk.startedAt)}</td>
                        <td className="py-2.5 text-secondary-foreground">{bk.size}</td>
                        <td className="py-2.5 text-secondary-foreground">{bk.retentionDays}d</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Recent Restore Tests */}
          <SectionCard title="Recent Restore Tests">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[440px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-3 font-medium">Backup</th>
                    <th className="pb-3 font-medium">Result</th>
                    <th className="pb-3 font-medium">Duration</th>
                    <th className="pb-3 font-medium">Tested At</th>
                    <th className="pb-3 font-medium">Tested By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockRestoreTests.map((rt) => {
                    const colors = restoreResultColors[rt.result] ?? restoreResultColors.Success;
                    return (
                      <tr key={rt.id} className="transition-colors hover:bg-secondary/40">
                        <td className="py-2.5 font-medium">{rt.backupName}</td>
                        <td className="py-2.5">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                            {rt.result}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">{rt.duration}</td>
                        <td className="py-2.5 text-secondary-foreground">{formatDateTime(rt.testedAt)}</td>
                        <td className="py-2.5 text-secondary-foreground">{rt.testedBy}</td>
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
          {/* DR Readiness */}
          <SectionCard title="DR Plan Readiness">
            <div className="space-y-3">
              {mockItOpsDRPlans.map((plan) => {
                const colors = drStatusColors[plan.status] ?? drStatusColors.Untested;
                return (
                  <div key={plan.id} className="rounded-md border border-border p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-snug">{plan.name}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}>
                        {plan.status}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      RTO: {plan.rtoMinutes}m · RPO: {plan.rpoMinutes}m
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      Last tested: {plan.lastTested}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          {/* RPO/RTO Summary */}
          <SectionCard title="SLA Targets">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-foreground">Core Services RTO</span>
                <span className="font-medium">120 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-foreground">Auth Service RTO</span>
                <span className="font-medium">30 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-foreground">Core Services RPO</span>
                <span className="font-medium">60 min</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary-foreground">Auth Service RPO</span>
                <span className="font-medium">15 min</span>
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-xs text-secondary-foreground">
                  All RTO/RPO targets defined in DR plans above.
                  Last full DR drill: <span className="font-medium text-foreground">Mar 1, 2026</span>
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              {[
                { label: "Trigger Manual Backup", desc: "Run an on-demand full backup" },
                { label: "Schedule Restore Test", desc: "Plan a DR restore validation" },
                { label: "View Backup Policies", desc: "Review retention settings" },
              ].map((action) => (
                <div
                  key={action.label}
                  className="cursor-pointer rounded-md border border-border p-3 transition-colors hover:bg-secondary"
                >
                  <p className="text-sm font-medium">{action.label}</p>
                  <p className="text-xs text-secondary-foreground">{action.desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
