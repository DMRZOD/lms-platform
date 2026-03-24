"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { mockExams } from "@/constants/teacher-mock-data";
import type { TeacherExam } from "@/types/teacher";
import { CheckCircle, Clock, MessageSquare, Users, XCircle } from "lucide-react";
import { useState } from "react";

export default function ExamsPage() {
  const [selectedExam, setSelectedExam] = useState<TeacherExam | null>(mockExams[0]);
  const [activeTab, setActiveTab] = useState("Exams");
  const [appealComment, setAppealComment] = useState<Record<string, string>>({});

  const getExamStatusBadge = (status: string) => {
    if (status === "completed") return "bg-[#f0f0f0] text-[#666]";
    if (status === "in_progress") return "bg-[#dcfce7] text-[#166534]";
    return "bg-[#dbeafe] text-[#1d4ed8]";
  };

  const getExamTypeBadge = (type: string) => {
    if (type === "final") return "bg-[#fee2e2] text-[#991b1b]";
    if (type === "midterm") return "bg-[#ffedd5] text-[#9a3412]";
    return "bg-[#f0f0f0] text-[#666]";
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader title="Exams" description="Manage exams, eligibility, and results" />
      </div>

      {/* Exam List */}
      {activeTab === "Exams" && (
        <div className="space-y-4">
          {mockExams.map((exam) => (
            <div
              key={exam.id}
              className={`rounded-lg border p-5 transition-colors ${
                selectedExam?.id === exam.id ? "border-foreground" : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{exam.courseName}</h3>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getExamTypeBadge(exam.type)}`}>
                      {exam.type}
                    </span>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getExamStatusBadge(exam.status)}`}>
                      {exam.status}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-secondary-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {exam.date} at {exam.startTime} · {exam.duration}min
                    </span>
                    <span>{exam.room}</span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {exam.eligibleCount}/{exam.totalStudents} eligible
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {["Eligibility", "Design", "Results", "Appeals"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => {
                        setSelectedExam(exam);
                        setActiveTab(tab);
                      }}
                      className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Eligibility Tab */}
      {activeTab === "Eligibility" && selectedExam && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("Exams")}
              className="text-sm text-secondary-foreground hover:text-foreground"
            >
              ← All Exams
            </button>
            <h2 className="font-semibold">
              Eligibility: {selectedExam.courseName} ({selectedExam.type})
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-2xl font-bold text-[#16a34a]">
                {selectedExam.eligibility.filter((e) => e.isEligible).length}
              </p>
              <p className="text-xs text-secondary-foreground">Eligible</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-2xl font-bold text-[#ef4444]">
                {selectedExam.eligibility.filter((e) => !e.isEligible).length}
              </p>
              <p className="text-xs text-secondary-foreground">Ineligible</p>
            </div>
            <div className="rounded-lg border border-border bg-background p-4 text-center">
              <p className="text-2xl font-bold">{selectedExam.totalStudents}</p>
              <p className="text-xs text-secondary-foreground">Total</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-sm">
              <thead className="bg-secondary">
                <tr>
                  <th className="p-3 text-left font-medium">Student</th>
                  <th className="p-3 text-left font-medium">Attendance</th>
                  <th className="p-3 text-left font-medium">Assignments</th>
                  <th className="p-3 text-left font-medium">Status</th>
                  <th className="p-3 text-left font-medium">Reasons</th>
                </tr>
              </thead>
              <tbody>
                {selectedExam.eligibility.map((e) => (
                  <tr key={e.studentId} className="border-t border-border">
                    <td className="p-3 font-medium">{e.studentName}</td>
                    <td
                      className={`p-3 ${e.attendanceRate < 75 ? "font-medium text-[#ef4444]" : ""}`}
                    >
                      {e.attendanceRate}%
                    </td>
                    <td className="p-3">
                      {e.assignmentsCompleted}/{e.totalAssignments}
                    </td>
                    <td className="p-3">
                      {e.isEligible ? (
                        <span className="flex items-center gap-1 text-[#16a34a]">
                          <CheckCircle className="h-4 w-4" /> Eligible
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[#ef4444]">
                          <XCircle className="h-4 w-4" /> Ineligible
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-xs text-secondary-foreground">
                      {e.ineligibilityReasons.join(", ") || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Design Tab */}
      {activeTab === "Design" && selectedExam && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("Exams")}
                className="text-sm text-secondary-foreground hover:text-foreground"
              >
                ← All Exams
              </button>
              <h2 className="font-semibold">
                Exam Design: {selectedExam.courseName}
              </h2>
            </div>
            <button className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:opacity-90">
              + Add Question
            </button>
          </div>

          {selectedExam.questions.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <p className="text-sm text-secondary-foreground">No questions yet</p>
              <button className="mt-3 text-sm font-medium underline underline-offset-2">
                Add first question
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedExam.questions.map((q, idx) => (
                <SectionCard key={q.id}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-secondary-foreground">
                          Q{idx + 1}
                        </span>
                        <span className="rounded bg-secondary px-1.5 py-0.5 text-xs capitalize text-secondary-foreground">
                          {q.type.replace("_", " ")}
                        </span>
                        <span className="text-xs text-secondary-foreground">
                          {q.maxScore} pts
                        </span>
                      </div>
                      <p className="text-sm font-medium">{q.text}</p>
                      {q.options && (
                        <ul className="mt-2 space-y-1">
                          {q.options.map((opt, i) => (
                            <li
                              key={i}
                              className={`flex items-center gap-2 text-xs ${
                                opt === q.correctAnswer ? "font-medium text-[#16a34a]" : "text-secondary-foreground"
                              }`}
                            >
                              <span className="flex h-4 w-4 items-center justify-center rounded-full border border-current text-xs">
                                {String.fromCharCode(65 + i)}
                              </span>
                              {opt}
                              {opt === q.correctAnswer && " ✓"}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button className="text-xs text-secondary-foreground underline underline-offset-2 hover:text-foreground">
                      Edit
                    </button>
                  </div>
                </SectionCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "Results" && selectedExam && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("Exams")}
              className="text-sm text-secondary-foreground hover:text-foreground"
            >
              ← All Exams
            </button>
            <h2 className="font-semibold">Results: {selectedExam.courseName}</h2>
          </div>

          {selectedExam.results.length === 0 ? (
            <p className="text-sm text-secondary-foreground">
              Results not available yet
            </p>
          ) : (
            <div className="overflow-hidden rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="p-3 text-left font-medium">Student</th>
                    <th className="p-3 text-left font-medium">Score</th>
                    <th className="p-3 text-left font-medium">Grade</th>
                    <th className="p-3 text-left font-medium">Submitted</th>
                    <th className="p-3 text-left font-medium">Appeal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedExam.results.map((r) => (
                    <tr key={r.studentId} className="border-t border-border">
                      <td className="p-3 font-medium">{r.studentName}</td>
                      <td className="p-3">
                        {r.score}/{r.maxScore}
                      </td>
                      <td className="p-3 font-bold">{r.grade}</td>
                      <td className="p-3 text-secondary-foreground text-xs">
                        {new Date(r.submittedAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {r.hasAppeal ? (
                          <span className="rounded-full bg-[#fef9c3] px-2 py-0.5 text-xs text-[#854d0e]">
                            {r.appealStatus}
                          </span>
                        ) : (
                          <span className="text-secondary-foreground text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Appeals Tab */}
      {activeTab === "Appeals" && selectedExam && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab("Exams")}
              className="text-sm text-secondary-foreground hover:text-foreground"
            >
              ← All Exams
            </button>
            <h2 className="font-semibold">Appeals: {selectedExam.courseName}</h2>
          </div>

          {selectedExam.results.filter((r) => r.hasAppeal).length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <CheckCircle className="mb-2 h-8 w-8 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">No appeals for this exam</p>
            </div>
          ) : (
            selectedExam.results
              .filter((r) => r.hasAppeal)
              .map((r) => (
                <SectionCard key={r.studentId}>
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{r.studentName}</p>
                        <p className="text-sm text-secondary-foreground">
                          Score: {r.score}/{r.maxScore} · Grade: {r.grade}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#fef9c3] px-2 py-0.5 text-xs font-medium text-[#854d0e]">
                        {r.appealStatus}
                      </span>
                    </div>
                    <div className="rounded-md bg-secondary p-3">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="mt-0.5 h-4 w-4 flex-shrink-0 text-secondary-foreground" />
                        <p className="text-sm">{r.appealComment}</p>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-secondary-foreground">
                        Your response
                      </label>
                      <textarea
                        value={appealComment[r.studentId] ?? ""}
                        onChange={(e) =>
                          setAppealComment({ ...appealComment, [r.studentId]: e.target.value })
                        }
                        rows={2}
                        placeholder="Write your response to the appeal..."
                        className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                      />
                      <div className="mt-2 flex gap-2">
                        <button className="rounded-md bg-[#16a34a] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#15803d]">
                          Accept Appeal
                        </button>
                        <button className="rounded-md bg-[#ef4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#dc2626]">
                          Reject Appeal
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionCard>
              ))
          )}
        </div>
      )}
    </div>
  );
}
