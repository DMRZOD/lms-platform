"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { PageHeader } from "@/components/platform/page-header";
import { SectionCard } from "@/components/student/section-card";
import { StudentStatusBadge } from "@/components/student/student-status-badge";
import { SubmissionForm } from "@/components/student/submission-form";
import { mockAssignments, mockStudentProfile } from "@/constants/student-mock-data";
import { canSubmit } from "@/lib/student-access";
import { BookOpen, Calendar, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>();
  const assignment = mockAssignments.find((a) => a.id === assignmentId);

  const [submitted, setSubmitted] = useState(false);

  if (!assignment) {
    return (
      <div className="py-12 text-center">
        <p className="text-secondary-foreground">Assignment not found.</p>
        <Link href="/student/assignments" className="mt-2 text-sm underline">
          Back to assignments
        </Link>
      </div>
    );
  }

  const { accessStatus } = mockStudentProfile;
  const submissionEnabled = canSubmit(accessStatus);
  const isGraded = assignment.status === "graded";
  const isSubmitted = assignment.status === "submitted" || submitted;

  const handleSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div>
      <div className="mb-2">
        <Link href="/student/assignments" className="text-sm text-secondary-foreground hover:text-foreground">
          ← Back to assignments
        </Link>
      </div>
      <PageHeader title={assignment.title} description={assignment.courseName} />

      {/* Info bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-lg border border-border bg-background p-4">
        <div className="flex items-center gap-1.5 text-sm text-secondary-foreground">
          <Calendar className="h-4 w-4" />
          Due{" "}
          {new Date(assignment.dueDate).toLocaleDateString("en-US", {
            weekday: "short",
            day: "numeric",
            month: "long",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        <StudentStatusBadge status={assignment.status} />
        <div className="text-sm text-secondary-foreground">
          Max score: <span className="font-semibold text-foreground">{assignment.maxScore}</span>
        </div>
        <div className="text-sm text-secondary-foreground">
          Weight: <span className="font-semibold text-foreground">{assignment.weight}%</span>
        </div>
        {isGraded && assignment.score !== undefined && (
          <div className="text-sm">
            Score:{" "}
            <span className="font-bold">
              {assignment.score}/{assignment.maxScore}
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main content */}
        <div className="space-y-6">
          <SectionCard title="Description">
            <p className="text-sm leading-relaxed text-secondary-foreground">{assignment.description}</p>
          </SectionCard>

          {assignment.rubric.length > 0 && (
            <SectionCard title="Rubric">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="pb-2 text-left font-medium text-secondary-foreground">Criterion</th>
                      <th className="pb-2 text-right font-medium text-secondary-foreground">Max</th>
                      {isGraded && <th className="pb-2 text-right font-medium text-secondary-foreground">Earned</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {assignment.rubric.map((item) => (
                      <tr key={item.id}>
                        <td className="py-2.5 pr-4">
                          <p className="font-medium">{item.criterion}</p>
                          {item.feedback && (
                            <p className="mt-0.5 text-xs text-secondary-foreground">{item.feedback}</p>
                          )}
                        </td>
                        <td className="py-2.5 text-right">{item.maxPoints}</td>
                        {isGraded && (
                          <td className="py-2.5 text-right font-semibold">{item.earnedPoints ?? "—"}</td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionCard>
          )}

          {isGraded && assignment.feedback ? (
            <SectionCard title="Teacher Feedback">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                  {assignment.courseName.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm leading-relaxed">{assignment.feedback}</p>
                </div>
              </div>
            </SectionCard>
          ) : !isSubmitted && !isGraded ? (
            <SectionCard title="Submit Assignment">
              <SubmissionForm
                assignment={assignment}
                onSubmit={() => handleSubmit()}
                disabled={!submissionEnabled}
              />
            </SectionCard>
          ) : (
            <SectionCard>
              <div className="flex items-center gap-3 py-4 text-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold">Assignment submitted</p>
                  {assignment.submittedAt && (
                    <p className="text-sm text-secondary-foreground">
                      Submitted on{" "}
                      {new Date(assignment.submittedAt).toLocaleDateString("en-US", {
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </SectionCard>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <SectionCard title="Status">
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-secondary-foreground">Status</span>
                <StudentStatusBadge status={assignment.status} />
              </div>
              {assignment.submittedAt && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground">Submitted</span>
                  <span>
                    {new Date(assignment.submittedAt).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
              )}
              {isGraded && assignment.score !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground">Score</span>
                  <span className="font-bold">
                    {assignment.score}/{assignment.maxScore}
                  </span>
                </div>
              )}
              {assignment.maxAttempts && (
                <div className="flex items-center justify-between">
                  <span className="text-secondary-foreground">Attempts</span>
                  <span>
                    {assignment.currentAttempt ?? 0}/{assignment.maxAttempts}
                  </span>
                </div>
              )}
            </div>
          </SectionCard>

          <SectionCard title="Course">
            <div className="flex items-center gap-2 text-sm">
              <BookOpen className="h-4 w-4 text-secondary-foreground" />
              <Link
                href={`/student/courses/${assignment.courseId}`}
                className="hover:underline"
              >
                {assignment.courseName}
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
