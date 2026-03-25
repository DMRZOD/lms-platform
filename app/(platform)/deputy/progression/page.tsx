"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, Clock, TrendingDown, TrendingUp, Users } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockStudentProgression } from "@/constants/deputy-mock-data";

const atRiskIndicators = [
  { indicator: "GPA below 2.0", count: 128 },
  { indicator: "Attendance below 70%", count: 242 },
  { indicator: "3+ missing assignments", count: 184 },
  { indicator: "Academic probation", count: 67 },
  { indicator: "Payment overdue 60+ days", count: 94 },
];

export default function ProgressionPage() {
  const latestCohort = mockStudentProgression[0];
  const allAtRisk = mockStudentProgression.reduce(
    (s, c) => s + c.atRiskCount,
    0,
  );

  const avgRetention =
    mockStudentProgression.reduce((s, c) => s + c.retentionRate, 0) /
    mockStudentProgression.length;

  const cohortBarData = mockStudentProgression.map((c) => ({
    cohort: c.cohort,
    initial: c.initialEnrollment,
    current: c.currentEnrollment,
  }));

  const funnelData = [
    { label: "Enrolled (2022)", value: 1380, pct: 100 },
    { label: "Year 2 Retained", value: 1248, pct: 90.4 },
    { label: "Year 3 Retained", value: 1186, pct: 85.9 },
    { label: "Year 4 Retained", value: 1180, pct: 85.5 },
    { label: "Graduated", value: 1079, pct: 78.2 },
  ];

  return (
    <div>
      <PageHeader
        title="Student Retention & Progression"
        description="Cohort retention analysis, dropout risk monitoring, and graduation tracking"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Overall Retention"
          value={`${avgRetention.toFixed(1)}%`}
          icon={TrendingUp}
          accent={avgRetention >= 90 ? "success" : "warning"}
          subtitle="Avg across cohorts"
        />
        <StatCard
          label="At-Risk Students"
          value={allAtRisk}
          icon={AlertTriangle}
          accent="warning"
          subtitle="Require intervention"
        />
        <StatCard
          label="Graduation Rate"
          value="78.2%"
          icon={Users}
          accent="warning"
          subtitle="2022 cohort"
        />
        <StatCard
          label="Avg Time to Graduate"
          value={`${latestCohort.avgTimeToGraduation || 4.1} yrs`}
          icon={Clock}
          subtitle="Target: 4.0 years"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Cohort Enrollment: Initial vs Current">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={cohortBarData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="cohort" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="initial" fill="#e3e3e3" radius={[4, 4, 0, 0]} name="Initial" />
              <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#e3e3e3]" /> Initial Enrollment
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" /> Current Enrollment
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Retention Funnel — 2022 Cohort">
          <div className="flex flex-col items-center space-y-2 py-4">
            {funnelData.map((step, i) => (
              <div
                key={i}
                className="flex items-center"
                style={{ width: `${step.pct}%` }}
              >
                <div
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm ${
                    i === 0
                      ? "bg-[#3b82f6] text-white"
                      : i === funnelData.length - 1
                        ? "bg-[#22c55e] text-white"
                        : "bg-secondary"
                  }`}
                >
                  <span className="font-medium text-xs">{step.label}</span>
                  <span className="font-bold text-xs">{step.value.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-secondary-foreground">
            Width represents relative proportion of original cohort
          </p>
        </SectionCard>

        <SectionCard title="Cohort Details">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                  <th className="pb-2 font-medium">Cohort</th>
                  <th className="pb-2 font-medium">Initial</th>
                  <th className="pb-2 font-medium">Current</th>
                  <th className="pb-2 font-medium">Retention</th>
                  <th className="pb-2 font-medium">At Risk</th>
                  <th className="pb-2 font-medium">Dropped</th>
                </tr>
              </thead>
              <tbody>
                {mockStudentProgression.map((c) => (
                  <tr
                    key={c.cohort}
                    className="border-b border-border hover:bg-secondary/50 last:border-0"
                  >
                    <td className="py-2.5 font-medium">{c.cohort}</td>
                    <td className="py-2.5">{c.initialEnrollment.toLocaleString()}</td>
                    <td className="py-2.5">{c.currentEnrollment.toLocaleString()}</td>
                    <td
                      className={`py-2.5 font-medium ${c.retentionRate >= 90 ? "text-[#166534]" : c.retentionRate >= 85 ? "" : "text-[#991b1b]"}`}
                    >
                      {c.retentionRate}%
                    </td>
                    <td
                      className={`py-2.5 ${c.atRiskCount > 80 ? "text-[#ef4444] font-medium" : c.atRiskCount > 50 ? "text-[#f59e0b]" : ""}`}
                    >
                      {c.atRiskCount}
                    </td>
                    <td className="py-2.5 text-secondary-foreground">
                      {c.droppedCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="At-Risk Indicators">
          <div className="space-y-3">
            {atRiskIndicators.map((item, i) => {
              const maxCount = Math.max(...atRiskIndicators.map((x) => x.count));
              const pct = (item.count / maxCount) * 100;
              return (
                <div key={i}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <TrendingDown className="h-3.5 w-3.5 text-[#ef4444]" />
                      {item.indicator}
                    </span>
                    <span className="font-medium text-[#991b1b]">
                      {item.count}
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-[#ef4444]/70"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-xs text-secondary-foreground">
            Students may appear in multiple categories. Total unique at-risk:{" "}
            <span className="font-medium">{allAtRisk}</span>
          </p>
        </SectionCard>
      </div>
    </div>
  );
}
