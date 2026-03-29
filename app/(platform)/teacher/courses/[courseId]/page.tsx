"use client";

import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { EmptyState } from "@/components/teacher/empty-state";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse, ApiModule } from "@/lib/teacher-api";
import {
  mockAQADReviews, mockEnrolledStudents,
  mockGradebookRows, mockQAQuestions,
} from "@/constants/teacher-mock-data";
import { AlertTriangle, BookOpen, ChevronLeft, Lock, Send, Users } from "lucide-react";
import Link from "next/link";

const TABS = ["Overview", "Structure", "Students", "Grades", "Q&A", "AQAD"];

function StatusBadge({ status }: { status: string }) {
  const cls =
      status === "PUBLISHED"  ? "bg-[#dcfce7] text-[#166534]" :
          status === "APPROVED"   ? "bg-[#dbeafe] text-[#1d4ed8]" :
              status === "IN_REVIEW"  ? "bg-[#fef9c3] text-[#854d0e]" :
                  status === "REJECTED"   ? "bg-[#fee2e2] text-[#991b1b]" :
                      "bg-[#f0f0f0] text-[#666]";
  return (
      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${cls}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const numId = Number(courseId);

  const [course, setCourse]       = useState<ApiCourse | null>(null);
  const [modules, setModules]     = useState<ApiModule[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [courseRes, modulesRes] = await Promise.allSettled([
        teacherApi.getCourse(numId),
        teacherApi.getCourseModules(numId),
      ]);
      if (courseRes.status === "fulfilled")  setCourse(courseRes.value);
      else setError("Failed to load course");
      if (modulesRes.status === "fulfilled") {
        const d = modulesRes.value;
        setModules(Array.isArray(d) ? d : []);
      }
    } finally {
      setLoading(false);
    }
  }, [numId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const doAction = async (fn: () => Promise<ApiCourse>, msg: string) => {
    setActionLoading(true);
    setActionMsg(null);
    try {
      const updated = await fn();
      setCourse(updated);
      setActionMsg(msg);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Action failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />)}
      </div>
  );

  if (error || !course) return (
      <div className="py-12 text-center">
        <p className="text-secondary-foreground">{error ?? "Course not found."}</p>
        <Link href="/teacher/courses" className="mt-2 text-sm underline">Back to Courses</Link>
      </div>
  );

  const canSubmit  = course.status === "DRAFT" || course.status === "REJECTED";
  const canPublish = course.status === "APPROVED";
  const isReview   = course.status === "IN_REVIEW";
  const aqadReview = mockAQADReviews[0];

  return (
      <div>
        <Link href="/teacher/courses" className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to Courses
        </Link>

        {/* Header */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <StatusBadge status={course.status} />
              <span className="text-xs text-secondary-foreground">v{course.version}</span>
            </div>
            <PageHeader
                title={course.title}
                description={`${course.language ?? ""} · ${course.level ?? ""}`}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {canSubmit && (
                <button
                    disabled={actionLoading}
                    onClick={() => doAction(() => teacherApi.submitForReview(numId), "Submitted for AQAD review!")}
                    className="flex items-center gap-1.5 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {actionLoading ? "Submitting..." : "Submit for AQAD Review"}
                </button>
            )}
            {canPublish && (
                <button
                    disabled={actionLoading}
                    onClick={() => doAction(() => teacherApi.publishCourse(numId), "Course published!")}
                    className="flex items-center gap-1.5 rounded-md bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d] disabled:opacity-50"
                >
                  {actionLoading ? "Publishing..." : "Publish Course"}
                </button>
            )}
            {isReview && (
                <span className="flex items-center gap-1.5 rounded-md bg-[#fef9c3] px-4 py-2 text-sm font-medium text-[#854d0e]">
              <Lock className="h-4 w-4" /> Under AQAD Review
            </span>
            )}
            {course.status === "PUBLISHED" && (
                <button
                    disabled={actionLoading}
                    onClick={() => doAction(() => teacherApi.archiveCourse(numId), "Course archived!")}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary disabled:opacity-50"
                >
                  Archive
                </button>
            )}
            {/* Edit */}
            {(course.status === "DRAFT" || course.status === "REJECTED") && (
                <Link
                    href={`/teacher/courses/${courseId}/edit`}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Edit
                </Link>
            )}
          </div>
        </div>

        {actionMsg && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {actionMsg}
            </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex overflow-x-auto">
            {TABS.map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === tab
                            ? "border-foreground text-foreground"
                            : "border-transparent text-secondary-foreground hover:text-foreground"
                    }`}
                >
                  {tab}
                </button>
            ))}
          </div>
        </div>

        {/* ── Overview ── */}
        {activeTab === "Overview" && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <SectionCard title="Course Information" className="lg:col-span-2">
                <div className="space-y-4">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">Description</p>
                    <p className="text-sm">{course.description || "—"}</p>
                  </div>
                  {course.learningOutcomes && (
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">Learning Outcomes</p>
                        <p className="text-sm whitespace-pre-line">{course.learningOutcomes}</p>
                      </div>
                  )}
                  {course.prerequisites && (
                      <div>
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-secondary-foreground">Prerequisites</p>
                        <p className="text-sm">{course.prerequisites}</p>
                      </div>
                  )}
                </div>
              </SectionCard>

              <div className="space-y-4">
                <SectionCard title="Details">
                  <div className="space-y-3 text-sm">
                    {([
                      ["Language",     course.language ?? "—"],
                      ["Level",        course.level ?? "—"],
                      ["Version",      String(course.version)],
                      ["Created",      new Date(course.createdAt).toLocaleDateString()],
                      ["Updated",      new Date(course.updatedAt).toLocaleDateString()],
                    ] as [string, string][]).map(([label, value]) => (
                        <div key={label} className="flex justify-between">
                          <span className="text-secondary-foreground">{label}</span>
                          <span className="font-medium">{value}</span>
                        </div>
                    ))}
                  </div>
                </SectionCard>
                {course.gradingPolicy && (
                    <SectionCard title="Grading Policy">
                      <p className="text-sm text-secondary-foreground whitespace-pre-line">{course.gradingPolicy}</p>
                    </SectionCard>
                )}
              </div>
            </div>
        )}

        {/* ── Structure ── */}
        {activeTab === "Structure" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-secondary-foreground">{modules.length} modules</p>
                <Link
                    href={`/teacher/courses/${courseId}/modules`}
                    className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
                >
                  Manage Modules
                </Link>
              </div>
              {modules.length === 0 ? (
                  <EmptyState
                      icon={BookOpen}
                      title="No modules yet"
                      description="Create modules to organize your lectures"
                      action={
                        <Link
                            href={`/teacher/courses/${courseId}/modules`}
                            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                        >
                          Add Module
                        </Link>
                      }
                  />
              ) : (
                  modules.map((mod) => (
                      <div key={mod.id} className="rounded-lg border border-border bg-background p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{mod.title}</p>
                            {mod.description && (
                                <p className="text-sm text-secondary-foreground">{mod.description}</p>
                            )}
                          </div>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                              mod.status === "ACTIVE"
                                  ? "bg-[#dcfce7] text-[#166534]"
                                  : "bg-secondary text-secondary-foreground"
                          }`}>
                    {mod.status}
                  </span>
                        </div>
                      </div>
                  ))
              )}
            </div>
        )}

        {/* ── Students (mock) ── */}
        {activeTab === "Students" && (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left font-medium">Student</th>
                  <th className="p-3 text-left font-medium">Attendance</th>
                  <th className="p-3 text-left font-medium">Grade</th>
                  <th className="p-3 text-left font-medium">Assignments</th>
                </tr>
                </thead>
                <tbody>
                {mockEnrolledStudents.map((s) => (
                    <tr key={s.id} className="border-t border-border hover:bg-secondary/50">
                      <td className="p-3">
                        <p className="font-medium">{s.name}</p>
                        <p className="text-xs text-secondary-foreground">{s.studentId}</p>
                      </td>
                      <td className={`p-3 ${s.attendanceRate < 75 ? "font-medium text-[#ef4444]" : ""}`}>
                        {s.attendanceRate}%
                      </td>
                      <td className="p-3 font-semibold">{s.currentGrade}</td>
                      <td className="p-3 text-secondary-foreground">
                        {s.submittedAssignments}/{s.totalAssignments}
                      </td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}

        {/* ── Grades (mock) ── */}
        {activeTab === "Grades" && (
            <div>
              <div className="mb-4 flex justify-end">
                <Link href="/teacher/gradebook" className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                  Open Full Gradebook
                </Link>
              </div>
              <div className="overflow-x-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                  <tr>
                    <th className="p-3 text-left font-medium">Student</th>
                    <th className="p-3 text-center font-medium">Total Score</th>
                    <th className="p-3 text-center font-medium">Final Grade</th>
                  </tr>
                  </thead>
                  <tbody>
                  {mockGradebookRows.map((row) => (
                      <tr key={row.studentId} className="border-t border-border">
                        <td className="p-3 font-medium">{row.studentName}</td>
                        <td className="p-3 text-center">{row.totalScore}</td>
                        <td className="p-3 text-center font-bold">{row.finalGrade}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </div>
        )}

        {/* ── Q&A (mock) ── */}
        {activeTab === "Q&A" && (
            <div className="space-y-3">
              <div className="flex justify-end">
                <Link href="/teacher/qa" className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary">
                  Open Q&A Panel
                </Link>
              </div>
              {mockQAQuestions.map((q) => (
                  <div key={q.id} className="rounded-lg border border-border bg-background p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{q.title}</p>
                        <p className="mt-0.5 text-xs text-secondary-foreground">
                          {q.authorName} · {new Date(q.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          q.status === "open"     ? "bg-[#fef9c3] text-[#854d0e]"
                              : q.status === "answered" ? "bg-[#dcfce7] text-[#166534]"
                                  : "bg-[#f0f0f0] text-[#666]"
                      }`}>
                  {q.status}
                </span>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {/* ── AQAD (mock) ── */}
        {activeTab === "AQAD" && (
            <div>
              {!aqadReview ? (
                  <EmptyState icon={Users} title="No AQAD review yet" description="Submit this course for review to get AQAD feedback" />
              ) : (
                  <div className="space-y-4">
                    <SectionCard title="Review Status">
                      <StatusBadge status={aqadReview.status.toUpperCase()} />
                      {aqadReview.reviewerName && (
                          <p className="mt-2 text-sm text-secondary-foreground">
                            Reviewed by {aqadReview.reviewerName}
                          </p>
                      )}
                    </SectionCard>
                    <Link href="/teacher/aqad-feedback" className="inline-block rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
                      View Full AQAD Feedback →
                    </Link>
                  </div>
              )}
            </div>
        )}
      </div>
  );
}