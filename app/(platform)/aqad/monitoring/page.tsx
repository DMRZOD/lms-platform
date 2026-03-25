"use client";

import { useState } from "react";
import { Activity, AlertTriangle, BarChart3, TrendingDown } from "lucide-react";
import { EmptyState } from "@/components/aqad/empty-state";
import { FilterBar } from "@/components/aqad/filter-bar";
import { QualityScoreBadge } from "@/components/aqad/quality-score-badge";
import { SectionCard } from "@/components/aqad/section-card";
import { StatCard } from "@/components/aqad/stat-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { PageHeader } from "@/components/platform/page-header";
import { mockAnomalyAlerts, mockPublishedCourses } from "@/constants/aqad-mock-data";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Published", value: "Published" },
  { label: "Re-Approval Required", value: "ReApprovalRequired" },
  { label: "Suspended", value: "Suspended" },
  { label: "Low Quality", value: "low_quality" },
];

function formatDate(ts: string) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

const SEVERITY_COLORS = {
  high: "bg-[#fee2e2] text-[#dc2626]",
  medium: "bg-[#fef3c7] text-[#d97706]",
  low: "bg-[#dbeafe] text-[#2563eb]",
};

export default function MonitoringPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);

  const filtered = mockPublishedCourses.filter((c) => {
    const matchesFilter =
      activeFilter === "all"
        ? true
        : activeFilter === "low_quality"
          ? c.qualityScore < 60
          : c.status === activeFilter;
    const matchesSearch =
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      c.teacherName.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const avgQuality = Math.round(
    mockPublishedCourses.reduce((s, c) => s + c.qualityScore, 0) /
      mockPublishedCourses.length,
  );

  const lowQualityCount = mockPublishedCourses.filter((c) => c.qualityScore < 60).length;
  const totalComplaints = mockPublishedCourses.reduce((s, c) => s + c.complaintsCount, 0);

  const detailCourse = selectedCourse
    ? mockPublishedCourses.find((c) => c.id === selectedCourse)
    : null;

  return (
    <div>
      <PageHeader
        title="Course Monitoring"
        description={`${mockPublishedCourses.length} published courses · Spring 2026`}
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard label="Published Courses" value={mockPublishedCourses.length} icon={Activity} />
        <StatCard
          label="Avg Quality Score"
          value={avgQuality}
          icon={BarChart3}
          subtitle="Out of 100"
          accent={avgQuality >= 80 ? "success" : avgQuality >= 60 ? "default" : "warning"}
        />
        <StatCard
          label="Low Quality"
          value={lowQualityCount}
          icon={TrendingDown}
          subtitle="Score below 60"
          accent={lowQualityCount > 0 ? "danger" : "default"}
        />
        <StatCard
          label="Total Complaints"
          value={totalComplaints}
          icon={AlertTriangle}
          subtitle="All published courses"
          accent={totalComplaints > 5 ? "warning" : "default"}
        />
      </div>

      {/* Anomaly Alerts */}
      {mockAnomalyAlerts.length > 0 && (
        <SectionCard title="Anomaly Alerts" className="mb-6">
          <div className="space-y-2">
            {mockAnomalyAlerts.map((anomaly) => (
              <div
                key={anomaly.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <AlertTriangle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    anomaly.severity === "high"
                      ? "text-[#dc2626]"
                      : anomaly.severity === "medium"
                        ? "text-[#d97706]"
                        : "text-[#2563eb]"
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{anomaly.courseTitle}</p>
                  <p className="text-xs text-secondary-foreground">{anomaly.description}</p>
                  <p className="mt-0.5 text-xs text-secondary-foreground">
                    Detected {formatDate(anomaly.detectedAt)}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${SEVERITY_COLORS[anomaly.severity]}`}
                >
                  {anomaly.severity}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      <FilterBar
        filters={FILTERS}
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        searchValue={search}
        onSearchChange={setSearch}
        placeholder="Search by course, teacher…"
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="No courses found"
          description="Try adjusting your filters."
        />
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2.5 text-left font-medium">Course</th>
                  <th className="px-4 py-2.5 text-left font-medium">Teacher</th>
                  <th className="px-4 py-2.5 text-center font-medium">Attendance</th>
                  <th className="px-4 py-2.5 text-center font-medium">Avg Grade</th>
                  <th className="px-4 py-2.5 text-center font-medium">Complaints</th>
                  <th className="px-4 py-2.5 text-center font-medium">Quality</th>
                  <th className="px-4 py-2.5 text-center font-medium">Status</th>
                  <th className="px-4 py-2.5 text-left font-medium">Next Audit</th>
                  <th className="px-4 py-2.5 text-center font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((course) => (
                  <tr key={course.id} className="border-b last:border-b-0 hover:bg-secondary/30">
                    <td className="px-4 py-3">
                      <p className="font-medium">{course.title}</p>
                      <p className="text-xs text-secondary-foreground">{course.code}</p>
                    </td>
                    <td className="px-4 py-3 text-secondary-foreground">{course.teacherName}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={
                          course.avgAttendance >= 80
                            ? "text-[#16a34a]"
                            : course.avgAttendance >= 65
                              ? "text-[#d97706]"
                              : "text-[#dc2626]"
                        }
                      >
                        {course.avgAttendance}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">{course.avgGrade}</td>
                    <td className="px-4 py-3 text-center">
                      {course.complaintsCount > 0 ? (
                        <span className="font-medium text-[#dc2626]">
                          {course.complaintsCount}
                        </span>
                      ) : (
                        <span className="text-secondary-foreground">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <QualityScoreBadge score={course.qualityScore} />
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusBadge status={course.status} />
                    </td>
                    <td className="px-4 py-3 text-xs text-secondary-foreground">
                      {formatDate(course.nextAuditAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() =>
                          setSelectedCourse(selectedCourse === course.id ? null : course.id)
                        }
                        className="rounded-md border px-2.5 py-1 text-xs hover:bg-secondary"
                      >
                        {selectedCourse === course.id ? "Close" : "Details"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Panel */}
      {detailCourse && detailCourse.lectureMetrics.length > 0 && (
        <SectionCard title={`${detailCourse.title} — Lecture Metrics`} className="mt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-secondary text-xs text-secondary-foreground">
                  <th className="px-4 py-2 text-left font-medium">Lecture</th>
                  <th className="px-4 py-2 text-center font-medium">Attendance</th>
                  <th className="px-4 py-2 text-center font-medium">Q&A Questions</th>
                  <th className="px-4 py-2 text-center font-medium">Avg Response (h)</th>
                  <th className="px-4 py-2 text-center font-medium">Chat Activity</th>
                  <th className="px-4 py-2 text-center font-medium">Complaints</th>
                </tr>
              </thead>
              <tbody>
                {detailCourse.lectureMetrics.map((lm) => (
                  <tr key={lm.lectureId} className="border-b last:border-b-0">
                    <td className="px-4 py-2.5">{lm.lectureTitle}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={
                          lm.attendanceRate >= 80
                            ? "text-[#16a34a]"
                            : lm.attendanceRate >= 65
                              ? "text-[#d97706]"
                              : "text-[#dc2626]"
                        }
                      >
                        {lm.attendanceRate}%
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">{lm.qaQuestions}</td>
                    <td className="px-4 py-2.5 text-center">
                      <span
                        className={
                          lm.avgResponseTime <= 4
                            ? "text-[#16a34a]"
                            : lm.avgResponseTime <= 24
                              ? "text-[#d97706]"
                              : "text-[#dc2626]"
                        }
                      >
                        {lm.avgResponseTime}h
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-center">{lm.chatActivity}</td>
                    <td className="px-4 py-2.5 text-center">
                      {lm.complaintsCount > 0 ? (
                        <span className="font-medium text-[#dc2626]">{lm.complaintsCount}</span>
                      ) : (
                        <span className="text-secondary-foreground">0</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      )}
    </div>
  );
}
