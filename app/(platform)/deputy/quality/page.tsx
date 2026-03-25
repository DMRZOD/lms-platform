"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertCircle, CheckCircle, ClipboardCheck, ShieldCheck } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockDepartmentPerformance,
  mockQualityMetrics,
} from "@/constants/deputy-mock-data";

const departments = [
  "All",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const statusConfig: Record<
  string,
  { label: string; color: string; bgColor: string }
> = {
  OnTrack: {
    label: "On Track",
    color: "text-[#166534]",
    bgColor: "bg-[#dcfce7]",
  },
  AtRisk: { label: "At Risk", color: "text-[#92400e]", bgColor: "bg-[#fef3c7]" },
  Critical: { label: "Critical", color: "text-[#991b1b]", bgColor: "bg-[#fee2e2]" },
  Exceeded: { label: "Exceeded", color: "text-[#1e40af]", bgColor: "bg-[#dbeafe]" },
};

export default function QualityPage() {
  const [deptFilter, setDeptFilter] = useState("All");

  const avgQuality =
    mockDepartmentPerformance.reduce((s, d) => s + d.qualityScore, 0) /
    mockDepartmentPerformance.length;
  const totalAudits = mockQualityMetrics.reduce(
    (s, q) => s + q.auditsCompleted,
    0,
  );
  const openIssues = mockQualityMetrics.reduce(
    (s, q) => s + q.issuesOpen,
    0,
  );
  const firstPassRate =
    (mockQualityMetrics.filter((q) => q.issuesOpen === 0).length /
      mockQualityMetrics.length) *
    100;

  const filteredMetrics =
    deptFilter === "All"
      ? mockQualityMetrics
      : mockQualityMetrics.filter((m) => m.department === deptFilter);

  const barChartData = mockDepartmentPerformance.map((d) => ({
    name: d.department.split(" ")[0],
    score: d.qualityScore,
  }));

  const complianceByDept = mockDepartmentPerformance.map((d) => {
    const deptMetrics = mockQualityMetrics.filter(
      (m) => m.department === d.department,
    );
    const avgScore =
      deptMetrics.length > 0
        ? deptMetrics.reduce((s, m) => s + (m.score / m.maxScore) * 100, 0) /
          deptMetrics.length
        : d.qualityScore;
    return { department: d.department, compliance: avgScore };
  });

  const recentFindings = [...mockQualityMetrics]
    .filter((m) => m.issuesOpen > 0)
    .sort((a, b) => b.issuesOpen - a.issuesOpen)
    .slice(0, 5);

  return (
    <div>
      <PageHeader
        title="Quality Monitoring"
        description="AQAD compliance, audit results, and quality scores across all departments"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Overall Quality Score"
          value={`${avgQuality.toFixed(1)}/100`}
          icon={ShieldCheck}
          accent={avgQuality >= 90 ? "success" : "warning"}
          subtitle="University average"
        />
        <StatCard
          label="Audits Completed"
          value={totalAudits}
          icon={ClipboardCheck}
          accent="info"
          subtitle="This semester"
        />
        <StatCard
          label="Open Issues"
          value={openIssues}
          icon={AlertCircle}
          accent={openIssues > 10 ? "danger" : "warning"}
          subtitle="Require resolution"
        />
        <StatCard
          label="First-Pass Rate"
          value={`${firstPassRate.toFixed(0)}%`}
          icon={CheckCircle}
          accent={firstPassRate >= 50 ? "success" : "warning"}
          subtitle="No issues found"
        />
      </div>

      <div className="mb-6">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SectionCard title="Quality Scores by Department">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={barChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}`, "Quality Score"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="score" radius={[4, 4, 0, 0]} fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Quality Metrics">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Metric</th>
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Score</th>
                    <th className="pb-2 font-medium">Status</th>
                    <th className="pb-2 font-medium">Issues</th>
                    <th className="pb-2 font-medium">Last Audit</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMetrics.map((m) => {
                    const cfg = statusConfig[m.status];
                    return (
                      <tr
                        key={m.id}
                        className="border-b border-border hover:bg-secondary/50 last:border-0"
                      >
                        <td className="py-2.5 font-medium">{m.name}</td>
                        <td className="py-2.5 text-secondary-foreground">
                          {m.department}
                        </td>
                        <td className="py-2.5">
                          {m.score}/{m.maxScore}
                        </td>
                        <td className="py-2.5">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bgColor} ${cfg.color}`}
                          >
                            {cfg.label}
                          </span>
                        </td>
                        <td
                          className={`py-2.5 ${m.issuesOpen > 5 ? "font-medium text-[#991b1b]" : m.issuesOpen > 2 ? "text-[#92400e]" : ""}`}
                        >
                          {m.issuesOpen}
                        </td>
                        <td className="py-2.5 text-xs text-secondary-foreground">
                          {m.lastAuditDate}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="AQAD Compliance">
            <div className="space-y-4">
              {complianceByDept.map((d) => (
                <div key={d.department}>
                  <div className="mb-1 flex items-center justify-between text-sm">
                    <span className="font-medium">
                      {d.department.split(" ")[0]}
                    </span>
                    <span
                      className={
                        d.compliance >= 90
                          ? "text-[#166534]"
                          : d.compliance >= 80
                            ? "text-[#92400e]"
                            : "text-[#991b1b]"
                      }
                    >
                      {d.compliance.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className={`h-full rounded-full ${d.compliance >= 90 ? "bg-[#22c55e]" : d.compliance >= 80 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                      style={{ width: `${d.compliance}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Issues — Needs Attention">
            <div className="space-y-3">
              {recentFindings.map((m) => (
                <div
                  key={m.id}
                  className="flex items-start gap-2 rounded-lg border border-border p-3"
                >
                  <AlertCircle
                    className={`mt-0.5 h-4 w-4 shrink-0 ${m.issuesOpen > 5 ? "text-[#ef4444]" : "text-[#f59e0b]"}`}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      {m.department}
                    </p>
                    <p className="mt-1 text-xs font-medium text-[#991b1b]">
                      {m.issuesOpen} open issues
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
