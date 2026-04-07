"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiAssignment, ApiSubmission, ApiCourse } from "@/lib/teacher-api";
import {
  AlertCircle,
  CheckCircle,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";

export default function AssignmentsPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [assignments, setAssignments] = useState<ApiAssignment[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<ApiAssignment | null>(null);
  const [submissions, setSubmissions] = useState<ApiSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<ApiSubmission | null>(null);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [grading, setGrading] = useState(false);

  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("100");
  const [feedback, setFeedback] = useState("");
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Load courses
  useEffect(() => {
    (async () => {
      try {
        const data = await teacherApi.getCourses({ size: 50 });
        const arr: ApiCourse[] = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(arr);
        if (arr.length > 0) setSelectedCourseId(arr[0].id);
      } finally {
        setLoadingCourses(false);
      }
    })();
  }, []);

  // Load assignments when course changes
  const loadAssignments = useCallback(async () => {
    if (!selectedCourseId) return;
    setLoadingAssignments(true);
    setSelectedAssignment(null);
    setSubmissions([]);
    setSelectedSubmission(null);
    try {
      const data = await teacherApi.getAssignments(selectedCourseId, { size: 50 });
      const arr: ApiAssignment[] = Array.isArray(data) ? data : (data.content ?? []);
      setAssignments(arr);
    } catch {
      setAssignments([]);
    } finally {
      setLoadingAssignments(false);
    }
  }, [selectedCourseId]);

  useEffect(() => { loadAssignments(); }, [loadAssignments]);

  // Load submissions when assignment selected
  const loadSubmissions = useCallback(async (assignment: ApiAssignment) => {
    setSelectedAssignment(assignment);
    setSelectedSubmission(null);
    setLoadingSubmissions(true);
    try {
      const data = await teacherApi.getSubmissions(assignment.id, { size: 100 });
      const arr: ApiSubmission[] = Array.isArray(data) ? data : (data.content ?? []);
      setSubmissions(arr);
    } catch {
      setSubmissions([]);
    } finally {
      setLoadingSubmissions(false);
    }
  }, []);

  const handleGrade = async () => {
    if (!selectedSubmission || !score.trim()) return;
    setGrading(true);
    setActionMsg(null);
    try {
      await teacherApi.gradeSubmission(selectedSubmission.id, {
        score: Number(score),
        maxScore: Number(maxScore),
        feedback: feedback.trim(),
      });
      setActionMsg("Grade saved successfully!");
      setSelectedSubmission(null);
      setScore("");
      setFeedback("");
      // Reload submissions
      if (selectedAssignment) await loadSubmissions(selectedAssignment);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to save grade");
    } finally {
      setGrading(false);
    }
  };

  const handlePublish = async (assignment: ApiAssignment) => {
    if (!selectedCourseId) return;
    try {
      await teacherApi.publishAssignment(selectedCourseId, assignment.id);
      await loadAssignments();
      setActionMsg("Assignment published!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to publish");
    }
  };

  const handleClose = async (assignment: ApiAssignment) => {
    if (!selectedCourseId) return;
    try {
      await teacherApi.closeAssignment(selectedCourseId, assignment.id);
      await loadAssignments();
      setActionMsg("Assignment closed!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to close");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "PUBLISHED" || status === "published") return "bg-[#dcfce7] text-[#166534]";
    if (status === "CLOSED" || status === "closed") return "bg-[#f0f0f0] text-[#666]";
    return "bg-[#fef9c3] text-[#854d0e]";
  };

  if (loadingCourses) {
    return (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  return (
      <div>
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <PageHeader title="Assignments" description="Manage assignments and review submissions" />
          <button
              onClick={loadAssignments}
              className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
          >
            <RefreshCw className="h-4 w-4" /> Refresh
          </button>
        </div>

        {/* Course selector */}
        <div className="mb-6 flex items-center gap-3">
          <label className="text-sm font-medium">Course:</label>
          <select
              value={selectedCourseId ?? ""}
              onChange={(e) => setSelectedCourseId(Number(e.target.value))}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
          >
            {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {actionMsg && (
            <div className="mb-4 rounded-lg border border-border bg-secondary/50 px-4 py-2 text-sm">
              {actionMsg}
            </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Assignment List */}
          <div className="space-y-3 lg:col-span-1">
            <h2 className="font-semibold">
              Assignments {loadingAssignments ? "(loading...)" : `(${assignments.length})`}
            </h2>

            {assignments.length === 0 && !loadingAssignments && (
                <p className="text-sm text-secondary-foreground">No assignments found for this course.</p>
            )}

            {assignments.map((asgn) => (
                <button
                    key={asgn.id}
                    onClick={() => loadSubmissions(asgn)}
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
                  <div className="mt-2 flex items-center gap-3 text-xs text-secondary-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  Due {new Date(asgn.deadline).toLocaleDateString()}
                </span>
                    {asgn.maxAttempts > 0 && (
                        <span>Max attempts: {asgn.maxAttempts}</span>
                    )}
                  </div>
                  <div className="mt-2 flex gap-2">
                    {asgn.status === "DRAFT" && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePublish(asgn); }}
                            className="rounded-md bg-[#16a34a] px-2 py-1 text-xs font-medium text-white hover:bg-[#15803d]"
                        >
                          Publish
                        </button>
                    )}
                    {asgn.status === "PUBLISHED" && (
                        <button
                            onClick={(e) => { e.stopPropagation(); handleClose(asgn); }}
                            className="rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-secondary"
                        >
                          Close
                        </button>
                    )}
                  </div>
                </button>
            ))}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2">
            {!selectedAssignment ? (
                <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-secondary-foreground">Select an assignment to view submissions</p>
                </div>
            ) : !selectedSubmission ? (
                <div className="space-y-4">
                  <SectionCard title={selectedAssignment.title}>
                    <div className="space-y-3">
                      <p className="text-sm">{selectedAssignment.description}</p>
                      <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-3">
                        <div>
                          <p className="text-secondary-foreground">Deadline</p>
                          <p className="font-medium">{new Date(selectedAssignment.deadline).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-secondary-foreground">Max Attempts</p>
                          <p className="font-medium">{selectedAssignment.maxAttempts}</p>
                        </div>
                        <div>
                          <p className="text-secondary-foreground">Late Penalty</p>
                          <p className="font-medium">
                            {selectedAssignment.isLateAllowed
                                ? `${selectedAssignment.latePenaltyPercent}%`
                                : "Not accepted"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </SectionCard>

                  <SectionCard title={`Submissions ${loadingSubmissions ? "(loading...)" : `(${submissions.length})`}`}>
                    <div className="space-y-2">
                      {submissions.length === 0 && !loadingSubmissions && (
                          <p className="text-sm text-secondary-foreground">No submissions yet.</p>
                      )}
                      {submissions.map((sub) => (
                          <div
                              key={sub.id}
                              className="flex items-center justify-between rounded-md border border-border p-3"
                          >
                            <div>
                              <p className="text-sm font-medium">Student #{sub.studentId}</p>
                              <p className="text-xs text-secondary-foreground">
                                Submitted {new Date(sub.submittedAt).toLocaleString()}
                                {sub.late && (
                                    <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-[#991b1b]">
                              Late
                            </span>
                                )}
                              </p>
                              <p className="text-xs text-secondary-foreground">
                                Attempt #{sub.attemptNumber} · Status: {sub.status}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {sub.status === "GRADED" ? (
                                  <span className="flex items-center gap-1 rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Graded
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
                                    setScore("");
                                    setFeedback("");
                                  }}
                                  className="flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium hover:bg-secondary"
                              >
                                Review <ChevronRight className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                      ))}
                    </div>
                  </SectionCard>
                </div>
            ) : (
                /* Submission Review Panel */
                <div className="space-y-4">
                  <button
                      onClick={() => setSelectedSubmission(null)}
                      className="flex items-center gap-1 text-sm text-secondary-foreground hover:text-foreground"
                  >
                    ← Back to submissions
                  </button>

                  <SectionCard title={`Review: Student #${selectedSubmission.studentId}`}>
                    <div className="space-y-4">
                      {/* Content */}
                      {selectedSubmission.textContent && (
                          <div>
                            <p className="mb-2 text-sm font-medium">Text Content</p>
                            <div className="rounded-md border border-border bg-secondary/30 p-3 text-sm">
                              {selectedSubmission.textContent}
                            </div>
                          </div>
                      )}

                      {/* File */}
                      {selectedSubmission.fileUrl && (
                          <div>
                            <p className="mb-2 text-sm font-medium">Submitted File</p>
                            <div className="flex items-center gap-2 rounded-md border border-border p-2">
                              <FileText className="h-4 w-4 text-secondary-foreground" />
                              <span className="flex-1 text-sm">{selectedSubmission.fileName}</span>
                              <span className="text-xs text-secondary-foreground">
                          {selectedSubmission.fileSizeBytes
                              ? `${Math.round(selectedSubmission.fileSizeBytes / 1024)} KB`
                              : ""}
                        </span>
                              <a
                                  href={selectedSubmission.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs font-medium underline underline-offset-2"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                      )}

                      {/* Grade Form */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="mb-1 block text-sm font-medium">Score</label>
                          <input
                              type="number"
                              min={0}
                              value={score}
                              onChange={(e) => setScore(e.target.value)}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                              placeholder="0"
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm font-medium">Max Score</label>
                          <input
                              type="number"
                              min={1}
                              value={maxScore}
                              onChange={(e) => setMaxScore(e.target.value)}
                              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                          />
                        </div>
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
                            disabled={grading || !score.trim()}
                            className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                        >
                          {grading ? "Saving..." : "Save Grade"}
                        </button>
                        <button
                            onClick={() => setSelectedSubmission(null)}
                            className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                        >
                          Cancel
                        </button>
                      </div>

                      {actionMsg && (
                          <p className="text-sm text-secondary-foreground">{actionMsg}</p>
                      )}
                    </div>
                  </SectionCard>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}
