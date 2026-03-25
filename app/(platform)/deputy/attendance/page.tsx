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
import { AlertTriangle, CalendarCheck, TrendingDown, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockAttendanceSummary } from "@/constants/deputy-mock-data";

const departments = [
  "All",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const timeRanges = ["Last Month", "Last 3 Months", "This Semester"];

const months = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];

export default function AttendancePage() {
  const [deptFilter, setDeptFilter] = useState("All");
  const [timeRange, setTimeRange] = useState("This Semester");

  const universityAvg =
    mockAttendanceSummary.reduce((s, d) => s + d.avgAttendanceRate, 0) /
    mockAttendanceSummary.length;
  const belowThreshold = mockAttendanceSummary.filter(
    (d) => d.avgAttendanceRate < 85,
  ).length;

  const filteredSummary =
    deptFilter === "All"
      ? mockAttendanceSummary
      : mockAttendanceSummary.filter((d) => d.department === deptFilter);

  const barChartData = mockAttendanceSummary.map((d) => ({
    name: d.department.split(" ")[0],
    rate: d.avgAttendanceRate,
  }));

  const lineChartData = months.map((month) => {
    const entry: Record<string, string | number> = { month };
    mockAttendanceSummary.forEach((dept) => {
      const m = dept.byMonth.find((b) => b.month === month);
      if (m) entry[dept.department.split(" ")[0]] = m.rate;
    });
    return entry;
  });

  const colors = [
    "#3b82f6",
    "#22c55e",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
  ];

  const heatmapData = mockAttendanceSummary.map((dept) => ({
    dept: dept.department.split(" ")[0],
    months: dept.byMonth,
  }));

  return (
    <div>
      <PageHeader
        title="Attendance Analytics"
        description="University-wide student attendance monitoring and trend analysis"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="University Avg Attendance"
          value={`${universityAvg.toFixed(1)}%`}
          icon={CalendarCheck}
          accent={universityAvg >= 85 ? "success" : "warning"}
          subtitle="All departments"
        />
        <StatCard
          label="Below Threshold Depts"
          value={belowThreshold}
          icon={AlertTriangle}
          accent={belowThreshold > 0 ? "danger" : "success"}
          subtitle="Departments below 85%"
        />
        <StatCard
          label="University Trend"
          value={universityAvg >= 83 ? "Stable" : "Declining"}
          icon={universityAvg >= 83 ? TrendingUp : TrendingDown}
          accent={universityAvg >= 83 ? "success" : "warning"}
          subtitle="vs. last semester"
        />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {departments.map((d) => (
            <option key={d}>{d}</option>
          ))}
        </select>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {timeRanges.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Attendance by Department">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(1)}%`, "Attendance"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="rate"
                radius={[4, 4, 0, 0]}
                fill="#3b82f6"
                label={{ position: "top", fontSize: 10 }}
              />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 text-xs text-secondary-foreground">
            Threshold: 85% — departments below this require intervention
          </div>
        </SectionCard>

        <SectionCard title="Monthly Trend by Department">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={lineChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[70, 95]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [`${Number(v).toFixed(1)}%`, ""]}
                contentStyle={{ fontSize: 12 }}
              />
              {mockAttendanceSummary.map((dept, i) => (
                <Line
                  key={dept.department}
                  type="monotone"
                  dataKey={dept.department.split(" ")[0]}
                  stroke={colors[i]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-2 flex flex-wrap gap-3 text-xs">
            {mockAttendanceSummary.map((dept, i) => (
              <span key={dept.department} className="flex items-center gap-1">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: colors[i] }}
                />
                {dept.department.split(" ")[0]}
              </span>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Below Threshold Students">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Total</th>
                  <th className="pb-2 font-medium">Below 75%</th>
                  <th className="pb-2 font-medium">Below 50%</th>
                  <th className="pb-2 font-medium">Avg Rate</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((d) => (
                  <tr
                    key={d.department}
                    className={`border-b border-border last:border-0 ${d.avgAttendanceRate < 80 ? "bg-[#fef2f2]/50" : ""}`}
                  >
                    <td className="py-2.5 font-medium">{d.department}</td>
                    <td className="py-2.5">{d.totalStudents.toLocaleString()}</td>
                    <td
                      className={`py-2.5 ${d.belowThresholdCount > 100 ? "font-medium text-[#991b1b]" : ""}`}
                    >
                      {d.belowThresholdCount}
                    </td>
                    <td className="py-2.5 text-secondary-foreground">
                      {Math.round(d.belowThresholdCount * 0.3)}
                    </td>
                    <td
                      className={`py-2.5 font-medium ${d.avgAttendanceRate >= 85 ? "text-[#166534]" : d.avgAttendanceRate >= 75 ? "text-[#92400e]" : "text-[#991b1b]"}`}
                    >
                      {d.avgAttendanceRate.toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Attendance Heatmap">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-secondary-foreground">
                  <th className="pb-2 pr-3 font-medium">Dept</th>
                  {months.map((m) => (
                    <th key={m} className="pb-2 px-1 font-medium text-center">
                      {m}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.dept}>
                    <td className="py-1 pr-3 font-medium text-xs">{row.dept}</td>
                    {row.months.map((m) => (
                      <td key={m.month} className="py-1 px-1 text-center">
                        <div
                          className="mx-auto h-8 w-8 rounded text-center text-xs leading-8 font-medium"
                          style={{
                            backgroundColor:
                              m.rate >= 90
                                ? "#dcfce7"
                                : m.rate >= 85
                                  ? "#d1fae5"
                                  : m.rate >= 80
                                    ? "#fef3c7"
                                    : m.rate >= 75
                                      ? "#fed7aa"
                                      : "#fee2e2",
                            color:
                              m.rate >= 90
                                ? "#166534"
                                : m.rate >= 85
                                  ? "#166534"
                                  : m.rate >= 80
                                    ? "#92400e"
                                    : m.rate >= 75
                                      ? "#9a3412"
                                      : "#991b1b",
                          }}
                        >
                          {m.rate.toFixed(0)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex gap-3 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#dcfce7]" /> ≥90%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#fef3c7]" /> 80-85%
            </span>
            <span className="flex items-center gap-1">
              <span className="h-3 w-3 rounded bg-[#fee2e2]" /> &lt;75%
            </span>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
