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
import { AlertTriangle, TrendingDown } from "lucide-react";
import { SectionCard } from "@/components/resource/section-card";
import { StatusBadge } from "@/components/resource/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockWorkload } from "@/constants/resource-mock-data";

const WORKLOAD_COLORS: Record<string, string> = {
  Normal: "#22c55e",
  High: "#f59e0b",
  Overloaded: "#ef4444",
  Underloaded: "#9ca3af",
};

const FORECAST_DATA = [
  { label: "CS Dept", current: 14, forecast: 17 },
  { label: "Math Dept", current: 18, forecast: 16 },
  { label: "English", current: 8, forecast: 10 },
  { label: "Business", current: 20, forecast: 22 },
  { label: "Physics", current: 18, forecast: 18 },
  { label: "Psychology", current: 10, forecast: 12 },
];

export default function WorkloadPage() {
  const [deptFilter, setDeptFilter] = useState("all");

  const departments = ["all", ...Array.from(new Set(mockWorkload.map((w) => w.department)))];

  const filtered = mockWorkload.filter(
    (w) => deptFilter === "all" || w.department === deptFilter,
  );

  const overloaded = filtered.filter((w) => w.status === "Overloaded");
  const underloaded = filtered.filter((w) => w.status === "Underloaded");

  const chartData = filtered.map((w) => ({
    name: w.teacherName.split(" ").slice(-1)[0],
    hours: w.lectureHoursWeek,
    max: w.maxWorkloadHours,
    fill: WORKLOAD_COLORS[w.status],
  }));

  return (
    <div>
      <PageHeader
        title="Workload Management"
        description="Monitor and balance teacher workload across departments."
      />

      {/* Dept filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {departments.map((dept) => (
          <button
            key={dept}
            onClick={() => setDeptFilter(dept)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              deptFilter === dept
                ? "bg-foreground text-background"
                : "border border-border bg-background text-foreground hover:bg-secondary"
            }`}
          >
            {dept === "all" ? "All Departments" : dept}
          </button>
        ))}
      </div>

      {/* Workload Table */}
      <SectionCard title="Workload Overview" className="mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                <th className="px-4 py-2.5 text-left font-medium">Department</th>
                <th className="px-4 py-2.5 text-right font-medium">Courses</th>
                <th className="px-4 py-2.5 text-right font-medium">Hrs/wk</th>
                <th className="px-4 py-2.5 text-right font-medium">Hrs/sem</th>
                <th className="px-4 py-2.5 text-right font-medium">Students</th>
                <th className="px-4 py-2.5 text-right font-medium">Q&A</th>
                <th className="px-4 py-2.5 text-right font-medium">Grading</th>
                <th className="px-4 py-2.5 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((w) => {
                const pct = Math.round(
                  (w.lectureHoursWeek / w.maxWorkloadHours) * 100,
                );
                return (
                  <tr
                    key={w.teacherId}
                    className="border-b last:border-b-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3 font-medium">{w.teacherName}</td>
                    <td className="px-4 py-3 text-secondary-foreground">
                      {w.department}
                    </td>
                    <td className="px-4 py-3 text-right">{w.courses}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="h-1.5 w-12 overflow-hidden rounded-full bg-secondary">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(pct, 100)}%`,
                              backgroundColor: WORKLOAD_COLORS[w.status],
                            }}
                          />
                        </div>
                        <span
                          className={
                            w.status === "Overloaded"
                              ? "font-medium text-[#dc2626]"
                              : ""
                          }
                        >
                          {w.lectureHoursWeek}h
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-foreground">
                      {w.lectureHoursSemester}h
                    </td>
                    <td className="px-4 py-3 text-right">{w.students}</td>
                    <td className="px-4 py-3 text-right text-secondary-foreground">
                      {w.qaActivity}/wk
                    </td>
                    <td className="px-4 py-3 text-right text-secondary-foreground">
                      {w.gradingQueue}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={w.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Bar Chart */}
      <SectionCard title="Workload Comparison (hrs/week)" className="mb-6">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              formatter={(value) => [`${value}h`, "Lecture hours/week"]}
            />
            <Bar dataKey="hours" name="Hours/week" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, idx) => (
                <rect key={idx} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-3 flex flex-wrap gap-3">
          {Object.entries(WORKLOAD_COLORS).map(([status, color]) => (
            <span key={status} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
              {status}
            </span>
          ))}
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Overloaded */}
        <SectionCard title={`Overloaded Teachers (${overloaded.length})`}>
          {overloaded.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No overloaded teachers.
            </p>
          ) : (
            <div className="space-y-3">
              {overloaded.map((w) => (
                <div
                  key={w.teacherId}
                  className="rounded-md border border-[#fee2e2] bg-[#fff5f5] p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-[#dc2626]" />
                        <p className="text-sm font-medium">{w.teacherName}</p>
                      </div>
                      <p className="mt-0.5 text-xs text-secondary-foreground">
                        {w.lectureHoursWeek}h/wk — {w.maxWorkloadHours}h max
                        ({Math.round((w.lectureHoursWeek / w.maxWorkloadHours) * 100)}%)
                      </p>
                    </div>
                    <StatusBadge status={w.status} />
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-secondary-foreground">
                      Recommendation: Assign TA
                    </span>
                    <span className="rounded-full bg-background px-2.5 py-0.5 text-xs text-secondary-foreground">
                      Reassign 1–2 courses
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Underloaded */}
        <SectionCard title={`Underloaded / Available (${underloaded.length})`}>
          {underloaded.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              No underloaded teachers.
            </p>
          ) : (
            <div className="space-y-3">
              {underloaded.map((w) => (
                <div
                  key={w.teacherId}
                  className="flex items-center justify-between rounded-md border border-border p-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-secondary-foreground" />
                      <p className="text-sm font-medium">{w.teacherName}</p>
                    </div>
                    <p className="mt-0.5 text-xs text-secondary-foreground">
                      {w.lectureHoursWeek}h/wk — capacity {w.maxWorkloadHours}h
                    </p>
                  </div>
                  <StatusBadge status={w.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* Forecast */}
      <SectionCard title="Next Semester Forecast" className="mt-6">
        <p className="mb-4 text-sm text-secondary-foreground">
          Estimated average workload per department based on planned courses for Fall 2026.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">Department</th>
                <th className="px-4 py-2.5 text-right font-medium">Current Avg (hrs/wk)</th>
                <th className="px-4 py-2.5 text-right font-medium">Forecast (hrs/wk)</th>
                <th className="px-4 py-2.5 text-right font-medium">Change</th>
              </tr>
            </thead>
            <tbody>
              {FORECAST_DATA.map((row) => {
                const diff = row.forecast - row.current;
                return (
                  <tr key={row.label} className="border-b last:border-b-0">
                    <td className="px-4 py-3">{row.label}</td>
                    <td className="px-4 py-3 text-right">{row.current}h</td>
                    <td className="px-4 py-3 text-right">{row.forecast}h</td>
                    <td
                      className={`px-4 py-3 text-right font-medium ${
                        diff > 0
                          ? "text-[#d97706]"
                          : diff < 0
                            ? "text-[#166534]"
                            : "text-secondary-foreground"
                      }`}
                    >
                      {diff > 0 ? `+${diff}` : diff}h
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
