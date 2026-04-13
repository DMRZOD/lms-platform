"use client";

import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StatCard } from "@/components/student/stat-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { UserCheck } from "lucide-react";
import { studentApi } from "@/lib/student-api";
import type { ApiAttendanceRecord, ApiCourse } from "@/lib/student-api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CourseAttendanceSummary {
  courseId: number;
  courseName: string;
  total: number;
  present: number;
  absent: number;
  late: number;
  rate: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AttendancePage() {
  const [records, setRecords]       = useState<ApiAttendanceRecord[]>([]);
  const [courses, setCourses]       = useState<ApiCourse[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);
  const [courseFilter, setCourseFilter] = useState("all");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch enrolled courses first
      const coursesData = await studentApi.getCourses();
      const arr: ApiCourse[] = Array.isArray(coursesData)
          ? coursesData
          : (coursesData as { content: ApiCourse[] }).content ?? [];
      setCourses(arr);

      // Fetch attendance for each course
      const attendanceResults = await Promise.allSettled(
          arr.map((c) => studentApi.getCourseAttendanceMe(c.id))
      );

      const allRecords: ApiAttendanceRecord[] = [];
      attendanceResults.forEach((res, idx) => {
        if (res.status === "fulfilled") {
          const data = Array.isArray(res.value) ? res.value : [];
          // Attach courseId/courseName if missing from response
          data.forEach((rec) => {
            allRecords.push({
              ...rec,
              courseId: rec.courseId ?? arr[idx].id,
              courseName: rec.courseName ?? arr[idx].title,
            });
          });
        }
      });

      setRecords(allRecords);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load attendance");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ── Compute summaries per course ──
  const summaries: CourseAttendanceSummary[] = courses.map((c) => {
    const courseRecords = records.filter((r) => r.courseId === c.id);
    const present = courseRecords.filter((r) => r.status === "present").length;
    const late    = courseRecords.filter((r) => r.status === "late").length;
    const absent  = courseRecords.filter((r) => r.status === "absent").length;
    const total   = courseRecords.length;
    const rate    = total > 0 ? Math.round(((present + late) / total) * 100) : 0;
    return { courseId: c.id, courseName: c.title, total, present, absent, late, rate };
  }).filter((s) => s.total > 0);

  const overallRate = summaries.length > 0
      ? Math.round(summaries.reduce((sum, s) => sum + s.rate, 0) / summaries.length)
      : 0;

  const totalPresent = records.filter((r) => r.status === "present" || r.status === "late").length;
  const totalAbsent  = records.filter((r) => r.status === "absent").length;

  const lowAttendance = summaries.filter((s) => s.rate < 75);

  const filteredRecords = records
      .filter((r) => courseFilter === "all" || String(r.courseId) === courseFilter)
      .sort((a, b) => (b.date ?? "").localeCompare(a.date ?? ""));

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error}</p>
          <button onClick={fetchData} className="rounded-md border border-border px-4 py-2 text-sm hover:bg-secondary">
            Retry
          </button>
        </div>
    );
  }

  return (
      <div>
        <PageHeader title="Attendance" description="Track your lecture attendance across all courses" />

        {/* Low attendance warning */}
        {!loading && lowAttendance.length > 0 && (
            <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
              <p className="font-semibold text-amber-800">Attendance warning</p>
              <ul className="mt-1 space-y-1">
                {lowAttendance.map((c) => (
                    <li key={c.courseId} className="text-sm text-amber-700">
                      {c.courseName}: {c.rate}% (minimum 75% required)
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* Stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="Overall Rate"   value={loading ? "—" : `${overallRate}%`} icon={UserCheck} />
          <StatCard label="Total Present"  value={loading ? "—" : String(totalPresent)} icon={UserCheck} subtitle="Sessions attended" />
          <StatCard label="Total Missed"   value={loading ? "—" : String(totalAbsent)}  icon={UserCheck} subtitle="Absences" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Per-course summary */}
          <SectionCard title="Per-Course Attendance">
            {loading ? (
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />
                  ))}
                </div>
            ) : summaries.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No attendance data available.</p>
            ) : (
                <div className="space-y-4">
                  {summaries.map((s) => (
                      <div key={s.courseId}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium">{s.courseName}</span>
                          <span className={`font-semibold ${s.rate < 75 ? "text-red-600" : "text-green-700"}`}>
                      {s.rate}%
                    </span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                          <div
                              className={`h-full rounded-full transition-all ${s.rate < 75 ? "bg-red-500" : "bg-green-500"}`}
                              style={{ width: `${s.rate}%` }}
                          />
                        </div>
                        <div className="mt-1 flex gap-3 text-xs text-secondary-foreground">
                          <span>✅ {s.present} present</span>
                          <span>⏰ {s.late} late</span>
                          <span>❌ {s.absent} absent</span>
                          <span>/ {s.total} total</span>
                        </div>
                      </div>
                  ))}
                </div>
            )}
          </SectionCard>

          {/* Attendance history */}
          <SectionCard title="Attendance History">
            <div className="mb-4">
              <select
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-sm focus:outline-none"
              >
                <option value="all">All courses</option>
                {courses.map((c) => (
                    <option key={c.id} value={String(c.id)}>{c.title}</option>
                ))}
              </select>
            </div>

            {loading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-14 animate-pulse rounded-lg bg-secondary" />
                  ))}
                </div>
            ) : filteredRecords.length === 0 ? (
                <p className="text-sm text-secondary-foreground">No records for the selected filter.</p>
            ) : (
                <div className="space-y-2">
                  {filteredRecords.map((rec) => (
                      <div
                          key={rec.id}
                          className="flex items-center justify-between rounded-md border border-border px-4 py-2.5 text-sm"
                      >
                        <div>
                          <p className="font-medium">{rec.lectureTitle ?? `Lecture #${rec.lectureId}`}</p>
                          <p className="text-xs text-secondary-foreground">
                            {rec.courseName ?? ""}{rec.date ? ` · ${new Date(rec.date).toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })}` : ""}
                            {rec.joinTime  && ` · In: ${rec.joinTime}`}
                            {rec.leaveTime && ` · Out: ${rec.leaveTime}`}
                            {rec.duration  !== undefined && ` · ${rec.duration} min`}
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
