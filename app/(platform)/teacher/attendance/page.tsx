"use client";

import { PageHeader } from "@/components/platform/page-header";
import { mockCourses, mockLectureAttendance } from "@/constants/teacher-mock-data";
import { AlertTriangle, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function AttendancePage() {
  const publishedCourses = mockCourses.filter(
    (c) => c.status === "Published" || c.status === "Approved",
  );
  const [selectedCourseId, setSelectedCourseId] = useState(publishedCourses[0]?.id ?? "");
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);

  const selectedLecture = selectedLectureId
    ? mockLectureAttendance.find((a) => a.lectureId === selectedLectureId)
    : null;

  const avgAttendance =
    mockLectureAttendance.length > 0
      ? Math.round(
          mockLectureAttendance.reduce((s, a) => s + a.attendanceRate, 0) /
            mockLectureAttendance.length,
        )
      : 0;

  const lowAttendanceLectures = mockLectureAttendance.filter((a) => a.attendanceRate < 75);

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Attendance" description="Track student attendance across lectures" />
      </div>

      {/* Course Selector */}
      <div className="mb-6 flex items-center gap-3">
        <label className="text-sm font-medium">Course:</label>
        <div className="relative">
          <select
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedLectureId(null);
            }}
            className="appearance-none rounded-md border border-border bg-background py-2 pl-3 pr-8 text-sm outline-none focus:border-foreground"
          >
            {publishedCourses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.code} — {c.name}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-secondary-foreground" />
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Avg Attendance</p>
          <p className={`text-2xl font-bold ${avgAttendance < 75 ? "text-[#ef4444]" : ""}`}>
            {avgAttendance}%
          </p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Lectures Tracked</p>
          <p className="text-2xl font-bold">{mockLectureAttendance.length}</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Low Attendance</p>
          <p className={`text-2xl font-bold ${lowAttendanceLectures.length > 0 ? "text-[#f59e0b]" : ""}`}>
            {lowAttendanceLectures.length}
          </p>
          <p className="text-xs text-secondary-foreground">lectures below 75%</p>
        </div>
        <div className="rounded-lg border border-border bg-background p-4">
          <p className="text-xs text-secondary-foreground">Students</p>
          <p className="text-2xl font-bold">42</p>
          <p className="text-xs text-secondary-foreground">enrolled</p>
        </div>
      </div>

      {/* Low Attendance Alert */}
      {lowAttendanceLectures.length > 0 && (
        <div className="mb-6 rounded-lg border border-[#fde68a] bg-[#fef9c3] p-4">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#92400e]" />
            <div>
              <p className="text-sm font-medium text-[#92400e]">
                {lowAttendanceLectures.length} lecture
                {lowAttendanceLectures.length > 1 ? "s" : ""} with low attendance (&lt;75%)
              </p>
              <ul className="mt-1">
                {lowAttendanceLectures.map((l) => (
                  <li key={l.lectureId} className="text-xs text-[#92400e]">
                    {l.lectureTopic} ({l.date}) — {l.attendanceRate}%
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* Lecture List */}
        <div className="lg:col-span-2">
          <h2 className="mb-3 font-semibold">Lectures</h2>
          <div className="space-y-2">
            {mockLectureAttendance.map((lecture) => (
              <button
                key={lecture.lectureId}
                onClick={() => setSelectedLectureId(lecture.lectureId)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedLectureId === lecture.lectureId
                    ? "border-foreground bg-secondary"
                    : "border-border bg-background hover:bg-secondary/50"
                }`}
              >
                <p className="text-sm font-medium">{lecture.lectureTopic}</p>
                <p className="text-xs text-secondary-foreground">{lecture.date}</p>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 rounded-full bg-[#f0f0f0]">
                    <div
                      className={`h-1.5 rounded-full ${
                        lecture.attendanceRate < 75 ? "bg-[#ef4444]" : "bg-[#22c55e]"
                      }`}
                      style={{ width: `${lecture.attendanceRate}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      lecture.attendanceRate < 75 ? "text-[#ef4444]" : ""
                    }`}
                  >
                    {lecture.attendanceRate}%
                  </span>
                </div>
                <p className="mt-1 text-xs text-secondary-foreground">
                  {lecture.presentCount}/{lecture.totalCount} present
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Student Detail */}
        <div className="lg:col-span-3">
          {!selectedLecture ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-secondary-foreground">Select a lecture to view attendance details</p>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <h2 className="font-semibold">{selectedLecture.lectureTopic}</h2>
                <p className="text-sm text-secondary-foreground">{selectedLecture.date}</p>
              </div>

              {/* Attendance Summary Bar */}
              <div className="mb-4 rounded-lg border border-border bg-background p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-medium">Attendance Rate</span>
                  <span className={`text-lg font-bold ${selectedLecture.attendanceRate < 75 ? "text-[#ef4444]" : "text-[#16a34a]"}`}>
                    {selectedLecture.attendanceRate}%
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-[#f0f0f0]">
                  <div
                    className={`h-3 rounded-full ${
                      selectedLecture.attendanceRate < 75 ? "bg-[#ef4444]" : "bg-[#22c55e]"
                    }`}
                    style={{ width: `${selectedLecture.attendanceRate}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-secondary-foreground">
                  {selectedLecture.presentCount} present, {selectedLecture.totalCount - selectedLecture.presentCount} absent
                </p>
              </div>

              <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="p-3 text-left font-medium">Student</th>
                      <th className="p-3 text-left font-medium">Status</th>
                      <th className="p-3 text-left font-medium">Entry</th>
                      <th className="p-3 text-left font-medium">Exit</th>
                      <th className="p-3 text-left font-medium">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedLecture.records.map((rec) => (
                      <tr key={rec.studentId} className="border-t border-border">
                        <td className="p-3 font-medium">{rec.studentName}</td>
                        <td className="p-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              rec.status === "present"
                                ? "bg-[#dcfce7] text-[#166534]"
                                : rec.status === "late"
                                  ? "bg-[#fef9c3] text-[#854d0e]"
                                  : "bg-[#fee2e2] text-[#991b1b]"
                            }`}
                          >
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-3 text-secondary-foreground">{rec.entryTime ?? "—"}</td>
                        <td className="p-3 text-secondary-foreground">{rec.exitTime ?? "—"}</td>
                        <td className="p-3 text-secondary-foreground">
                          {rec.duration ? `${rec.duration} min` : rec.absenceReason ?? "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-xs text-secondary-foreground">
                Attendance data is read-only and tracked automatically via Teams.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
