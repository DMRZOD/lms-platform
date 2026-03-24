"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { mockAssignments, mockSubmissions } from "@/constants/teacher-mock-data";
import type { StudentSubmission, TeacherAssignment } from "@/types/teacher";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Plus,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function AssignmentsPage() {
  const [selectedAssignment, setSelectedAssignment] = useState<TeacherAssignment | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<StudentSubmission | null>(null);
  const [grade, setGrade] = useState("");
  const [feedback, setFeedback] = useState("");

  const getStatusBadge = (status: string) => {
    if (status === "published") return "bg-[#dcfce7] text-[#166534]";
    if (status === "closed") return "bg-[#f0f0f0] text-[#666]";
    return "bg-[#fef9c3] text-[#854d0e]";
  };

  const handleGrade = () => {
    // mock grading action
    setSelectedSubmission(null);
    setGrade("");
    setFeedback("");
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <PageHeader title="Assignments" description="Manage assignments and review submissions" />
        <Link
          href="/teacher/courses"
          className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> Create Assignment
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Assignment List */}
        <div className="space-y-3 lg:col-span-1">
          <h2 className="font-semibold">All Assignments</h2>
          {mockAssignments.map((asgn) => {
            const pendingCount = mockSubmissions.filter(
              (s) => s.assignmentId === asgn.id && (s.status === "submitted" || s.status === "late"),
            ).length;

            return (
              <button
                key={asgn.id}
                onClick={() => {
                  setSelectedAssignment(asgn);
                  setSelectedSubmission(null);
                }}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedAssignment?.id === asgn.id
                    ? "border-foreground bg-secondary"
                    : "border-border bg-background hover:bg-secondary/50"
                }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="font-medium">{asgn.title}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(asgn.status)}`}>
                    {asgn.status}
                  </span>
                </div>
                <p className="text-xs text-secondary-foreground">{asgn.courseName}</p>
                <div className="mt-2 flex items-center gap-3 text-xs text-secondary-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Due {asgn.deadline}
                  </span>
                  <span>
                    {asgn.submissionsCount}/{asgn.totalStudents} submitted
                  </span>
                  {pendingCount > 0 && (
                    <span className="rounded-full bg-[#fef9c3] px-2 py-0.5 text-[#854d0e]">
                      {pendingCount} pending
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Panel */}
        <div className="lg:col-span-2">
          {!selectedAssignment ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
              <p className="text-sm text-secondary-foreground">Select an assignment to view details</p>
            </div>
          ) : !selectedSubmission ? (
            <div className="space-y-4">
              <SectionCard title={selectedAssignment.title}>
                <div className="space-y-3">
                  <p className="text-sm">{selectedAssignment.description}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <p className="text-secondary-foreground">Deadline</p>
                      <p className="font-medium">{selectedAssignment.deadline}</p>
                    </div>
                    <div>
                      <p className="text-secondary-foreground">Max Attempts</p>
                      <p className="font-medium">{selectedAssignment.maxAttempts}</p>
                    </div>
                    <div>
                      <p className="text-secondary-foreground">Late Penalty</p>
                      <p className="font-medium">
                        {selectedAssignment.lateSubmissionAllowed
                          ? `${selectedAssignment.latePenaltyPercent}%`
                          : "Not accepted"}
                      </p>
                    </div>
                    <div>
                      <p className="text-secondary-foreground">Graded</p>
                      <p className="font-medium">
                        {selectedAssignment.gradedCount}/{selectedAssignment.submissionsCount}
                      </p>
                    </div>
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Rubrics">
                <div className="space-y-3">
                  {selectedAssignment.rubrics.map((rubric) => (
                    <div key={rubric.id} className="rounded-md border border-border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <p className="font-medium">{rubric.criterion}</p>
                        <span className="text-sm text-secondary-foreground">
                          Max: {rubric.maxScore} pts
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                        {rubric.levels.map((level) => (
                          <div
                            key={level.label}
                            className="rounded-md bg-secondary p-2 text-xs"
                          >
                            <p className="font-medium">{level.label}</p>
                            <p className="text-secondary-foreground">{level.score} pts</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Submissions">
                <div className="space-y-2">
                  {mockSubmissions
                    .filter((s) => s.assignmentId === selectedAssignment.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between rounded-md border border-border p-3"
                      >
                        <div>
                          <p className="text-sm font-medium">{sub.studentName}</p>
                          <p className="text-xs text-secondary-foreground">
                            Submitted {new Date(sub.submittedAt).toLocaleString()}
                            {sub.isLate && (
                              <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-[#991b1b]">
                                Late
                              </span>
                            )}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {sub.score !== null ? (
                            <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                              <CheckCircle className="h-3.5 w-3.5" />
                              {sub.score}/100
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded-full bg-[#fef9c3] px-2 py-0.5 text-xs text-[#854d0e]">
                              <AlertCircle className="h-3.5 w-3.5" />
                              Pending
                            </span>
                          )}
                          <button
                            onClick={() => {
                              setSelectedSubmission(sub);
                              setGrade(sub.score !== null ? String(sub.score) : "");
                              setFeedback(sub.feedback ?? "");
                            }}
                            className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-secondary"
                          >
                            Review <ChevronRight className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {mockSubmissions.filter((s) => s.assignmentId === selectedAssignment.id)
                    .length === 0 && (
                    <p className="text-sm text-secondary-foreground">No submissions yet</p>
                  )}
                </div>
              </SectionCard>
            </div>
          ) : (
            /* Submission Review Panel */
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedSubmission(null)}
                  className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
                >
                  ← Back to submissions
                </button>
              </div>

              <SectionCard title={`Review: ${selectedSubmission.studentName}`}>
                <div className="space-y-4">
                  {/* Files */}
                  <div>
                    <p className="mb-2 text-sm font-medium">Submitted Files</p>
                    {selectedSubmission.files.map((f) => (
                      <div
                        key={f.name}
                        className="flex items-center gap-2 rounded-md border border-border p-2"
                      >
                        <FileText className="h-4 w-4 text-secondary-foreground" />
                        <span className="flex-1 text-sm">{f.name}</span>
                        <span className="text-xs text-secondary-foreground">{f.size}</span>
                        <button className="text-xs font-medium underline underline-offset-2">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Rubric Scoring */}
                  <div>
                    <p className="mb-2 text-sm font-medium">Grade by Rubrics</p>
                    <div className="space-y-3">
                      {selectedAssignment.rubrics.map((rubric) => (
                        <div key={rubric.id} className="rounded-md border border-border p-3">
                          <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium">{rubric.criterion}</p>
                            <span className="text-xs text-secondary-foreground">
                              Max: {rubric.maxScore}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {rubric.levels.map((level) => (
                              <button
                                key={level.label}
                                className="rounded-md border border-border p-2 text-left text-xs hover:border-foreground hover:bg-secondary"
                              >
                                <p className="font-medium">{level.label}</p>
                                <p className="text-secondary-foreground">{level.score} pts</p>
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manual Grade */}
                  <div>
                    <label className="mb-1 block text-sm font-medium">Total Score</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className="w-24 rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Feedback</label>
                    <textarea
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      placeholder="Write feedback for the student..."
                      className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleGrade}
                      className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
                    >
                      Save & Publish Grade
                    </button>
                    <button
                      onClick={() => setSelectedSubmission(null)}
                      className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
