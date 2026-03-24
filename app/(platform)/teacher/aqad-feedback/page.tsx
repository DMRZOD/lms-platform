"use client";

import { PageHeader } from "@/components/platform/page-header";
import { DeadlineCountdown } from "@/components/teacher/deadline-countdown";
import { SectionCard } from "@/components/teacher/section-card";
import { mockAQADReviews, mockCorrectiveActions } from "@/constants/teacher-mock-data";
import type { AQADReview } from "@/types/teacher";
import {
  CheckCircle,
  CheckSquare,
  ChevronRight,
  RotateCcw,
  Send,
  Square,
  XCircle,
} from "lucide-react";
import { useState } from "react";

type MainTab = "Reviews" | "Corrective Actions";

export default function AQADFeedbackPage() {
  const [activeTab, setActiveTab] = useState<MainTab>("Reviews");
  const [selectedReview, setSelectedReview] = useState<AQADReview | null>(null);
  const [reviews, setReviews] = useState(mockAQADReviews);
  const [actions, setActions] = useState(mockCorrectiveActions);
  const [teacherResponse, setTeacherResponse] = useState("");
  const [resubmitted, setResubmitted] = useState<Record<string, boolean>>({});

  const getStatusClass = (status: string) => {
    if (status === "Approved") return "bg-[#dcfce7] text-[#166534]";
    if (status === "Rejected") return "bg-[#fee2e2] text-[#991b1b]";
    if (status === "InReview") return "bg-[#fef9c3] text-[#854d0e]";
    return "bg-[#ffedd5] text-[#9a3412]";
  };

  const getPriorityClass = (priority: string) => {
    if (priority === "critical") return "bg-[#fee2e2] text-[#991b1b]";
    if (priority === "high") return "bg-[#ffedd5] text-[#9a3412]";
    if (priority === "medium") return "bg-[#fef9c3] text-[#854d0e]";
    return "bg-[#f0f0f0] text-[#666]";
  };

  const handleMarkComplete = (id: string) => {
    setActions(
      actions.map((a) =>
        a.id === id ? { ...a, status: "completed" as const, completedAt: new Date().toISOString() } : a,
      ),
    );
  };

  const handleResubmit = (reviewId: string) => {
    setResubmitted({ ...resubmitted, [reviewId]: true });
    setReviews(
      reviews.map((r) =>
        r.id === reviewId
          ? {
              ...r,
              status: "InReview" as const,
              teacherResponse: teacherResponse,
              resubmittedAt: new Date().toISOString(),
            }
          : r,
      ),
    );
    setSelectedReview(
      reviews.find((r) => r.id === reviewId) ?? null,
    );
    setTeacherResponse("");
  };

  return (
    <div>
      <div className="mb-6">
        <PageHeader
          title="AQAD Feedback"
          description="Review AQAD feedback and corrective actions"
        />
      </div>

      {/* Main Tabs */}
      <div className="mb-6 border-b border-border">
        <div className="flex">
          {(["Reviews", "Corrective Actions"] as MainTab[]).map((tab) => (
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
              {tab === "Corrective Actions" &&
                actions.filter((a) => a.status !== "completed").length > 0 && (
                  <span className="ml-2 rounded-full bg-[#fee2e2] px-1.5 py-0.5 text-xs text-[#991b1b]">
                    {actions.filter((a) => a.status !== "completed").length}
                  </span>
                )}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Tab */}
      {activeTab === "Reviews" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* Review List */}
          <div className="space-y-2 lg:col-span-2">
            {reviews.map((review) => (
              <button
                key={review.id}
                onClick={() => setSelectedReview(review)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  selectedReview?.id === review.id
                    ? "border-foreground bg-secondary"
                    : "border-border bg-background hover:bg-secondary/50"
                }`}
              >
                <div className="mb-1 flex items-start justify-between gap-2">
                  <p className="font-medium">{review.courseName}</p>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getStatusClass(review.status)}`}>
                    {review.status}
                  </span>
                </div>
                <p className="text-xs text-secondary-foreground">{review.courseCode}</p>
                <p className="text-xs text-secondary-foreground">
                  Submitted: {review.submittedAt}
                  {review.reviewedAt ? ` · Reviewed: ${review.reviewedAt}` : ""}
                </p>
                {review.status === "Rejected" && review.deadline && (
                  <div className="mt-2">
                    <DeadlineCountdown deadline={review.deadline} />
                  </div>
                )}
                <div className="mt-1 flex items-center gap-1 text-xs text-secondary-foreground">
                  <ChevronRight className="h-3 w-3" />
                  {review.requiredActions.filter((a) => !a.isCompleted).length} required actions
                </div>
              </button>
            ))}
          </div>

          {/* Review Detail */}
          <div className="lg:col-span-3">
            {!selectedReview ? (
              <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-secondary-foreground">Select a review to view details</p>
              </div>
            ) : (
              <div className="space-y-4">
                <SectionCard title="Review Status">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusClass(selectedReview.status)}`}>
                      {selectedReview.status}
                    </span>
                    {selectedReview.reviewerName && (
                      <p className="text-sm text-secondary-foreground">
                        By {selectedReview.reviewerName}
                        {selectedReview.reviewedAt ? ` · ${selectedReview.reviewedAt}` : ""}
                      </p>
                    )}
                    {selectedReview.deadline && (
                      <div className="ml-auto">
                        <DeadlineCountdown deadline={selectedReview.deadline} />
                      </div>
                    )}
                  </div>
                </SectionCard>

                {selectedReview.checklist.length > 0 && (
                  <SectionCard title="AQAD Checklist">
                    <div className="space-y-2">
                      {selectedReview.checklist.map((item) => (
                        <div
                          key={item.id}
                          className={`flex items-start gap-3 rounded-md border p-3 ${
                            item.status === "passed"
                              ? "border-[#bbf7d0] bg-[#f0fdf4]"
                              : item.status === "failed"
                                ? "border-[#fecaca] bg-[#fef2f2]"
                                : "border-[#fde68a] bg-[#fef9c3]"
                          }`}
                        >
                          {item.status === "passed" ? (
                            <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#16a34a]" />
                          ) : item.status === "failed" ? (
                            <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ef4444]" />
                          ) : (
                            <span className="mt-0.5 text-sm text-[#92400e]">?</span>
                          )}
                          <div>
                            <p className="text-xs font-medium text-secondary-foreground">
                              {item.category}
                            </p>
                            <p className="text-sm">{item.criterion}</p>
                            {item.reviewerComment && (
                              <p className="mt-1 text-xs text-secondary-foreground">
                                {item.reviewerComment}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {selectedReview.requiredActions.length > 0 && (
                  <SectionCard title="Required Actions">
                    <div className="space-y-2">
                      {selectedReview.requiredActions.map((action) => (
                        <div
                          key={action.id}
                          className="flex items-start gap-3 rounded-md border border-border p-3"
                        >
                          <button
                            onClick={() => {
                              setSelectedReview({
                                ...selectedReview,
                                requiredActions: selectedReview.requiredActions.map((a) =>
                                  a.id === action.id ? { ...a, isCompleted: !a.isCompleted } : a,
                                ),
                              });
                            }}
                            className="mt-0.5 flex-shrink-0"
                          >
                            {action.isCompleted ? (
                              <CheckSquare className="h-4 w-4 text-[#16a34a]" />
                            ) : (
                              <Square className="h-4 w-4 text-secondary-foreground" />
                            )}
                          </button>
                          <p
                            className={`text-sm ${
                              action.isCompleted ? "line-through text-secondary-foreground" : ""
                            }`}
                          >
                            {action.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </SectionCard>
                )}

                {(selectedReview.status === "Rejected" ||
                  selectedReview.status === "ConditionalApproval") &&
                  !resubmitted[selectedReview.id] && (
                    <SectionCard title="Submit Response">
                      <div className="space-y-3">
                        <textarea
                          value={teacherResponse}
                          onChange={(e) => setTeacherResponse(e.target.value)}
                          rows={3}
                          placeholder="Describe the corrections you have made..."
                          className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-foreground"
                        />
                        <button
                          onClick={() => handleResubmit(selectedReview.id)}
                          disabled={!teacherResponse.trim()}
                          className="flex items-center gap-1.5 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8] disabled:opacity-40"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Resubmit for Review
                        </button>
                      </div>
                    </SectionCard>
                  )}

                {resubmitted[selectedReview.id] && (
                  <div className="rounded-md border border-[#bbf7d0] bg-[#f0fdf4] p-3 text-sm text-[#166534]">
                    <div className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Course resubmitted for AQAD review
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Corrective Actions Tab */}
      {activeTab === "Corrective Actions" && (
        <div className="space-y-4">
          {actions.map((action) => (
            <div
              key={action.id}
              className={`rounded-lg border p-5 ${
                action.status === "completed" ? "border-border opacity-60" : "border-border bg-background"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{action.courseName}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${getPriorityClass(action.priority)}`}>
                      {action.priority}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        action.status === "completed"
                          ? "bg-[#dcfce7] text-[#166534]"
                          : action.status === "overdue"
                            ? "bg-[#fee2e2] text-[#991b1b]"
                            : action.status === "in_progress"
                              ? "bg-[#dbeafe] text-[#1d4ed8]"
                              : "bg-[#fef9c3] text-[#854d0e]"
                      }`}
                    >
                      {action.status}
                    </span>
                  </div>
                  <p className="text-sm font-medium">{action.description}</p>
                  <p className="mt-1 text-sm text-secondary-foreground">{action.requiredAction}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-secondary-foreground">
                    <span>Issued: {action.issuedAt}</span>
                    <span>Deadline: {action.deadline}</span>
                    {action.completedAt && <span>Completed: {action.completedAt}</span>}
                    {!action.aqadVerified && action.status === "completed" && (
                      <span className="text-[#854d0e]">Awaiting AQAD verification</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <DeadlineCountdown deadline={action.deadline} />
                  {action.status !== "completed" && (
                    <button
                      onClick={() => handleMarkComplete(action.id)}
                      className="flex items-center gap-1.5 rounded-md border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-1.5 text-xs font-medium text-[#166534] hover:bg-[#dcfce7]"
                    >
                      <CheckCircle className="h-3.5 w-3.5" />
                      Mark Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {actions.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-12 text-center">
              <CheckCircle className="mb-2 h-8 w-8 text-secondary-foreground" />
              <p className="text-sm text-secondary-foreground">No corrective actions</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
