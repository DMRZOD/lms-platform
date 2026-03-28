"use client";

import { useState, useEffect, useCallback } from "react";
import { use } from "react";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { SectionCard } from "@/components/aqad/section-card";
import { StatusBadge } from "@/components/aqad/status-badge";
import { Timeline } from "@/components/aqad/timeline";
import { PageHeader } from "@/components/platform/page-header";
import { apiClient } from "@/lib/api-client";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReviewChecklist {
  learningOutcomesDefined: boolean;
  assessmentAlignedWithOutcomes: boolean;
  materialsUploaded: boolean;
  gradingWeightsDefined: boolean;
  attendancePolicyDefined: boolean;
  academicIntegrityStatementPresent: boolean;
}

interface ReviewDecisionData {
  id: number;
  decisionType: "APPROVED" | "REJECTED" | "CONDITIONAL_APPROVAL";
  reasonCode: string;
  notes: string;
  conditions: string[];
  deadline: string;
  adminOverride: boolean;
}

interface ApiReviewDetail {
  id: number;
  courseId: number;
  courseTitle: string;
  reviewerId: number;
  reviewerName: string;
  status: string;
  checklist: ReviewChecklist;
  createdAt: string;
  closedAt: string | null;
  decision: ReviewDecisionData | null;
}

interface ApiComment {
  id: number;
  reviewId: number;
  authorId: number;
  authorName: string;
  lectureId: number | null;
  commentText: string;
  visibility: "INTERNAL" | "PUBLIC";
  createdAt: string;
}

type DecisionType = "APPROVED" | "REJECTED" | "CONDITIONAL_APPROVAL";

type Props = { params: Promise<{ courseId: string }> };

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReviewDetailPage({ params }: Props) {
  const { courseId } = use(params);
  const reviewId = courseId; // route param is actually reviewId

  const [review, setReview]       = useState<ApiReviewDetail | null>(null);
  const [comments, setComments]   = useState<ApiComment[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"checklist" | "decision" | "comments">("checklist");

  // Checklist state (local edits before submitting decision)
  const [checklist, setChecklist] = useState<ReviewChecklist>({
    learningOutcomesDefined: false,
    assessmentAlignedWithOutcomes: false,
    materialsUploaded: false,
    gradingWeightsDefined: false,
    attendancePolicyDefined: false,
    academicIntegrityStatementPresent: false,
  });

  // Decision state
  const [decision, setDecision]         = useState<DecisionType | "">("");
  const [reasonCode, setReasonCode]     = useState("");
  const [decisionNotes, setDecisionNotes] = useState("");
  const [conditions, setConditions]     = useState("");
  const [deadline, setDeadline]         = useState("");
  const [submitting, setSubmitting]     = useState(false);

  // Comment state
  const [commentText, setCommentText]   = useState("");
  const [visibility, setVisibility]     = useState<"INTERNAL" | "PUBLIC">("INTERNAL");
  const [addingComment, setAddingComment] = useState(false);

  // ── Fetch review detail ──
  const fetchReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiClient.get<ApiReviewDetail>(
          `/api/v1/aqad/reviews/${reviewId}`
      );
      setReview(data);
      setChecklist(data.checklist);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load review");
    } finally {
      setLoading(false);
    }
  }, [reviewId]);

  // ── Fetch comments ──
  const fetchComments = useCallback(async () => {
    try {
      const data = await apiClient.get<ApiComment[]>(
          `/api/v1/aqad/reviews/${reviewId}/comments`
      );
      setComments(Array.isArray(data) ? data : []);
    } catch {
      // comments optional
    }
  }, [reviewId]);

  useEffect(() => {
    fetchReview();
    fetchComments();
  }, [fetchReview, fetchComments]);

  // ── Submit decision ──
  const handleSubmitDecision = async () => {
    if (!decision) return;
    setSubmitting(true);
    try {
      await apiClient.post(`/api/v1/aqad/reviews/${reviewId}/decisions`, {
        decisionType: decision,
        reasonCode: reasonCode || undefined,
        notes: decisionNotes || undefined,
        conditions: conditions ? conditions.split("\n").filter(Boolean) : [],
        deadline: deadline || undefined,
        checklist,
      });
      await fetchReview();
      setActiveTab("checklist");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to submit decision");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Add comment ──
  const handleAddComment = async () => {
    if (!commentText.trim()) return;
    setAddingComment(true);
    try {
      await apiClient.post(`/api/v1/aqad/reviews/${reviewId}/comments`, {
        commentText,
        lectureId: null,
        visibility,
      });
      setCommentText("");
      await fetchComments();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setAddingComment(false);
    }
  };

  const CHECKLIST_LABELS: Record<keyof ReviewChecklist, string> = {
    learningOutcomesDefined:              "Learning Outcomes Defined",
    assessmentAlignedWithOutcomes:        "Assessment Aligned with Outcomes",
    materialsUploaded:                    "Materials Uploaded",
    gradingWeightsDefined:                "Grading Weights Defined",
    attendancePolicyDefined:              "Attendance Policy Defined",
    academicIntegrityStatementPresent:    "Academic Integrity Statement Present",
  };

  const TABS = [
    { id: "checklist" as const, label: "Checklist" },
    { id: "decision"  as const, label: "Decision" },
    { id: "comments"  as const, label: `Comments (${comments.length})` },
  ];

  if (loading) {
    return (
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-secondary" />
          ))}
        </div>
    );
  }

  if (error || !review) {
    return (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-sm text-red-500">{error ?? "Review not found"}</p>
          <Link href="/aqad/review-queue" className="text-sm underline">
            Back to Review Queue
          </Link>
        </div>
    );
  }

  return (
      <div>
        {/* Breadcrumb */}
        <div className="mb-4 flex items-center gap-2 text-sm text-secondary-foreground">
          <Link href="/aqad/review-queue" className="hover:text-foreground">
            Review Queue
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>Review #{review.id}</span>
        </div>

        <PageHeader
            title={review.courseTitle}
            description={`Review #${review.id}`}
        />

        {/* Header info */}
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-lg border bg-secondary/30 p-4 md:grid-cols-4">
          <div>
            <p className="text-xs text-secondary-foreground">Reviewer</p>
            <p className="text-sm font-medium">{review.reviewerName ?? "—"}</p>
          </div>
          <div>
            <p className="text-xs text-secondary-foreground">Status</p>
            <StatusBadge status={review.status} />
          </div>
          <div>
            <p className="text-xs text-secondary-foreground">Created</p>
            <p className="text-sm font-medium">
              {new Date(review.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
            </p>
          </div>
          <div>
            <p className="text-xs text-secondary-foreground">Decision</p>
            <p className="text-sm font-medium">
              {review.decision?.decisionType ?? "Pending"}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-1 border-b">
          {TABS.map((tab) => (
              <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                      activeTab === tab.id
                          ? "border-b-2 border-foreground text-foreground"
                          : "text-secondary-foreground hover:text-foreground"
                  }`}
              >
                {tab.label}
              </button>
          ))}
        </div>

        {/* ── Checklist Tab ── */}
        {activeTab === "checklist" && (
            <SectionCard title="Quality Checklist">
              <div className="space-y-3">
                {(Object.keys(checklist) as (keyof ReviewChecklist)[]).map((key) => (
                    <label
                        key={key}
                        className="flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-secondary/30"
                    >
                      <input
                          type="checkbox"
                          checked={checklist[key]}
                          onChange={(e) =>
                              setChecklist((prev) => ({ ...prev, [key]: e.target.checked }))
                          }
                          className="h-4 w-4 rounded"
                          disabled={!!review.decision}
                      />
                      <span className="text-sm font-medium">
                  {CHECKLIST_LABELS[key]}
                </span>
                      {checklist[key] ? (
                          <span className="ml-auto rounded-full bg-[#dcfce7] px-2 py-0.5 text-xs text-[#166534]">
                    Passed
                  </span>
                      ) : (
                          <span className="ml-auto rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                    Pending
                  </span>
                      )}
                    </label>
                ))}
              </div>
              <div className="mt-4 flex justify-end">
                <p className="text-sm text-secondary-foreground">
                  {Object.values(checklist).filter(Boolean).length} /{" "}
                  {Object.keys(checklist).length} items passed
                </p>
              </div>
            </SectionCard>
        )}

        {/* ── Decision Tab ── */}
        {activeTab === "decision" && (
            <div className="space-y-6">
              {review.decision ? (
                  <SectionCard title="Decision Submitted">
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                      <div>
                        <p className="text-xs text-secondary-foreground">Decision</p>
                        <p className="text-sm font-semibold">
                          {review.decision.decisionType.replace("_", " ")}
                        </p>
                      </div>
                      {review.decision.reasonCode && (
                          <div>
                            <p className="text-xs text-secondary-foreground">Reason Code</p>
                            <p className="text-sm">{review.decision.reasonCode}</p>
                          </div>
                      )}
                      {review.decision.deadline && (
                          <div>
                            <p className="text-xs text-secondary-foreground">Deadline</p>
                            <p className="text-sm">
                              {new Date(review.decision.deadline).toLocaleDateString()}
                            </p>
                          </div>
                      )}
                    </div>
                    {review.decision.notes && (
                        <div className="mt-4">
                          <p className="text-xs text-secondary-foreground">Notes</p>
                          <p className="text-sm">{review.decision.notes}</p>
                        </div>
                    )}
                    {review.decision.conditions?.length > 0 && (
                        <div className="mt-4">
                          <p className="mb-2 text-xs text-secondary-foreground">Conditions</p>
                          <ul className="space-y-1">
                            {review.decision.conditions.map((c, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-foreground" />
                                  {c}
                                </li>
                            ))}
                          </ul>
                        </div>
                    )}
                  </SectionCard>
              ) : (
                  <SectionCard title="Submit Decision">
                    <div className="space-y-4">
                      {(["APPROVED", "CONDITIONAL_APPROVAL", "REJECTED"] as DecisionType[]).map((d) => (
                          <label
                              key={d}
                              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-4 transition-colors ${
                                  decision === d ? "border-foreground bg-secondary" : "hover:bg-secondary/50"
                              }`}
                          >
                            <input
                                type="radio"
                                name="decision"
                                value={d}
                                checked={decision === d}
                                onChange={() => setDecision(d)}
                            />
                            <div>
                              <p className="text-sm font-medium">
                                {d === "CONDITIONAL_APPROVAL" ? "Conditional Approval" : d.charAt(0) + d.slice(1).toLowerCase()}
                              </p>
                              <p className="text-xs text-secondary-foreground">
                                {d === "APPROVED" && "Course passes quality review."}
                                {d === "CONDITIONAL_APPROVAL" && "Course may be published but must complete required changes."}
                                {d === "REJECTED" && "Course does not meet standards. Must resubmit."}
                              </p>
                            </div>
                          </label>
                      ))}

                      <div>
                        <label className="mb-1 block text-xs font-medium">Reason Code</label>
                        <input
                            type="text"
                            value={reasonCode}
                            onChange={(e) => setReasonCode(e.target.value)}
                            placeholder="e.g. INCOMPLETE_MATERIALS"
                            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-medium">Notes</label>
                        <textarea
                            value={decisionNotes}
                            onChange={(e) => setDecisionNotes(e.target.value)}
                            placeholder="General notes about this review…"
                            rows={3}
                            className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                        />
                      </div>

                      {(decision === "REJECTED" || decision === "CONDITIONAL_APPROVAL") && (
                          <>
                            <div>
                              <label className="mb-1 block text-xs font-medium">
                                Conditions (one per line)
                              </label>
                              <textarea
                                  value={conditions}
                                  onChange={(e) => setConditions(e.target.value)}
                                  placeholder="List conditions or required changes…"
                                  rows={3}
                                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-xs font-medium">Deadline</label>
                              <input
                                  type="date"
                                  value={deadline}
                                  onChange={(e) => setDeadline(e.target.value)}
                                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
                              />
                            </div>
                          </>
                      )}

                      <div className="flex justify-end gap-3">
                        <button
                            disabled={!decision || submitting}
                            onClick={handleSubmitDecision}
                            className="rounded-md bg-foreground px-4 py-2 text-sm text-background hover:opacity-90 disabled:opacity-50"
                        >
                          {submitting ? "Submitting…" : "Submit Decision"}
                        </button>
                      </div>
                    </div>
                  </SectionCard>
              )}
            </div>
        )}

        {/* ── Comments Tab ── */}
        {activeTab === "comments" && (
            <div className="space-y-4">
              <SectionCard title="Add Comment">
                <div className="space-y-3">
              <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write a comment…"
                  rows={3}
                  className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none"
              />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <label className="text-xs font-medium">Visibility:</label>
                      <select
                          value={visibility}
                          onChange={(e) => setVisibility(e.target.value as "INTERNAL" | "PUBLIC")}
                          className="rounded-md border border-border bg-background px-2 py-1 text-xs focus:outline-none"
                      >
                        <option value="INTERNAL">Internal (AQAD only)</option>
                        <option value="PUBLIC">Public (visible to teacher)</option>
                      </select>
                    </div>
                    <button
                        disabled={!commentText.trim() || addingComment}
                        onClick={handleAddComment}
                        className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 disabled:opacity-50"
                    >
                      {addingComment ? "Adding…" : "Add Comment"}
                    </button>
                  </div>
                </div>
              </SectionCard>

              {comments.length === 0 ? (
                  <p className="py-8 text-center text-sm text-secondary-foreground">
                    No comments yet.
                  </p>
              ) : (
                  <div className="space-y-3">
                    {comments.map((comment) => (
                        <div key={comment.id} className="rounded-lg border p-4">
                          <div className="mb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">{comment.authorName}</p>
                              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                  comment.visibility === "INTERNAL"
                                      ? "bg-[#fef9c3] text-[#854d0e]"
                                      : "bg-[#dcfce7] text-[#166534]"
                              }`}>
                        {comment.visibility}
                      </span>
                            </div>
                            <p className="text-xs text-secondary-foreground">
                              {new Date(comment.createdAt).toLocaleString("en-US", {
                                month: "short", day: "numeric",
                                hour: "2-digit", minute: "2-digit",
                              })}
                            </p>
                          </div>
                          <p className="text-sm">{comment.commentText}</p>
                        </div>
                    ))}
                  </div>
              )}
            </div>
        )}
      </div>
  );
}