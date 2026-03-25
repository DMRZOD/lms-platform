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
import { BookOpen, GraduationCap, LayoutGrid, TrendingUp } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import {
  mockAcademicPrograms,
  mockDepartmentPerformance,
  semesterGPATrend,
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

const semesters = ["Spring 2026", "Fall 2025", "Spring 2025", "Fall 2024"];

export default function AcademicPage() {
  const [deptFilter, setDeptFilter] = useState("All");
  const [semester, setSemester] = useState("Spring 2026");

  const avgGPA =
    mockDepartmentPerformance.reduce((s, d) => s + d.gpa, 0) /
    mockDepartmentPerformance.length;
  const avgCompletion =
    mockDepartmentPerformance.reduce((s, d) => s + d.completionRate, 0) /
    mockDepartmentPerformance.length;

  const filteredPrograms =
    deptFilter === "All"
      ? mockAcademicPrograms
      : mockAcademicPrograms.filter((p) => p.department === deptFilter);

  const gpaChartData = mockDepartmentPerformance.map((d) => ({
    name: d.department.split(" ")[0],
    gpa: d.gpa,
    fill: d.gpa >= 3.5 ? "#22c55e" : d.gpa >= 3.3 ? "#f59e0b" : "#ef4444",
  }));

  return (
    <div>
      <PageHeader
        title="Academic Analytics"
        description="University-wide academic performance, programs, and graduation metrics"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Overall GPA"
          value={avgGPA.toFixed(2)}
          icon={GraduationCap}
          accent={avgGPA >= 3.5 ? "success" : "warning"}
          subtitle="University average"
        />
        <StatCard
          label="Graduation Rate"
          value="78.2%"
          icon={TrendingUp}
          accent="warning"
          subtitle="2022 cohort"
        />
        <StatCard
          label="Active Programs"
          value={mockAcademicPrograms.length}
          icon={LayoutGrid}
          subtitle="Across all departments"
        />
        <StatCard
          label="Avg Course Completion"
          value={`${avgCompletion.toFixed(1)}%`}
          icon={BookOpen}
          accent={avgCompletion >= 92 ? "success" : "warning"}
          subtitle="All departments"
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
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        >
          {semesters.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="GPA by Department">
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={gpaChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis domain={[3.0, 4.0]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [Number(v).toFixed(2), "GPA"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="gpa" radius={[4, 4, 0, 0]}>
                {gpaChartData.map((entry, i) => (
                  <rect key={i} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-2 flex gap-4 text-xs text-secondary-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#22c55e]" /> ≥ 3.5
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#f59e0b]" /> 3.3–3.5
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-sm bg-[#ef4444]" /> &lt; 3.3
            </span>
          </div>
        </SectionCard>

        <SectionCard title="GPA Trend — Last 4 Semesters">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={semesterGPATrend}
              margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis
                dataKey="semester"
                tick={{ fontSize: 11 }}
                tickFormatter={(v: string) => v.split(" ")[0]}
              />
              <YAxis domain={[3.2, 3.6]} tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => [Number(v).toFixed(2), "GPA"]}
                contentStyle={{ fontSize: 12 }}
              />
              <Line
                type="monotone"
                dataKey="gpa"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Programs Overview" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                  <th className="pb-2 font-medium">Program</th>
                  <th className="pb-2 font-medium">Department</th>
                  <th className="pb-2 font-medium">Enrolled</th>
                  <th className="pb-2 font-medium">Avg GPA</th>
                  <th className="pb-2 font-medium">Completion</th>
                  <th className="pb-2 font-medium">Satisfaction</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-border hover:bg-secondary/50 last:border-0"
                  >
                    <td className="py-2.5 font-medium">{p.name}</td>
                    <td className="py-2.5 text-secondary-foreground">
                      {p.department}
                    </td>
                    <td className="py-2.5">{p.enrolledStudents}</td>
                    <td
                      className={`py-2.5 font-medium ${p.avgGPA >= 3.5 ? "text-[#166534]" : p.avgGPA >= 3.3 ? "" : "text-[#991b1b]"}`}
                    >
                      {p.avgGPA.toFixed(2)}
                    </td>
                    <td
                      className={`py-2.5 ${p.completionRate >= 93 ? "text-[#166534]" : p.completionRate >= 88 ? "" : "text-[#991b1b]"}`}
                    >
                      {p.completionRate}%
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          p.satisfactionScore >= 4.3
                            ? "bg-[#dcfce7] text-[#166534]"
                            : p.satisfactionScore >= 4.0
                              ? "bg-[#fef3c7] text-[#92400e]"
                              : "bg-[#fee2e2] text-[#991b1b]"
                        }`}
                      >
                        {p.satisfactionScore}/5.0
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <SectionCard title="Course Completion Rates by Department" className="lg:col-span-2">
          <div className="space-y-3">
            {mockDepartmentPerformance.map((d) => (
              <div key={d.department}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium">{d.department}</span>
                  <span
                    className={
                      d.completionRate >= 93
                        ? "text-[#166534]"
                        : d.completionRate >= 89
                          ? ""
                          : "text-[#991b1b]"
                    }
                  >
                    {d.completionRate}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full ${d.completionRate >= 93 ? "bg-[#22c55e]" : d.completionRate >= 89 ? "bg-[#f59e0b]" : "bg-[#ef4444]"}`}
                    style={{ width: `${d.completionRate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
