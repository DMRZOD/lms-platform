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
import { AlertTriangle, FileText, Star, Users } from "lucide-react";
import { SectionCard } from "@/components/deputy/section-card";
import { StatCard } from "@/components/deputy/stat-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockDepartmentPerformance } from "@/constants/deputy-mock-data";

const departments = [
  "All",
  "Engineering",
  "Economics",
  "Health Sciences",
  "Humanities",
  "Design",
  "Natural Sciences",
];

const workloadAlerts = [
  {
    dept: "Natural Sciences",
    issue: "5 senior faculty declined contract renewal",
    severity: "high",
    ratio: 36.9,
  },
  {
    dept: "Design",
    issue: "Studio overload — avg 29 students per teacher",
    severity: "medium",
    ratio: 29.1,
  },
  {
    dept: "Economics",
    issue: "3 courses without assigned teachers",
    severity: "medium",
    ratio: 25.8,
  },
];

const upcomingExpirations = [
  { name: "Dr. Nazarov, A.", dept: "Natural Sciences", expiresIn: 8 },
  { name: "Prof. Umarov, B.", dept: "Economics", expiresIn: 12 },
  { name: "Dr. Khodjaev, C.", dept: "Humanities", expiresIn: 18 },
  { name: "Ms. Rakhimova, D.", dept: "Design", expiresIn: 22 },
  { name: "Dr. Yusupov, E.", dept: "Engineering", expiresIn: 28 },
];

export default function ResourcesPage() {
  const [deptFilter, setDeptFilter] = useState("All");

  const totalTeachers = mockDepartmentPerformance.reduce(
    (s, d) => s + d.teacherCount,
    0,
  );
  const avgRatio =
    mockDepartmentPerformance.reduce((s, d) => s + d.studentTeacherRatio, 0) /
    mockDepartmentPerformance.length;

  const filteredDepts =
    deptFilter === "All"
      ? mockDepartmentPerformance
      : mockDepartmentPerformance.filter((d) => d.department === deptFilter);

  const facultyChartData = mockDepartmentPerformance.map((d) => ({
    name: d.department.split(" ")[0],
    teachers: d.teacherCount,
  }));

  const ratioChartData = mockDepartmentPerformance.map((d) => ({
    name: d.department.split(" ")[0],
    ratio: d.studentTeacherRatio,
  }));

  return (
    <div>
      <PageHeader
        title="Resource Analytics"
        description="Faculty distribution, workload, performance, and staffing across departments"
      />

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Teachers"
          value={totalTeachers}
          icon={Users}
          subtitle="Active faculty members"
        />
        <StatCard
          label="Avg KPI Score"
          value="82.4"
          icon={Star}
          accent="success"
          subtitle="Faculty performance"
        />
        <StatCard
          label="Student-Teacher Ratio"
          value={`${avgRatio.toFixed(1)}:1`}
          icon={Users}
          accent={avgRatio > 28 ? "danger" : avgRatio > 24 ? "warning" : "success"}
          subtitle="University average"
        />
        <StatCard
          label="Workload Alerts"
          value={workloadAlerts.length}
          icon={AlertTriangle}
          accent={workloadAlerts.length > 2 ? "warning" : "default"}
          subtitle="Departments at risk"
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
          <SectionCard title="Faculty Distribution by Department">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={facultyChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [Number(v), "Teachers"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="teachers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Student-Teacher Ratio by Department">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ratioChartData} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => [`${Number(v).toFixed(1)}:1`, "Ratio"]}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar dataKey="ratio" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </SectionCard>

          <SectionCard title="Department Summary">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs text-secondary-foreground">
                    <th className="pb-2 font-medium">Department</th>
                    <th className="pb-2 font-medium">Teachers</th>
                    <th className="pb-2 font-medium">Students</th>
                    <th className="pb-2 font-medium">Ratio</th>
                    <th className="pb-2 font-medium">Satisfaction</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDepts.map((d) => (
                    <tr
                      key={d.department}
                      className="border-b border-border hover:bg-secondary/50 last:border-0"
                    >
                      <td className="py-2.5 font-medium">{d.department}</td>
                      <td className="py-2.5">{d.teacherCount}</td>
                      <td className="py-2.5">{d.enrollmentCount.toLocaleString()}</td>
                      <td
                        className={`py-2.5 ${d.studentTeacherRatio > 30 ? "font-medium text-[#991b1b]" : d.studentTeacherRatio > 26 ? "text-[#92400e]" : ""}`}
                      >
                        {d.studentTeacherRatio.toFixed(1)}:1
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                            d.satisfactionScore >= 4.3
                              ? "bg-[#dcfce7] text-[#166534]"
                              : d.satisfactionScore >= 4.0
                                ? "bg-[#fef3c7] text-[#92400e]"
                                : "bg-[#fee2e2] text-[#991b1b]"
                          }`}
                        >
                          {d.satisfactionScore}/5.0
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-6">
          <SectionCard title="Workload Alerts">
            <div className="space-y-3">
              {workloadAlerts.map((alert, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <AlertTriangle
                      className={`h-4 w-4 shrink-0 ${alert.severity === "high" ? "text-[#ef4444]" : "text-[#f59e0b]"}`}
                    />
                    <span className="font-medium">{alert.dept}</span>
                  </div>
                  <p className="mt-1 text-xs text-secondary-foreground">
                    {alert.issue}
                  </p>
                  <p className="mt-1 text-xs font-medium">
                    Ratio:{" "}
                    <span
                      className={
                        alert.ratio > 30 ? "text-[#991b1b]" : "text-[#92400e]"
                      }
                    >
                      {alert.ratio}:1
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Upcoming Contract Expirations">
            <div className="space-y-3">
              {upcomingExpirations.map((teacher, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm"
                >
                  <FileText className="h-4 w-4 shrink-0 text-secondary-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium">{teacher.name}</p>
                    <p className="text-xs text-secondary-foreground">
                      {teacher.dept}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                      teacher.expiresIn <= 14
                        ? "bg-[#fee2e2] text-[#991b1b]"
                        : teacher.expiresIn <= 21
                          ? "bg-[#fef3c7] text-[#92400e]"
                          : "bg-[#f3f4f6] text-[#374151]"
                    }`}
                  >
                    {teacher.expiresIn}d
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
