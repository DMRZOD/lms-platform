"use client";

import Link from "next/link";
import {
  AlertTriangle,
  BarChart3,
  DollarSign,
  Flame,
  FileBarChart,
  GitCompare,
  GraduationCap,
  LineChart,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { KPIGauge } from "@/components/deputy/kpi-gauge";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockDeputyStats,
  mockDepartmentPerformance,
  mockIncidents,
  mockKPIs,
  mockReportHistory,
} from "@/constants/deputy-mock-data";

const severityConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  critical: {
    label: "Critical",
    color: "text-[#991b1b]",
    bgColor: "bg-[#fee2e2]",
  },
  high: { label: "High", color: "text-[#92400e]", bgColor: "bg-[#fef3c7]" },
  medium: {
    label: "Medium",
    color: "text-[#1e40af]",
    bgColor: "bg-[#dbeafe]",
  },
  low: { label: "Low", color: "text-[#374151]", bgColor: "bg-[#f3f4f6]" },
};

const quickActions = [
  { label: "KPI Center", href: "/deputy/kpi-center", icon: Target },
  { label: "Academic", href: "/deputy/academic", icon: GraduationCap },
  { label: "Financial", href: "/deputy/financial", icon: DollarSign },
  { label: "Incidents", href: "/deputy/incidents", icon: Flame },
  { label: "Forecasting", href: "/deputy/forecasting", icon: LineChart },
  { label: "Reports", href: "/deputy/reports", icon: FileBarChart },
];

export default function DeputyDashboardPage() {
  const topKPIs = mockKPIs.slice(0, 8);
  const openIncidents = mockIncidents.filter((i) => i.status !== "resolved");
  const recentReports = mockReportHistory.slice(0, 3);

  return (
    <div>
      <PageHeader
        title="Executive Dashboard"
        description="Strategic overview of university performance across all departments"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6">
        <StatCard
          label="Total Students"
          value={mockDeputyStats.totalStudents.toLocaleString()}
          icon={Users}
          subtitle="Active enrollments"
        />
        <StatCard
          label="Total Teachers"
          value={mockDeputyStats.totalTeachers}
          icon={GraduationCap}
          subtitle="Faculty members"
        />
        <StatCard
          label="Overall GPA"
          value={mockDeputyStats.overallGPA.toFixed(2)}
          icon={BarChart3}
          accent="success"
          subtitle="University average"
        />
        <StatCard
          label="Retention Rate"
          value={`${mockDeputyStats.retentionRate}%`}
          icon={TrendingUp}
          accent={mockDeputyStats.retentionRate >= 90 ? "success" : "warning"}
          subtitle="Student retention"
        />
        <StatCard
          label="Satisfaction"
          value={`${mockDeputyStats.satisfactionScore}/5.0`}
          icon={GitCompare}
          accent={
            mockDeputyStats.satisfactionScore >= 4.3 ? "success" : "warning"
          }
          subtitle="Student score"
        />
        <StatCard
          label="Revenue YTD"
          value={`$${(mockDeputyStats.revenueYTD / 1_000_000).toFixed(1)}M`}
          icon={DollarSign}
          accent="info"
          subtitle="Year to date"
        />
      </div>

      {mockDeputyStats.kpisAtRisk > 3 && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#fca5a5] bg-[#fef2f2] p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-[#ef4444]" />
          <div>
            <p className="text-sm font-medium text-[#991b1b]">
              {mockDeputyStats.kpisAtRisk} KPIs at risk require attention
            </p>
            <p className="mt-0.5 text-xs text-[#991b1b]/80">
              Review the KPI Center to identify and address performance gaps
              across departments.
            </p>
          </div>
          <Link
            href="/deputy/kpi-center"
            className="ml-auto shrink-0 text-xs font-medium text-[#991b1b] hover:underline"
          >
            View KPI Center →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard
            title="KPI Summary"
            action={
              <Link
                href="/deputy/kpi-center"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {topKPIs.map((kpi) => (
                <KPIGauge key={kpi.id} kpi={kpi} />
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Department Rankings"
            action={
              <Link
                href="/deputy/comparative"
                className="text-secondary-foreground hover:text-foreground"
              >
                View comparative →
              </Link>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">GPA</th>
                    <th className="pb-2 font-medium">Retention</th>
                    <th className="pb-2 font-medium">Quality</th>
                    <th className="pb-2 font-medium">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {[...mockDepartmentPerformance]
                    .sort((a, b) => b.qualityScore - a.qualityScore)
                    .map((dept, i) => (
                      <tr
                        key={dept.department}
                        className="border-b border-border last:border-0"
                      >
                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs font-medium text-secondary-foreground">
                              {i + 1}
                            </span>
                            <span className="font-medium">
                              {dept.department}
                            </span>
                          </div>
                        </td>
                        <td
                          className={`py-2.5 ${dept.gpa >= 3.5 ? "text-[#166534]" : dept.gpa >= 3.3 ? "" : "text-[#991b1b]"}`}
                        >
                          {dept.gpa.toFixed(2)}
                        </td>
                        <td
                          className={`py-2.5 ${dept.retentionRate >= 90 ? "text-[#166534]" : dept.retentionRate >= 85 ? "" : "text-[#991b1b]"}`}
                        >
                          {dept.retentionRate}%
                        </td>
                        <td
                          className={`py-2.5 ${dept.qualityScore >= 90 ? "text-[#166534]" : dept.qualityScore >= 85 ? "" : "text-[#991b1b]"}`}
                        >
                          {dept.qualityScore}
                        </td>
                        <td className="py-2.5 text-secondary-foreground">
                          ${(dept.revenueCollected / 1_000_000).toFixed(1)}M
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-border p-3 text-center text-xs hover:bg-secondary"
                >
                  <Icon className="h-5 w-5 text-secondary-foreground" />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </SectionCard>

          <SectionCard
            title="Open Incidents"
            action={
              <Link
                href="/deputy/incidents"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="space-y-3">
              {openIncidents.slice(0, 3).map((incident) => {
                const cfg = severityConfig[incident.severity];
                return (
                  <div
                    key={incident.id}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span
                      className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bgColor} ${cfg.color}`}
                    >
                      {cfg.label}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-medium">{incident.title}</p>
                      <p className="text-xs text-secondary-foreground">
                        {incident.department}
                      </p>
                    </div>
                  </div>
                );
              })}
              {openIncidents.length === 0 && (
                <p className="text-sm text-secondary-foreground">
                  No open incidents
                </p>
              )}
            </div>
          </SectionCard>

          <SectionCard
            title="Recent Reports"
            action={
              <Link
                href="/deputy/reports"
                className="text-secondary-foreground hover:text-foreground"
              >
                View all →
              </Link>
            }
          >
            <div className="space-y-3">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center gap-2 text-sm">
                  <FileBarChart className="h-4 w-4 shrink-0 text-secondary-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {report.title}
                    </p>
                    <p className="text-xs text-secondary-foreground">
                      {report.period} · {report.format}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs font-medium text-[#166534]">
                    {report.status}
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
