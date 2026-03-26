"use client";

import {
  CheckCircle,
  Clock,
  Database,
  HardDrive,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { SectionCard } from "@/components/admin/section-card";
import { StatCard } from "@/components/admin/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockBackups,
  mockDisasterRecoveryPlans,
  mockMaintenanceStats,
} from "@/constants/admin-mock-data";
import type { BackupStatus, BackupType, DRPlanStatus } from "@/types/admin";

const backupStatusColors: Record<BackupStatus, { bg: string; text: string }> =
  {
    Completed: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
    Running: { bg: "bg-[#eff6ff]", text: "text-[#1d4ed8]" },
    Failed: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
    Scheduled: { bg: "bg-[#f1f5f9]", text: "text-[#475569]" },
  };

const backupTypeColors: Record<BackupType, { bg: string; text: string }> = {
  Full: { bg: "bg-[#f5f3ff]", text: "text-[#6d28d9]" },
  Incremental: { bg: "bg-[#fff7ed]", text: "text-[#c2410c]" },
  Differential: { bg: "bg-[#ecfeff]", text: "text-[#0e7490]" },
};

const drStatusColors: Record<DRPlanStatus, { bg: string; text: string }> = {
  Verified: { bg: "bg-[#dcfce7]", text: "text-[#166534]" },
  NeedsTesting: { bg: "bg-[#fef9c3]", text: "text-[#854d0e]" },
  Outdated: { bg: "bg-[#fee2e2]", text: "text-[#991b1b]" },
};

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Completed", value: "Completed" },
  { label: "Running", value: "Running" },
  { label: "Failed", value: "Failed" },
  { label: "Scheduled", value: "Scheduled" },
];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function AdminMaintenancePage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const s = mockMaintenanceStats;

  const filtered = mockBackups.filter(
    (b) => statusFilter === "all" || b.status === statusFilter,
  );

  return (
    <div>
      <PageHeader
        title="Backup & Disaster Recovery"
        description="System backups, recovery plans, and maintenance operations"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <StatCard
          label="Last Backup"
          value={new Date(s.lastBackup).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          icon={Database}
          subtitle="Today"
          accent="success"
        />
        <StatCard
          label="Success Rate"
          value={`${s.backupSuccessRate}%`}
          icon={CheckCircle}
          accent={s.backupSuccessRate >= 95 ? "success" : "warning"}
        />
        <StatCard
          label="Total Size"
          value={s.totalBackupSize}
          icon={HardDrive}
        />
        <StatCard
          label="DR Plans Verified"
          value={`${s.drPlansVerified}/${s.drPlansTotal}`}
          icon={CheckCircle}
          accent={
            s.drPlansVerified === s.drPlansTotal ? "success" : "warning"
          }
        />
        <StatCard
          label="Next Backup"
          value={new Date(s.nextScheduledBackup).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          icon={Clock}
          subtitle="Tomorrow"
          accent="info"
        />
        <StatCard
          label="Failed Backups"
          value={s.failedBackups}
          icon={XCircle}
          accent={s.failedBackups > 0 ? "danger" : "success"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Backup History — 2/3 */}
        <div className="lg:col-span-2">
          <SectionCard>
            <div className="mb-4 flex flex-wrap gap-1.5">
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
            <h2 className="mb-3 font-semibold">
              Backup History ({filtered.length})
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-secondary-foreground">
                    <th className="pb-2 font-medium">Type</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Started</th>
                    <th className="pb-2 font-medium">Completed</th>
                    <th className="pb-2 font-medium">Size</th>
                    <th className="pb-2 font-medium">Initiated By</th>
                    <th className="pb-2 text-center font-medium">Retention</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filtered.map((b) => {
                    const sc =
                      backupStatusColors[b.status] ??
                      backupStatusColors.Scheduled;
                    const tc =
                      backupTypeColors[b.type] ?? backupTypeColors.Full;
                    return (
                      <tr
                        key={b.id}
                        className="hover:bg-secondary/40 transition-colors"
                      >
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${tc.bg} ${tc.text}`}
                          >
                            {b.type}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${sc.bg} ${sc.text}`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {formatDateTime(b.startedAt)}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {b.completedAt ? formatDateTime(b.completedAt) : "—"}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {b.size}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          {b.initiatedBy}
                        </td>
                        <td className="py-2.5 text-center text-secondary-foreground">
                          {b.retentionDays}d
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <p className="py-8 text-center text-sm text-secondary-foreground">
                  No backups match the selected filter.
                </p>
              )}
            </div>
          </SectionCard>
        </div>

        {/* Right — 1/3 */}
        <div className="space-y-6">
          <SectionCard title="Disaster Recovery Plans">
            <div className="space-y-3">
              {mockDisasterRecoveryPlans.map((plan) => {
                const colors =
                  drStatusColors[plan.status] ?? drStatusColors.Outdated;
                return (
                  <div
                    key={plan.id}
                    className="rounded-md border border-border p-3"
                  >
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <p className="text-sm font-medium">{plan.name}</p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                      >
                        {plan.status}
                      </span>
                    </div>
                    <div className="flex gap-4 text-xs text-secondary-foreground">
                      <span>RTO: {plan.rtoMinutes}min</span>
                      <span>RPO: {plan.rpoMinutes}min</span>
                    </div>
                    <p className="mt-1 text-xs text-secondary-foreground">
                      Last tested: {formatDate(plan.lastTested)}
                    </p>
                  </div>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard title="Quick Actions">
            <div className="space-y-2">
              {[
                {
                  label: "Trigger Full Backup",
                  icon: Database,
                  variant: "primary",
                },
                {
                  label: "Trigger Incremental Backup",
                  icon: RefreshCw,
                  variant: "default",
                },
                {
                  label: "Test DR Plan",
                  icon: CheckCircle,
                  variant: "default",
                },
                {
                  label: "Download Latest Backup",
                  icon: HardDrive,
                  variant: "default",
                },
              ].map(({ label, icon: Icon, variant }) => (
                <button
                  key={label}
                  className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors ${
                    variant === "primary"
                      ? "border-foreground bg-foreground text-background hover:opacity-90"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Backup Schedule">
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Full backup</span>
                <span className="font-medium">Every 24h at 02:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">
                  Incremental
                </span>
                <span className="font-medium">Every 12h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">Retention</span>
                <span className="font-medium">Full: 30d / Inc: 7d</span>
              </div>
              <div className="flex justify-between">
                <span className="text-secondary-foreground">
                  Next scheduled
                </span>
                <span className="font-medium">
                  {new Date(s.nextScheduledBackup).toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
