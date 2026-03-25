"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GitCompare, TrendingDown, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockComparativeData,
  mockDepartmentPerformance,
  semesterGPATrend,
} from "@/constants/deputy-mock-data";

const metrics = [
  { label: "GPA", value: "GPA" },
  { label: "Retention Rate", value: "Retention" },
  { label: "Satisfaction Score", value: "Satisfaction" },
  { label: "Quality Score", value: "Quality" },
  { label: "Collection Rate", value: "Revenue" },
];

const periods = [
  "This Semester vs Last Semester",
  "This Year vs Last Year",
  "Q1 2026 vs Q1 2025",
];

export default function ComparativePage() {
  const [metric, setMetric] = useState("GPA");
  const [periodComparison, setPeriodComparison] = useState(periods[0]);

  const getMetricValue = (dept: (typeof mockDepartmentPerformance)[0]) => {
    switch (metric) {
      case "GPA": return dept.gpa;
      case "Retention": return dept.retentionRate;
      case "Satisfaction": return dept.satisfactionScore;
      case "Quality": return dept.qualityScore;
      case "Revenue": return dept.revenueCollected / 1_000_000;
      default: return dept.gpa;
    }
  };

  const getUnit = () => {
    if (metric === "Satisfaction") return "/5.0";
    if (metric === "Revenue") return "M";
    if (metric === "GPA") return "";
    return "%";
  };

  const sortedDepts = [...mockDepartmentPerformance].sort(
    (a, b) => getMetricValue(b) - getMetricValue(a),
  );

  const topPerformer = sortedDepts[0];
  const bottomPerformer = sortedDepts[sortedDepts.length - 1];

  const previousOffsets: Record<string, number> = {
    Engineering: -0.032,
    Economics: 0.014,
    "Health Sciences": -0.026,
    Humanities: -0.009,
    Design: -0.027,
    "Natural Sciences": -0.009,
  };

  const barChartData = mockDepartmentPerformance.map((d) => {
    const current = getMetricValue(d);
    const offset = previousOffsets[d.department] ?? 0;
    const previous = current * (1 + offset);
    return {
      name: d.department.split(" ")[0],
      current: parseFloat(current.toFixed(2)),
      previous: parseFloat(previous.toFixed(2)),
    };
  });

  const lineChartData = semesterGPATrend.map((s) => ({
    semester: s.semester.split(" ")[0],
    Engineering: +(s.gpa + 0.13).toFixed(2),
    Economics: +(s.gpa - 0.04).toFixed(2),
    "Health Sci": +(s.gpa + 0.19).toFixed(2),
    Humanities: +(s.gpa + 0.02).toFixed(2),
    Design: +(s.gpa + 0.06).toFixed(2),
    "Nat Sci": +(s.gpa + 0.09).toFixed(2),
  }));

  const lineColors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];
  const lineKeys = [
    "Engineering",
    "Economics",
    "Health Sci",
    "Humanities",
    "Design",
    "Nat Sci",
  ];

  return (
    <div>
      <PageHeader
        title="Comparative Analytics"
        description="Cross-department and period-over-period performance comparison"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Metric Being Compared"
          value={metrics.find((m) => m.value === metric)?.label ?? metric}
          icon={GitCompare}
          subtitle={periodComparison}
        />
        <StatCard
          label="Top Performer"
          value={topPerformer.department.split(" ")[0]}
          icon={TrendingUp}
          accent="success"
          subtitle={`${metric}: ${getMetricValue(topPerformer).toFixed(2)}${getUnit()}`}
        />
        <StatCard
          label="Needs Attention"
          value={bottomPerformer.department.split(" ")[0]}
          icon={TrendingDown}
          accent="warning"
          subtitle={`${metric}: ${getMetricValue(bottomPerformer).toFixed(2)}${getUnit()}`}
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {metrics.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <select
          value={periodComparison}
          onChange={(e) => setPeriodComparison(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {periods.map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title={`${metric} — Current vs Previous Period`}>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="previous" fill="#e3e3e3" radius={[4, 4, 0, 0]} name="Previous" />
              <Bar dataKey="current" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Current" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#e3e3e3]" /> Previous Period
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#3b82f6]" /> Current Period
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Department Ranking">
          <div className="overflow-y-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                  <th className="pb-2 font-medium">Rank</th>
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Current</th>
                  <th className="pb-2 font-medium">Change</th>
                  <th className="pb-2 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {sortedDepts.map((d, i) => {
                  const currentVal = getMetricValue(d);
                  const change = mockComparativeData.find(
                    (c) => c.department === d.department,
                  )?.changePercent ?? 0;
                  return (
                    <tr
                      key={d.department}
                      className={`border-b border-border last:border-0 ${i === 0 ? "bg-[#fef3c7]/30" : ""}`}
                    >
                      <td className="py-2.5">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${i === 0 ? "bg-[#fef3c7] text-[#92400e]" : "bg-secondary text-secondary-foreground"}`}>
                          {i + 1}
                        </span>
                      </td>
                      <td className="py-2.5 font-medium">{d.department}</td>
                      <td className="py-2.5">
                        {currentVal.toFixed(2)}
                        {getUnit()}
                      </td>
                      <td
                        className={`py-2.5 text-xs font-medium ${change >= 0 ? "text-[#166534]" : "text-[#991b1b]"}`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change.toFixed(1)}%
                      </td>
                      <td className="py-2.5">
                        {change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-[#22c55e]" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-[#ef4444]" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="GPA Trend by Department" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="semester" tick={{ fontSize: 12 }} />
              <YAxis domain={[3.2, 3.8]} tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              {lineKeys.map((key, i) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={lineColors[i]}
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {lineKeys.map((key, i) => (
              <span key={key} className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: lineColors[i] }}
                />
                {key}
              </span>
            ))}
          </div>
        </SectionCard>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:col-span-2">
          <SectionCard title="Top Improver">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dcfce7]">
                <TrendingUp className="h-6 w-6 text-[#22c55e]" />
              </div>
              <p className="mt-3 text-lg font-bold">
                {topPerformer.department}
              </p>
              <p className="text-sm text-secondary-foreground">
                {metric}: {getMetricValue(topPerformer).toFixed(2)}
                {getUnit()}
              </p>
              <span className="mt-2 rounded-full bg-[#dcfce7] px-3 py-1 text-sm font-medium text-[#166534]">
                Highest performing department
              </span>
            </div>
          </SectionCard>

          <SectionCard title="Needs Attention">
            <div className="flex flex-col items-center py-4 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7]">
                <TrendingDown className="h-6 w-6 text-[#f59e0b]" />
              </div>
              <p className="mt-3 text-lg font-bold">
                {bottomPerformer.department}
              </p>
              <p className="text-sm text-secondary-foreground">
                {metric}: {getMetricValue(bottomPerformer).toFixed(2)}
                {getUnit()}
              </p>
              <span className="mt-2 rounded-full bg-[#fef3c7] px-3 py-1 text-sm font-medium text-[#92400e]">
                Below department average
              </span>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
