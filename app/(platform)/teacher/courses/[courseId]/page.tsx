"use client";

import { PageHeader } from "@/components/platform/page-header";
import { CourseStatusBadge } from "@/components/teacher/course-status-badge";
import { EmptyState } from "@/components/teacher/empty-state";
import { SectionCard } from "@/components/teacher/section-card";
import {
  mockAQADReviews,
  mockCourses,
  mockEnrolledStudents,
  mockGradebookRows,
  mockModules,
  mockQAQuestions,
} from "@/constants/teacher-mock-data";
import { AlertTriangle, BookOpen, ChevronLeft, Lock, Send, Users } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";

const TABS = ["Overview", "Structure", "Students", "Grades", "Q&A", "Analytics", "AQAD"];

export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [activeTab, setActiveTab] = useState("Overview");
  const [submitted, setSubmitted] = useState(false);
  const [published, setPublished] = useState(false);

  const course = mockCourses.find((c) => c.id === courseId) ?? mockCourses[0];
  const modules = mockModules.filter((m) => m.courseId === course.id);
  const aqadReview = mockAQADReviews.find((r) => r.courseId === course.id);

  const canSubmitForReview = course.status === "Draft" || course.status === "Rejected";
  const canPublish = course.status === "Approved" && !published;
  const isBlocked = course.status === "InReview";
  const currentStatus = published ? "Published" : submitted ? "InReview" : course.status;

  return (
    <div>
      {/* Back */}
      <Link
        href="/teacher/courses"
        className="mb-4 flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Back to Courses
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-secondary-foreground">{course.code}</p>
            <CourseStatusBadge status={currentStatus} />
          </div>
          <PageHeader title={course.name} description={`${course.credits} credits · ${course.language} · ${course.difficultyLevel}`} />
        </div>
        <div className="flex flex-wrap gap-2">
          {canSubmitForReview && !submitted && (
            <button
              onClick={() => setSubmitted(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
            >
              <Send className="h-4 w-4" />
              Submit for AQAD Review
            </button>
          )}
          {submitted && !published && (
            <span className="flex items-center gap-1.5 rounded-md bg-[#fef9c3] px-4 py-2 text-sm font-medium text-[#854d0e]">
              <Lock className="h-4 w-4" /> Awaiting AQAD Review
            </span>
          )}
          {canPublish && (
            <button
              onClick={() => setPublished(true)}
              className="flex items-center gap-1.5 rounded-md bg-[#16a34a] px-4 py-2 text-sm font-medium text-white hover:bg-[#15803d]"
            >
              Publish Course
            </button>
          )}
          {isBlocked && (
            <span className="flex items-center gap-1.5 rounded-md bg-[#fef9c3] px-4 py-2 text-sm font-medium text-[#854d0e]">
              <Lock className="h-4 w-4" /> Under AQAD Review
            </span>
          )}
          {course.status === "Rejected" && (
            <Link
              href="/teacher/aqad-feedback"
              className="flex items-center gap-1.5 rounded-md border border-[#fecaca] bg-[#fef2f2] px-4 py-2 text-sm font-medium text-[#991b1b] hover:bg-[#fee2e2]"
            >
              <AlertTriangle className="h-4 w-4" />
              View {course.aqadRemarks} Remark{(course.aqadRemarks ?? 0) > 1 ? "s" : ""}
            </Link>
          )}
        </div>
      </div>

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

      {/* Tab Content */}
      {activeTab === "Overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <SectionCard title="Course Information" className="lg:col-span-2">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Description</p>
                <p className="text-sm">{course.description}</p>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Learning Outcomes</p>
                <ul className="space-y-1">
                  {course.learningOutcomes.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
              {course.prerequisites.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-secondary-foreground uppercase tracking-wide">Prerequisites</p>
                  <ul className="space-y-1">
                    {course.prerequisites.map((p, i) => (
                      <li key={i} className="text-sm text-secondary-foreground">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="Details">
              <div className="space-y-3 text-sm">
                {[
                  ["Credits", course.credits],
                  ["Language", course.language],
                  ["Level", course.difficultyLevel],
                  ["Semester", course.semester],
                  ["Year", course.year],
                  ["Total Lectures", `${course.completedLectures}/${course.totalLectures}`],
                  ["Students", course.totalStudents],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between">
                    <span className="text-secondary-foreground">{label}</span>
                    <span className="font-medium capitalize">{String(value)}</span>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Grading Policy">
              <div className="space-y-2">
                {course.gradingPolicy.map((item) => (
                  <div key={item.type} className="flex items-center justify-between text-sm">
                    <span className="text-secondary-foreground">{item.type}</span>
                    <span className="font-semibold">{item.weight}%</span>
                  </div>
                ))}
                <p className="mt-2 text-xs text-secondary-foreground">{course.lateSubmissionPolicy}</p>
              </div>
            </SectionCard>
          </div>
        </div>
      )}

      {activeTab === "Structure" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">{modules.length} modules</p>
            <Link
              href={`/teacher/courses/${course.id}/modules`}
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
                  href={`/teacher/courses/${course.id}/modules`}
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
                    <p className="font-medium">{mod.name}</p>
                    <p className="text-sm text-secondary-foreground">{mod.description}</p>
                  </div>
                  <span className="text-xs text-secondary-foreground">
                    {mod.lectureIds.length} lecture{mod.lectureIds.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "Students" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">{mockEnrolledStudents.length} students enrolled</p>
          </div>
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left font-medium">Student</th>
                  <th className="p-3 text-left font-medium">Group</th>
                  <th className="p-3 text-left font-medium">Attendance</th>
                  <th className="p-3 text-left font-medium">Grade</th>
                  <th className="p-3 text-left font-medium">Assignments</th>
                </tr>
              </thead>
              <tbody>
                {mockEnrolledStudents.map((student) => (
                  <tr key={student.id} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3">
                      <p className="font-medium">{student.name}</p>
                      <p className="text-xs text-secondary-foreground">{student.studentId}</p>
                    </td>
                    <td className="p-3 text-secondary-foreground">{student.group}</td>
                    <td className="p-3">
                      <span className={student.attendanceRate < 75 ? "font-medium text-[#ef4444]" : ""}>
                        {student.attendanceRate}%
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{student.currentGrade}</span>
                      <span className="ml-1 text-xs text-secondary-foreground">({student.currentScore})</span>
                    </td>
                    <td className="p-3 text-secondary-foreground">
                      {student.submittedAssignments}/{student.totalAssignments}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Grades" && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">Gradebook summary</p>
            <Link
              href="/teacher/gradebook"
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
              Open Full Gradebook
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left font-medium">Student</th>
                  <th className="p-3 text-left font-medium">Total Score</th>
                  <th className="p-3 text-left font-medium">Final Grade</th>
                </tr>
              </thead>
              <tbody>
                {mockGradebookRows.map((row) => (
                  <tr key={row.studentId} className="border-t border-border hover:bg-secondary/50">
                    <td className="p-3 font-medium">{row.studentName}</td>
                    <td className="p-3">{row.totalScore}</td>
                    <td className="p-3 font-semibold">{row.finalGrade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "Q&A" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-secondary-foreground">{mockQAQuestions.length} questions</p>
            <Link
              href="/teacher/qa"
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-secondary"
            >
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
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    q.status === "open"
                      ? "bg-[#fef9c3] text-[#854d0e]"
                      : q.status === "answered"
                        ? "bg-[#dcfce7] text-[#166534]"
                        : "bg-[#f0f0f0] text-[#666666]"
                  }`}
                >
                  {q.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === "Analytics" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <SectionCard title="Attendance by Lecture">
            <div className="space-y-2">
              {[88, 86, 91, 79, 84, 82, 88].map((rate, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-20 text-xs text-secondary-foreground">Lecture {i + 1}</span>
                  <div className="flex-1 rounded-full bg-secondary">
                    <div
                      className={`h-2 rounded-full ${rate < 75 ? "bg-[#ef4444]" : "bg-foreground"}`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="w-10 text-right text-xs font-medium">{rate}%</span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Grade Distribution">
            <div className="space-y-2">
              {[
                ["A", 8],
                ["B", 15],
                ["C", 12],
                ["D", 5],
                ["F", 2],
              ].map(([grade, count]) => (
                <div key={grade} className="flex items-center gap-3">
                  <span className="w-6 text-sm font-bold">{grade}</span>
                  <div className="flex-1 rounded-full bg-secondary">
                    <div
                      className="h-2 rounded-full bg-foreground"
                      style={{ width: `${((count as number) / 42) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-xs font-medium">{count}</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      )}

      {activeTab === "AQAD" && (
        <div>
          {!aqadReview ? (
            <EmptyState
              icon={Users}
              title="No AQAD review yet"
              description="Submit this course for review to get AQAD feedback"
            />
          ) : (
            <div className="space-y-4">
              <SectionCard title="Review Status">
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-medium ${
                      aqadReview.status === "Approved"
                        ? "bg-[#dcfce7] text-[#166534]"
                        : aqadReview.status === "Rejected"
                          ? "bg-[#fee2e2] text-[#991b1b]"
                          : "bg-[#fef9c3] text-[#854d0e]"
                    }`}
                  >
                    {aqadReview.status}
                  </span>
                  {aqadReview.reviewerName && (
                    <p className="text-sm text-secondary-foreground">
                      Reviewed by {aqadReview.reviewerName}
                      {aqadReview.reviewedAt ? ` on ${aqadReview.reviewedAt}` : ""}
                    </p>
                  )}
                </div>
              </SectionCard>

              {aqadReview.checklist.length > 0 && (
                <SectionCard title="Checklist">
                  <div className="space-y-2">
                    {aqadReview.checklist.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-start gap-3 rounded-md border border-border p-3"
                      >
                        <span
                          className={`mt-0.5 flex-shrink-0 text-base ${
                            item.status === "passed"
                              ? "text-[#16a34a]"
                              : item.status === "failed"
                                ? "text-[#ef4444]"
                                : "text-[#f59e0b]"
                          }`}
                        >
                          {item.status === "passed" ? "✓" : item.status === "failed" ? "✗" : "?"}
                        </span>
                        <div>
                          <p className="text-sm">{item.criterion}</p>
                          {item.reviewerComment && (
                            <p className="mt-0.5 text-xs text-secondary-foreground">{item.reviewerComment}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </SectionCard>
              )}

              <Link
                href="/teacher/aqad-feedback"
                className="inline-block rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
              >
                View Full AQAD Feedback →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
