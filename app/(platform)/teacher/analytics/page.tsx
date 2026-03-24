"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { mockCourses, mockEnrolledStudents } from "@/constants/teacher-mock-data";
import { AlertTriangle, ChevronDown, Download, TrendingDown, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const attendanceTrendData = [
  { lecture: "L1", rate: 88 },
  { lecture: "L2", rate: 86 },
  { lecture: "L3", rate: 91 },
  { lecture: "L4", rate: 79 },
  { lecture: "L5", rate: 84 },
  { lecture: "L6", rate: 82 },
  { lecture: "L7", rate: 88 },
  { lecture: "L8", rate: 85 },
];

const gradeDistributionData = [
  { grade: "A", count: 8 },
  { grade: "B", count: 15 },
  { grade: "C", count: 12 },
  { grade: "D", count: 5 },
  { grade: "F", count: 2 },
];

const qaSlaPieData = [
  { name: "Within SLA", value: 91 },
  { name: "SLA Breached", value: 9 },
];

const GRADE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#f97316", "#ef4444"];
const SLA_COLORS = ["#22c55e", "#ef4444"];

const avgAssignmentScores = [
  { assignment: "Asgn 1", avg: 81 },
  { assignment: "Asgn 2", avg: 76 },
  { assignment: "Asgn 3", avg: 85 },
  { assignment: "Asgn 4", avg: 72 },
  { assignment: "Midterm", avg: 78 },
];

export default function AnalyticsPage() {
  const [selectedCourseId, setSelectedCourseId] = useState(mockCourses[0]?.id ?? "");

  const course = mockCourses.find((c) => c.id === selectedCourseId) ?? mockCourses[0];

  const strugglingStudents = mockEnrolledStudents.filter(
    (s) => s.attendanceRate < 75 || s.currentScore < 60,
  );

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Analytics" description="Performance metrics and insights" />
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-8 text-sm outline-none focus:border-foreground"
            >
              {mockCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-secondary-foreground" />
          </div>
          <button className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary">
            <Download className="h-4 w-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Avg Attendance</p>
          <p className={`text-2xl font-bold ${course.avgAttendance < 75 ? "text-[#ef4444]" : ""}`}>
            {course.avgAttendance}%
          </p>
          <p className="flex items-center gap-1 text-xs text-secondary-foreground">
            {course.avgAttendance >= 80 ? (
              <TrendingUp className="h-3 w-3 text-[#22c55e]" />
            ) : (
              <TrendingDown className="h-3 w-3 text-[#ef4444]" />
            )}
            vs 80% target
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Avg Grade</p>
          <p className="text-2xl font-bold">{course.avgGrade}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Progress</p>
          <p className="text-2xl font-bold">
            {course.completedLectures}/{course.totalLectures}
          </p>
          <p className="text-xs text-secondary-foreground">lectures completed</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Q&A SLA</p>
          <p className="text-2xl font-bold">91%</p>
          <p className="text-xs text-secondary-foreground">answered within 24h</p>
        </div>
      </div>

      {/* Struggling Students Alert */}
      {strugglingStudents.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#fde68a] bg-[#fef9c3] p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#92400e]" />
            <div>
              <p className="text-sm font-medium text-[#92400e]">
                {strugglingStudents.length} struggling student
                {strugglingStudents.length > 1 ? "s" : ""} detected
              </p>
              <div className="mt-1 flex flex-wrap gap-2">
                {strugglingStudents.map((s) => (
                  <span key={s.id} className="rounded-full bg-[#fde68a] px-2 py-0.5 text-xs text-[#92400e]">
                    {s.name} ({s.attendanceRate < 75 ? `${s.attendanceRate}% attendance` : `${s.currentScore} score`})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Progress */}
      <div className="mb-6 rounded-lg border border-border bg-background p-4">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm font-medium">Course Progress</p>
          <p className="text-sm text-secondary-foreground">
            {Math.round((course.completedLectures / course.totalLectures) * 100)}%
          </p>
        </div>
        <div className="h-3 w-full rounded-full bg-secondary">
          <div
            className="h-3 rounded-full bg-foreground"
            style={{
              width: `${(course.completedLectures / course.totalLectures) * 100}%`,
            }}
          />
        </div>
        <p className="mt-1 text-xs text-secondary-foreground">
          {course.completedLectures} of {course.totalLectures} lectures completed
        </p>
      </div>

      {/* Charts Row 1 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Attendance Trend by Lecture">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={attendanceTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="lecture" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 100]} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(value) => [`${value}%`, "Attendance"]}
              />
              <Line
                type="monotone"
                dataKey="rate"
                stroke="#1c1d1d"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <p className="mt-1 text-xs text-secondary-foreground">
            Reference line: 75% minimum required
          </p>
        </SectionCard>

        <SectionCard title="Grade Distribution">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={gradeDistributionData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {gradeDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={GRADE_COLORS[index]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>
      </div>

      {/* Charts Row 2 */}
      <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <SectionCard title="Average Assignment Scores" className="lg:col-span-2">
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={avgAssignmentScores}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e3e3e3" />
              <XAxis dataKey="assignment" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="avg" fill="#1c1d1d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </SectionCard>

        <SectionCard title="Q&A SLA Performance">
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={qaSlaPieData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={70}
                dataKey="value"
                label={({ value }) => `${value}%`}
                labelLine={false}
              >
                {qaSlaPieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={SLA_COLORS[index]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 flex justify-center gap-4 text-xs">
            {qaSlaPieData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: SLA_COLORS[i] }}
                />
                {d.name}
              </span>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Student Engagement Table */}
      <SectionCard title="Student Engagement">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="pb-2 text-left font-medium">Student</th>
                <th className="pb-2 text-left font-medium">Attendance</th>
                <th className="pb-2 text-left font-medium">Score</th>
                <th className="pb-2 text-left font-medium">Assignments</th>
                <th className="pb-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockEnrolledStudents.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="py-2.5 font-medium">{s.name}</td>
                  <td
                    className={`py-2.5 ${s.attendanceRate < 75 ? "font-medium text-[#ef4444]" : ""}`}
                  >
                    {s.attendanceRate}%
                  </td>
                  <td className="py-2.5">{s.currentScore}</td>
                  <td className="py-2.5 text-secondary-foreground">
                    {s.submittedAssignments}/{s.totalAssignments}
                  </td>
                  <td className="py-2.5">
                    {s.attendanceRate < 75 || s.currentScore < 60 ? (
                      <span className="rounded-full bg-[#fee2e2] px-2 py-0.5 text-xs text-[#991b1b]">
                        At risk
                      </span>
                    ) : (
                      <span className="rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                        On track
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}
