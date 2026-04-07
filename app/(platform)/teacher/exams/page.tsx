"use client";

import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/teacher/section-card";
import { teacherApi } from "@/lib/teacher-api";
import type { ApiCourse, ApiExamSession, ApiExamResult, ApiExamAppeal } from "@/lib/teacher-api";
import { CheckCircle, Clock, MessageSquare, RefreshCw, Users, XCircle } from "lucide-react";
import { useEffect, useState, useCallback } from "react";

type ExamTab = "Sessions" | "Results" | "Appeals";

export default function ExamsPage() {
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  const [sessions, setSessions] = useState<ApiExamSession[]>([]);
  const [results, setResults] = useState<ApiExamResult[]>([]);
  const [appeals, setAppeals] = useState<ApiExamAppeal[]>([]);

  const [activeTab, setActiveTab] = useState<ExamTab>("Sessions");
  const [loading, setLoading] = useState(true);
  const [loadingData, setLoadingData] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  // Appeal review
  const [reviewingId, setReviewingId] = useState<number | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Create exam session form
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [sessionForm, setSessionForm] = useState({
    studentId: "",
    examType: "MIDTERM",
    scheduledStart: "",
    scheduledEnd: "",
  });
  const [creatingSession, setCreatingSession] = useState(false);

  // Load courses
  useEffect(() => {
    (async () => {
      try {
        const data = await teacherApi.getCourses({ size: 50 });
        const arr: ApiCourse[] = Array.isArray(data) ? data : (data.content ?? []);
        setCourses(arr);
        if (arr.length > 0) setSelectedCourseId(arr[0].id);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const loadData = useCallback(async () => {
    setLoadingData(true);
    setActionMsg(null);
    try {
      // Load appeals queue (accessible to teacher)
      const appealsRes = await teacherApi.getAppealsQueue().catch(() => []);
      setAppeals(Array.isArray(appealsRes) ? appealsRes : []);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => { loadData(); }, [loadData]);

  // Create exam session
  const handleCreateSession = async () => {
    if (!selectedCourseId || !sessionForm.studentId || !sessionForm.scheduledStart) return;
    setCreatingSession(true);
    setActionMsg(null);
    try {
      const session = await teacherApi.createExamSession({
        studentId: Number(sessionForm.studentId),
        courseId: selectedCourseId,
        examType: sessionForm.examType,
        scheduledStart: new Date(sessionForm.scheduledStart).toISOString(),
        scheduledEnd: sessionForm.scheduledEnd
            ? new Date(sessionForm.scheduledEnd).toISOString()
            : new Date(sessionForm.scheduledStart).toISOString(),
      });
      setSessions((prev) => [...prev, session]);
      setShowCreateSession(false);
      setSessionForm({ studentId: "", examType: "MIDTERM", scheduledStart: "", scheduledEnd: "" });
      setActionMsg("Exam session created!");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to create session");
    } finally {
      setCreatingSession(false);
    }
  };

  // Update session status
  const handleUpdateStatus = async (sessionId: string, status: "GRADED" | "INVALIDATED") => {
    try {
      await teacherApi.updateExamSessionStatus(sessionId, { status });
      setSessions((prev) =>
          prev.map((s) => (s.id === sessionId ? { ...s, status } : s)),
      );
      setActionMsg(`Session marked as ${status}`);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to update status");
    }
  };

  // Review appeal
  const handleReviewAppeal = async (appealId: number, decision: "APPROVED" | "REJECTED") => {
    if (!decisionReason.trim()) {
      setActionMsg("Please provide a decision reason");
      return;
    }
    setSubmittingReview(true);
    try {
      await teacherApi.reviewAppeal(appealId, {
        status: decision,
        decisionReason: decisionReason.trim(),
      });
      setAppeals((prev) =>
          prev.map((a) =>
              a.id === appealId ? { ...a, status: decision, decisionReason } : a,
          ),
      );
      setReviewingId(null);
      setDecisionReason("");
      setActionMsg(`Appeal ${decision.toLowerCase()}!`);
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to review appeal");
    } finally {
      setSubmittingReview(false);
    }
  };

  // Load student results
  const handleLoadStudentResults = async (studentId: number) => {
    try {
      const data = await teacherApi.getStudentExamResults(studentId);
      const arr: ApiExamResult[] = Array.isArray(data) ? data : [];
      setResults(arr);
      setActiveTab("Results");
    } catch (e: unknown) {
      setActionMsg(e instanceof Error ? e.message : "Failed to load results");
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "GRADED" || status === "COMPLETED") return "bg-[#dcfce7] text-[#166534]";
    if (status === "IN_PROGRESS") return "bg-[#dbeafe] text-[#1d4ed8]";
    if (status === "INVALIDATED") return "bg-[#fee2e2] text-[#991b1b]";
    if (status === "SCHEDULED") return "bg-[#fef9c3] text-[#854d0e]";
    if (status === "SUBMITTED") return "bg-[#fef9c3] text-[#854d0e]";
    return "bg-[#f0f0f0] text-[#666]";
  };

  if (loading) {
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
          <PageHeader title="Exams" description="Manage exam sessions, results, and appeals" />
          <div className="flex gap-2">
            <button
                onClick={loadData}
                className="flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-secondary"
            >
              <RefreshCw className="h-4 w-4" /> Refresh
            </button>
            <button
                onClick={() => setShowCreateSession(true)}
                className="flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
            >
              + New Session
            </button>
          </div>
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

        {/* Create Session Form */}
        {showCreateSession && (
            <div className="mb-6 rounded-lg border border-border bg-background p-5 space-y-4">
              <h3 className="font-semibold">Create Exam Session</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-medium">Student ID *</label>
                  <input
                      type="number"
                      value={sessionForm.studentId}
                      onChange={(e) => setSessionForm({ ...sessionForm, studentId: e.target.value })}
                      placeholder="Student ID"
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Exam Type</label>
                  <select
                      value={sessionForm.examType}
                      onChange={(e) => setSessionForm({ ...sessionForm, examType: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  >
                    {["MIDTERM", "FINAL", "RETAKE", "QUIZ"].map((t) => (
                        <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">Start *</label>
                  <input
                      type="datetime-local"
                      value={sessionForm.scheduledStart}
                      onChange={(e) => setSessionForm({ ...sessionForm, scheduledStart: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium">End</label>
                  <input
                      type="datetime-local"
                      value={sessionForm.scheduledEnd}
                      onChange={(e) => setSessionForm({ ...sessionForm, scheduledEnd: e.target.value })}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                    onClick={handleCreateSession}
                    disabled={!sessionForm.studentId || !sessionForm.scheduledStart || creatingSession}
                    className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-40"
                >
                  {creatingSession ? "Creating..." : "Create"}
                </button>
                <button
                    onClick={() => setShowCreateSession(false)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
        )}

        {/* Tabs */}
        <div className="mb-6 border-b border-border">
          <div className="flex">
            {(["Sessions", "Results", "Appeals"] as ExamTab[]).map((tab) => (
                <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`border-b-2 px-5 py-2.5 text-sm font-medium transition-colors ${
                        activeTab === tab
                            ? "border-foreground text-foreground"
                            : "border-transparent text-secondary-foreground hover:text-foreground"
                    }`}
                >
                  {tab}
                  {tab === "Appeals" && appeals.filter((a) => a.status === "SUBMITTED").length > 0 && (
                      <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-xs text-[#991b1b]">
                  {appeals.filter((a) => a.status === "SUBMITTED").length}
                </span>
                  )}
                </button>
            ))}
          </div>
        </div>

        {/* Sessions Tab */}
        {activeTab === "Sessions" && (
            <div className="space-y-4">
              {sessions.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                    <div className="text-center">
                      <Clock className="mx-auto mb-2 h-8 w-8 text-secondary-foreground" />
                      <p className="text-sm text-secondary-foreground">
                        No exam sessions yet. Create one to get started.
                      </p>
                    </div>
                  </div>
              ) : (
                  sessions.map((session) => (
                      <div key={session.id} className="rounded-lg border border-border bg-background p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">Student #{session.studentId}</p>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(session.status)}`}>
                        {session.status}
                      </span>
                              <span className="rounded bg-secondary px-2 py-0.5 text-xs">
                        {session.examType}
                      </span>
                            </div>
                            <div className="mt-1 flex flex-wrap gap-3 text-sm text-secondary-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {new Date(session.scheduledStart).toLocaleString()}
                      </span>
                            </div>
                            {session.score && (
                                <p className="mt-1 text-sm font-medium">Score: {session.score}</p>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                                onClick={() => handleLoadStudentResults(session.studentId)}
                                className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                            >
                              View Results
                            </button>
                            {session.status !== "GRADED" && session.status !== "INVALIDATED" && (
                                <>
                                  <button
                                      onClick={() => handleUpdateStatus(session.id, "GRADED")}
                                      className="rounded-md bg-[#16a34a] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#15803d]"
                                  >
                                    Mark Graded
                                  </button>
                                  <button
                                      onClick={() => handleUpdateStatus(session.id, "INVALIDATED")}
                                      className="rounded-md bg-[#ef4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#dc2626]"
                                  >
                                    Invalidate
                                  </button>
                                </>
                            )}
                          </div>
                        </div>
                      </div>
                  ))
              )}
            </div>
        )}

        {/* Results Tab */}
        {activeTab === "Results" && (
            <div className="space-y-4">
              {results.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                    <div className="text-center">
                      <Users className="mx-auto mb-2 h-8 w-8 text-secondary-foreground" />
                      <p className="text-sm text-secondary-foreground">
                        Select a session and click "View Results" to load student exam results.
                      </p>
                    </div>
                  </div>
              ) : (
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary">
                      <tr>
                        <th className="p-3 text-left font-medium">Session ID</th>
                        <th className="p-3 text-left font-medium">Exam Type</th>
                        <th className="p-3 text-left font-medium">Score</th>
                        <th className="p-3 text-left font-medium">Status</th>
                        <th className="p-3 text-left font-medium">Date</th>
                      </tr>
                      </thead>
                      <tbody>
                      {results.map((r) => (
                          <tr key={r.id} className="border-t border-border">
                            <td className="p-3 font-mono text-xs">{r.examSessionId?.slice(0, 12)}...</td>
                            <td className="p-3">{r.examType}</td>
                            <td className="p-3 font-bold">{r.score}</td>
                            <td className="p-3">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusBadge(r.status)}`}>
                          {r.status}
                        </span>
                            </td>
                            <td className="p-3 text-secondary-foreground text-xs">
                              {new Date(r.createdAt).toLocaleDateString()}
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
        {activeTab === "Appeals" && (
            <div className="space-y-4">
              {loadingData ? (
                  <div className="space-y-2">
                    {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-20 animate-pulse rounded-lg bg-secondary" />
                    ))}
                  </div>
              ) : appeals.length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
                    <CheckCircle className="mb-2 h-8 w-8 text-secondary-foreground" />
                    <p className="text-sm text-secondary-foreground">No appeals in queue</p>
                  </div>
              ) : (
                  appeals.map((appeal) => (
                      <SectionCard key={appeal.id}>
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium">Student #{appeal.studentId}</p>
                              <p className="text-xs text-secondary-foreground font-mono">
                                Session: {appeal.examSessionId?.slice(0, 16)}...
                              </p>
                            </div>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                    appeal.status === "APPROVED"
                                        ? "bg-[#dcfce7] text-[#166534]"
                                        : appeal.status === "REJECTED"
                                            ? "bg-[#fee2e2] text-[#991b1b]"
                                            : "bg-[#fef9c3] text-[#854d0e]"
                                }`}
                            >
                      {appeal.status}
                    </span>
                          </div>

                          <div className="rounded-md bg-secondary p-3">
                            <div className="flex items-start gap-2">
                              <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-secondary-foreground" />
                              <p className="text-sm">{appeal.reasonText}</p>
                            </div>
                          </div>

                          <p className="text-xs text-secondary-foreground">
                            Submitted: {new Date(appeal.createdAt).toLocaleString()}
                          </p>

                          {appeal.decisionReason && (
                              <p className="text-sm text-secondary-foreground">
                                Decision: {appeal.decisionReason}
                              </p>
                          )}

                          {appeal.status === "SUBMITTED" && (
                              <div className="space-y-2">
                                {reviewingId === appeal.id ? (
                                    <>
                          <textarea
                              value={decisionReason}
                              onChange={(e) => setDecisionReason(e.target.value)}
                              rows={2}
                              placeholder="Decision reason..."
                              className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                          />
                                      <div className="flex gap-2">
                                        <button
                                            onClick={() => handleReviewAppeal(appeal.id, "APPROVED")}
                                            disabled={submittingReview}
                                            className="flex items-center gap-1.5 rounded-md bg-[#16a34a] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#15803d] disabled:opacity-50"
                                        >
                                          <CheckCircle className="h-3.5 w-3.5" />
                                          Approve
                                        </button>
                                        <button
                                            onClick={() => handleReviewAppeal(appeal.id, "REJECTED")}
                                            disabled={submittingReview}
                                            className="flex items-center gap-1.5 rounded-md bg-[#ef4444] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#dc2626] disabled:opacity-50"
                                        >
                                          <XCircle className="h-3.5 w-3.5" />
                                          Reject
                                        </button>
                                        <button
                                            onClick={() => { setReviewingId(null); setDecisionReason(""); }}
                                            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                                        >
                                          Cancel
                                        </button>
                                      </div>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setReviewingId(appeal.id)}
                                        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                                    >
                                      Review Appeal
                                    </button>
                                )}
                              </div>
                          )}
                        </div>
                      </SectionCard>
                  ))
              )}
            </div>
        )}
      </div>
  );
}
