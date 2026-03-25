"use client";

import {
  AlertCircle,
  ArrowLeftRight,
  BarChart3,
  Briefcase,
  FileBarChart,
  TrendingDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";
import Link from "next/link";
import { SectionCard } from "@/components/resource/section-card";
import { StatCard } from "@/components/resource/stat-card";
import { StatusBadge } from "@/components/resource/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockResourceStats,
  mockResourceAlerts,
  mockTeachers,
  mockReplacements,
} from "@/constants/resource-mock-data";

const QUICK_ACTIONS = [
  { label: "Register Teacher", href: "/resource/teachers/register", icon: UserPlus },
  { label: "Create Assignment", href: "/resource/assignments", icon: Briefcase },
  { label: "Workload Report", href: "/resource/reports", icon: FileBarChart },
  { label: "Start Replacement", href: "/resource/replacements", icon: ArrowLeftRight },
  { label: "All Teachers", href: "/resource/teachers", icon: Users },
  { label: "Performance", href: "/resource/performance", icon: BarChart3 },
];

const NOW = new Date("2026-03-25").getTime();

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const expiringTeachers = mockTeachers.filter((t) => {
  if (!t.contractEndDate) return false;
  const daysLeft =
    (new Date(t.contractEndDate).getTime() - NOW) / (1000 * 60 * 60 * 24);
  return daysLeft <= 60 && daysLeft > 0;
});

export default function ResourceDashboardPage() {
  const workloadAlerts = mockResourceAlerts.filter((a) => a.type === "workload");
  const performanceAlerts = mockResourceAlerts.filter((a) => a.type === "performance");
  const contractAlerts = mockResourceAlerts.filter((a) => a.type === "contract");

  const activeReplacements = mockReplacements.filter(
    (r) => r.status === "Initiated" || r.status === "InProgress",
  );

  const pendingTeachers = mockTeachers.filter((t) => t.status === "Pending");

  return (
    <div>
      <PageHeader
        title="Resource Dashboard"
        description="Teacher management & resource allocation — Spring 2026"
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard
          label="Total Teachers"
          value={mockResourceStats.totalTeachers}
          icon={Users}
          subtitle={`${mockResourceStats.byStatus.active} active`}
        />
        <StatCard
          label="Active"
          value={mockResourceStats.byStatus.active}
          icon={UserCheck}
          subtitle="Currently teaching"
          accent="success"
        />
        <StatCard
          label="Pending Verification"
          value={mockResourceStats.byStatus.pending}
          icon={AlertCircle}
          subtitle="Awaiting review"
          accent={mockResourceStats.byStatus.pending > 0 ? "warning" : "default"}
        />
        <StatCard
          label="Suspended"
          value={mockResourceStats.byStatus.suspended}
          icon={Users}
          subtitle="Access revoked"
          accent={mockResourceStats.byStatus.suspended > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Active Assignments"
          value={mockResourceStats.activeAssignments}
          icon={Briefcase}
          subtitle="Current semester"
        />
        <StatCard
          label="Avg Workload"
          value={`${mockResourceStats.avgWorkloadHours}h/wk`}
          icon={BarChart3}
          subtitle="Across active teachers"
        />
        <StatCard
          label="Overloaded"
          value={mockResourceStats.overloadedCount}
          icon={TrendingUp}
          subtitle="Exceed max hours"
          accent={mockResourceStats.overloadedCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Expiring Contracts"
          value={mockResourceStats.expiringContracts}
          icon={FileBarChart}
          subtitle="Within 60 days"
          accent={mockResourceStats.expiringContracts > 0 ? "warning" : "default"}
        />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left — 2 cols */}
        <div className="space-y-6 lg:col-span-2">
          {/* Workload Alerts */}
          <SectionCard
            title="Workload Alerts"
            action={
              <Link
                href="/resource/workload"
                className="text-secondary-foreground hover:text-foreground"
              >
                View workload →
              </Link>
            }
          >
            {workloadAlerts.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No workload issues.</p>
            ) : (
              <div className="space-y-2">
                {workloadAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between rounded-md border border-[#fee2e2] bg-[#fff5f5] px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{alert.teacherName}</p>
                      <p className="text-xs text-secondary-foreground">{alert.message}</p>
                    </div>
                    <Link
                      href={`/resource/teachers/${alert.teacherId}`}
                      className="ml-3 shrink-0 text-xs text-secondary-foreground underline hover:text-foreground"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Performance Alerts */}
          <SectionCard
            title="Performance Alerts"
            action={
              <Link
                href="/resource/performance"
                className="text-secondary-foreground hover:text-foreground"
              >
                View performance →
              </Link>
            }
          >
            {performanceAlerts.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No performance issues.</p>
            ) : (
              <div className="space-y-2">
                {performanceAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between rounded-md border border-[#fef3c7] bg-[#fffbeb] px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-3.5 w-3.5 text-[#d97706]" />
                        <p className="text-sm font-medium">{alert.teacherName}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-secondary-foreground">{alert.message}</p>
                    </div>
                    <Link
                      href={`/resource/teachers/${alert.teacherId}`}
                      className="ml-3 shrink-0 text-xs text-secondary-foreground underline hover:text-foreground"
                    >
                      View
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </SectionCard>

          {/* Active Replacements */}
          <SectionCard
            title="Active Replacements"
            action={
              <Link
                href="/resource/replacements"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            {activeReplacements.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No active replacements.</p>
            ) : (
              <div className="space-y-2">
                {activeReplacements.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between rounded-md border px-3 py-2.5"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">
                        {r.currentTeacherName} → {r.newTeacherName}
                      </p>
                      <p className="text-xs text-secondary-foreground">
                        {r.reason} · Effective {formatDate(r.effectiveDate)}
                      </p>
                    </div>
                    <StatusBadge status={r.status} className="ml-3 shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right — 1 col */}
        <div className="space-y-6">
          {/* Pending Verification */}
          <SectionCard title="Pending Verification">
            <div className="mb-3 flex items-center justify-between rounded-md bg-[#fef3c7] px-4 py-3">
              <div>
                <p className="text-2xl font-bold text-[#92400e]">{pendingTeachers.length}</p>
                <p className="text-xs text-[#92400e]">teachers awaiting review</p>
              </div>
              <AlertCircle className="h-8 w-8 text-[#d97706]" />
            </div>
            {pendingTeachers.slice(0, 3).map((t) => (
              <div key={t.id} className="flex items-center justify-between py-1.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{t.name}</p>
                  <p className="text-xs text-secondary-foreground">{t.department}</p>
                </div>
                <Link
                  href={`/resource/teachers/${t.id}/verify`}
                  className="ml-3 shrink-0 rounded-md border border-foreground px-2.5 py-1 text-xs font-medium hover:bg-secondary"
                >
                  Verify
                </Link>
              </div>
            ))}
            <Link
              href="/resource/teachers"
              className="mt-3 block rounded-md border py-2 text-center text-sm font-medium hover:bg-secondary"
            >
              Go to Verification ({pendingTeachers.length}) →
            </Link>
          </SectionCard>

          {/* Expiring Contracts */}
          <SectionCard
            title="Expiring Contracts"
            action={
              <Link
                href="/resource/reports"
                className="text-secondary-foreground hover:text-foreground"
              >
                Reports →
              </Link>
            }
          >
            {contractAlerts.length === 0 ? (
              <p className="text-sm text-secondary-foreground">No contracts expiring soon.</p>
            ) : (
              <div className="space-y-2">
                {contractAlerts.map((alert) => {
                  const teacher = expiringTeachers.find((t) => t.id === alert.teacherId);
                  return (
                    <div key={alert.id} className="flex items-center justify-between py-1">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{alert.teacherName}</p>
                        <p className="truncate text-xs text-secondary-foreground">
                          {teacher?.contractEndDate ? formatDate(teacher.contractEndDate) : ""}
                        </p>
                      </div>
                      <span
                        className={`ml-2 shrink-0 text-xs font-medium ${
                          alert.severity === "danger"
                            ? "text-[#dc2626]"
                            : alert.severity === "warning"
                              ? "text-[#d97706]"
                              : "text-secondary-foreground"
                        }`}
                      >
                        {alert.severity === "danger"
                          ? "Critical"
                          : alert.severity === "warning"
                            ? "Soon"
                            : "Upcoming"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          {/* Quick Actions */}
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-center hover:bg-secondary"
                >
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                  <span className="text-xs font-medium leading-tight">{label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
