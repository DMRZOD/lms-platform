"use client";

import { useState } from "react";
import { AlertTriangle, Star } from "lucide-react";
import Link from "next/link";
import { SectionCard } from "@/components/resource/section-card";
import { PageHeader } from "@/components/platform/page-header";
import { mockKPIs } from "@/constants/resource-mock-data";

const KPI_THRESHOLDS = {
  avgAttendance: { good: 80, warn: 70 },
  feedbackScore: { good: 4.0, warn: 3.5 },
  qaSLAPercent: { good: 80, warn: 65 },
  aqadFirstPassRate: { good: 80, warn: 60 },
};

function cellClass(value: number, good: number, warn: number) {
  if (value >= good) return "text-[#166534] font-medium";
  if (value >= warn) return "text-[#92400e]";
  return "text-[#991b1b] font-medium";
}

const DEPARTMENTS = ["all", "Computer Science", "Mathematics", "English", "Business", "Physics", "Psychology"];
const SEMESTERS = ["Spring 2026", "Fall 2025", "Spring 2025"];

export default function PerformancePage() {
  const [deptFilter, setDeptFilter] = useState("all");
  const [semesterFilter, setSemesterFilter] = useState("Spring 2026");
  const [search, setSearch] = useState("");

  const filtered = mockKPIs
    .filter((k) => {
      if (deptFilter !== "all" && k.department !== deptFilter) return false;
      if (search && !k.teacherName.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => b.overallScore - a.overallScore);

  const issueTeachers = filtered.filter(
    (k) =>
      k.avgAttendance < KPI_THRESHOLDS.avgAttendance.warn ||
      k.feedbackScore < KPI_THRESHOLDS.feedbackScore.warn ||
      k.qaSLAPercent < KPI_THRESHOLDS.qaSLAPercent.warn ||
      k.aqadFirstPassRate < KPI_THRESHOLDS.aqadFirstPassRate.warn,
  );

  return (
    <div>
      <PageHeader
        title="Teacher Performance"
        description="KPI monitoring — attendance, feedback, Q&A SLA, and AQAD approval rates."
      />

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
        >
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d === "all" ? "All Departments" : d}
            </option>
          ))}
        </select>
        <select
          value={semesterFilter}
          onChange={(e) => setSemesterFilter(e.target.value)}
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
        >
          {SEMESTERS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search teacher…"
          className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>

      {/* Performance Issues Alert */}
      {issueTeachers.length > 0 && (
        <div className="mb-6 rounded-md border border-[#fef3c7] bg-[#fffbeb] p-4">
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#d97706]" />
            <p className="text-sm font-medium text-[#92400e]">
              {issueTeachers.length} teacher{issueTeachers.length > 1 ? "s" : ""} below KPI
              thresholds
            </p>
          </div>
          <div className="space-y-1.5">
            {issueTeachers.map((k) => {
              const issues: string[] = [];
              if (k.avgAttendance < KPI_THRESHOLDS.avgAttendance.warn)
                issues.push(`Attendance ${k.avgAttendance}%`);
              if (k.feedbackScore < KPI_THRESHOLDS.feedbackScore.warn)
                issues.push(`Feedback ${k.feedbackScore}/5`);
              if (k.qaSLAPercent < KPI_THRESHOLDS.qaSLAPercent.warn)
                issues.push(`Q&A SLA ${k.qaSLAPercent}%`);
              if (k.aqadFirstPassRate < KPI_THRESHOLDS.aqadFirstPassRate.warn)
                issues.push(`AQAD ${k.aqadFirstPassRate}%`);
              return (
                <div key={k.teacherId} className="flex items-center justify-between">
                  <span className="text-sm text-[#92400e]">
                    <strong>{k.teacherName}</strong> — {issues.join(", ")}
                  </span>
                  <Link
                    href={`/resource/teachers/${k.teacherId}`}
                    className="text-xs text-[#92400e] underline hover:opacity-80"
                  >
                    View
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Performance Table */}
      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-secondary">
                <th className="px-4 py-2.5 text-left font-medium">#</th>
                <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                <th className="px-4 py-2.5 text-right font-medium">Attendance</th>
                <th className="px-4 py-2.5 text-right font-medium">Feedback</th>
                <th className="px-4 py-2.5 text-right font-medium">Q&A SLA</th>
                <th className="px-4 py-2.5 text-right font-medium">AQAD First-Pass</th>
                <th className="px-4 py-2.5 text-right font-medium">Overall</th>
                <th className="px-4 py-2.5 text-left font-medium">Trend</th>
                <th className="px-4 py-2.5 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k, idx) => {
                const trend =
                  k.prevSemesterScore !== null
                    ? k.overallScore - k.prevSemesterScore
                    : null;
                return (
                  <tr
                    key={k.teacherId}
                    className="border-b last:border-b-0 hover:bg-secondary/30"
                  >
                    <td className="px-4 py-3 text-secondary-foreground">{idx + 1}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{k.teacherName}</p>
                      <p className="text-xs text-secondary-foreground">{k.department}</p>
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${cellClass(k.avgAttendance, KPI_THRESHOLDS.avgAttendance.good, KPI_THRESHOLDS.avgAttendance.warn)}`}
                    >
                      {k.avgAttendance}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${cellClass(k.feedbackScore, KPI_THRESHOLDS.feedbackScore.good, KPI_THRESHOLDS.feedbackScore.warn)}`}
                    >
                      <span className="flex items-center justify-end gap-1">
                        <Star className="h-3.5 w-3.5 text-[#f59e0b]" />
                        {k.feedbackScore}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${cellClass(k.qaSLAPercent, KPI_THRESHOLDS.qaSLAPercent.good, KPI_THRESHOLDS.qaSLAPercent.warn)}`}
                    >
                      {k.qaSLAPercent}%
                    </td>
                    <td
                      className={`px-4 py-3 text-right ${cellClass(k.aqadFirstPassRate, KPI_THRESHOLDS.aqadFirstPassRate.good, KPI_THRESHOLDS.aqadFirstPassRate.warn)}`}
                    >
                      {k.aqadFirstPassRate}%
                    </td>
                    <td className="px-4 py-3 text-right font-bold">{k.overallScore}</td>
                    <td className="px-4 py-3">
                      {trend !== null ? (
                        <span
                          className={`text-xs font-medium ${
                            trend > 0
                              ? "text-[#166534]"
                              : trend < 0
                                ? "text-[#dc2626]"
                                : "text-secondary-foreground"
                          }`}
                        >
                          {trend > 0 ? `↑ +${trend}` : trend < 0 ? `↓ ${trend}` : "→ 0"}
                        </span>
                      ) : (
                        <span className="text-xs text-secondary-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/resource/teachers/${k.teacherId}`}
                        className="text-xs text-secondary-foreground underline hover:text-foreground"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-secondary-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#22c55e]" />
          Good (≥ threshold)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
          Warning (near threshold)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ef4444]" />
          Below threshold
        </span>
      </div>
    </div>
  );
}
