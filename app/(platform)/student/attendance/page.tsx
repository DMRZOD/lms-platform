"use client";

import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { AttendanceChart } from "@/components/student/attendance-chart";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { mockAttendanceRecords, mockCourseAttendance, mockCourses } from "@/constants/student-mock-data";
import { UserCheck } from "lucide-react";

export default function AttendancePage() {
  const [courseFilter, setCourseFilter] = useState("all");

  const overallRate = Math.round(
    mockCourseAttendance.reduce((sum, c) => sum + c.rate, 0) / mockCourseAttendance.length,
  );
  const totalPresent = mockAttendanceRecords.filter((r) => r.status === "present" || r.status === "late").length;
  const totalMissed = mockAttendanceRecords.filter((r) => r.status === "absent").length;

  const filteredRecords = mockAttendanceRecords
    .filter((r) => courseFilter === "all" || r.courseId === courseFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  const lowAttendanceCourses = mockCourseAttendance.filter((c) => c.rate < c.threshold);

  return (
    <div>
      <PageHeader title="Attendance" description="Track your lecture attendance across all courses" />

      {lowAttendanceCourses.length > 0 && (
        <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
          <p className="font-semibold text-amber-800">Attendance warning</p>
          <ul className="mt-1 space-y-1">
            {lowAttendanceCourses.map((c) => (
              <li key={c.courseId} className="text-sm text-amber-700">
                {c.courseName}: {c.rate}% (minimum {c.threshold}% required)
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Overall Rate" value={`${overallRate}%`} icon={UserCheck} />
        <StatCard label="Total Present" value={totalPresent} icon={UserCheck} subtitle="Sessions attended" />
        <StatCard label="Total Missed" value={totalMissed} icon={UserCheck} subtitle="Absences" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <SectionCard title="Per-Course Attendance">
          <AttendanceChart courses={mockCourseAttendance} />
        </SectionCard>

        <SectionCard title="Attendance History">
          <div className="mb-4">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
            >
              <option value="all">All courses</option>
              {mockCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code} — {c.name}
                </option>
              ))}
            </select>
          </div>

          {filteredRecords.length === 0 ? (
            <p className="text-sm text-secondary-foreground">No records for the selected filter.</p>
          ) : (
            <div className="space-y-2">
              {filteredRecords.map((rec) => (
                <div
                  key={rec.id}
                  className="flex items-center justify-between rounded-md border border-border px-4 py-2.5 text-sm"
                >
                  <div>
                    <p className="font-medium">{rec.lectureTitle}</p>
                    <p className="text-xs text-secondary-foreground">
                      {rec.courseName} ·{" "}
                      {new Date(rec.date).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                      {rec.joinTime && ` · In: ${rec.joinTime}`}
                      {rec.leaveTime && ` · Out: ${rec.leaveTime}`}
                      {rec.duration !== undefined && ` · ${rec.duration} min`}
                    </p>
                  </div>
                  <StudentStatusBadge status={rec.status} />
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}
