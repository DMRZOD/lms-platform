"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { studentApi } from "@/lib/student-api";
import type { ApiAssignment, ApiSubmission, ApiCourse } from "@/lib/student-api";
import { BookOpen, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();

  const [assignment, setAssignment]       = useState<ApiAssignment | null>(null);
  const [submission, setSubmission]       = useState<ApiSubmission | null>(null);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [content, setContent]             = useState("");
  const [fileUrl, setFileUrl]             = useState("");
  const [submitting, setSubmitting]       = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profileData = await studentApi.getProfile();

      // ── Fix: правильная типизация ответа getCourses ──
      const coursesRaw = await studentApi.getCourses();
      const courses: ApiCourse[] = Array.isArray(coursesRaw)
          ? coursesRaw
          : (coursesRaw as { content: ApiCourse[] }).content ?? [];

      // Ищем задание по всем курсам
      let found: ApiAssignment | null = null;
      for (const course of courses) {
        try {
          const asgn = await studentApi.getAssignment(course.id, Number(assignmentId));
          if (asgn) { found = asgn; break; }
        } catch {
          // не в этом курсе — продолжаем
        }
      }
      setAssignment(found);

      // Проверяем существующий submission
      if (profileData?.id) {
        try {
          const subs = await studentApi.getMySubmission(
              Number(assignmentId),
              profileData.id
          );
          const arr = Array.isArray(subs) ? subs : [];
          if (arr.length > 0) setSubmission(arr[0]);
        } catch {
          // submission ещё нет
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load assignment");
    } finally {
      setLoading(false);
    }
  }, [assignmentId]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !fileUrl.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await studentApi.submitAssignment(Number(assignmentId), {
        content: content  || undefined,
        fileUrl: fileUrl  || undefined,
      });
      setSubmission(result);
      setSubmitSuccess(true);
      setContent("");
      setFileUrl("");
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error || !assignment) {
    return (
        <div className="py-12 text-center">
          <p className="text-secondary-foreground">{error ?? "Assignment not found."}</p>
          <Link href="/student/assignments" className="mt-2 text-sm underline">
            Back to assignments
          </Link>
        </div>
    );
  }

  const isSubmitted = !!submission || submitSuccess;
  const isGraded    = submission?.score !== undefined;
  const isOverdue   = assignment.dueDate
      ? new Date(assignment.dueDate) < new Date()
      : false;

  return (
      <div>
        <div className="mb-2">
          <Link href="/student/assignments" className="text-sm text-secondary-foreground hover:text-foreground">
            ← Back to assignments
          </Link>
        </div>

        <PageHeader
            title={assignment.title}
            description={assignment.courseTitle ?? `Course #${assignment.courseId}`}
        />

        {/* Info bar */}
        <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4">
          {assignment.dueDate && (
              <div className="flex items-center gap-1.5 text-sm text-secondary-foreground">
                <Calendar className="h-4 w-4" />
                Due {new Date(assignment.dueDate).toLocaleDateString("en-US", {
                weekday: "short", day: "numeric", month: "long",
                hour: "2-digit", minute: "2-digit",
              })}
              </div>
          )}
          {isOverdue && !isSubmitted && (
              <span className="flex items-center gap-1 rounded-full bg-[#fee2e2] px-2.5 py-0.5 text-xs font-medium text-[#991b1b]">
            <AlertTriangle className="h-3 w-3" /> Overdue
          </span>
          )}
          {assignment.maxScore !== undefined && (
              <div className="text-sm text-secondary-foreground">
                Max score: <span className="font-semibold text-foreground">{assignment.maxScore}</span>
              </div>
          )}
          {assignment.weight !== undefined && (
              <div className="text-sm text-secondary-foreground">
                Weight: <span className="font-semibold text-foreground">{assignment.weight}%</span>
              </div>
          )}
          {isGraded && (
              <div className="text-sm font-bold">
                Score: {submission!.score}/{assignment.maxScore}
              </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
          {/* Main */}
          <div className="space-y-6">

            {assignment.description && (
                <SectionCard title="Description">
                  <p className="text-sm leading-relaxed text-secondary-foreground">
                    {assignment.description}
                  </p>
                </SectionCard>
            )}

            {isGraded && submission?.feedback && (
                <SectionCard title="Teacher Feedback">
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                      {(assignment.courseTitle ?? "??").slice(0, 2).toUpperCase()}
                    </div>
                    <p className="text-sm leading-relaxed">{submission.feedback}</p>
                  </div>
                </SectionCard>
            )}

            {/* Submit form */}
            {!isSubmitted ? (
                <SectionCard title="Submit Assignment">
                  {submitError && (
                      <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        {submitError}
                      </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="mb-1 block text-xs font-medium">Answer / Response</label>
                      <textarea
                          value={content}
                          onChange={(e) => setContent(e.target.value)}
                          placeholder="Write your answer here…"
                          rows={6}
                          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        File URL <span className="text-secondary-foreground">(optional)</span>
                      </label>
                      <input
                          type="url"
                          value={fileUrl}
                          onChange={(e) => setFileUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-secondary-foreground focus:outline-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                          type="submit"
                          disabled={submitting || (!content.trim() && !fileUrl.trim())}
                          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
                      >
                        {submitting ? "Submitting…" : "Submit Assignment"}
                      </button>
                    </div>
                  </form>
                </SectionCard>
            ) : (
                <SectionCard>
                  <div className="flex items-center gap-3 py-4">
                    <CheckCircle className="h-6 w-6 text-green-600 shrink-0" />
                    <div>
                      <p className="font-semibold">Assignment submitted</p>
                      {submission?.submittedAt && (
                          <p className="text-sm text-secondary-foreground">
                            Submitted on{" "}
                            {new Date(submission.submittedAt).toLocaleDateString("en-US", {
                              day: "numeric", month: "long",
                              hour: "2-digit", minute: "2-digit",
                            })}
                          </p>
                      )}
                    </div>
                  </div>
                  {submission?.content && (
                      <div className="mt-3 rounded-lg bg-secondary/30 p-3">
                        <p className="mb-1 text-xs font-medium text-secondary-foreground">Your answer</p>
                        <p className="text-sm">{submission.content}</p>
                      </div>
                  )}
                  {submission?.fileUrl && (
                      <a href={submission.fileUrl} target="_blank" rel="noreferrer"
                         className="mt-2 inline-block text-sm underline text-secondary-foreground hover:text-foreground">
                        View submitted file →
                      </a>
                  )}
                </SectionCard>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <SectionCard title="Status">
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground">Submission</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      isGraded    ? "bg-[#dcfce7] text-[#166534]" :
                          isSubmitted ? "bg-[#dbeafe] text-[#1d4ed8]" :
                              isOverdue   ? "bg-[#fee2e2] text-[#991b1b]" :
                                  "bg-[#fef9c3] text-[#854d0e]"
                  }`}>
                  {isGraded ? "Graded" : isSubmitted ? "Submitted" : isOverdue ? "Overdue" : "Pending"}
                </span>
                </div>
                {submission?.submittedAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Submitted</span>
                      <span>{new Date(submission.submittedAt).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span>
                    </div>
                )}
                {isGraded && submission?.score !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Score</span>
                      <span className="font-bold">{submission.score}/{assignment.maxScore ?? "—"}</span>
                    </div>
                )}
                {assignment.dueDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-secondary-foreground">Due date</span>
                      <span>{new Date(assignment.dueDate).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</span>
                    </div>
                )}
              </div>
            </SectionCard>

            <SectionCard title="Course">
              <div className="flex items-center gap-2 text-sm">
                <BookOpen className="h-4 w-4 text-secondary-foreground" />
                <Link href={`/student/courses/${assignment.courseId}`} className="hover:underline">
                  {assignment.courseTitle ?? `Course #${assignment.courseId}`}
                </Link>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
  );
}
